import type { SavedKind, SavedRecord } from "@/lib/proprint/local-saves";

export function parseSavedRecord<T>(id: string, data: unknown, expectedKind?: SavedKind): SavedRecord<T> | null {
    if (!data || typeof data !== "object") return null;
    const record = data as Record<string, unknown>;
    if (typeof record.name !== "string" || record.name.trim().length === 0) return null;
    if (record.kind !== "serialpro" && record.kind !== "quotepro") return null;
    if (expectedKind && record.kind !== expectedKind) return null;
    if (typeof record.createdAt !== "string" || typeof record.updatedAt !== "string") return null;
    if (record.settings === undefined) return null;
    return {
        id,
        name: record.name,
        kind: record.kind,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
        settings: record.settings as T,
    };
}

export function toFirestoreSave<T>(record: SavedRecord<T>) {
    return {
        kind: record.kind,
        name: record.name,
        settings: JSON.parse(JSON.stringify(record.settings)) as T,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
    };
}

export function decideLocalImport(input: {
    alreadyImported: boolean;
    cloudCount: number;
    localCount: number;
}): "skip" | "import" {
    if (input.alreadyImported) return "skip";
    if (input.cloudCount > 0) return "skip";
    if (input.localCount === 0) return "skip";
    return "import";
}

export function localImportFlagKey(uid: string) {
    return `proprint.imported-local.${uid}`;
}
