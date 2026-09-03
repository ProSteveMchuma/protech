"use client";

import type { SavedKind } from "./local-saves";

export interface CloudSaveRecord<T> {
    id: string;
    name: string;
    kind: SavedKind;
    settings: T;
    createdAt: string;
    updatedAt: string;
}

type TokenGetter = () => Promise<string | null>;

async function authHeaders(getToken: TokenGetter): Promise<HeadersInit | null> {
    const token = await getToken();
    if (!token) return null;
    return { Authorization: `Bearer ${token}` };
}

export async function listCloudSaves<T>(getToken: TokenGetter, kind: SavedKind): Promise<CloudSaveRecord<T>[]> {
    const headers = await authHeaders(getToken);
    if (!headers) return [];
    try {
        const res = await fetch(`/api/saves?kind=${kind}`, { headers });
        if (!res.ok) return [];
        const data = await res.json();
        return (data.records ?? []) as CloudSaveRecord<T>[];
    } catch {
        return [];
    }
}

export async function pushCloudSave<T>(
    getToken: TokenGetter,
    record: { kind: SavedKind; id: string; name: string; settings: T }
): Promise<boolean> {
    const headers = await authHeaders(getToken);
    if (!headers) return false;
    try {
        const res = await fetch("/api/saves", {
            method: "POST",
            headers: { ...headers, "Content-Type": "application/json" },
            body: JSON.stringify(record),
        });
        return res.ok;
    } catch {
        return false;
    }
}

export async function deleteCloudSave(getToken: TokenGetter, kind: SavedKind, id: string): Promise<void> {
    const headers = await authHeaders(getToken);
    if (!headers) return;
    try {
        await fetch(`/api/saves?kind=${kind}&id=${encodeURIComponent(id)}`, { method: "DELETE", headers });
    } catch {
        /* best-effort mirror */
    }
}
