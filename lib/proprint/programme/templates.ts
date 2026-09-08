import type { ProgrammeTemplateId } from "./schema.ts";

export type PanelKind =
    | "cover"
    | "acknowledgement"
    | "service"
    | "tribute"
    | "memories"
    | "hymns"
    | "eulogy"
    | "blank";

export type SheetFace = {
    left: PanelKind;
    right: PanelKind;
};

export type ProgrammeTemplate = {
    id: ProgrammeTemplateId;
    name: string;
    mood: string;
    description: string;
    tokens: {
        paper: string;
        ink: string;
        accent: string;
        wave: string;
        muted: string;
    };
    /** Panel map per A3 sheet (1-indexed content faces). */
    sheets: SheetFace[];
};

export const FLORAL_MATRIARCH: ProgrammeTemplate = {
    id: "floral-matriarch",
    name: "Floral Matriarch",
    mood: "Cream, rose, burgundy",
    description: "Photo-forward A3 fold with soft florals — Emma-class cover and acknowledgement.",
    tokens: {
        paper: "#f7f0e8",
        ink: "#6b2b45",
        accent: "#a8556a",
        wave: "#8f3d57",
        muted: "#9a6b7a",
    },
    sheets: [
        { left: "acknowledgement", right: "cover" },
        { left: "service", right: "tribute" },
        { left: "memories", right: "hymns" },
        { left: "memories", right: "eulogy" },
    ],
};

export const PROGRAMME_TEMPLATES: Record<ProgrammeTemplateId, ProgrammeTemplate> = {
    "floral-matriarch": FLORAL_MATRIARCH,
};

export function getProgrammeTemplate(id: ProgrammeTemplateId) {
    return PROGRAMME_TEMPLATES[id];
}

export function listProgrammeTemplates() {
    return Object.values(PROGRAMME_TEMPLATES);
}
