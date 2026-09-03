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

function parse(raw: string | null): SessionImposition | null {
    if (!raw) return null;
    try {
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

export function readSessionImposition(): SessionImposition | null {
    if (!canUseStorage()) return null;
    return parse(window.localStorage.getItem(IMPOSITION_KEY));
}

// Cached snapshot so useSyncExternalStore gets a stable reference between renders.
let snapshotRaw: string | null = null;
let snapshotValue: SessionImposition | null = null;

export function getSessionImpositionSnapshot(): SessionImposition | null {
    if (!canUseStorage()) return null;
    const raw = window.localStorage.getItem(IMPOSITION_KEY);
    if (raw !== snapshotRaw) {
        snapshotRaw = raw;
        snapshotValue = parse(raw);
    }
    return snapshotValue;
}

export function getServerSessionImposition(): SessionImposition | null {
    return null;
}

export function subscribeSessionImposition(callback: () => void) {
    if (!canUseStorage()) return () => {};
    window.addEventListener("storage", callback);
    return () => window.removeEventListener("storage", callback);
}
