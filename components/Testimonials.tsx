"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "./ui/Badge";

const items = [
    {
        name: "Wanjiku M.",
        role: "Founder, Nairobi Properties Ltd",
        body:
            "We replaced two part-time admins with one Pro Remote Tasks VA and cut our admin spend by KES 80,000/month. Inbox is finally under control.",
        outcome: "Saved KES 80k/mo",
    },
    {
        name: "David O.",
        role: "Managing Director, Mombasa Logistics",
        body:
            "Their content team got us ranking #2 on Google for 'cargo clearing Mombasa' in 4 months. Inquiries are up 3x. Worth every shilling.",
        outcome: "3x inbound leads",
    },
    {
        name: "Aisha K.",
        role: "Marketing Lead, Westlands Health",
        body:
            "Our Instagram grew from 800 to 12,000 followers in 6 months. The team understands our local market in a way agencies abroad never did.",
        outcome: "+11.2k followers",
    },
    {
        name: "Kipchoge W.",
        role: "Founder, Rift Valley Supplies & General Contractors",
        body:
            "We had not won a county tender in three years. Pro Remote Tasks caught two expired compliance docs in week one, then packaged a Nakuru County supply bid the way the procuring entity actually wanted it. We won.",
        outcome: "Won KES 4.2M county supply",
    },
];

export function Testimonials() {
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        if (paused) return;
        const t = setTimeout(() => setIndex((i) => (i + 1) % items.length), 6000);
        return () => clearTimeout(t);
    }, [index, paused]);

    const t = items[index];
    return (
        <section
            className="py-24 bg-white relative overflow-hidden"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            <div className="container mx-auto px-4">
                <div className="text-center mb-14">
                    <Badge tone="sun" icon={<Star className="size-3 fill-amber-500 text-amber-500" />} className="mb-4">
                        Real Kenyan Businesses
                    </Badge>
                    <h2 className="font-display text-3xl md:text-5xl font-bold text-slate-900 mb-3">
                        Why founders trust us
                    </h2>
                    <p className="text-slate-600 max-w-xl mx-auto">
                        We don't sell hours — we sell outcomes.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="relative bg-gradient-to-br from-slate-50 to-white rounded-3xl border border-slate-200 p-8 md:p-14 premium-shadow">
                        <Quote className="size-12 text-brand-200 mb-6" />
                        <div className="min-h-[180px]">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -12 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <p className="font-display text-xl md:text-2xl leading-relaxed text-slate-800 mb-8">
                                        "{t.body}"
                                    </p>
                                    <div className="flex items-center justify-between flex-wrap gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="size-12 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-white font-bold flex items-center justify-center text-lg">
                                                {t.name[0]}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900">{t.name}</div>
                                                <div className="text-sm text-slate-500">{t.role}</div>
                                            </div>
                                        </div>
                                        <div className="px-4 py-2 rounded-full bg-success-500/10 text-success-600 text-sm font-bold">
                                            {t.outcome}
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
                            <div className="flex gap-2">
                                {items.map((_, i) => (
                                    <button
                                        key={i}
                                        aria-label={`Show testimonial ${i + 1}`}
                                        onClick={() => setIndex(i)}
                                        className={`h-1.5 rounded-full transition-all ${i === index ? "w-8 bg-brand-600" : "w-2 bg-slate-300"
                                            }`}
                                    />
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    aria-label="Previous"
                                    onClick={() => setIndex((i) => (i - 1 + items.length) % items.length)}
                                    className="size-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:border-brand-500 hover:text-brand-600 transition"
                                >
                                    <ChevronLeft className="size-4" />
                                </button>
                                <button
                                    aria-label="Next"
                                    onClick={() => setIndex((i) => (i + 1) % items.length)}
                                    className="size-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:border-brand-500 hover:text-brand-600 transition"
                                >
                                    <ChevronRight className="size-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
