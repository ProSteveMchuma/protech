"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { clsx } from "clsx";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

interface PricingTier {
    name: string;
    price: string;
    description: string;
    features: string[];
    recommended?: boolean;
    pkgKey?: string;
}

interface Props {
    tiers: PricingTier[];
    serviceName: string;
}

export function PricingV2({ tiers, serviceName }: Props) {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={stagger(0, 0.1)}
            className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4"
        >
            {tiers.map((tier, i) => (
                <motion.div key={i} variants={fadeUp}>
                    <div
                        className={clsx(
                            "relative h-full rounded-3xl border p-8 flex flex-col transition-all duration-500",
                            tier.recommended
                                ? "bg-brand-950 text-white border-brand-950 shadow-2xl shadow-brand-950/30 lg:scale-[1.04] z-10"
                                : "bg-white text-slate-900 border-slate-200 premium-shadow-hover"
                        )}
                    >
                        {tier.recommended && (
                            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                                <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-accent-500 to-brand-500 text-white text-[11px] font-bold uppercase tracking-wider shadow-lg">
                                    <Sparkles className="size-3" /> Best value
                                </div>
                            </div>
                        )}

                        <h3 className="font-display text-2xl font-bold mb-2">{tier.name}</h3>
                        <p className={clsx("text-sm mb-6 min-h-[2.5rem]", tier.recommended ? "text-slate-300" : "text-slate-500")}>
                            {tier.description}
                        </p>

                        <div className="font-mono text-3xl font-bold mb-6 leading-none">
                            {tier.price.split("/")[0]}
                            {tier.price.includes("/") && (
                                <span className={clsx("text-sm font-medium ml-1", tier.recommended ? "text-slate-400" : "text-slate-500")}>
                                    /{tier.price.split("/")[1]}
                                </span>
                            )}
                        </div>

                        <ul className="space-y-3 mb-8 flex-1">
                            {tier.features.map((feature, j) => (
                                <li key={j} className="flex items-start gap-3 text-sm">
                                    <CheckCircle2
                                        className={clsx(
                                            "size-5 shrink-0 mt-0.5",
                                            tier.recommended ? "text-accent-400" : "text-success-500"
                                        )}
                                    />
                                    <span className={tier.recommended ? "text-slate-200" : "text-slate-700"}>
                                        {feature}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <div className="space-y-2.5">
                            {tier.pkgKey && (
                                <Link
                                    href={`/checkout?pkg=${tier.pkgKey}`}
                                    className={clsx(
                                        "flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold transition-all",
                                        tier.recommended
                                            ? "bg-success-500 text-white hover:bg-success-600 shadow-lg shadow-success-500/30"
                                            : "bg-success-500 text-white hover:bg-success-600 shadow-lg shadow-success-500/20"
                                    )}
                                >
                                    Pay with M-Pesa <ArrowRight className="size-4" />
                                </Link>
                            )}
                            <Link
                                href={`/hire?service=${serviceName}&tier=${tier.name}`}
                                className={clsx(
                                    "flex items-center justify-center w-full py-3 rounded-xl font-semibold text-sm transition-all",
                                    tier.recommended
                                        ? "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                                        : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                                )}
                            >
                                Talk to sales first
                            </Link>
                        </div>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}
