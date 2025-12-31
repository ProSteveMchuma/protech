"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight, TrendingUp, Users, Award } from "lucide-react";

const caseStudies = [
    {
        id: 1,
        title: "EcoBuilding Kenya",
        category: "Tender Support",
        result: "Secured KES 45M Contract",
        metric: "100% Compliance Score",
        image: "/tender-writing.png", // Reusing existing asset for now
        icon: <Award className="size-5 text-amber-400" />,
        description: "Full technical proposal writing and compliance handling for a major government infrastructure bid.",
    },
    {
        id: 2,
        title: "FreshGrocers App",
        category: "Web & Automation",
        result: "300% Sales Increase",
        metric: "15k+ Monthly Users",
        image: "/ai-automation.png",
        icon: <TrendingUp className="size-5 text-green-400" />,
        description: "E-commerce platform with automated WhatsApp ordering bot, reducing manual entry by 90%.",
    },
    {
        id: 3,
        title: "Summit Law Firm",
        category: "Branding & Print",
        result: "Market Re-positioning",
        metric: "Premium Identity",
        image: "/branding-printing.png",
        icon: <Users className="size-5 text-blue-400" />,
        description: "Complete corporate rebranding, including office signage, business cards, and document templates.",
    },
];

export const CaseStudies = () => {
    return (
        <section className="py-24 bg-background relative overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="max-w-2xl">
                        <span className="text-primary font-bold tracking-wider uppercase text-sm">Proven Results</span>
                        <h2 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl mt-2">
                            We Don't Just Build.<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">We Deliver ROI.</span>
                        </h2>
                    </div>
                    {/* Link to all cases/services */}
                    <a href="/services" className="hidden md:flex items-center gap-2 text-foreground font-semibold hover:text-primary transition-colors border-b border-white/20 pb-1">
                        View Full Portfolio <ArrowUpRight className="size-4" />
                    </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {caseStudies.map((study, i) => (
                        <motion.div
                            key={study.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative bg-card border border-white/5 rounded-2xl overflow-hidden hover:border-primary/50 transition-colors cursor-pointer"
                        >
                            <a href={`/contact?subject=I want results like ${study.title}`} className="block h-full">
                                {/* Image Area */}
                                <div className="relative h-64 overflow-hidden">
                                    <Image
                                        src={study.image}
                                        alt={study.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors" />
                                    <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-white/10">
                                        {study.category}
                                    </div>
                                </div>

                                {/* Content Area */}
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                                            {study.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{study.title}</h3>
                                            <p className="text-green-400 font-bold text-sm">{study.result}</p>
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                                        {study.description}
                                    </p>
                                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                        <span className="text-xs text-muted-foreground font-mono">Metric: {study.metric}</span>
                                        <span className="text-primary text-sm font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                            Get Similar Results <ArrowUpRight className="size-3" />
                                        </span>
                                    </div>
                                </div>
                            </a>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-12 text-center md:hidden">
                    <a href="/services" className="inline-flex items-center gap-2 text-foreground font-semibold hover:text-primary transition-colors border-b border-white/20 pb-1">
                        View Full Portfolio <ArrowUpRight className="size-4" />
                    </a>
                </div>
            </div>
        </section>
    );
};
