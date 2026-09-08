import {
    createBlankProgramme,
    newProgrammeId,
    type ProgrammeContent,
} from "./schema.ts";

/** Partial structured draft produced from a write-up. Always merged into editable ProgrammeContent. */
export type ProgrammeImportDraft = {
    identity?: Partial<ProgrammeContent["identity"]>;
    acknowledgement?: Partial<ProgrammeContent["acknowledgement"]>;
    service?: Partial<{
        title: string;
        rows: Array<{ time: string; activity: string }>;
        masterOfCeremonies: string;
        presidingPastor: string;
        choir: string;
        tributeSpeakers: Array<{ label: string }>;
    }>;
    tributes?: Array<{ title: string; body: string; signOff: string }>;
    hymns?: Array<{ title: string; lyrics: string }>;
    eulogy?: Partial<{
        title: string;
        tagline: string;
        sections: Array<{ heading: string; body: string; enabled: boolean }>;
        closingQuote: string;
    }>;
    memories?: Partial<ProgrammeContent["memories"]>;
    sheetCount?: number;
    notes?: string[];
};

export type ProgrammeImportResult = {
    draft: ProgrammeImportDraft;
    content: ProgrammeContent;
    engine: "rules" | "ai";
    warnings: string[];
};

const SECTION_HEADERS = [
    "acknowledgement",
    "acknowledgment",
    "order of service",
    "funeral program",
    "funeral programme",
    "programme",
    "tributes",
    "tribute",
    "hymns",
    "hymn",
    "songs",
    "eulogy",
    "obituary",
    "biography",
    "life history",
    "memories",
] as const;

function normalize(text: string) {
    return text.replace(/\r\n/g, "\n").replace(/\u00a0/g, " ").trim();
}

function splitSections(text: string): Map<string, string> {
    const lines = normalize(text).split("\n");
    const map = new Map<string, string>();
    let current = "intro";
    const buckets: Record<string, string[]> = { intro: [] };

    for (const raw of lines) {
        const line = raw.trim();
        const lower = line.toLowerCase().replace(/[:.\-–—]+$/g, "").trim();
        const matched = SECTION_HEADERS.find((header) => lower === header || lower.startsWith(`${header} `));
        if (matched && line.length < 80) {
            current = matched === "acknowledgment" ? "acknowledgement" : matched;
            if (current === "funeral programme" || current === "programme") current = "funeral program";
            if (current === "order of service") current = "funeral program";
            if (current === "hymn" || current === "songs") current = "hymns";
            if (current === "tribute") current = "tributes";
            if (current === "obituary" || current === "biography" || current === "life history") current = "eulogy";
            buckets[current] ??= [];
            continue;
        }
        buckets[current] ??= [];
        buckets[current].push(raw);
    }

    for (const [key, value] of Object.entries(buckets)) {
        map.set(key, value.join("\n").trim());
    }
    return map;
}

function extractName(intro: string): { first: string; surname: string } | null {
    const namePart = "([A-Z][A-Za-z'’\\-]+(?:[^\\S\\n]+[A-Z][A-Za-z'’\\-]+){1,3})";
    const patterns = [
        new RegExp(`celebrating the life of\\s+${namePart}`, "i"),
        new RegExp(`in loving memory of\\s+${namePart}`, "i"),
        new RegExp(`funeral (?:program|programme)(?:\\s+for)?\\s+${namePart}`, "i"),
        new RegExp(`^${namePart}\\s*$`, "m"),
    ];
    const stopWords = new Set(["beloved", "matriarch", "patriarch", "sunrise", "sunset", "rest"]);
    for (const pattern of patterns) {
        const match = intro.match(pattern);
        if (!match?.[1]) continue;
        const parts = match[1]
            .trim()
            .split(/[^\S\n]+/)
            .filter((part) => !stopWords.has(part.toLowerCase()));
        if (parts.length < 2) continue;
        return { first: parts[0], surname: parts.slice(1).join(" ") };
    }
    return null;
}

function extractDates(text: string): { sunrise?: string; sunset?: string } {
    const labeledSunrise = text.match(/sunrise\s*[:|.]?\s*([A-Za-z0-9 ,\/\-]+?)(?:\s*[|•]\s*|\s*$|\n)/i);
    const labeledSunset = text.match(/sunset\s*[:|.]?\s*([A-Za-z0-9 ,\/\-]+?)(?:\s*[|•]\s*|\s*$|\n)/i);
    if (labeledSunrise || labeledSunset) {
        return {
            sunrise: labeledSunrise?.[1]?.trim(),
            sunset: labeledSunset?.[1]?.trim(),
        };
    }

    const fullRange = text.match(
        /\b(\d{1,2}\s+[A-Za-z]{3,9}\s+\d{4})\s*[-–—]\s*(\d{1,2}\s+[A-Za-z]{3,9}\s+\d{4})\b/
    );
    if (fullRange) {
        return { sunrise: fullRange[1].trim(), sunset: fullRange[2].trim() };
    }

    const yearRange = text.match(/\b((?:19|20)\d{2})\s*[-–—]\s*((?:19|20)\d{2})\b/);
    if (yearRange) {
        return { sunrise: yearRange[1], sunset: yearRange[2] };
    }

    const bornDate = text.match(/\bborn\s+(?:on\s+)?(\d{1,2}\s+[A-Za-z]{3,9}\s+\d{4})\b/i);
    const diedDate = text.match(
        /(?:died|demise|passed(?:\s+away)?(?:\s+on)?)\s+(?:on\s+)?(\d{1,2}\s+[A-Za-z]{3,9}\s+\d{4})\b/i
    );
    return {
        sunrise: bornDate?.[1]?.trim(),
        sunset: diedDate?.[1]?.trim(),
    };
}

function extractRole(text: string): string | undefined {
    const match =
        text.match(/beloved\s+([^\n.]{5,80})/i) ||
        text.match(/matriarch of[^\n.]{3,60}/i) ||
        text.match(/patriarch of[^\n.]{3,60}/i);
    return match?.[0]?.trim();
}

function extractDedication(text: string): string | undefined {
    const match = text.match(/rest in peace[^\n,]{0,40}/i);
    return match?.[0]?.trim();
}

function parseServiceRows(block: string): Array<{ time: string; activity: string }> {
    const rows: Array<{ time: string; activity: string }> = [];
    let inSpeakerList = false;
    for (const line of block.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        const timed = trimmed.match(/^(\d{1,2}[:.]?\d{0,2}\s*(?:hrs?|am|pm)?)\s*[-–—:]?\s*(.+)$/i);
        if (timed && /(?:hrs?|am|pm|:)/i.test(timed[1])) {
            const activity = timed[2].trim();
            inSpeakerList = /\btributes?\b/i.test(activity);
            if (!inSpeakerList) {
                rows.push({ time: timed[1].replace(/\s+/g, " ").trim(), activity });
            } else {
                rows.push({ time: timed[1].replace(/\s+/g, " ").trim(), activity });
            }
            continue;
        }

        if (inSpeakerList) {
            if (/^\d+[.)]\s+/.test(trimmed) || /^[-•]\s+/.test(trimmed)) continue;
            inSpeakerList = false;
        }

        if (/^tributes?\b/i.test(trimmed) && trimmed.length < 40) {
            inSpeakerList = true;
            continue;
        }

        const numbered = trimmed.match(/^\d+[.)]\s+(.+)$/);
        if (numbered && !inSpeakerList) {
            rows.push({ time: "", activity: numbered[1].trim() });
        }
    }
    return rows.slice(0, 40);
}

function parseSpeakers(block: string): Array<{ label: string }> {
    const speakers: Array<{ label: string }> = [];
    let capturing = false;
    for (const line of block.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        const timed = trimmed.match(/^(\d{1,2}[:.]?\d{0,2}\s*(?:hrs?|am|pm)?)\s*[-–—:]?\s*(.+)$/i);
        if (timed && /(?:hrs?|am|pm|:)/i.test(timed[1])) {
            capturing = /\btributes?\b/i.test(timed[2]);
            continue;
        }

        if (/^tributes?\b/i.test(trimmed) && trimmed.length < 40) {
            capturing = true;
            continue;
        }
        if (!capturing) continue;

        const match = trimmed.match(/^\d+[.)]\s+(.+)$/) || trimmed.match(/^[-•]\s+(.+)$/);
        if (match) speakers.push({ label: match[1].trim() });
        else if (!/^\d+[.)]/.test(trimmed)) capturing = false;
    }
    return speakers.slice(0, 30);
}

function parseTributes(block: string): Array<{ title: string; body: string; signOff: string }> {
    if (!block.trim()) return [];
    const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
    if (lines.length === 0) return [];

    const fromChunks = block
        .split(/\n(?=From\s+)/i)
        .map((chunk) => chunk.trim())
        .filter(Boolean);
    if (fromChunks.length > 1 || /^From\s+/i.test(fromChunks[0] || "")) {
        return fromChunks.slice(0, 6).map((chunk) => {
            const chunkLines = chunk.split("\n").map((line) => line.trim()).filter(Boolean);
            const head = chunkLines[0] || "Tribute";
            const fromMatch = head.match(/^From\s+([^:]+)[:\-]?\s*(.*)$/i);
            if (fromMatch) {
                const title = `From ${fromMatch[1].trim()}`;
                const rest = [fromMatch[2], ...chunkLines.slice(1)].filter(Boolean).join("\n").trim();
                return { title, body: rest || title, signOff: "" };
            }
            return { title: "Tribute", body: chunk, signOff: "" };
        });
    }

    const title = /^tribute/i.test(lines[0]) ? lines[0] : "Tribute";
    const bodyLines = /^tribute/i.test(lines[0]) ? lines.slice(1) : [...lines];
    let signOff = "";
    if (bodyLines.length > 1 && bodyLines[bodyLines.length - 1].length < 80) {
        signOff = bodyLines[bodyLines.length - 1];
        bodyLines.pop();
    }
    return [{ title, body: bodyLines.join("\n"), signOff }];
}

function parseHymns(block: string): Array<{ title: string; lyrics: string }> {
    if (!block.trim()) return [];
    const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);

    const isTitleCaseLine = (line: string) =>
        line.length <= 80 &&
        /^[A-Z0-9][\w'’\-]*(?:\s+[A-Z0-9][\w'’\-]*){0,7}$/.test(line) &&
        !/[.!?]$/.test(line);

    // Title-only list: each line is a short title-cased hymn name.
    if (lines.length >= 1 && lines.every(isTitleCaseLine)) {
        return lines.slice(0, 8).map((title) => ({ title, lyrics: "" }));
    }

    // Blank-line separated hymn blocks, or a single title + lyrics block.
    const stanzas = block
        .split(/\n\s*\n/)
        .map((chunk) => chunk.trim())
        .filter(Boolean);
    const hymns: Array<{ title: string; lyrics: string }> = [];
    for (const stanza of stanzas.slice(0, 6)) {
        const stanzaLines = stanza.split("\n").map((line) => line.trim()).filter(Boolean);
        const title = stanzaLines[0] || "Hymn";
        const lyrics = stanzaLines.slice(1).join("\n").trim();
        hymns.push({ title, lyrics });
    }
    if (hymns.length === 0) hymns.push({ title: "Hymn", lyrics: block.trim() });
    return hymns;
}

function parseEulogySections(block: string): Array<{ heading: string; body: string; enabled: boolean }> {
    const defaults = ["Birth", "Education", "Career", "Marriage and Family", "Demise"];
    const sections = defaults.map((heading) => ({ heading, body: "", enabled: true }));
    if (!block.trim()) return sections;

    const lower = block.toLowerCase();
    for (const section of sections) {
        const key = section.heading.toLowerCase();
        const idx = lower.indexOf(key);
        if (idx === -1) continue;
        const after = block.slice(idx + key.length).replace(/^[:\-\s]+/, "");
        const nextIdx = defaults
            .map((heading) => after.toLowerCase().indexOf(heading.toLowerCase()))
            .filter((value) => value > 0)
            .sort((a, b) => a - b)[0];
        section.body = (nextIdx ? after.slice(0, nextIdx) : after).trim().slice(0, 1200);
    }

    if (sections.every((section) => !section.body)) {
        sections[0].body = block.trim().slice(0, 1500);
    }
    return sections;
}

/** Deterministic write-up → draft. No network. Always produces editable fields. */
export function parseProgrammeWriteUp(raw: string): ProgrammeImportDraft {
    const text = normalize(raw);
    const sections = splitSections(text);
    const intro = sections.get("intro") || text;
    const name = extractName(intro) || extractName(text);
    const dates = extractDates(text);
    const role = extractRole(intro) || extractRole(text);
    const dedication = extractDedication(text);
    const serviceBlock = sections.get("funeral program") || "";
    const ackBlock = sections.get("acknowledgement") || "";
    const tributeBlock = sections.get("tributes") || "";
    const hymnBlock = sections.get("hymns") || "";
    const eulogyBlock = sections.get("eulogy") || "";
    const memoriesBlock = sections.get("memories") || "";

    const serviceRows = parseServiceRows(serviceBlock);
    const speakers = parseSpeakers(serviceBlock);
    const tributes = parseTributes(tributeBlock);
    const hymns = parseHymns(hymnBlock);
    const eulogySections = parseEulogySections(eulogyBlock);

    const notes: string[] = [];
    if (!name) notes.push("Could not detect a full name — fill the cover manually.");
    if (!serviceRows.length) notes.push("No timed order-of-service rows found — add them in the Service step.");
    if (!ackBlock) notes.push("No acknowledgement section detected.");

    const filledPanels = [
        Boolean(name || dates.sunrise || dates.sunset),
        Boolean(ackBlock),
        serviceRows.length > 0,
        tributes.length > 0,
        hymns.some((hymn) => hymn.title || hymn.lyrics),
        eulogySections.some((section) => section.body),
    ].filter(Boolean).length;

    return {
        identity: {
            displayFirstName: name?.first || "",
            surnameLine: name?.surname || "",
            coverTitle: /in loving memory/i.test(intro) ? "In Loving Memory" : "Celebrating the Life",
            roleLine: role || "",
            sunrise: dates.sunrise || "",
            sunset: dates.sunset || "",
            dedication: dedication || "Rest in Peace",
            motto: "",
            attributes: [],
            venue: "",
            serviceDate: "",
            serviceTime: "",
        },
        acknowledgement: {
            title: "Acknowledgement",
            body: ackBlock || "",
            footerLine: "A beautiful soul lives on in our hearts",
        },
        service: {
            title: "Funeral Program",
            rows: serviceRows,
            masterOfCeremonies: "",
            presidingPastor: "",
            choir: "",
            tributeSpeakers: speakers,
        },
        tributes,
        hymns,
        eulogy: {
            title: "Eulogy",
            tagline: "A life of love, faith and family",
            sections: eulogySections,
            closingQuote: "Your legacy lives on in our hearts forever.",
        },
        memories: {
            title: memoriesBlock ? "Memories" : "Memories",
            subtitle: "Cherished moments through the years",
            caption: memoriesBlock.slice(0, 120) || "Different seasons, one beautiful story",
        },
        sheetCount: Math.min(4, Math.max(2, Math.ceil(filledPanels / 2) + 1)),
        notes,
    };
}

export function applyImportDraft(
    draft: ProgrammeImportDraft,
    base: ProgrammeContent = createBlankProgramme()
): ProgrammeContent {
    const identity = { ...base.identity, ...draft.identity };
    const acknowledgement = { ...base.acknowledgement, ...draft.acknowledgement };
    const serviceRows =
        draft.service?.rows?.map((row) => ({
            id: newProgrammeId("row"),
            time: row.time,
            activity: row.activity,
        })) ?? base.service.rows;
    const tributeSpeakers =
        draft.service?.tributeSpeakers?.map((speaker) => ({
            id: newProgrammeId("spk"),
            label: speaker.label,
        })) ?? base.service.tributeSpeakers;

    const tributes =
        draft.tributes && draft.tributes.length > 0
            ? draft.tributes.map((tribute) => ({
                  id: newProgrammeId("trb"),
                  title: tribute.title,
                  body: tribute.body,
                  signOff: tribute.signOff,
              }))
            : base.tributes;

    const hymns =
        draft.hymns && draft.hymns.length > 0
            ? draft.hymns.map((hymn) => ({
                  id: newProgrammeId("hym"),
                  title: hymn.title,
                  lyrics: hymn.lyrics,
              }))
            : base.hymns;

    const eulogySections =
        draft.eulogy?.sections?.map((section) => ({
            id: newProgrammeId("eul"),
            heading: section.heading,
            body: section.body,
            enabled: section.enabled,
        })) ?? base.eulogy.sections;

    return {
        ...base,
        sheetCount: draft.sheetCount ?? base.sheetCount,
        identity,
        acknowledgement,
        service: {
            title: draft.service?.title || base.service.title,
            rows: serviceRows,
            masterOfCeremonies: draft.service?.masterOfCeremonies ?? base.service.masterOfCeremonies,
            presidingPastor: draft.service?.presidingPastor ?? base.service.presidingPastor,
            choir: draft.service?.choir ?? base.service.choir,
            tributeSpeakers,
        },
        tributes,
        hymns,
        eulogy: {
            title: draft.eulogy?.title || base.eulogy.title,
            tagline: draft.eulogy?.tagline || base.eulogy.tagline,
            sections: eulogySections,
            closingQuote: draft.eulogy?.closingQuote || base.eulogy.closingQuote,
        },
        memories: { ...base.memories, ...draft.memories },
    };
}

export function stripDocxXml(xml: string): string {
    return xml
        .replace(/<w:tab\/>/g, "\t")
        .replace(/<w:br[^/]*\/>/g, "\n")
        .replace(/<\/w:p>/g, "\n")
        .replace(/<[^>]+>/g, "")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}
