import {
    createDefaultProgramme,
    isProgrammeContent,
    programmeDisplayName,
    type ProgrammeContent,
    type ProgrammeSavedSettings,
} from "./schema.ts";

export type ProgrammeSaveRecord = {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    settings: ProgrammeSavedSettings;
};

const STORAGE_KEY = "proprint.saves.programme";
const MAX_SAVES = 20;
const listeners = new Set<() => void>();
let snapshotCache: ProgrammeSaveRecord[] | null = null;

function canUseStorage() {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function emitChange() {
    snapshotCache = null;
    for (const listener of listeners) listener();
}

function readAll(): ProgrammeSaveRecord[] {
    if (!canUseStorage()) return [];
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw) as unknown;
        if (!Array.isArray(parsed)) return [];
        return parsed.filter(isSaveRecord);
    } catch {
        return [];
    }
}

function isSaveRecord(value: unknown): value is ProgrammeSaveRecord {
    if (!value || typeof value !== "object") return false;
    const record = value as Record<string, unknown>;
    if (typeof record.id !== "string" || typeof record.name !== "string") return false;
    if (typeof record.createdAt !== "string" || typeof record.updatedAt !== "string") return false;
    if (!record.settings || typeof record.settings !== "object") return false;
    const settings = record.settings as ProgrammeSavedSettings;
    return isProgrammeContent(settings.content);
}

function writeAll(records: ProgrammeSaveRecord[]) {
    if (!canUseStorage()) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    emitChange();
}

export function subscribeProgrammeSaves(listener: () => void) {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}

export function listProgrammeSaves() {
    return readAll().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getProgrammeSaveSnapshot() {
    if (snapshotCache) return snapshotCache;
    snapshotCache = listProgrammeSaves();
    return snapshotCache;
}

export function getServerProgrammeSaveSnapshot(): ProgrammeSaveRecord[] {
    return [];
}

export function saveProgrammeRecord(input: {
    id?: string;
    name?: string;
    content: ProgrammeContent;
}): ProgrammeSaveRecord {
    const now = new Date().toISOString();
    const existing = readAll();
    const id = input.id ?? crypto.randomUUID();
    const previous = existing.find((record) => record.id === id);
    const name = (input.name ?? programmeDisplayName(input.content)).trim() || "Untitled programme";
    const next: ProgrammeSaveRecord = {
        id,
        name,
        createdAt: previous?.createdAt ?? now,
        updatedAt: now,
        settings: { content: input.content },
    };
    const without = existing.filter((record) => record.id !== id);
    writeAll([next, ...without].slice(0, MAX_SAVES));
    return next;
}

export function deleteProgrammeSave(id: string) {
    writeAll(readAll().filter((record) => record.id !== id));
}

export function loadProgrammeOrDefault(id: string | null): ProgrammeContent {
    if (!id) return createDefaultProgramme();
    const found = readAll().find((record) => record.id === id);
    return found ? found.settings.content : createDefaultProgramme();
}

export function formatProgrammeSavedWhen(iso: string) {
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

export { createDefaultProgramme };
