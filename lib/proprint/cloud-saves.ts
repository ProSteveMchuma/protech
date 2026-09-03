import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    query,
    setDoc,
    where,
} from "firebase/firestore";
import { getClientFirestore } from "@/lib/firebase-browser";
import {
    listSaves,
    LOCAL_SAVE_LIMIT,
    type SavedKind,
    type SavedRecord,
} from "@/lib/proprint/local-saves";
import {
    decideLocalImport,
    localImportFlagKey,
    parseSavedRecord,
    toFirestoreSave,
} from "@/lib/proprint/saved-record";

const KINDS: SavedKind[] = ["serialpro", "quotepro"];

function savesCollection(uid: string) {
    const db = getClientFirestore();
    if (!db) return null;
    return collection(db, "shops", uid, "saves");
}

function saveDoc(uid: string, id: string) {
    const db = getClientFirestore();
    if (!db) return null;
    return doc(db, "shops", uid, "saves", id);
}

function shopDoc(uid: string) {
    const db = getClientFirestore();
    if (!db) return null;
    return doc(db, "shops", uid);
}

export async function ensureShopProfile(user: { uid: string; email: string | null }) {
    const ref = shopDoc(user.uid);
    if (!ref) return;
    const now = new Date().toISOString();
    const existing = await getDoc(ref);
    if (!existing.exists()) {
        await setDoc(ref, {
            email: user.email ?? "",
            createdAt: now,
            updatedAt: now,
        });
        return;
    }
    await setDoc(
        ref,
        {
            email: user.email ?? existing.data()?.email ?? "",
            updatedAt: now,
        },
        { merge: true }
    );
}

export async function listCloudSaves<T>(uid: string, kind?: SavedKind): Promise<Array<SavedRecord<T>>> {
    const col = savesCollection(uid);
    if (!col) return [];
    const snap = kind ? await getDocs(query(col, where("kind", "==", kind))) : await getDocs(col);
    return snap.docs
        .map((item) => parseSavedRecord<T>(item.id, item.data(), kind))
        .filter((record): record is SavedRecord<T> => record !== null)
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function subscribeCloudSaves<T>(
    uid: string,
    kind: SavedKind,
    onNext: (records: Array<SavedRecord<T>>) => void,
    onError: (error: Error) => void
): () => void {
    const col = savesCollection(uid);
    if (!col) {
        onNext([]);
        return () => undefined;
    }
    return onSnapshot(
        query(col, where("kind", "==", kind)),
        (snap) => {
            const records = snap.docs
                .map((item) => parseSavedRecord<T>(item.id, item.data(), kind))
                .filter((record): record is SavedRecord<T> => record !== null)
                .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
            onNext(records);
        },
        (error) => onError(error)
    );
}

export async function saveCloudRecord<T>(
    uid: string,
    kind: SavedKind,
    input: { id?: string; name: string; settings: T; createdAt?: string }
): Promise<SavedRecord<T>> {
    const refBase = saveDoc(uid, input.id ?? crypto.randomUUID());
    if (!refBase) throw new Error("Cloud saves are not available.");
    const now = new Date().toISOString();
    const existing = await getDoc(refBase);
    const createdAt = existing.exists()
        ? String(existing.data()?.createdAt ?? now)
        : (input.createdAt ?? now);
    const record: SavedRecord<T> = {
        id: refBase.id,
        name: input.name.trim() || "Untitled",
        kind,
        createdAt,
        updatedAt: now,
        settings: input.settings,
    };
    await setDoc(refBase, toFirestoreSave(record));
    await trimCloudSaves(uid, kind, record.id);
    return record;
}

async function trimCloudSaves(uid: string, kind: SavedKind, keepId: string) {
    const records = await listCloudSaves(uid, kind);
    if (records.length <= LOCAL_SAVE_LIMIT) return;
    const extras = records.filter((record) => record.id !== keepId).slice(LOCAL_SAVE_LIMIT - 1);
    await Promise.all(extras.map((record) => deleteCloudSave(uid, record.id)));
}

export async function deleteCloudSave(uid: string, id: string) {
    const ref = saveDoc(uid, id);
    if (!ref) throw new Error("Cloud saves are not available.");
    await deleteDoc(ref);
}

export async function copyLocalSavesToCloud(uid: string): Promise<number> {
    let count = 0;
    for (const kind of KINDS) {
        for (const record of listSaves(kind)) {
            await saveCloudRecord(uid, kind, {
                id: record.id,
                name: record.name,
                settings: record.settings,
                createdAt: record.createdAt,
            });
            count += 1;
        }
    }
    return count;
}

export async function maybeImportLocalSaves(uid: string): Promise<number> {
    if (typeof window === "undefined") return 0;
    const flagKey = localImportFlagKey(uid);
    const flag = window.localStorage.getItem(flagKey);
    if (flag === "done" || flag === "pending") return 0;
    const localCount = KINDS.reduce((sum, kind) => sum + listSaves(kind).length, 0);
    window.localStorage.setItem(flagKey, "pending");
    try {
        const cloudCount = (await listCloudSaves(uid)).length;
        if (decideLocalImport({ alreadyImported: false, cloudCount, localCount }) === "skip") {
            window.localStorage.setItem(flagKey, "done");
            return 0;
        }
        const count = await copyLocalSavesToCloud(uid);
        window.localStorage.setItem(flagKey, "done");
        return count;
    } catch (error) {
        window.localStorage.removeItem(flagKey);
        throw error;
    }
}
