"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { mapFirestoreError } from "@/lib/proprint/auth-errors";
import { deleteCloudSave, saveCloudRecord, subscribeCloudSaves } from "@/lib/proprint/cloud-saves";
import { deleteSave, saveRecord, type SavedKind, type SavedRecord } from "@/lib/proprint/local-saves";
import { useLocalSaves } from "./useLocalSaves";

export type SaveSource = "local" | "cloud";

type CloudState<T> = {
    uid: string | null;
    records: Array<SavedRecord<T>>;
    ready: boolean;
    error: string | null;
};

export function useShopSaves<T>(kind: SavedKind) {
    const { user, ready, configured } = useAuth();
    const local = useLocalSaves<T>(kind);
    const [cloud, setCloud] = useState<CloudState<T>>({
        uid: null,
        records: [],
        ready: false,
        error: null,
    });

    useEffect(() => {
        if (!user) return;
        const uid = user.uid;
        return subscribeCloudSaves<T>(
            uid,
            kind,
            (records) => {
                setCloud({ uid, records, ready: true, error: null });
            },
            (error) => {
                setCloud({ uid, records: [], ready: true, error: mapFirestoreError(error) });
            }
        );
    }, [kind, user]);

    const signedIn = Boolean(user);
    const cloudMatches = signedIn && cloud.uid === user?.uid;
    const cloudError = cloudMatches ? cloud.error : null;
    const usingCloud = cloudMatches && !cloudError;

    const save = useCallback(
        async (input: { id?: string; name: string; settings: T }) => {
            if (user && !cloudError) {
                return saveCloudRecord<T>(user.uid, kind, input);
            }
            return saveRecord<T>(kind, input);
        },
        [cloudError, kind, user]
    );

    const remove = useCallback(
        async (id: string) => {
            if (user && !cloudError) {
                await deleteCloudSave(user.uid, id);
                return;
            }
            deleteSave(kind, id);
        },
        [cloudError, kind, user]
    );

    return {
        records: usingCloud ? cloud.records : signedIn && !cloudMatches ? [] : local,
        source: (usingCloud ? "cloud" : "local") as SaveSource,
        ready: ready && (!signedIn || cloudMatches),
        configured,
        signedIn,
        error: cloudError,
        save,
        remove,
    };
}
