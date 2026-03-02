"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, FileCheck, ShieldCheck, Trophy, AlertCircle } from "lucide-react";
import { BookingModal } from "@/components/interactive/BookingModal";
import Link from "next/link";

const features = [
    {
        icon: <ShieldCheck className="size-6 text-green-400" />,
        title: "100% Compliance Audit",
        description: "We never submit blind. We check every tax compliance, CR12, and NCA certificate to ensure you are not disqualified on technicalities.",
    },
    {
        icon: <FileCheck className="size-6 text-blue-400" />,
        title: "Professional Writing",
        description: "Our technical writers craft methodology statements that score high marks. We speak the language of evaluators.",
    },
    {
        icon: <Trophy className="size-6 text-amber-400" />,
        title: "High Win Rate",
        description: "Our clients have secured over KES 500M+ in government and private sector contracts. We play to win.",
    },
    {
        icon: <AlertCircle className="size-6 text-red-400" />,
        title: "Deadline Guarantee",
        description: "Time is money. We guarantee submission readiness 24 hours before the deadline or your money back.",
    },
];

export default function TenderPage() {
    const [isBookingOpen, setIsBookingOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[bottom_1px_center]" />

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="text-left">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-1.5 text-sm font-medium text-green-500 mb-8"
                            >
                                <ShieldCheck className="size-4" />
                                Government & Private Tenders
                            </motion.div>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-5xl lg:text-7xl font-black tracking-tighter mb-6"
                            >
                                Win More. <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
                                    Stress Less.
                                </span>
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-xl text-muted-foreground mb-10 leading-relaxed"
                            >
                                Stop getting disqualified for missing documents. We handle the paperwork, the technical writing, and the compliance checks so you can focus on the job.
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="flex flex-col sm:flex-row gap-4"
                            >
                                <button
                                    onClick={() => setIsBookingOpen(true)}
                                    className="inline-flex h-14 items-center justify-center rounded-full bg-primary px-8 text-lg font-bold text-primary-foreground shadow-lg hover:bg-primary/90 hover:scale-105 transition-all"
                                >
                                    Get a Quote for My Bid
                                    <ArrowRight className="ml-2 size-5" />
                                </button>
                                <Link
                                    href="/contact"
                                    className="inline-flex h-14 items-center justify-center rounded-full border border-input bg-background px-8 text-lg font-medium shadow-sm hover:bg-accent hover:text-accent-foreground transition-all"
                                >
                                    Free Compliance Check
                                </Link>
                            </motion.div>
                        </div>

                        {/* Hero Visual */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-green-500/20 blur-[100px] rounded-full" />
                            <div className="relative rounded-2xl border border-white/10 shadow-2xl overflow-hidden bg-black/50 backdrop-blur-xl">
                                <Image
                                    src="/templates/tender_dashboard.png"
                                    width={800}
                                    height={600}
                                    alt="Tender Success Dashboard"
                                    className="w-full h-auto object-cover opacity-90"
                                />
                                {/* Floating Badge */}
                                <div className="absolute bottom-6 left-6 bg-card/90 backdrop-blur border border-white/10 p-4 rounded-xl shadow-lg flex items-center gap-4 animate-bounce-slow">
                                    <div className="size-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                                        <Trophy className="size-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase font-semibold">Total Won Value</p>
                                        <p className="text-xl font-bold text-foreground">KES 500M+</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* The Problem Section */}
            <section className="py-24 bg-muted/10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Why Do Most Bids Fail?</h2>
                        <p className="text-muted-foreground text-lg">It's not your price. It's usually a small technicality.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center bg-card border border-border/50 rounded-3xl p-12">
                        <div className="space-y-4">
                            <div className="text-4xl font-black text-red-500">80%</div>
                            <p className="text-foreground font-semibold">Disqualified on Preliminaries</p>
                            <p className="text-sm text-muted-foreground">Missing tax compliance or wrong formatting.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="text-4xl font-black text-red-500">15%</div>
                            <p className="text-foreground font-semibold">Lose on Technicals</p>
                            <p className="text-sm text-muted-foreground">Generic methodology copy-pasted from the internet.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="text-4xl font-black text-green-500">Only 5%</div>
                            <p className="text-foreground font-semibold">Win the Contract</p>
                            <p className="text-sm text-muted-foreground">Those who use professional bid management.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">The ProTech Advantage</h2>
                        <p className="text-muted-foreground">We turn the odds in your favor.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-card border border-border/50 p-8 rounded-2xl flex items-start gap-6 hover:border-green-500/50 transition-colors"
                            >
                                <div className="shrink-0 bg-background/50 w-14 h-14 rounded-xl flex items-center justify-center ring-1 ring-white/10">
                                    {feature.icon}
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl mb-3">{feature.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 bg-green-600/10 border-y border-green-500/20 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-green-500/5 blur-3xl pointer-events-none" />
                <div className="container mx-auto px-4 relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">Don't risk your next big contract.</h2>
                    <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                        Professionals use experts. Let us handle the paperwork while you prepare to do the job.
                    </p>
                    <button
                        onClick={() => setIsBookingOpen(true)}
                        className="bg-green-600 text-white px-10 py-4 rounded-full font-bold text-lg shadow-2xl hover:bg-green-500 hover:scale-105 transition-all"
                    >
                        Start Your Bid Now
                    </button>
                </div>
            </section>
        </div>
    );
}
