/**
 * Lightweight, browser-side preflight. Uses only geometry we can read from
 * pdf-lib (media/trim boxes). Catches the cheap, high-frequency mistakes
 * before an operator generates a full production run.
 */

export interface Box {
    width: number;
    height: number;
}

export interface PreflightInput {
    /** MediaBox size in points. */
    mediaBox: Box;
    /** TrimBox size in points, if the artwork declares one. */
    trimBox?: Box | null;
    pageCount: number;
}

export type PreflightLevel = "pass" | "warn" | "fail";

export interface PreflightFinding {
    id: string;
    level: PreflightLevel;
    message: string;
}

const PT_TO_MM = 25.4 / 72;
const MIN_BLEED_MM = 3;

export function evaluatePreflight(input: PreflightInput): PreflightFinding[] {
    const findings: PreflightFinding[] = [];
    const wMm = input.mediaBox.width * PT_TO_MM;
    const hMm = input.mediaBox.height * PT_TO_MM;

    findings.push({
        id: "size",
        level: "pass",
        message: `Artwork size: ${wMm.toFixed(0)} × ${hMm.toFixed(0)} mm.`,
    });

    if (input.mediaBox.width <= 0 || input.mediaBox.height <= 0) {
        findings.push({ id: "empty", level: "fail", message: "Artwork has no measurable page size." });
    }

    if (!input.trimBox) {
        findings.push({
            id: "trim",
            level: "warn",
            message: "No TrimBox defined. If this job is cut to size, export with a trim box and bleed.",
        });
    } else {
        const bleedX = ((input.mediaBox.width - input.trimBox.width) / 2) * PT_TO_MM;
        const bleedY = ((input.mediaBox.height - input.trimBox.height) / 2) * PT_TO_MM;
        const bleed = Math.min(bleedX, bleedY);
        if (bleed < -0.05) {
            findings.push({ id: "trim", level: "warn", message: "TrimBox is larger than the page — check the export." });
        } else if (bleed + 0.05 < MIN_BLEED_MM) {
            findings.push({
                id: "bleed",
                level: "warn",
                message: `Only ${bleed.toFixed(1)} mm bleed. Aim for ${MIN_BLEED_MM} mm so cutting does not leave white edges.`,
            });
        } else {
            findings.push({ id: "bleed", level: "pass", message: `Bleed ${bleed.toFixed(1)} mm — good for cutting.` });
        }
    }

    if (input.pageCount > 1) {
        findings.push({ id: "pages", level: "pass", message: `${input.pageCount} pages — pick the template page to number.` });
    }

    return findings;
}

export function worstLevel(findings: PreflightFinding[]): PreflightLevel {
    if (findings.some((f) => f.level === "fail")) return "fail";
    if (findings.some((f) => f.level === "warn")) return "warn";
    return "pass";
}
