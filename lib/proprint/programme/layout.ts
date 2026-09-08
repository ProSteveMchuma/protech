import {
    A3_HEIGHT_MM,
    A3_WIDTH_MM,
    A4_WIDTH_MM,
    BLEED_MM,
    GUTTER_MM,
    MAX_SHEETS,
    SAFE_MM,
    type ProgrammeContent,
} from "./schema.ts";
import { getProgrammeTemplate, type SheetFace } from "./templates.ts";

export const PROGRAMME_PAGE = {
    widthMm: A3_WIDTH_MM,
    heightMm: A3_HEIGHT_MM,
    panelWidthMm: A4_WIDTH_MM,
    bleedMm: BLEED_MM,
    safeMm: SAFE_MM,
    gutterMm: GUTTER_MM,
} as const;

export function clampSheetCount(count: number) {
    return Math.min(MAX_SHEETS, Math.max(1, Math.floor(count)));
}

export function sheetsForProgramme(content: ProgrammeContent): SheetFace[] {
    const template = getProgrammeTemplate(content.templateId);
    const count = clampSheetCount(content.sheetCount);
    return template.sheets.slice(0, count);
}

export function panelLabel(kind: SheetFace["left"]) {
    switch (kind) {
        case "cover":
            return "Front cover";
        case "acknowledgement":
            return "Acknowledgement";
        case "service":
            return "Funeral program";
        case "tribute":
            return "Tribute";
        case "memories":
            return "Memories";
        case "hymns":
            return "Hymns / songs";
        case "eulogy":
            return "Eulogy";
        default:
            return "Blank";
    }
}

/** CSS aspect ratio for an A3 landscape stage. */
export function a3AspectRatio() {
    return `${A3_WIDTH_MM} / ${A3_HEIGHT_MM}`;
}
