"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Smartphone, Zap, Search, Layout } from "lucide-react";
import { BookingModal } from "@/components/interactive/BookingModal";
import Link from "next/link";

const features = [
    {
        icon: <Smartphone className="size-6 text-primary" />,
        title: "Mobile-First Design",
        description: "60% of traffic is mobile. We build for the phone first, ensuring perfect experiences on any device.",
    },
    {
        icon: <Zap className="size-6 text-amber-400" />,
        title: "Blazing Fast Speeds",
        description: "Speed sells. Our sites load in under 2 seconds, keeping users engaged and Google happy.",
    },
    {
        icon: <Search className="size-6 text-cyan-400" />,
        title: "SEO Baked In",
        description: "We don't just add keywords later. We structure the code so you rank higher from Day 1.",
    },
    {
        icon: <Layout className="size-6 text-purple-400" />,
        title: "Conversion Focused",
        description: "Pretty isn't enough. We place CTAs and buttons psychologically to get you more sales.",
    },
];

const templates = [
    {
        id: "ecommerce",
        title: "The Modern Retailer",
        category: "E-Commerce",
        image: "/templates/ecommerce.png",
        description: "Perfect for fashion, electronics, and retail brands looking to sell volumes online.",
    },
    {
        id: "corporate",
        title: "The Trust Authority",
        category: "Corporate & Finance",
        image: "/templates/corporate.png",
        description: "Build immense trust with a clean, professional look. Ideal for Law, Finance, and B2B.",
    },
    {
        id: "saas",
        title: "The Tech Unicorn",
        category: "SaaS & App Landing",
        image: "/templates/saas.png",
        description: "Futuristic, dark-mode capability, and high-tech vibes for software and startup companies.",
    },
];

export default function WebDesignPage() {
    const [isBookingOpen, setIsBookingOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[bottom_1px_center]" />
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-8"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        ProTech Web Services
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-black tracking-tighter mb-6"
                    >
                        We Don't Just Build Websites. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                            We Build Digital Empires.
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10"
                    >
                        Stop losing customers to outdated designs. Get a high-performance website that captures leads, ranks on Google, and prints money for your business.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <button
                            onClick={() => setIsBookingOpen(true)}
                            className="inline-flex h-14 items-center justify-center rounded-full bg-primary px-8 text-lg font-bold text-primary-foreground shadow-lg hover:bg-primary/90 hover:scale-105 transition-all"
                        >
                            Get My Proposal
                            <ArrowRight className="ml-2 size-5" />
                        </button>
                        <Link
                            href="#portfolio"
                            className="inline-flex h-14 items-center justify-center rounded-full border border-input bg-background px-8 text-lg font-medium shadow-sm hover:bg-accent hover:text-accent-foreground transition-all"
                        >
                            View Examples
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-muted/20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-card border border-border/50 p-6 rounded-2xl hover:border-primary/50 transition-colors"
                            >
                                <div className="mb-4 bg-background/50 w-12 h-12 rounded-lg flex items-center justify-center ring-1 ring-white/10">
                                    {feature.icon}
                                </div>
                                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground text-sm">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Template Showcase */}
            <section id="portfolio" className="py-32">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">World-Class Designs</h2>
                        <p className="text-muted-foreground text-lg">Pick a style that dominates your industry.</p>
                    </div>

                    <div className="space-y-24">
                        {templates.map((template, i) => (
                            <motion.div
                                key={template.id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className={`flex flex-col lg:flex-row items-center gap-12 ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
                            >
                                <div className="flex-1 w-full">
                                    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                                        <Image
                                            src={template.image}
                                            alt={template.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                                    </div>
                                </div>
                                <div className="flex-1 space-y-6">
                                    <div className="text-sm font-semibold text-primary tracking-wider uppercase">{template.category}</div>
                                    <h3 className="text-3xl md:text-4xl font-bold">{template.title}</h3>
                                    <p className="text-lg text-muted-foreground leading-relaxed">
                                        {template.description}
                                        <br /><br />
                                        This template is designed to maximize engagement, featuring clear navigation, fast load times, and a structure that Google loves.
                                    </p>
                                    <ul className="space-y-3">
                                        {["Fully Responsive", "SEO Optimized", "Admin Dashboard"].map((item, idx) => (
                                            <li key={idx} className="flex items-center gap-2">
                                                <CheckCircle2 className="size-5 text-green-500" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="pt-4">
                                        <button
                                            onClick={() => setIsBookingOpen(true)}
                                            className="px-8 py-3 rounded-full bg-white text-black font-bold hover:bg-gray-200 transition-colors"
                                        >
                                            I Want This Style
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 bg-primary text-primary-foreground text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to dominate your market?</h2>
                    <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
                        Your competitors are already online. Don't get left behind.
                        Let's build you a website that pays for itself.
                    </p>
                    <button
                        onClick={() => setIsBookingOpen(true)}
                        className="bg-background text-foreground px-10 py-4 rounded-full font-bold text-lg shadow-2xl hover:scale-105 transition-transform"
                    >
                        Start My Project Now
                    </button>
                </div>
            </section>
        </div>
    );
}
