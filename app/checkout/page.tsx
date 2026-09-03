"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, Check, Smartphone } from "lucide-react";
import { PACKAGES, business } from "@/lib/config";
import { useAuth } from "@/components/auth/AuthProvider";
import { track } from "@/lib/analytics";

const PLAN_ORDER = ["serialpro-monthly", "prepress-monthly", "shop-monthly"] as const;

const PLAN_BLURB: Record<string, string> = {
    "serialpro-monthly": "One production tool, cloud-saved jobs and branded output.",
    "prepress-monthly": "Both tools, QR serials, multi-line quotes and the machine catalog.",
    "shop-monthly": "Everything, plus team workspaces and every module as it ships.",
};

export default function CheckoutPage() {
    const { user, getToken } = useAuth();
    const [pkgKey, setPkgKey] = useState<string>("prepress-monthly");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [code, setCode] = useState("");
    const [status, setStatus] = useState<{ kind: "idle" | "ok" | "error" | "info"; message: string }>({ kind: "idle", message: "" });
    const [busy, setBusy] = useState(false);

    const pkg = PACKAGES[pkgKey];

    useEffect(() => {
        track("checkout_started", {});
    }, []);

    useEffect(() => {
        if (user?.displayName) setName((prev) => prev || user.displayName || "");
        if (user?.email) setEmail((prev) => prev || user.email || "");
    }, [user]);

    const accountRef = useMemo(() => name.trim() || "your shop name", [name]);

    async function sendStkPush() {
        setStatus({ kind: "info", message: "Requesting an M-Pesa prompt…" });
        try {
            const res = await fetch("/api/payment/stkpush", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone, pkgKey }),
            });
            const data = await res.json();
            if (data.success) {
                setStatus({ kind: "info", message: data.message || "Check your phone and enter your M-Pesa PIN, then submit the code below." });
            } else {
                setStatus({ kind: "info", message: data.error || "Use the Paybill steps below to pay." });
            }
        } catch {
            setStatus({ kind: "error", message: "Could not reach M-Pesa. Use the Paybill steps below." });
        }
    }

    async function submit(event: FormEvent) {
        event.preventDefault();
        setBusy(true);
        setStatus({ kind: "idle", message: "" });
        try {
            const token = await getToken();
            const res = await fetch("/api/payment/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                body: JSON.stringify({ customerName: name, customerEmail: email, customerPhone: phone, mpesaCode: code, pkgKey }),
            });
            const data = await res.json();
            if (data.success) {
                track("payment_submitted", { pkgKey, amount: pkg?.amount });
                setStatus({ kind: "ok", message: "Payment received. We verify within 2 hours and activate your plan by email or WhatsApp." });
                setCode("");
            } else {
                setStatus({ kind: "error", message: data.error || "Could not submit. Check the details and try again." });
            }
        } catch {
            setStatus({ kind: "error", message: "Network error. Please try again." });
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="min-h-screen bg-press px-4 pb-16 pt-28 text-slate-100 sm:px-6">
            <div className="mx-auto max-w-5xl">
                <p className="kicker text-cyan-300">Checkout</p>
                <h1 className="mt-3 text-4xl font-black tracking-[-.04em]">Activate your plan</h1>
                <p className="mt-3 max-w-2xl text-slate-300">
                    Pay by M-Pesa. We confirm within 2 hours and switch on your features. The tools stay free to use meanwhile.
                </p>

                <div className="mt-10 grid gap-4 lg:grid-cols-3">
                    {PLAN_ORDER.map((key) => {
                        const plan = PACKAGES[key];
                        const active = key === pkgKey;
                        return (
                            <button
                                key={key}
                                onClick={() => setPkgKey(key)}
                                className={`rounded-2xl border p-6 text-left transition ${active ? "border-cyan-300 bg-cyan-300/10" : "border-white/10 hover:border-cyan-300/40"}`}
                            >
                                <div className="flex items-center justify-between">
                                    <p className="font-mono text-xs uppercase tracking-wider text-cyan-200">{plan.tier}</p>
                                    {active && <Check className="size-4 text-cyan-300" aria-hidden="true" />}
                                </div>
                                <p className="mt-4 font-mono text-2xl font-black tabular-nums">KES {plan.amount.toLocaleString()}<span className="text-sm font-normal text-slate-400"> /mo</span></p>
                                <p className="mt-3 text-sm leading-6 text-slate-300">{PLAN_BLURB[key]}</p>
                            </button>
                        );
                    })}
                </div>

                <div className="mt-8 grid gap-6 lg:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-press-panel p-6">
                        <h2 className="text-sm font-black uppercase tracking-wider text-cyan-200">Pay via M-Pesa Paybill</h2>
                        <ol className="mt-4 space-y-3 text-sm text-slate-200">
                            <li>1. Go to <b>Lipa na M-Pesa</b> → <b>Pay Bill</b>.</li>
                            <li>2. Business number: <b className="font-mono text-cyan-200">{business.paybill}</b></li>
                            <li>3. Account number: <b className="font-mono">{accountRef}</b></li>
                            <li>4. Amount: <b className="font-mono">KES {pkg?.amount.toLocaleString()}</b></li>
                            <li>5. Enter your PIN and confirm. Submit the SMS code on the right.</li>
                        </ol>
                        <div className="mt-6 rounded-xl border border-white/10 bg-press p-4">
                            <p className="text-xs text-slate-400">Prefer an instant prompt to your phone?</p>
                            <div className="mt-2 flex gap-2">
                                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="07XX XXX XXX" className="min-w-0 flex-1 rounded-lg border border-white/12 bg-press-panel px-3 py-2 text-sm outline-none focus:border-cyan-300" />
                                <button type="button" onClick={() => void sendStkPush()} className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-cyan-300/40 px-3 py-2 text-sm font-bold text-cyan-100 hover:bg-cyan-300/10">
                                    <Smartphone className="size-4" aria-hidden="true" /> Send prompt
                                </button>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={submit} className="rounded-2xl border border-white/10 bg-press-panel p-6">
                        <h2 className="text-sm font-black uppercase tracking-wider text-cyan-200">Confirm your payment</h2>
                        {!user && (
                            <p className="mt-3 text-xs text-amber-200">
                                Tip: <Link href="/account" className="underline">sign in</Link> first so we activate your plan automatically on verification.
                            </p>
                        )}
                        <label className="serial-field"><span>Shop / full name</span><input value={name} onChange={(e) => setName(e.target.value)} required /></label>
                        <label className="serial-field"><span>Email</span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
                        <label className="serial-field"><span>Phone</span><input value={phone} onChange={(e) => setPhone(e.target.value)} required /></label>
                        <label className="serial-field"><span>M-Pesa confirmation code</span><input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="e.g. QGH1A2B3C4" required /></label>
                        {status.message && (
                            <p role="status" className={`mt-4 rounded-lg border px-3 py-2 text-sm ${status.kind === "ok" ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200" : status.kind === "error" ? "border-rose-400/30 bg-rose-400/10 text-rose-200" : "border-cyan-300/30 bg-cyan-300/10 text-cyan-100"}`}>
                                {status.message}
                            </p>
                        )}
                        <button type="submit" className="primary-button" disabled={busy}>{busy ? "Submitting…" : "Submit payment"}</button>
                        <p className="mt-3 text-center text-[11px] text-slate-400">Billing is not auto-charged. Each period is a fresh M-Pesa payment until standing orders launch.</p>
                    </form>
                </div>

                <Link href="/#pricing" className="mt-8 inline-flex items-center gap-1.5 text-sm font-bold text-cyan-300 hover:text-cyan-200">
                    Compare all plans <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
            </div>
        </div>
    );
}
