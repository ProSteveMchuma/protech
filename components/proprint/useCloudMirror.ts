"use client";

import { useCallback, useEffect, useRef } from "react";
import { saveRecord, type SavedKind } from "@/lib/proprint/local-saves";
import { deleteCloudSave, listCloudSaves, pushCloudSave } from "@/lib/proprint/cloud-saves";
import { useAuth } from "@/components/auth/AuthProvider";

/**
 * Best-effort cloud mirror for saved jobs. Local storage stays the reliable
 * source of truth; when a signed-in shop has the cloudSave entitlement we
 * import their cloud jobs on mount and mirror every save/delete to the cloud.
 */
export function useCloudMirror<T>(kind: SavedKind) {
    const { user, can, getToken } = useAuth();
    const active = Boolean(user) && can("cloudSave");
    const importedFor = useRef<string | null>(null);

    useEffect(() => {
        if (!active || !user) return;
        if (importedFor.current === user.uid) return;
        importedFor.current = user.uid;
        let cancelled = false;
        void (async () => {
            const cloud = await listCloudSaves<T>(getToken, kind);
            if (cancelled) return;
            for (const record of cloud) {
                saveRecord<T>(kind, { id: record.id, name: record.name, settings: record.settings });
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [active, user, kind, getToken]);

    const mirrorSave = useCallback(
        (record: { id: string; name: string; settings: T }) => {
            if (active) void pushCloudSave<T>(getToken, { kind, ...record });
        },
        [active, getToken, kind]
    );

    const mirrorDelete = useCallback(
        (id: string) => {
            if (active) void deleteCloudSave(getToken, kind, id);
        },
        [active, getToken, kind]
    );

    return { cloudActive: active, mirrorSave, mirrorDelete };
}
