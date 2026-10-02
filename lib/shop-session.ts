import "server-only";
import { cookies } from "next/headers";
import { business } from "./config";
import { getFirestoreDatabase } from "./firebase-admin";
import { claimPrintOrders } from "./print-orders";
import { accountRole, normalizeShopPhone, type ShopRole } from "./shop-account";
import { lookupIdToken, mintSessionCookie, readSessionCookie } from "./shop-identity";

export const SHOP_COOKIE = "proprint_session";
const SESSION_MAX_AGE_MS = 5 * 24 * 60 * 60 * 1000;

export type ShopUser = {
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: ShopRole;
};

function staffEmails() {
  return [business.supportEmail, ...(process.env.ADMIN_EMAILS || "").split(",")];
}

function asUser(uid: string, data: Record<string, unknown> | undefined, emailFallback = ""): ShopUser {
  return {
    uid,
    name: String(data?.name || "User"),
    email: String(data?.email || emailFallback),
    phone: String(data?.phone || ""),
    role: data?.role === "admin" ? "admin" : "user",
  };
}

export async function currentShopUser(): Promise<ShopUser | null> {
  const store = await cookies();
  const token = store.get(SHOP_COOKIE)?.value;
  if (!token) return null;
  const db = getFirestoreDatabase();
  if (!db) return null;
  const decoded = await readSessionCookie(token);
  if (!decoded) return null;
  const snap = await db.collection("shopUsers").doc(decoded.uid).get();
  if (!snap.exists) return null;
  return asUser(decoded.uid, snap.data() as Record<string, unknown> | undefined, decoded.email);
}

export async function openShopSession(idToken: string): Promise<{ user: ShopUser; cookie: string } | null> {
  const db = getFirestoreDatabase();
  if (!db || !idToken) return null;
  const decoded = await lookupIdToken(idToken);
  if (!decoded) return null;
  const ref = db.collection("shopUsers").doc(decoded.uid);
  const existing = await ref.get();
  const previous = existing.data() || {};
  const email = decoded.email || String(previous.email || "");
  const phone = normalizeShopPhone(decoded.phone || String(previous.phone || "")) || "";
  const name = String(previous.name || decoded.name || (email ? email.split("@")[0] : "User"));
  const user: ShopUser = {
    uid: decoded.uid,
    name,
    email,
    phone,
    role: accountRole(email, typeof previous.role === "string" ? previous.role : undefined, staffEmails()),
  };
  await ref.set({ ...user, updatedAt: new Date().toISOString(), createdAt: previous.createdAt || new Date().toISOString() });
  await claimPrintOrders(user);
  const cookie = await mintSessionCookie(idToken);
  if (!cookie) return null;
  return { user, cookie };
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE_MS / 1000,
  };
}

export async function updateShopProfile(input: { name?: string; phone?: string }): Promise<ShopUser | null> {
  const current = await currentShopUser();
  const db = getFirestoreDatabase();
  if (!current || !db) return null;
  const name = input.name?.trim().replace(/\s+/g, " ");
  const phone = input.phone !== undefined ? normalizeShopPhone(input.phone) || "" : current.phone;
  const next: ShopUser = {
    ...current,
    name: name && name.length >= 2 ? name : current.name,
    phone,
  };
  await db.collection("shopUsers").doc(current.uid).set({ ...next, updatedAt: new Date().toISOString() }, { merge: true });
  await claimPrintOrders(next);
  return next;
}
