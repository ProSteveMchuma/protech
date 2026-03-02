"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FaqItem {
    question: string;
    answer: string;
}

interface FaqSectionProps {
    items: FaqItem[];
    title?: string;
}

export function FaqSection({ items, title = "Frequently Asked Questions" }: FaqSectionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 max-w-3xl">
                <h2 className="font-serif text-3xl font-bold text-slate-900 mb-12 text-center">{title}</h2>
                <div className="space-y-4">
                    {items.map((item, i) => (
                        <div key={i} className="border border-slate-200 rounded-2xl overflow-hidden transition-all hover:border-blue-200">
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="w-full flex justify-between items-center p-6 text-left bg-slate-50/50 hover:bg-slate-50 transition-colors"
                            >
                                <span className="font-bold text-slate-900">{item.question}</span>
                                {openIndex === i ? (
                                    <ChevronUp className="size-5 text-blue-600" />
                                ) : (
                                    <ChevronDown className="size-5 text-slate-400" />
                                )}
                            </button>
                            <AnimatePresence>
                                {openIndex === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="p-6 pt-0 text-slate-600 leading-relaxed border-t border-slate-100 bg-white">
                                            {item.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
