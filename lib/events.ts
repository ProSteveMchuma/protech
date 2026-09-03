import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { getFirestoreDatabase } from "./firebase-admin";

export interface AnalyticsRecord {
    id: string;
    event: string;
    props: Record<string, unknown>;
    path?: string;
    createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "events.json");
const MAX_LOCAL_EVENTS = 2000;

async function ensure() {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
        await fs.access(FILE);
    } catch {
        await fs.writeFile(FILE, "[]", "utf-8");
    }
}

async function readAll(): Promise<AnalyticsRecord[]> {
    try {
        await ensure();
        return JSON.parse(await fs.readFile(FILE, "utf-8"));
    } catch {
        return [];
    }
}

export async function recordEvent(init: { event: string; props?: Record<string, unknown>; path?: string }): Promise<AnalyticsRecord> {
    const record: AnalyticsRecord = {
        id: crypto.randomUUID(),
        event: init.event,
        props: init.props ?? {},
        path: init.path,
        createdAt: new Date().toISOString(),
    };

    const db = getFirestoreDatabase();
    if (db) {
        try {
            await db.collection("events").doc(record.id).set(record);
            return record;
        } catch (err) {
            console.warn("[events] Firestore write failed:", (err as Error).message);
        }
    }

    try {
        await ensure();
        const items = await readAll();
        items.unshift(record);
        await fs.writeFile(FILE, JSON.stringify(items.slice(0, MAX_LOCAL_EVENTS), null, 2), "utf-8");
    } catch (err) {
        console.warn("[events] local persist failed:", (err as Error).message);
    }
    return record;
}

export async function listEvents(limit = 200): Promise<AnalyticsRecord[]> {
    const db = getFirestoreDatabase();
    if (db) {
        const snapshot = await db.collection("events").orderBy("createdAt", "desc").limit(limit).get();
        return snapshot.docs.map((doc) => doc.data() as AnalyticsRecord);
    }
    return (await readAll()).slice(0, limit);
}

/** Aggregate funnel counts for the admin dashboard. */
export async function eventTotals(): Promise<Record<string, number>> {
    const events = await listEvents(MAX_LOCAL_EVENTS);
    const totals: Record<string, number> = {};
    for (const record of events) totals[record.event] = (totals[record.event] ?? 0) + 1;
    return totals;
}
