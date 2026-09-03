import "server-only";
import { getAuth } from "firebase-admin/auth";
import { getApps } from "firebase-admin/app";
import { getFirestoreDatabase } from "./firebase-admin";

export interface VerifiedUser {
    uid: string;
    email: string | null;
}

/**
 * Verify a Firebase ID token from an Authorization: Bearer header.
 * Returns null when Admin credentials or the token are missing/invalid, so
 * callers degrade gracefully in local dev without Firebase configured.
 */
export async function verifyRequestUser(req: Request): Promise<VerifiedUser | null> {
    const header = req.headers.get("authorization") || "";
    const match = header.match(/^Bearer\s+(.+)$/i);
    if (!match) return null;

    // Ensure the admin app is initialised (getFirestoreDatabase triggers init).
    getFirestoreDatabase();
    if (getApps().length === 0) return null;

    try {
        const decoded = await getAuth().verifyIdToken(match[1]);
        return { uid: decoded.uid, email: decoded.email ?? null };
    } catch {
        return null;
    }
}
