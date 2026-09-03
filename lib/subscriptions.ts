import { promises as fs } from "fs";
import path from "path";
import { getFirestoreDatabase } from "./firebase-admin";
import { planFromPackageKey, type PlanId } from "./entitlements";

export type SubscriptionStatus = "active" | "past_due" | "canceled";

export interface Subscription {
    uid: string;
    plan: PlanId;
    status: SubscriptionStatus;
    pkgKey: string | null;
    updatedAt: string;
    /** ISO date the current paid period ends; used for grace/dunning. */
    currentPeriodEnd?: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "subscriptions.json");

async function ensure() {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
        await fs.access(FILE);
    } catch {
        await fs.writeFile(FILE, "[]", "utf-8");
    }
}

async function readAll(): Promise<Subscription[]> {
    try {
        await ensure();
        return JSON.parse(await fs.readFile(FILE, "utf-8"));
    } catch {
        return [];
    }
}

async function writeAll(items: Subscription[]) {
    try {
        await ensure();
        await fs.writeFile(FILE, JSON.stringify(items, null, 2), "utf-8");
    } catch (err) {
        console.warn("[subscriptions] persist failed:", (err as Error).message);
    }
}

export async function getSubscription(uid: string): Promise<Subscription | null> {
    const db = getFirestoreDatabase();
    if (db) {
        const doc = await db.collection("subscriptions").doc(uid).get();
        return doc.exists ? (doc.data() as Subscription) : null;
    }
    return (await readAll()).find((s) => s.uid === uid) ?? null;
}

/** Effective plan today, downgrading to free once a paid period has lapsed. */
export function effectivePlan(sub: Subscription | null): PlanId {
    if (!sub || sub.status === "canceled") return "free";
    if (sub.currentPeriodEnd && new Date(sub.currentPeriodEnd).getTime() < Date.now()) {
        return sub.status === "active" ? sub.plan : "free";
    }
    return sub.plan;
}

export async function activateSubscription(uid: string, pkgKey: string, days = 31): Promise<Subscription> {
    const sub: Subscription = {
        uid,
        plan: planFromPackageKey(pkgKey),
        status: "active",
        pkgKey,
        updatedAt: new Date().toISOString(),
        currentPeriodEnd: new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString(),
    };

    const db = getFirestoreDatabase();
    if (db) {
        await db.collection("subscriptions").doc(uid).set(sub);
        return sub;
    }
    const items = await readAll();
    const next = [sub, ...items.filter((s) => s.uid !== uid)];
    await writeAll(next);
    return sub;
}
