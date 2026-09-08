import "server-only";
import { z } from "zod";
import type { ProgrammeImportDraft } from "@/lib/proprint/programme/import-draft";

const draftSchema = z.object({
    identity: z
        .object({
            displayFirstName: z.string().optional(),
            surnameLine: z.string().optional(),
            coverTitle: z.string().optional(),
            roleLine: z.string().optional(),
            sunrise: z.string().optional(),
            sunset: z.string().optional(),
            attributes: z.array(z.string()).optional(),
            dedication: z.string().optional(),
            motto: z.string().optional(),
            venue: z.string().optional(),
            serviceDate: z.string().optional(),
            serviceTime: z.string().optional(),
        })
        .optional(),
    acknowledgement: z
        .object({
            title: z.string().optional(),
            body: z.string().optional(),
            footerLine: z.string().optional(),
        })
        .optional(),
    service: z
        .object({
            title: z.string().optional(),
            rows: z.array(z.object({ time: z.string(), activity: z.string() })).optional(),
            masterOfCeremonies: z.string().optional(),
            presidingPastor: z.string().optional(),
            choir: z.string().optional(),
            tributeSpeakers: z.array(z.object({ label: z.string() })).optional(),
        })
        .optional(),
    tributes: z.array(z.object({ title: z.string(), body: z.string(), signOff: z.string() })).optional(),
    hymns: z.array(z.object({ title: z.string(), lyrics: z.string() })).optional(),
    eulogy: z
        .object({
            title: z.string().optional(),
            tagline: z.string().optional(),
            sections: z
                .array(z.object({ heading: z.string(), body: z.string(), enabled: z.boolean() }))
                .optional(),
            closingQuote: z.string().optional(),
        })
        .optional(),
    memories: z
        .object({
            title: z.string().optional(),
            subtitle: z.string().optional(),
            caption: z.string().optional(),
        })
        .optional(),
    sheetCount: z.number().int().min(1).max(4).optional(),
    notes: z.array(z.string()).optional(),
});

export function isProgrammeAiConfigured() {
    return Boolean(process.env.PROGRAMME_AI_API_KEY || process.env.OPENAI_API_KEY);
}

function aiConfig() {
    const apiKey = process.env.PROGRAMME_AI_API_KEY || process.env.OPENAI_API_KEY;
    if (!apiKey) return null;
    return {
        apiKey,
        baseUrl: (process.env.PROGRAMME_AI_BASE_URL || process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(
            /\/$/,
            ""
        ),
        model: process.env.PROGRAMME_AI_MODEL || process.env.OPENAI_MODEL || "gpt-4o-mini",
    };
}

export async function structureProgrammeWithAi(writeUp: string): Promise<ProgrammeImportDraft> {
    const config = aiConfig();
    if (!config) {
        throw new Error("AI import is not configured.");
    }

    const system = `You structure Kenyan funeral programme write-ups into JSON for an editable print builder.
Return ONLY valid JSON matching this shape:
{
  "identity": { "displayFirstName", "surnameLine", "coverTitle", "roleLine", "sunrise", "sunset", "attributes": [], "dedication", "motto", "venue", "serviceDate", "serviceTime" },
  "acknowledgement": { "title", "body", "footerLine" },
  "service": { "title", "rows": [{"time","activity"}], "masterOfCeremonies", "presidingPastor", "choir", "tributeSpeakers": [{"label"}] },
  "tributes": [{"title","body","signOff"}],
  "hymns": [{"title","lyrics"}],
  "eulogy": { "title", "tagline", "sections": [{"heading","body","enabled"}], "closingQuote" },
  "memories": { "title", "subtitle", "caption" },
  "sheetCount": 2,
  "notes": []
}
Rules:
- Prefer Celebrating the Life / In Loving Memory for coverTitle.
- Keep local language hymn titles and lyrics as given.
- Do not invent facts that are not in the write-up; leave blanks instead.
- sheetCount is 2-4 based on how much content exists.
- notes may list missing pieces for the operator.`;

    const response = await fetch(`${config.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${config.apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: config.model,
            temperature: 0.2,
            response_format: { type: "json_object" },
            messages: [
                { role: "system", content: system },
                { role: "user", content: writeUp.slice(0, 20000) },
            ],
        }),
    });

    if (!response.ok) {
        const detail = await response.text();
        throw new Error(`AI import failed (${response.status}): ${detail.slice(0, 240)}`);
    }

    const payload = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
    };
    const content = payload.choices?.[0]?.message?.content;
    if (!content) throw new Error("AI import returned an empty response.");

    const parsed = draftSchema.parse(JSON.parse(content));
    return parsed;
}
