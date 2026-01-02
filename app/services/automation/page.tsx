"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Bot, Cpu, MessageSquare, Zap, Clock, TrendingUp } from "lucide-react";
import { BookingModal } from "@/components/interactive/BookingModal";
import Link from "next/link";

const features = [
    {
        icon: <MessageSquare className="size-6 text-green-400" />,
        title: "WhatsApp Chatbots",
        description: "Never miss a customer. Our AI bots handle inquiries, qualify leads, and book appointments 24/7 on WhatsApp.",
    },
    {
        icon: <Cpu className="size-6 text-blue-400" />,
        title: "Workflow Automation",
        description: "Connect your apps (Gmail, Sheets, CRM). When a client sends an email, we automatically create a task and notify your team.",
    },
    {
        icon: <Zap className="size-6 text-amber-400" />,
        title: "CRM Integration",
        description: "Keep your customer data organized automatically. No more manual data entry or lost spreadsheets.",
    },
    {
        icon: <Clock className="size-6 text-purple-400" />,
        title: "Save 20+ Hours/Week",
        description: "Stop doing repetitive tasks. Let the robots handle the boring work so you can focus on growing your business.",
    },
];

export default function AutomationPage() {
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
                                className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-400 mb-8"
                            >
                                <Bot className="size-4" />
                                AI & Business Automation
                            </motion.div>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-5xl lg:text-7xl font-black tracking-tighter mb-6"
                            >
                                Work Smarter. <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">
                                    Not Harder.
                                </span>
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-xl text-muted-foreground mb-10 leading-relaxed"
                            >
                                Your competitors are sleeping. Your business shouldn't. We build AI systems that sell, support, and manage your operations 24/7.
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
                                    Automate My Business
                                    <ArrowRight className="ml-2 size-5" />
                                </button>
                                <Link
                                    href="/contact"
                                    className="inline-flex h-14 items-center justify-center rounded-full border border-input bg-background px-8 text-lg font-medium shadow-sm hover:bg-accent hover:text-accent-foreground transition-all"
                                >
                                    See a Demo
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
                            <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full" />
                            <div className="relative rounded-2xl border border-white/10 shadow-2xl overflow-hidden bg-black/50 backdrop-blur-xl">
                                <Image
                                    src="/templates/automation_dashboard.png"
                                    width={800}
                                    height={600}
                                    alt="AI Automation Workflow"
                                    className="w-full h-auto object-cover opacity-90"
                                />
                                {/* Floating Badge */}
                                <div className="absolute top-6 right-6 bg-card/90 backdrop-blur border border-white/10 p-4 rounded-xl shadow-lg flex items-center gap-4 animate-pulse">
                                    <div className="size-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                        <TrendingUp className="size-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase font-semibold">Efficiency Boost</p>
                                        <p className="text-xl font-bold text-foreground">+300% ROI</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ROI Calculator Section (Visual) */}
            <section className="py-24 bg-muted/10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">The Cost of "Doing it Manually"</h2>
                        <p className="text-muted-foreground text-lg">Every hour you spend on data entry is an hour you lose on sales.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-card border border-border/50 rounded-3xl p-12 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none" />

                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold">Without Automation</h3>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 text-red-400">
                                    <Clock className="size-5 shrink-0" />
                                    <span>Slow response times (Lose Leads)</span>
                                </li>
                                <li className="flex items-center gap-3 text-red-400">
                                    <Clock className="size-5 shrink-0" />
                                    <span>Manual data entry errors</span>
                                </li>
                                <li className="flex items-center gap-3 text-red-400">
                                    <Clock className="size-5 shrink-0" />
                                    <span>Hiring more staff for simple tasks</span>
                                </li>
                            </ul>
                        </div>

                        <div className="space-y-6 md:border-l border-white/10 md:pl-8">
                            <h3 className="text-2xl font-bold text-blue-400">With ProTech AI</h3>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 text-green-400">
                                    <Zap className="size-5 shrink-0" />
                                    <span>Instant &lt; 1s Response 24/7</span>
                                </li>
                                <li className="flex items-center gap-3 text-green-400">
                                    <Zap className="size-5 shrink-0" />
                                    <span>100% Accurate Data Sync</span>
                                </li>
                                <li className="flex items-center gap-3 text-green-400">
                                    <Zap className="size-5 shrink-0" />
                                    <span>Scale without hiring more people</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">What We Automate</h2>
                        <p className="text-muted-foreground">From customer service to back-office operations.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-card border border-border/50 p-6 rounded-2xl hover:border-blue-500/50 transition-colors"
                            >
                                <div className="mb-4 bg-background/50 w-12 h-12 rounded-lg flex items-center justify-center ring-1 ring-white/10">
                                    {feature.icon}
                                </div>
                                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 bg-blue-600/10 border-y border-blue-500/20 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-500/5 blur-3xl pointer-events-none" />
                <div className="container mx-auto px-4 relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">Future-Proof Your Business</h2>
                    <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                        Don't let manual work slow you down. Let's build your automated engine today.
                    </p>
                    <button
                        onClick={() => setIsBookingOpen(true)}
                        className="bg-blue-600 text-white px-10 py-4 rounded-full font-bold text-lg shadow-2xl hover:bg-blue-500 hover:scale-105 transition-all"
                    >
                        Book Automation Audit
                    </button>
                </div>
            </section>
        </div>
    );
}
