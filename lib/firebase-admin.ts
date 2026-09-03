import "server-only";
import { applicationDefault, cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let cachedDb: Firestore | null | undefined;
let cachedApp: App | null | undefined;

export function isFirebaseAdminConfigured() {
    return Boolean(
        process.env.GOOGLE_APPLICATION_CREDENTIALS ||
            process.env.FIREBASE_CONFIG ||
            (process.env.FIREBASE_PROJECT_ID &&
                process.env.FIREBASE_CLIENT_EMAIL &&
                process.env.FIREBASE_PRIVATE_KEY)
    );
}

function getAdminApp(): App | null {
    if (cachedApp !== undefined) return cachedApp;
    if (!isFirebaseAdminConfigured()) {
        if (process.env.NODE_ENV === "production") {
            throw new Error(
                "Firestore credentials are required in production. Configure Application Default Credentials or FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY."
            );
        }
        cachedApp = null;
        return cachedApp;
    }

    const existing = getApps()[0];
    if (existing) {
        cachedApp = existing;
        return cachedApp;
    }

    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
        cachedApp = initializeApp({
            credential: cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
            }),
            projectId: process.env.FIREBASE_PROJECT_ID,
        });
        return cachedApp;
    }

    cachedApp = initializeApp({
        credential: applicationDefault(),
        projectId: process.env.FIREBASE_PROJECT_ID,
    });
    return cachedApp;
}

export function getFirestoreDatabase(): Firestore | null {
    if (cachedDb !== undefined) return cachedDb;
    const app = getAdminApp();
    if (!app) {
        cachedDb = null;
        return cachedDb;
    }
    cachedDb = getFirestore(app);
    return cachedDb;
}
