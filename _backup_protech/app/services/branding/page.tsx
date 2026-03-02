"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Printer, Palette, Truck, Layers, CheckCircle2 } from "lucide-react";
import { BookingModal } from "@/components/interactive/BookingModal";
import Link from "next/link";

const features = [
    {
        icon: <Palette className="size-6 text-pink-400" />,
        title: "Corporate Identity",
        description: "Consistent logos, business cards, and letterheads that make your brand look like a Fortune 500 company.",
    },
    {
        icon: <Truck className="size-6 text-blue-400" />,
        title: "Vehicle Branding",
        description: "Turn your fleet into moving billboards. High-quality vinyl wraps that last for years.",
    },
    {
        icon: <Printer className="size-6 text-cyan-400" />,
        title: "Large Format Print",
        description: "Banners, signage, and exhibition stands. If you can imagine it, we can print it huge.",
    },
    {
        icon: <Layers className="size-6 text-amber-400" />,
        title: "Premium Materials",
        description: "We don't do cheap paper. We use premium GSM stocks, gold foiling, and spot UV for that 'wow' factor.",
    },
];

const portfolio = [
    {
        title: "Luxury Stationery",
        image: "/templates/branding_stationery.png",
        tag: "Business Cards & Letterheads"
    },
    {
        title: "Fleet Branding",
        image: "/templates/branding_fleet.png",
        tag: "Vehicle Wraps"
    },
    {
        title: "Event Displays",
        image: "/templates/branding_banner.png",
        tag: "Roll-up Banners"
    }
];

export default function BrandingPage() {
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
                        className="inline-flex items-center gap-2 rounded-full border border-pink-500/20 bg-pink-500/10 px-4 py-1.5 text-sm font-medium text-pink-400 mb-8"
                    >
                        <Printer className="size-4" />
                        Premium Branding & Print
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl lg:text-7xl font-black tracking-tighter mb-6"
                    >
                        Be Seen. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-600">
                            Be Remembered.
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-3xl mx-auto"
                    >
                        In a crowded market, the visible brand wins. From gold-foil business cards to full vehicle wraps, we make sure you look expensive.
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
                            Get a Quote
                            <ArrowRight className="ml-2 size-5" />
                        </button>
                        <Link
                            href="#gallery"
                            className="inline-flex h-14 items-center justify-center rounded-full border border-input bg-background px-8 text-lg font-medium shadow-sm hover:bg-accent hover:text-accent-foreground transition-all"
                        >
                            View Portfolio
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Gallery Grid */}
            <section id="gallery" className="py-24 bg-muted/10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Craftsmanship in Every Detail</h2>
                        <p className="text-muted-foreground">See the difference quality printing makes.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {portfolio.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer"
                            >
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                                <div className="absolute bottom-6 left-6 text-white">
                                    <p className="text-xs font-bold uppercase tracking-wider text-pink-400 mb-1">{item.tag}</p>
                                    <h3 className="text-2xl font-bold">{item.title}</h3>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-card border border-border/50 p-6 rounded-2xl hover:border-pink-500/50 transition-colors text-center"
                            >
                                <div className="mb-4 bg-background/50 w-16 h-16 rounded-full flex items-center justify-center ring-1 ring-white/10 mx-auto">
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
            <section className="py-24 bg-pink-600/10 border-y border-pink-500/20 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-pink-500/5 blur-3xl pointer-events-none" />
                <div className="container mx-auto px-4 relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">Make a Statement.</h2>
                    <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                        Your brand deserves to look as good as your business performs. Let's print something amazing.
                    </p>
                    <button
                        onClick={() => setIsBookingOpen(true)}
                        className="bg-pink-600 text-white px-10 py-4 rounded-full font-bold text-lg shadow-2xl hover:bg-pink-500 hover:scale-105 transition-all"
                    >
                        Start Branding Project
                    </button>
                </div>
            </section>
        </div>
    );
}
