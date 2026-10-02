import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { getFirestoreDatabase } from "./firebase-admin";
import { toFirestoreData } from "./firestore-value";
import { statusAfterPayment, statusChangeAllowed, type FileState } from "./order-desk";
import type { PrintJob, QuoteSpec } from "./printshop/pricing";
import type { StoredArtwork } from "./order-files";
import { orderBelongsToAccount, type ShopAccount } from "./shop-account";

export type PrintOrderStatus = "received" | "confirmed" | "printing" | "ready" | "dispatched" | "cancelled";

export type PrintOrderLine = {
  lineId: string;
  slug: string;
  title: string;
  quantity: number;
  totalKes: number;
  summary: string;
  spec: QuoteSpec;
  job?: PrintJob;
  fileState?: FileState;
  artworkFile?: StoredArtwork;
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
  fulfillment?: "delivery" | "pickup";
  artwork?: string;
  notes?: string;
  internalNote?: string;
  artworkToken?: string;
  artworkFile?: { name: string; size: number; contentType: string; path: string };
  payment?: { state: "unreviewed" | "confirmed" | "rejected"; note?: string; at: string };
  mpesaCode: string;
  lines: PrintOrderLine[];
  subtotalKes: number;
  deliveryKes: number;
  totalKes: number;
  statusHistory: { status: PrintOrderStatus; at: string }[];
  userId?: string;
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

export async function savePrintOrder(order: Omit<PrintOrder, "id" | "createdAt" | "status" | "statusHistory">): Promise<{ order: PrintOrder | null; duplicate: boolean }> {
  const createdAt = new Date().toISOString();
  const saved = toFirestoreData<PrintOrder>({
    ...order,
    mpesaCode: order.mpesaCode.trim().toUpperCase(),
    id: crypto.randomUUID(),
    createdAt,
    status: "received",
    statusHistory: [{ status: "received", at: createdAt }],
    artworkToken: crypto.randomBytes(24).toString("hex"),
    payment: { state: "unreviewed", at: createdAt },
  });
  const db = getFirestoreDatabase();
  if (db) {
    const existing = await db.collection("printOrders").where("mpesaCode", "==", saved.mpesaCode).limit(1).get();
    if (!existing.empty) return { order: existing.docs[0].data() as PrintOrder, duplicate: true };
    await db.collection("printOrders").doc(saved.id).set(saved);
    return { order: saved, duplicate: false };
  }
  try {
    await ensureStore();
    const orders = await listPrintOrders();
    const duplicate = orders.find((item) => item.mpesaCode === saved.mpesaCode);
    if (duplicate) return { order: duplicate, duplicate: true };
    orders.unshift(saved);
    await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
    return { order: saved, duplicate: false };
  } catch (err) {
    console.warn("[print-orders] Persistence skipped:", (err as Error).message);
    return { order: null, duplicate: false };
  }
}

export async function listPrintOrders(limit = 200): Promise<PrintOrder[]> {
  const db = getFirestoreDatabase();
  if (db) {
    const snapshot = await db.collection("printOrders").orderBy("createdAt", "desc").limit(limit).get();
    return snapshot.docs.map((doc) => doc.data() as PrintOrder);
  }
  try {
    await ensureStore();
    const raw = await fs.readFile(ORDERS_FILE, "utf-8");
    const orders = JSON.parse(raw) as PrintOrder[];
    return Array.isArray(orders) ? orders.slice(0, limit) : [];
  } catch {
    return [];
  }
}

export async function listAccountOrders(account: ShopAccount): Promise<PrintOrder[]> {
  const orders = await listPrintOrders(200);
  return orders.filter((order) => orderBelongsToAccount(order, account));
}

export async function claimPrintOrders(account: ShopAccount): Promise<number> {
  const orders = await listPrintOrders(200);
  let claimed = 0;
  for (const order of orders) {
    if (order.userId) continue;
    if (!orderBelongsToAccount(order, account)) continue;
    await persist({ ...order, userId: account.uid });
    claimed += 1;
  }
  return claimed;
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

function tokensMatch(stored: string, provided: string) {
  const left = Buffer.from(stored);
  const right = Buffer.from(provided);
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

async function persist(order: PrintOrder) {
  const db = getFirestoreDatabase();
  if (db) {
    await db.collection("printOrders").doc(order.id).set(toFirestoreData(order));
    return;
  }
  await ensureStore();
  const raw = await fs.readFile(ORDERS_FILE, "utf-8");
  const orders = JSON.parse(raw) as PrintOrder[];
  const index = Array.isArray(orders) ? orders.findIndex((item) => item.id === order.id) : -1;
  const next = Array.isArray(orders) ? orders : [];
  if (index === -1) next.unshift(order);
  else next[index] = order;
  await fs.writeFile(ORDERS_FILE, JSON.stringify(next, null, 2), "utf-8");
}

export async function updatePrintOrderStatus(id: string, status: PrintOrderStatus): Promise<{ order: PrintOrder | null; error?: string }> {
  const current = await getPrintOrder(id);
  if (!current) return { order: null, error: "Order not found" };
  if (current.status === status) return { order: current };
  const error = statusChangeAllowed(current, status);
  if (error) return { order: current, error };
  const next = {
    ...current,
    status,
    statusHistory: [...(current.statusHistory ?? []), { status, at: new Date().toISOString() }],
  };
  await persist(next);
  return { order: next };
}

export async function reviewOrderPayment(id: string, decision: "confirmed" | "rejected", note?: string): Promise<PrintOrder | null> {
  const current = await getPrintOrder(id);
  if (!current) return null;
  const status = statusAfterPayment(current.status, decision);
  const at = new Date().toISOString();
  const next: PrintOrder = {
    ...current,
    status,
    payment: { state: decision, note: note?.trim() || undefined, at },
    statusHistory: status === current.status ? current.statusHistory : [...(current.statusHistory ?? []), { status, at }],
  };
  await persist(next);
  return next;
}

export async function setOrderInternalNote(id: string, note: string): Promise<PrintOrder | null> {
  const current = await getPrintOrder(id);
  if (!current) return null;
  const next = { ...current, internalNote: note.trim() };
  await persist(next);
  return next;
}

export async function reviewLineFile(id: string, lineId: string, fileState: "accepted" | "rejected"): Promise<PrintOrder | null> {
  const current = await getPrintOrder(id);
  if (!current) return null;
  if (!current.lines.some((line) => line.lineId === lineId)) return null;
  const next = { ...current, lines: current.lines.map((line) => (line.lineId === lineId ? { ...line, fileState } : line)) };
  await persist(next);
  return next;
}

export async function attachLineArtwork(id: string, lineId: string, file: StoredArtwork): Promise<PrintOrder | null> {
  const current = await getPrintOrder(id);
  if (!current) return null;
  const line = current.lines.find((item) => item.lineId === lineId);
  if (!line || line.fileState === "accepted") return null;
  const next = {
    ...current,
    lines: current.lines.map((item) => (item.lineId === lineId ? { ...item, artworkFile: file, fileState: "received" as const } : item)),
  };
  await persist(next);
  return next;
}

export async function attachOrderArtwork(id: string, file: StoredArtwork, consumeToken: boolean): Promise<PrintOrder | null> {
  const current = await getPrintOrder(id);
  if (!current) return null;
  const next = { ...current, artworkFile: file, artworkToken: consumeToken ? undefined : current.artworkToken };
  await persist(next);
  return next;
}

export async function orderMatchingArtworkToken(id: string, token: string): Promise<PrintOrder | null> {
  const order = await getPrintOrder(id);
  if (!order?.artworkToken || !tokensMatch(order.artworkToken, token)) return null;
  return order;
}

export function deskOrder(order: PrintOrder): PrintOrder {
  const copy = { ...order };
  delete copy.artworkToken;
  return copy;
}
