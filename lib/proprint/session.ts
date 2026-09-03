/**
 * Lightweight, session-scoped handoff between tools (browser localStorage).
 * SerialPro writes its last calculated imposition so QuotePro can offer to
 * reuse the real pieces-per-sheet instead of the operator re-typing it.
 */

const IMPOSITION_KEY = "proprint.session.imposition";

export interface SessionImposition {
    piecesPerSheet: number;
    across: number;
    down: number;
    sheetLabel: string;
    updatedAt: string;
}

function canUseStorage() {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function writeSessionImposition(value: Omit<SessionImposition, "updatedAt">) {
    if (!canUseStorage()) return;
    try {
        window.localStorage.setItem(
            IMPOSITION_KEY,
            JSON.stringify({ ...value, updatedAt: new Date().toISOString() })
        );
    } catch {
        /* storage full or unavailable — non-critical */
    }
}

export function readSessionImposition(): SessionImposition | null {
    if (!canUseStorage()) return null;
    try {
        const raw = window.localStorage.getItem(IMPOSITION_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as Partial<SessionImposition>;
        if (typeof parsed.piecesPerSheet !== "number" || parsed.piecesPerSheet < 1) return null;
        return {
            piecesPerSheet: parsed.piecesPerSheet,
            across: parsed.across ?? 0,
            down: parsed.down ?? 0,
            sheetLabel: parsed.sheetLabel ?? "",
            updatedAt: parsed.updatedAt ?? "",
        };
    } catch {
        return null;
    }
}
