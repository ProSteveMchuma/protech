"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    CheckCircle2,
    AlertCircle,
    Copy,
    Check,
    ArrowRight,
    Smartphone,
} from "lucide-react";
import { PACKAGES, business } from "@/lib/config";
import { Button } from "./ui/Button";
import { fadeUp } from "@/lib/motion";

type Step = "details" | "pay" | "done";

const fieldClass =
    "w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 outline-none transition";

export function CheckoutForm() {
    const params = useSearchParams();
    const pkgKey = params.get("pkg") || "va-growth";
    const pkg = PACKAGES[pkgKey] || PACKAGES["va-growth"];

    const [step, setStep] = useState<Step>("details");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [code, setCode] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [resultMessage, setResultMessage] = useState<string | null>(null);

    const accountRef = useMemo(() => name.trim() || "Your Full Name", [name]);

    function startPayment(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        if (name.trim().length < 2) return setError("Enter your full name");
        if (!email.includes("@")) return setError("Enter a valid email");
        if (phone.replace(/\D/g, "").length < 9) return setError("Enter a valid phone");
        setStep("pay");
    }

    async function submitCode(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            const res = await fetch("/api/payment/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customerName: name,
                    customerEmail: email,
                    customerPhone: phone,
                    mpesaCode: code,
                    pkgKey,
                }),
            });
            const body = await res.json();
            if (!res.ok || !body.success) {
                setError(body.error || "Could not submit payment.");
                return;
            }
            setResultMessage(
                body.duplicate
                    ? body.message
                    : "Verified within 4 business hours. Onboarding follows."
            );
            setStep("done");
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    if (step === "done") {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.5, type: "spring", bounce: 0.4 }}
                    className="size-20 rounded-full bg-success-500/10 flex items-center justify-center mx-auto mb-5"
                >
                    <CheckCircle2 className="size-12 text-success-600" />
                </motion.div>
                <h3 className="font-display text-2xl font-bold text-emerald-900 mb-2">
                    Payment submitted.
                </h3>
                <p className="text-emerald-800 mb-2">
                    Thanks {name}. Verifying code{" "}
                    <span className="font-mono font-bold tabular-nums">
                        {code.toUpperCase()}
                    </span>
                    .
                </p>
                <p className="text-sm text-emerald-700">{resultMessage}</p>
            </motion.div>
        );
    }

    return (
        <div className="space-y-6">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="bg-gradient-to-br from-brand-50 to-accent-50 border border-brand-100 rounded-2xl p-4 md:p-5"
            >
                <div className="text-[10px] uppercase tracking-[0.2em] text-brand-700/80 font-bold mb-1">
                    You're paying for
                </div>
                <div className="text-sm font-medium text-slate-600 mb-2">
                    {pkg.tier}
                    <span className="text-slate-400"> · {pkg.service}</span>
                </div>
                <div className="font-mono tabular-nums text-3xl md:text-4xl font-bold text-brand-950 leading-none">
                    KES {pkg.amount.toLocaleString()}
                </div>
            </motion.div>

            <Stepper step={step} />

            <AnimatePresence mode="wait">
                {step === "details" && (
                    <motion.form
                        key="details"
                        onSubmit={startPayment}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-5"
                    >
                        <div className="grid md:grid-cols-2 gap-4">
                            <Field
                                label="Full name"
                                hint="This must match the M-Pesa account name you'll use."
                            >
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className={fieldClass}
                                    placeholder="Jane Mwangi"
                                />
                            </Field>
                            <Field label="Email">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className={fieldClass}
                                    placeholder="jane@company.co.ke"
                                />
                            </Field>
                        </div>
                        <Field label="Phone number" hint="The Safaricom number you'll pay from.">
                            <input
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                                inputMode="tel"
                                className={fieldClass}
                                placeholder="0712 345 678"
                            />
                        </Field>
                        {error && <ErrorBox>{error}</ErrorBox>}
                        <Button type="submit" variant="dark" size="xl" fullWidth>
                            Continue to M-Pesa instructions <ArrowRight className="size-5" />
                        </Button>
                    </motion.form>
                )}

                {step === "pay" && (
                    <motion.div
                        key="pay"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-5"
                    >
                        <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-200 rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 rounded-xl bg-success-500 flex items-center justify-center">
                                    <Smartphone className="size-5 text-white" />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900">
                                        Pay via M-Pesa
                                    </div>
                                    <div className="text-xs text-slate-500">
                                        Lipa Na M-Pesa → Pay Bill
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <CopyRow label="Business no. (Paybill)" value={business.paybill} />
                                <CopyRow label="Account number" value={accountRef} />
                                <CopyRow
                                    label="Amount"
                                    value={`KES ${pkg.amount.toLocaleString()}`}
                                    copyValue={String(pkg.amount)}
                                />
                            </div>
                            <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-700 leading-relaxed">
                                <p className="font-semibold text-slate-900 mb-2">
                                    On your phone:
                                </p>
                                <ol className="list-decimal list-inside space-y-1 text-xs marker:text-brand-500 marker:font-bold">
                                    <li>Open M-Pesa → Lipa Na M-Pesa → Pay Bill</li>
                                    <li>
                                        Business number:{" "}
                                        <strong className="font-mono tabular-nums font-bold text-slate-900">
                                            {business.paybill}
                                        </strong>
                                    </li>
                                    <li>
                                        Account number:{" "}
                                        <strong className="font-mono font-bold text-slate-900">
                                            {accountRef}
                                        </strong>
                                    </li>
                                    <li>
                                        Amount:{" "}
                                        <strong className="font-mono tabular-nums font-bold text-slate-900">
                                            {pkg.amount.toLocaleString()}
                                        </strong>
                                    </li>
                                    <li>Enter your M-Pesa PIN and confirm</li>
                                    <li>
                                        You'll get an SMS with a confirmation code (e.g.{" "}
                                        <span className="font-mono font-bold">QGH1A2B3C4</span>) — enter
                                        it below.
                                    </li>
                                </ol>
                            </div>
                        </div>

                        <form onSubmit={submitCode} className="space-y-4">
                            <Field
                                label="M-Pesa confirmation code"
                                hint="From the Safaricom SMS — looks like QGH1A2B3C4."
                            >
                                <input
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                                    required
                                    maxLength={12}
                                    autoCapitalize="characters"
                                    className={`${fieldClass} font-mono text-lg tracking-[0.15em] uppercase border-2 focus:border-success-500 focus:ring-success-500/30`}
                                    placeholder="QGH1A2B3C4"
                                />
                            </Field>
                            {error && <ErrorBox>{error}</ErrorBox>}
                            <Button
                                type="submit"
                                loading={submitting}
                                variant="success"
                                size="xl"
                                fullWidth
                            >
                                I've paid — submit code
                            </Button>
                            <button
                                type="button"
                                onClick={() => setStep("details")}
                                className="block w-full text-sm text-slate-500 hover:text-slate-800 transition"
                            >
                                ← Back to details
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function Stepper({ step }: { step: Step }) {
    const items = [
        { key: "details", label: "Your details" },
        { key: "pay", label: "Pay & confirm" },
    ];
    return (
        <ol className="flex items-center gap-3 text-xs font-medium">
            {items.map((it, i) => {
                const idx = items.findIndex((x) => x.key === step);
                const active = i === idx;
                const done = i < idx;
                return (
                    <li key={it.key} className="flex items-center gap-3 flex-1">
                        <span
                            className={`size-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors ${done
                                ? "bg-success-500 text-white"
                                : active
                                    ? "bg-brand-950 text-white"
                                    : "bg-slate-200 text-slate-500"
                                }`}
                        >
                            {done ? <Check className="size-3.5" /> : i + 1}
                        </span>
                        <span className={active ? "text-slate-900" : "text-slate-500"}>
                            {it.label}
                        </span>
                        {i < items.length - 1 && (
                            <span className="flex-1 h-px bg-slate-200" />
                        )}
                    </li>
                );
            })}
        </ol>
    );
}

function Field({
    label,
    hint,
    children,
}: {
    label: string;
    hint?: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {label}
            </label>
            {children}
            {hint && <p className="text-xs text-slate-500 mt-1.5">{hint}</p>}
        </div>
    );
}

function ErrorBox({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-800"
        >
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <div>{children}</div>
        </motion.div>
    );
}

function CopyRow({
    label,
    value,
    copyValue,
}: {
    label: string;
    value: string;
    copyValue?: string;
}) {
    const [copied, setCopied] = useState(false);
    async function copy() {
        try {
            await navigator.clipboard.writeText(copyValue ?? value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            // ignore
        }
    }
    return (
        <button
            type="button"
            onClick={copy}
            className="w-full flex items-center justify-between gap-3 p-3 rounded-xl bg-white border border-slate-200 hover:border-success-500 hover:ring-2 hover:ring-success-500/20 hover:shadow-md transition-all text-left group"
        >
            <div>
                <div className="text-[11px] uppercase tracking-wide text-slate-500 font-bold">
                    {label}
                </div>
                <div className="font-mono font-bold text-slate-900 text-lg">
                    {value}
                </div>
            </div>
            <div
                className={`flex items-center gap-1.5 text-xs font-bold transition ${copied ? "text-success-600" : "text-slate-500 group-hover:text-success-600"
                    }`}
            >
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                {copied ? "Copied" : "Copy"}
            </div>
        </button>
    );
}
