import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { getFirestoreDatabase } from "./firebase-admin";

export type PaymentStatus = "pending" | "verified" | "rejected";

export interface Payment {
    id: string;
    createdAt: string;
    updatedAt: string;
    status: PaymentStatus;
    amount: number;
    /** Customer enters this from the M-Pesa SMS, e.g. "QGH1234XYZ" */
    mpesaCode: string;
    /** Account reference customer used (typically their full name). */
    accountRef: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    service: string;
    tier: string;
    pkgKey: string;
    /** Set when admin verifies/rejects. */
    verifiedAt?: string;
    note?: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "payments.json");

async function ensure() {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
        await fs.access(FILE);
    } catch {
        await fs.writeFile(FILE, "[]", "utf-8");
    }
}

async function readAll(): Promise<Payment[]> {
    try {
        await ensure();
        return JSON.parse(await fs.readFile(FILE, "utf-8"));
    } catch {
        return [];
    }
}

async function writeAll(items: Payment[]) {
    try {
        await ensure();
        await fs.writeFile(FILE, JSON.stringify(items, null, 2), "utf-8");
    } catch (err) {
        console.warn("[payments] persist failed:", (err as Error).message);
    }
}

/** Customer submits a manual payment claim. */
export async function submitPayment(
    init: Omit<Payment, "id" | "createdAt" | "updatedAt" | "status" | "verifiedAt">
): Promise<{ payment: Payment; duplicate: boolean }> {
    const db = getFirestoreDatabase();
    if (db) {
        const code = init.mpesaCode.trim().toUpperCase();
        const ref = db.collection("payments").doc(code);
        return db.runTransaction(async (transaction) => {
            const existing = await transaction.get(ref);
            if (existing.exists) return { payment: existing.data() as Payment, duplicate: true };
            const now = new Date().toISOString();
            const payment: Payment = { id: crypto.randomUUID(), createdAt: now, updatedAt: now, status: "pending", ...init, mpesaCode: code };
            transaction.create(ref, payment);
            return { payment, duplicate: false };
        });
    }
    const items = await readAll();

    const code = init.mpesaCode.trim().toUpperCase();
    const existing = items.find((p) => p.mpesaCode === code);
    if (existing) {
        return { payment: existing, duplicate: true };
    }

    const now = new Date().toISOString();
    const payment: Payment = {
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
        status: "pending",
        ...init,
        mpesaCode: code,
    };
    items.unshift(payment);
    await writeAll(items);
    return { payment, duplicate: false };
}

export async function listPayments(): Promise<Payment[]> {
    const db = getFirestoreDatabase();
    if (db) {
        const snapshot = await db.collection("payments").orderBy("createdAt", "desc").get();
        return snapshot.docs.map((doc) => doc.data() as Payment);
    }
    return readAll();
}

export async function setPaymentStatus(
    id: string,
    status: PaymentStatus,
    note?: string
): Promise<Payment | null> {
    const db = getFirestoreDatabase();
    if (db) {
        const query = await db.collection("payments").where("id", "==", id).limit(1).get();
        if (query.empty) return null;
        const ref = query.docs[0].ref;
        const current = query.docs[0].data() as Payment;
        const updated: Payment = { ...current, status, verifiedAt: new Date().toISOString(), updatedAt: new Date().toISOString(), ...(note !== undefined || current.note !== undefined ? { note: note ?? current.note } : {}) };
        await ref.set(updated);
        return updated;
    }
    const items = await readAll();
    const idx = items.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    items[idx] = {
        ...items[idx],
        status,
        verifiedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        note: note ?? items[idx].note,
    };
    await writeAll(items);
    return items[idx];
}
