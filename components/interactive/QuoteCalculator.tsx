"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, Calculator, DollarSign, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

const services = [
    {
        id: "web",
        title: "Web Design",
        basePrice: 25000,
        features: [
            { id: "seo", label: "SEO Optimization", price: 5000 },
            { id: "cms", label: "Content Mgmt System", price: 8000 },
            { id: "ecom", label: "E-commerce (Shop)", price: 15000 },
        ],
    },
    {
        id: "tender",
        title: "Tender Writing",
        basePrice: 5000,
        features: [
            { id: "compliance", label: "Compliance Check", price: 2000 },
            { id: "graphic", label: "Graphic Design Layout", price: 3000 },
            { id: "express", label: "Express Delivery (24h)", price: 5000 },
        ],
    },
    {
        id: "branding",
        title: "Branding",
        basePrice: 10000,
        features: [
            { id: "logo", label: "Logo Design", price: 3000 },
            { id: "cards", label: "Business Cards (100pcs)", price: 2500 },
            { id: "social", label: "Social Media Kit", price: 5000 },
        ],
    },
];

export const QuoteCalculator = () => {
    const [selectedService, setSelectedService] = useState<string | null>(null);
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
    const [showResult, setShowResult] = useState<boolean | 'final'>(false);

    // Calculate Total
    const currentService = services.find((s) => s.id === selectedService);
    const total =
        (currentService?.basePrice || 0) +
        (currentService?.features
            .filter((f) => selectedFeatures.includes(f.id))
            .reduce((sum, f) => sum + f.price, 0) || 0);

    const toggleFeature = (id: string) => {
        setSelectedFeatures((prev) =>
            prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
        );
    };

    const reset = () => {
        setSelectedService(null);
        setSelectedFeatures([]);
        setShowResult(false);
    };

    return (
        <div className="w-full max-w-lg mx-auto bg-card/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-primary/10 rounded-xl text-primary">
                        <Calculator className="size-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">Smart Quote</h3>
                        <p className="text-sm text-muted-foreground">Estimate your project cost instantly.</p>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {!selectedService ? (
                        <motion.div
                            key="step-1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-3"
                        >
                            <p className="font-medium mb-2">Select a Service:</p>
                            {services.map((service) => (
                                <button
                                    key={service.id}
                                    onClick={() => setSelectedService(service.id)}
                                    className="w-full flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-primary/10 hover:border-primary/30 transition-all group"
                                >
                                    <span className="font-semibold">{service.title}</span>
                                    <ChevronRight className="size-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                </button>
                            ))}
                        </motion.div>
                    ) : !showResult ? (
                        <motion.div
                            key="step-2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-bold text-lg text-primary">{currentService?.title}</h4>
                                <button onClick={reset} className="text-xs text-muted-foreground hover:text-foreground">Change</button>
                            </div>

                            <div className="space-y-3 mb-6">
                                {currentService?.features.map((feature) => (
                                    <button
                                        key={feature.id}
                                        onClick={() => toggleFeature(feature.id)}
                                        className={cn(
                                            "w-full flex items-center justify-between p-3 rounded-lg border transition-all",
                                            selectedFeatures.includes(feature.id)
                                                ? "bg-primary/20 border-primary text-primary"
                                                : "bg-white/5 border-transparent hover:bg-white/10"
                                        )}
                                    >
                                        <span className="text-sm">{feature.label}</span>
                                        <span className="text-xs font-mono opacity-70">+KES {feature.price.toLocaleString()}</span>
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setShowResult(true)}
                                className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg hover:brightness-110 transition-all"
                            >
                                Continue
                            </button>
                        </motion.div>
                    ) : showResult === true && typeof showResult === 'boolean' ? ( /* Intermediate Email Step Hack - Reusing boolean for now but ideally a step enum */
                        <motion.div
                            key="step-email"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-4"
                        >
                            <div className="text-center mb-6">
                                <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary mb-3">
                                    <Check className="size-6" />
                                </div>
                                <h3 className="text-xl font-bold">Your Quote is Ready!</h3>
                                <p className="text-sm text-muted-foreground">Where should we send the detailed breakdown?</p>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs font-semibold uppercase text-muted-foreground mb-1 block">Full Name</label>
                                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-primary focus:outline-none" placeholder="John Doe" />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold uppercase text-muted-foreground mb-1 block">Email Address</label>
                                    <input type="email" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-primary focus:outline-none" placeholder="john@example.com" />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold uppercase text-muted-foreground mb-1 block">Phone (Optional)</label>
                                    <input type="tel" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-primary focus:outline-none" placeholder="+254..." />
                                </div>
                            </div>

                            <button
                                onClick={() => setShowResult("final" as any)} // Quick hack to switch views
                                className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg hover:brightness-110 transition-all mt-4"
                            >
                                Reveal My Price
                            </button>
                            <p className="text-[10px] text-center text-muted-foreground">We value your privacy. No spam.</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-6"
                        >
                            <div className="inline-flex p-4 rounded-full bg-green-500/10 text-green-500 mb-4">
                                <DollarSign className="size-8" />
                            </div>
                            <p className="text-muted-foreground mb-1">Estimated Cost</p>
                            <h3 className="text-4xl font-black text-foreground mb-6">
                                KES {total.toLocaleString()}
                            </h3>

                            <div className="flex gap-3">
                                <button onClick={reset} className="flex-1 py-3 px-4 rounded-xl border border-white/10 hover:bg-white/5 flex items-center justify-center gap-2 text-sm font-medium">
                                    <RefreshCw className="size-4" /> Reset
                                </button>
                                <button className="flex-[2] py-3 px-4 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg hover:brightness-110">
                                    Book This Package
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
