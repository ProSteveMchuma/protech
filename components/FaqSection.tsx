"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "./ui/Badge";

interface FaqItem {
    question: string;
    answer: string;
}

interface FaqSectionProps {
    items: FaqItem[];
    title?: string;
    eyebrow?: string;
}

export function FaqSection({
    items,
    title = "Frequently asked questions",
    eyebrow = "FAQ",
}: FaqSectionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="text-center mb-12">
                    <Badge tone="neutral" className="mb-3">{eyebrow}</Badge>
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 text-balance">
                        {title}
                    </h2>
                </div>
                <div className="space-y-3">
                    {items.map((item, i) => {
                        const open = openIndex === i;
                        return (
                            <div
                                key={i}
                                className={`rounded-2xl border transition-colors ${open
                                    ? "border-brand-300 bg-brand-50/40"
                                    : "border-slate-200 bg-white hover:border-slate-300"
                                    }`}
                            >
                                <button
                                    onClick={() => setOpenIndex(open ? null : i)}
                                    className="w-full flex justify-between items-center text-left p-5 md:p-6 group"
                                >
                                    <span className="font-bold text-slate-900 pr-6">
                                        {item.question}
                                    </span>
                                    <span
                                        className={`size-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${open
                                            ? "bg-brand-600 text-white"
                                            : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                                            }`}
                                    >
                                        {open ? (
                                            <Minus className="size-4" />
                                        ) : (
                                            <Plus className="size-4" />
                                        )}
                                    </span>
                                </button>
                                <AnimatePresence initial={false}>
                                    {open && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-5 md:px-6 pb-6 text-slate-600 leading-relaxed">
                                                {item.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
