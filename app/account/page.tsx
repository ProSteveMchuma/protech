"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Check, LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { track } from "@/lib/analytics";
import { FEATURE_LABELS, FEATURES, PLAN_LABELS } from "@/lib/entitlements";

export default function AccountPage() {
    const { configured, loading, user, plan, entitlements, signIn, signUp, logout } = useAuth();
    const [mode, setMode] = useState<"signin" | "signup">("signin");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [shopName, setShopName] = useState("");
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);

    async function submit(event: FormEvent) {
        event.preventDefault();
        setError("");
        setBusy(true);
        try {
            if (mode === "signup") {
                await signUp(email, password, shopName);
                track("signup", { plan });
            } else {
                await signIn(email, password);
                track("login");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="min-h-screen bg-press px-4 pb-16 pt-28 text-slate-100 sm:px-6">
            <div className="mx-auto max-w-2xl">
                <p className="kicker text-cyan-300">Shop workspace</p>
                <h1 className="mt-3 text-4xl font-black tracking-[-.04em]">Your ProPrint account</h1>

                {!configured && (
                    <div className="mt-6 rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100">
                        Accounts are not enabled on this deployment yet. The tools work fully without an account — your jobs
                        save in this browser. Set the Firebase web keys to turn on cloud sync and workspaces.
                    </div>
                )}

                {configured && loading && <p className="mt-8 text-slate-400">Loading your workspace…</p>}

                {configured && !loading && !user && (
                    <div className="mt-8 rounded-2xl border border-white/10 bg-press-panel p-6">
                        <div className="mb-5 inline-flex rounded-lg border border-white/10 bg-press p-0.5">
                            {(["signin", "signup"] as const).map((value) => (
                                <button
                                    key={value}
                                    onClick={() => setMode(value)}
                                    className={`rounded-md px-4 py-1.5 text-xs font-bold ${mode === value ? "bg-cyan-300 text-slate-950" : "text-slate-300"}`}
                                >
                                    {value === "signin" ? "Sign in" : "Create account"}
                                </button>
                            ))}
                        </div>
                        <form onSubmit={submit} className="space-y-4">
                            {mode === "signup" && (
                                <label className="serial-field">
                                    <span>Print shop name</span>
                                    <input value={shopName} onChange={(e) => setShopName(e.target.value)} placeholder="e.g. Nairobi Print Works" />
                                </label>
                            )}
                            <label className="serial-field">
                                <span>Email</span>
                                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
                            </label>
                            <label className="serial-field">
                                <span>Password</span>
                                <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "signup" ? "new-password" : "current-password"} />
                            </label>
                            {error && <p role="alert" className="rounded-lg border border-rose-400/30 bg-rose-400/10 p-3 text-sm text-rose-200">{error}</p>}
                            <button type="submit" className="primary-button" disabled={busy}>
                                {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
                            </button>
                        </form>
                    </div>
                )}

                {configured && !loading && user && (
                    <div className="mt-8 space-y-6">
                        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-press-panel p-6">
                            <div>
                                <p className="text-sm text-slate-400">Signed in as</p>
                                <p className="text-lg font-bold">{user.displayName || user.email}</p>
                                <p className="mt-1 font-mono text-xs uppercase tracking-wider text-cyan-300">Plan: {PLAN_LABELS[plan]}</p>
                            </div>
                            <button onClick={() => void logout()} className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-sm font-bold text-slate-200 hover:bg-white/5">
                                <LogOut className="size-4" aria-hidden="true" /> Sign out
                            </button>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-press-panel p-6">
                            <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-cyan-200">
                                <ShieldCheck className="size-4" aria-hidden="true" /> What your plan includes
                            </h2>
                            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                                {FEATURES.map((feature) => {
                                    const on = entitlements.includes(feature);
                                    return (
                                        <li key={feature} className={`flex items-center gap-2 text-sm ${on ? "text-slate-100" : "text-slate-500"}`}>
                                            <Check className={`size-4 ${on ? "text-emerald-400" : "text-slate-600"}`} aria-hidden="true" />
                                            {FEATURE_LABELS[feature]}
                                        </li>
                                    );
                                })}
                            </ul>
                            {plan === "free" && (
                                <Link href="/checkout" className="cta-primary mt-6 inline-flex px-5 py-2.5 text-sm">Choose a plan</Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
