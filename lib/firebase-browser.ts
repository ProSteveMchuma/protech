import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getFirebaseApp } from "@/lib/firebase-client";

export function getFirebaseAuth(): Auth | null {
    if (typeof window === "undefined") return null;
    const app = getFirebaseApp();
    if (!app) return null;
    return getAuth(app);
}

export function getClientFirestore(): Firestore | null {
    if (typeof window === "undefined") return null;
    const app = getFirebaseApp();
    if (!app) return null;
    return getFirestore(app);
}
