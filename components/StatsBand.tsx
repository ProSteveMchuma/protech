"use client";

import { AnimatedCounter } from "./AnimatedCounter";
import { motion } from "framer-motion";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

const stats = [
    { value: 150, suffix: "+", label: "Vetted Kenyan pros", color: "text-accent-400" },
    { value: 60, suffix: "+", label: "Active client businesses", color: "text-brand-300" },
    { value: 4_200_000, prefix: "KES ", label: "Saved by clients in 2025", color: "text-success-500" },
    { value: 24, suffix: "h", label: "Avg. onboarding time", color: "text-amber-400" },
];

export function StatsBand() {
    return (
        <section className="bg-brand-950 text-white py-20 bg-grid relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none opacity-40 bg-aurora-dark" />
            <div className="container mx-auto px-4 relative">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                    variants={stagger(0, 0.12)}
                    className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto"
                >
                    {stats.map((s, i) => (
                        <motion.div
                            key={i}
                            variants={fadeUp}
                            className="text-center md:text-left"
                        >
                            <div className={`font-display text-4xl md:text-5xl font-bold ${s.color} mb-2 leading-none tabular-nums`}>
                                <AnimatedCounter
                                    value={s.value}
                                    prefix={s.prefix}
                                    suffix={s.suffix}
                                />
                            </div>
                            <div className="text-xs md:text-sm text-slate-400 font-medium">
                                {s.label}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
