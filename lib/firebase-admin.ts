import "server-only";
import { applicationDefault, cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let cached: Firestore | null | undefined;

function credentialsConfigured() {
    return Boolean(
        process.env.GOOGLE_APPLICATION_CREDENTIALS ||
        process.env.FIREBASE_CONFIG ||
        (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY)
    );
}

export function getFirestoreDatabase(): Firestore | null {
    if (cached !== undefined) return cached;
    if (!credentialsConfigured()) {
        if (process.env.NODE_ENV === "production") {
            throw new Error("Firestore credentials are required in production. Configure Application Default Credentials or FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY.");
        }
        cached = null;
        return cached;
    }

    const existing = getApps()[0];
    const app = existing ?? initializeApp(
        process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY
            ? {
                credential: cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
                }),
                projectId: process.env.FIREBASE_PROJECT_ID,
            }
            : { credential: applicationDefault(), projectId: process.env.FIREBASE_PROJECT_ID },
    );
    const databaseId = process.env.FIRESTORE_DATABASE_ID || "(default)";
    const database = databaseId === "(default)" ? getFirestore(app) : getFirestore(app, databaseId);
    try {
        database.settings({ ignoreUndefinedProperties: true });
    } catch (err) {
        if (!/already been initialized/i.test((err as Error).message)) throw err;
    }
    cached = database;
    return cached;
}

export function getAdminAuth(): Auth | null {
    if (!getFirestoreDatabase()) return null;
    const app = getApps()[0];
    return app ? getAuth(app) : null;
}
