"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
    createUserWithEmailAndPassword,
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    type Auth,
    type User,
} from "firebase/auth";
import { getFirebaseApp, isFirebaseWebConfigured } from "@/lib/firebase-client";
import { hasEntitlement, type Feature, type PlanId } from "@/lib/entitlements";

interface AuthUser {
    uid: string;
    email: string | null;
    displayName: string | null;
}

interface AuthState {
    configured: boolean;
    loading: boolean;
    user: AuthUser | null;
    plan: PlanId;
    entitlements: Feature[];
    can: (feature: Feature) => boolean;
    signUp: (email: string, password: string, shopName?: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    getToken: () => Promise<string | null>;
    refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

function toAuthUser(user: User | null): AuthUser | null {
    return user ? { uid: user.uid, email: user.email, displayName: user.displayName } : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const configured = isFirebaseWebConfigured();
    const [loading, setLoading] = useState(configured);
    const [user, setUser] = useState<AuthUser | null>(null);
    const [plan, setPlan] = useState<PlanId>("free");
    const [entitlements, setEntitlements] = useState<Feature[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    const getToken = useCallback(async () => {
        try {
            return currentUser ? await currentUser.getIdToken() : null;
        } catch {
            return null;
        }
    }, [currentUser]);

    const loadEntitlements = useCallback(async (account: User | null) => {
        if (!account) {
            setPlan("free");
            setEntitlements([]);
            return;
        }
        try {
            const token = await account.getIdToken();
            const res = await fetch("/api/me", { headers: { Authorization: `Bearer ${token}` } });
            const data = await res.json();
            setPlan(data.plan ?? "free");
            setEntitlements(data.entitlements ?? []);
        } catch {
            setPlan("free");
            setEntitlements([]);
        }
    }, []);

    const refresh = useCallback(async () => {
        await loadEntitlements(currentUser);
    }, [loadEntitlements, currentUser]);

    useEffect(() => {
        // loading initialises to `configured`; when not configured it is already
        // false, so no synchronous setState is needed here.
        if (!configured) return;
        const app = getFirebaseApp();
        if (!app) return;
        const auth = getAuth(app);
        const unsubscribe = onAuthStateChanged(auth, (next) => {
            setCurrentUser(next);
            setUser(toAuthUser(next));
            setLoading(false);
            void loadEntitlements(next);
        });
        return unsubscribe;
    }, [configured, loadEntitlements]);

    const authOrThrow = (): Auth => {
        const app = getFirebaseApp();
        if (!app) throw new Error("Accounts are not configured on this deployment yet.");
        return getAuth(app);
    };

    const signUp = useCallback(async (email: string, password: string, shopName?: string) => {
        const auth = authOrThrow();
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        if (shopName) await updateProfile(credential.user, { displayName: shopName });
        setUser(toAuthUser(credential.user));
    }, []);

    const signIn = useCallback(async (email: string, password: string) => {
        const auth = authOrThrow();
        await signInWithEmailAndPassword(auth, email, password);
    }, []);

    const logout = useCallback(async () => {
        const app = getFirebaseApp();
        if (app) await signOut(getAuth(app));
        setPlan("free");
        setEntitlements([]);
    }, []);

    const value = useMemo<AuthState>(
        () => ({
            configured,
            loading,
            user,
            plan,
            entitlements,
            can: (feature: Feature) => hasEntitlement(plan, feature),
            signUp,
            signIn,
            logout,
            getToken,
            refresh,
        }),
        [configured, loading, user, plan, entitlements, signUp, signIn, logout, getToken, refresh]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}

export function useEntitlement(feature: Feature): boolean {
    return useAuth().can(feature);
}
