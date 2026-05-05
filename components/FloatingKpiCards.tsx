"use client";

import { motion } from "framer-motion";
import { CheckCircle2, TrendingUp, Clock, Sparkles } from "lucide-react";

const cards = [
    {
        icon: <CheckCircle2 className="size-5 text-success-500" />,
        label: "Onboarding",
        value: "24h",
        sub: "From sign-up to start",
        position: "top-2 left-0",
        delay: 0.1,
        offset: { y: 0, x: -8 },
    },
    {
        icon: <TrendingUp className="size-5 text-accent-500" />,
        label: "Avg. saved",
        value: "67%",
        sub: "vs hiring locally",
        position: "top-24 right-0",
        delay: 0.25,
        offset: { y: -10, x: 8 },
    },
    {
        icon: <Clock className="size-5 text-brand-500" />,
        label: "Hours back",
        value: "20+",
        sub: "Per week, per founder",
        position: "bottom-12 left-6",
        delay: 0.4,
        offset: { y: 8, x: 0 },
    },
    {
        icon: <Sparkles className="size-5 text-amber-500" />,
        label: "Talent pool",
        value: "150+",
        sub: "Vetted Kenyan pros",
        position: "bottom-0 right-2",
        delay: 0.55,
        offset: { y: 12, x: 6 },
    },
];

export function FloatingKpiCards() {
    return (
        <div className="relative mx-auto w-full max-w-md aspect-square hidden lg:block">
            {/* glow */}
            <div className="absolute inset-12 rounded-full bg-gradient-to-br from-brand-500/40 via-accent-500/40 to-success-500/30 blur-3xl" />
            {/* center plate with logo glyph */}
            <div className="absolute inset-16 rounded-3xl bg-white shadow-2xl border border-slate-100 flex items-center justify-center">
                <div className="text-center px-6">
                    <div className="font-display text-5xl font-bold text-brand-950">
                        PRT<span className="text-success-500">.</span>
                    </div>
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 mt-2">
                        Pro Remote Tasks
                    </div>
                </div>
            </div>

            {cards.map((c, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 24, scale: 0.92 }}
                    animate={{
                        opacity: 1,
                        y: c.offset.y,
                        x: c.offset.x,
                        scale: 1,
                    }}
                    transition={{
                        duration: 0.7,
                        delay: c.delay,
                        ease: [0.16, 1, 0.3, 1],
                    }}
                    className={`absolute ${c.position}`}
                >
                    <motion.div
                        animate={{ y: [0, -6, 0] }}
                        transition={{
                            duration: 5 + i * 0.4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.2,
                        }}
                        className="bg-white rounded-2xl shadow-xl border border-slate-100 px-4 py-3 min-w-[160px]"
                    >
                        <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-1">
                            {c.icon}
                            {c.label}
                        </div>
                        <div className="font-display text-2xl font-bold text-slate-900 leading-none">
                            {c.value}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">{c.sub}</div>
                    </motion.div>
                </motion.div>
            ))}
        </div>
    );
}
