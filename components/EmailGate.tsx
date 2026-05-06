"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2, ChevronDown, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";

const schema = z.object({
    email: z.string().trim().email("Enter a valid email"),
    name: z.string().trim().max(120).optional(),
    company: z.string().trim().max(160).optional(),
});

type FormValues = z.infer<typeof schema>;

const fieldClass =
    "w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 outline-none transition";

export function EmailGate() {
    const router = useRouter();
    const params = useSearchParams();
    const [showOptional, setShowOptional] = useState(false);
    const [success, setSuccess] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({ resolver: zodResolver(schema) });

    const utm_source = params.get("utm_source") || undefined;
    const utm_campaign = params.get("utm_campaign") || undefined;
    const ref = params.get("ref") || undefined;

    const onSubmit = async (values: FormValues) => {
        setServerError(null);
        try {
            const res = await fetch("/api/lead-magnet/unlock", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...values,
                    utm_source,
                    utm_campaign,
                    ref,
                }),
            });
            if (!res.ok) {
                const j = await res.json().catch(() => ({}));
                setServerError(j.error || "Something went wrong. Try again.");
                return;
            }
            setSuccess(true);
        } catch {
            setServerError("Network error. Try again.");
        }
    };

    // After success: short pause for the microinteraction, then refresh
    // the route so the server re-reads the cookie and renders the unlocked content.
    useEffect(() => {
        if (!success) return;
        const t = setTimeout(() => {
            router.refresh();
            // Auto-scroll to the first reason once the unlock has rendered.
            setTimeout(() => {
                const el = document.getElementById("reason-1");
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 300);
        }, 900);
        return () => clearTimeout(t);
    }, [success, router]);

    return (
        <div
            data-print-hide
            className="fixed inset-0 z-40 flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0 pointer-events-none"
        >
            {/* Soft backdrop — gradient up from page bottom so the blurred guide above stays teasing */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/60 to-slate-50 backdrop-blur-[2px] pointer-events-auto" />

            <motion.div
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-lg pointer-events-auto"
            >
                <div className="rounded-3xl bg-white border border-slate-200 premium-shadow p-7 md:p-9">
                    <AnimatePresence mode="wait">
                        {success ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-center py-4"
                            >
                                <div className="size-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle2 className="size-7 text-success-600" />
                                </div>
                                <h2 className="font-display text-2xl font-bold text-slate-900 mb-1.5">
                                    You&rsquo;re in.
                                </h2>
                                <p className="text-slate-600 text-sm">
                                    Unlocking the guide&hellip;
                                </p>
                            </motion.div>
                        ) : (
                            <motion.form
                                key="form"
                                initial={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onSubmit={handleSubmit(onSubmit)}
                                className="space-y-4"
                            >
                                <div className="flex items-start gap-3 mb-1">
                                    <span className="inline-flex size-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700 shrink-0">
                                        <Lock className="size-5" aria-hidden />
                                    </span>
                                    <div>
                                        <Badge tone="sun" className="mb-2">
                                            Free guide
                                        </Badge>
                                        <h2 className="font-display text-xl md:text-2xl font-bold text-slate-900 leading-tight">
                                            Read the full disqualification list.
                                        </h2>
                                        <p className="text-sm text-slate-600 mt-1">
                                            Drop your email and we&rsquo;ll unlock the guide instantly.
                                            Save it as a PDF, share it with your bid team.
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Work email
                                    </label>
                                    <input
                                        {...register("email")}
                                        type="email"
                                        autoComplete="email"
                                        className={fieldClass}
                                        placeholder="you@company.co.ke"
                                        autoFocus
                                    />
                                    {errors.email && (
                                        <p className="text-red-600 text-xs mt-1.5 font-medium">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setShowOptional((s) => !s)}
                                    className="text-xs text-slate-500 inline-flex items-center gap-1 hover:text-slate-700 transition"
                                >
                                    Tell us a bit more (optional)
                                    <ChevronDown
                                        className={`size-3.5 transition-transform ${showOptional ? "rotate-180" : ""}`}
                                    />
                                </button>

                                <AnimatePresence initial={false}>
                                    {showOptional && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                            className="overflow-hidden"
                                        >
                                            <div className="grid sm:grid-cols-2 gap-3 pt-1">
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-600 mb-1">
                                                        Your name
                                                    </label>
                                                    <input
                                                        {...register("name")}
                                                        autoComplete="name"
                                                        className={fieldClass}
                                                        placeholder="Jane Mwangi"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-600 mb-1">
                                                        Company
                                                    </label>
                                                    <input
                                                        {...register("company")}
                                                        autoComplete="organization"
                                                        className={fieldClass}
                                                        placeholder="Acme Co. Ltd"
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {serverError && (
                                    <p className="text-red-600 text-xs font-medium">{serverError}</p>
                                )}

                                <Button
                                    type="submit"
                                    loading={isSubmitting}
                                    variant="primary"
                                    size="lg"
                                    fullWidth
                                >
                                    Get the guide <ArrowRight className="size-5" />
                                </Button>

                                <p className="text-center text-[11px] text-slate-500 leading-relaxed">
                                    No spam. We&rsquo;ll only email you when we publish another tender
                                    guide or have something genuinely useful for Kenyan SMEs.
                                </p>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
