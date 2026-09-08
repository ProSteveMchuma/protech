import { NextResponse } from "next/server";
import { z } from "zod";
import { structureProgrammeWithAi, isProgrammeAiConfigured } from "@/lib/proprint/programme/ai-import";
import {
    applyImportDraft,
    parseProgrammeWriteUp,
    stripDocxXml,
    type ProgrammeImportDraft,
} from "@/lib/proprint/programme/import-draft";
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

export const runtime = "nodejs";

const bodySchema = z.object({
    text: z.string().max(100_000).optional(),
    docxBase64: z.string().max(8_000_000).optional(),
    preferAi: z.boolean().optional(),
});

function extractDocxText(base64: string): string {
    const dir = mkdtempSync(join(tmpdir(), "programme-docx-"));
    const file = join(dir, "upload.docx");
    try {
        writeFileSync(file, Buffer.from(base64, "base64"));
        const result = spawnSync("unzip", ["-p", file, "word/document.xml"], { encoding: "utf8", maxBuffer: 12_000_000 });
        if (result.status !== 0 || !result.stdout) {
            throw new Error("Could not read that Word document. Paste the text instead.");
        }
        return stripDocxXml(result.stdout);
    } finally {
        rmSync(dir, { recursive: true, force: true });
    }
}

export async function GET() {
    return NextResponse.json({
        success: true,
        aiConfigured: isProgrammeAiConfigured(),
        engines: isProgrammeAiConfigured() ? ["rules", "ai"] : ["rules"],
    });
}

export async function POST(request: Request) {
    try {
        const json = await request.json();
        const body = bodySchema.parse(json);
        let text = body.text?.trim() || "";
        if (!text && body.docxBase64) {
            text = extractDocxText(body.docxBase64);
        }
        if (!text || text.length < 40) {
            return NextResponse.json(
                { success: false, error: "Paste or upload a write-up with at least a short life story or order of service." },
                { status: 400 }
            );
        }

        const preferAi = body.preferAi !== false && isProgrammeAiConfigured();
        let draft: ProgrammeImportDraft;
        let engine: "rules" | "ai" = "rules";
        const warnings: string[] = [];

        if (preferAi) {
            try {
                draft = await structureProgrammeWithAi(text);
                engine = "ai";
            } catch (error) {
                draft = parseProgrammeWriteUp(text);
                warnings.push(
                    error instanceof Error
                        ? `AI unavailable — used rule-based draft. ${error.message}`
                        : "AI unavailable — used rule-based draft."
                );
            }
        } else {
            draft = parseProgrammeWriteUp(text);
            if (!isProgrammeAiConfigured()) {
                warnings.push("AI is not configured. Draft used local rules; every field stays editable.");
            }
        }

        if (draft.notes?.length) warnings.push(...draft.notes);
        const content = applyImportDraft(draft);

        return NextResponse.json({
            success: true,
            engine,
            aiConfigured: isProgrammeAiConfigured(),
            draft,
            content,
            warnings,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Could not prepare the programme draft.";
        return NextResponse.json({ success: false, error: message }, { status: 400 });
    }
}
