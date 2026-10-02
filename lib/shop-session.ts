import "server-only";
import { cookies } from "next/headers";
import { business } from "./config";
import { getAdminAuth, getFirestoreDatabase } from "./firebase-admin";
import { claimPrintOrders } from "./print-orders";
import { accountRole, normalizeShopPhone, type ShopRole } from "./shop-account";

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

export async function currentShopUser(): Promise<ShopUser | null> {
  const store = await cookies();
  const token = store.get(SHOP_COOKIE)?.value;
  if (!token) return null;
  const auth = getAdminAuth();
  const db = getFirestoreDatabase();
  if (!auth || !db) return null;
  try {
    const decoded = await auth.verifySessionCookie(token, true);
    const snap = await db.collection("shopUsers").doc(decoded.uid).get();
    if (!snap.exists) return null;
    const data = snap.data() || {};
    return {
      uid: decoded.uid,
      name: String(data.name || "User"),
      email: String(data.email || decoded.email || ""),
      phone: String(data.phone || ""),
      role: data.role === "admin" ? "admin" : "user",
    };
  } catch {
    return null;
  }
}

export async function openShopSession(idToken: string): Promise<{ user: ShopUser; cookie: string } | null> {
  const auth = getAdminAuth();
  const db = getFirestoreDatabase();
  if (!auth || !db || !idToken) return null;
  const decoded = await auth.verifyIdToken(idToken);
  const ref = db.collection("shopUsers").doc(decoded.uid);
  const existing = await ref.get();
  const previous = existing.data() || {};
  const email = String(decoded.email || previous.email || "").trim().toLowerCase();
  const phone = normalizeShopPhone(String(decoded.phone_number || previous.phone || "")) || "";
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
  const cookie = await auth.createSessionCookie(idToken, { expiresIn: SESSION_MAX_AGE_MS });
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
  const auth = getAdminAuth();
  const db = getFirestoreDatabase();
  if (!current || !auth || !db) return null;
  const name = input.name?.trim().replace(/\s+/g, " ");
  const phone = input.phone !== undefined ? normalizeShopPhone(input.phone) || "" : current.phone;
  const next: ShopUser = {
    ...current,
    name: name && name.length >= 2 ? name : current.name,
    phone,
  };
  await db.collection("shopUsers").doc(current.uid).set({ ...next, updatedAt: new Date().toISOString() }, { merge: true });
  if (next.name !== current.name) await auth.updateUser(current.uid, { displayName: next.name }).catch(() => undefined);
  await claimPrintOrders(next);
  return next;
}
