import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { getFirestoreDatabase } from "./firebase-admin";
import type { QuoteSpec } from "./printshop/pricing";

export type PrintOrderStatus = "received" | "confirmed" | "printing" | "dispatched" | "cancelled";

export type PrintOrderLine = {
  slug: string;
  title: string;
  quantity: number;
  totalKes: number;
  summary: string;
  spec: QuoteSpec;
};

export type PrintOrder = {
  id: string;
  createdAt: string;
  status: PrintOrderStatus;
  customer: {
    name: string;
    email: string;
    phone: string;
    county: string;
    address: string;
  };
  artwork?: string;
  notes?: string;
  mpesaCode: string;
  lines: PrintOrderLine[];
  subtotalKes: number;
  deliveryKes: number;
  totalKes: number;
};

const DATA_DIR = path.join(process.cwd(), "data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

async function ensureStore() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(ORDERS_FILE);
  } catch {
    await fs.writeFile(ORDERS_FILE, "[]", "utf-8");
  }
}

export async function savePrintOrder(order: Omit<PrintOrder, "id" | "createdAt" | "status">): Promise<PrintOrder | null> {
  const saved: PrintOrder = { ...order, id: crypto.randomUUID(), createdAt: new Date().toISOString(), status: "received" };
  const db = getFirestoreDatabase();
  if (db) {
    await db.collection("printOrders").doc(saved.id).set(saved);
    return saved;
  }
  try {
    await ensureStore();
    const orders = await listPrintOrders();
    orders.unshift(saved);
    await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
    return saved;
  } catch (err) {
    console.warn("[print-orders] Persistence skipped:", (err as Error).message);
    return null;
  }
}

export async function listPrintOrders(): Promise<PrintOrder[]> {
  const db = getFirestoreDatabase();
  if (db) {
    const snapshot = await db.collection("printOrders").orderBy("createdAt", "desc").get();
    return snapshot.docs.map((doc) => doc.data() as PrintOrder);
  }
  try {
    await ensureStore();
    const raw = await fs.readFile(ORDERS_FILE, "utf-8");
    const orders = JSON.parse(raw) as PrintOrder[];
    return Array.isArray(orders) ? orders : [];
  } catch {
    return [];
  }
}

export async function getPrintOrder(id: string): Promise<PrintOrder | null> {
  const db = getFirestoreDatabase();
  if (db) {
    const snapshot = await db.collection("printOrders").doc(id).get();
    return snapshot.exists ? (snapshot.data() as PrintOrder) : null;
  }
  const orders = await listPrintOrders();
  return orders.find((order) => order.id === id) ?? null;
}

export async function updatePrintOrderStatus(id: string, status: PrintOrderStatus): Promise<boolean> {
  const db = getFirestoreDatabase();
  if (db) {
    const ref = db.collection("printOrders").doc(id);
    const snapshot = await ref.get();
    if (!snapshot.exists) return false;
    await ref.update({ status });
    return true;
  }
  try {
    const orders = await listPrintOrders();
    const index = orders.findIndex((order) => order.id === id);
    if (index === -1) return false;
    orders[index].status = status;
    await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
    return true;
  } catch {
    return false;
  }
}
