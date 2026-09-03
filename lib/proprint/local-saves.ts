export type SavedKind = "serialpro" | "quotepro";

export type SerialProSavedSettings = {
    start: number;
    end: number;
    prefix: string;
    suffix: string;
    padding: number;
    copies: number;
    setsPerBook: number;
    fontSize: number;
    bold: boolean;
    second: boolean;
    positions: Array<{ x: number; y: number }>;
    mode: "number-only" | "step-repeat" | "cut-stack";
    preset: string;
    landscape: boolean;
    customWidth: number;
    customHeight: number;
    margin: number;
    gx: number;
    gy: number;
    cropMarks: boolean;
    templatePage: number;
    sourceFileName?: string;
};

export type QuoteProSavedSettings = {
    jobName: string;
    clientName: string;
    reference: string;
    input: {
        quantity: number;
        itemsPerSheet: number;
        spoilagePercent: number;
        sheetCost: number;
        printCostPerSheet: number;
        sides: number;
        setupCost: number;
        finishingPerPiece: number;
        otherCost: number;
        markupPercent: number;
        taxPercent: number;
    };
};

export type SavedRecord<T> = {
    id: string;
    name: string;
    kind: SavedKind;
    createdAt: string;
    updatedAt: string;
    settings: T;
};

const STORAGE_PREFIX = "proprint.saves.";
const MAX_SAVES = 25;

function storageKey(kind: SavedKind) {
    return `${STORAGE_PREFIX}${kind}`;
}

function canUseStorage() {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readAll<T>(kind: SavedKind): SavedRecord<T>[] {
    if (!canUseStorage()) return [];
    try {
        const raw = window.localStorage.getItem(storageKey(kind));
        if (!raw) return [];
        const parsed = JSON.parse(raw) as unknown;
        if (!Array.isArray(parsed)) return [];
        return parsed.filter(isSavedRecord) as SavedRecord<T>[];
    } catch {
        return [];
    }
}

function isSavedRecord(value: unknown): value is SavedRecord<unknown> {
    if (!value || typeof value !== "object") return false;
    const record = value as Record<string, unknown>;
    return (
        typeof record.id === "string" &&
        typeof record.name === "string" &&
        typeof record.kind === "string" &&
        typeof record.createdAt === "string" &&
        typeof record.updatedAt === "string" &&
        record.settings !== undefined
    );
}

function writeAll<T>(kind: SavedKind, records: SavedRecord<T>[]) {
    if (!canUseStorage()) return;
    window.localStorage.setItem(storageKey(kind), JSON.stringify(records));
}

export function listSaves<T>(kind: SavedKind): SavedRecord<T>[] {
    return readAll<T>(kind).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getSave<T>(kind: SavedKind, id: string): SavedRecord<T> | null {
    return readAll<T>(kind).find((record) => record.id === id) ?? null;
}

export function saveRecord<T>(
    kind: SavedKind,
    input: { id?: string; name: string; settings: T }
): SavedRecord<T> {
    const name = input.name.trim() || "Untitled";
    const now = new Date().toISOString();
    const existing = readAll<T>(kind);
    const id = input.id ?? crypto.randomUUID();
    const previous = existing.find((record) => record.id === id);
    const next: SavedRecord<T> = {
        id,
        name,
        kind,
        createdAt: previous?.createdAt ?? now,
        updatedAt: now,
        settings: input.settings,
    };
    const without = existing.filter((record) => record.id !== id);
    const records = [next, ...without].slice(0, MAX_SAVES);
    writeAll(kind, records);
    return next;
}

export function deleteSave(kind: SavedKind, id: string) {
    writeAll(
        kind,
        readAll(kind).filter((record) => record.id !== id)
    );
}

export function formatSavedWhen(iso: string) {
    try {
        return new Date(iso).toLocaleString("en-KE", {
            timeZone: "Africa/Nairobi",
            dateStyle: "medium",
            timeStyle: "short",
        });
    } catch {
        return iso;
    }
}

export const LOCAL_SAVE_LIMIT = MAX_SAVES;
