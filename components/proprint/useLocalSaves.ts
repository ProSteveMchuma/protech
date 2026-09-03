"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
    getSaveSnapshot,
    getServerSaveSnapshot,
    subscribeSaves,
    type SavedKind,
    type SavedRecord,
} from "@/lib/proprint/local-saves";

export function useLocalSaves<T>(kind: SavedKind): Array<SavedRecord<T>> {
    const getSnapshot = useCallback(() => getSaveSnapshot<T>(kind), [kind]);
    return useSyncExternalStore(subscribeSaves, getSnapshot, getServerSaveSnapshot<T>);
}
