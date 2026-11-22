import "server-only";
import crypto from "crypto";
import { getFirestoreDatabase } from "./firebase-admin";
import { summarizeClicks, type ContactClick, type ContactClickSummary } from "./contact-clicks-summary";

export type { ContactChannel, ContactClick, ContactClickSummary } from "./contact-clicks-summary";

const COLLECTION = "contactClicks";

export async function recordContactClick(click: Omit<ContactClick, "id" | "at">) {
  const db = getFirestoreDatabase();
  if (!db) return;
  const entry: ContactClick = { id: crypto.randomUUID(), at: new Date().toISOString(), ...click };
  await db.collection(COLLECTION).doc(entry.id).set(entry);
}

export async function contactClickSummary(days = 30): Promise<ContactClickSummary> {
  const db = getFirestoreDatabase();
  if (!db) return summarizeClicks([], days);
  const since = new Date(Date.now() - days * 86_400_000).toISOString();
  const snapshot = await db.collection(COLLECTION).where("at", ">=", since).get();
  return summarizeClicks(snapshot.docs.map((doc) => doc.data() as ContactClick), days);
}
