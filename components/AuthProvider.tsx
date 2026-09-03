"use client";

import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import {
    browserLocalPersistence,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    sendPasswordResetEmail,
    setPersistence,
    signInWithEmailAndPassword,
    signOut,
    type User,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase-browser";
import { isFirebaseWebConfigured } from "@/lib/firebase-client";
import { mapAuthError } from "@/lib/proprint/auth-errors";
import { ensureShopProfile, maybeImportLocalSaves } from "@/lib/proprint/cloud-saves";

type AuthSnapshot = {
    user: User | null;
    ready: boolean;
};

type AuthContextValue = {
    user: User | null;
    ready: boolean;
    configured: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<void>;
    signOutUser: () => Promise<void>;
    sendReset: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const serverSnapshot: AuthSnapshot = { user: null, ready: false };

let snapshot: AuthSnapshot = { user: null, ready: false };
const listeners = new Set<() => void>();
let started = false;

function emit(next: AuthSnapshot) {
    if (snapshot.user === next.user && snapshot.ready === next.ready) return;
    snapshot = next;
    for (const listener of listeners) listener();
}

function startAuth() {
    if (started) return;
    started = true;
    if (!isFirebaseWebConfigured()) {
        snapshot = { user: null, ready: true };
        return;
    }
    const auth = getFirebaseAuth();
    if (!auth) {
        snapshot = { user: null, ready: true };
        return;
    }
    void setPersistence(auth, browserLocalPersistence);
    onAuthStateChanged(auth, (user) => {
        emit({ user, ready: true });
        if (!user) return;
        void ensureShopProfile(user)
            .then(() => maybeImportLocalSaves(user.uid))
            .catch(() => {
                // Profile / first-import failures should not block sign-in; the account page surfaces save errors.
            });
    });
}

function subscribeAuth(listener: () => void) {
    startAuth();
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}

function getAuthSnapshot() {
    return snapshot;
}

async function requireAuth() {
    const auth = getFirebaseAuth();
    if (!auth) {
        throw new Error("Shop accounts are not configured in this environment.");
    }
    await setPersistence(auth, browserLocalPersistence);
    return auth;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const configured = isFirebaseWebConfigured();
    const { user, ready } = useSyncExternalStore(subscribeAuth, getAuthSnapshot, () => serverSnapshot);

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            ready,
            configured,
            async signIn(email, password) {
                const auth = await requireAuth();
                try {
                    await signInWithEmailAndPassword(auth, email, password);
                } catch (error) {
                    throw new Error(mapAuthError(error));
                }
            },
            async signUp(email, password) {
                const auth = await requireAuth();
                try {
                    await createUserWithEmailAndPassword(auth, email, password);
                } catch (error) {
                    throw new Error(mapAuthError(error));
                }
            },
            async signOutUser() {
                const auth = getFirebaseAuth();
                if (!auth) return;
                await signOut(auth);
            },
            async sendReset(email) {
                const auth = await requireAuth();
                try {
                    await sendPasswordResetEmail(auth, email);
                } catch (error) {
                    throw new Error(mapAuthError(error));
                }
            },
        }),
        [configured, ready, user]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const value = useContext(AuthContext);
    if (!value) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return value;
}
