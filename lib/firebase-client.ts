import { initializeApp, getApps, type FirebaseApp } from "firebase/app";

export type FirebaseWebConfig = {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
};

export function getFirebaseWebConfig(): FirebaseWebConfig | null {
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
    const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

    if (!apiKey || !authDomain || !projectId || !storageBucket || !messagingSenderId || !appId) {
        return null;
    }

    return { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId };
}

export function isFirebaseWebConfigured() {
    return getFirebaseWebConfig() !== null;
}

/** Browser / shared Firebase app. Safe for Auth and client SDKs. Never put Admin credentials here. */
export function getFirebaseApp(): FirebaseApp | null {
    const config = getFirebaseWebConfig();
    if (!config) return null;
    return getApps()[0] ?? initializeApp(config);
}
