"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Clock, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { TiltCard } from "./ui/TiltCard";
import { fadeUp, stagger, viewportOnce, imageReveal } from "@/lib/motion";
import { ButtonLink } from "./ui/Button";

export function BentoGrid() {
    return (
        <section className="py-24 md:py-32 bg-slate-50 relative overflow-hidden">
            <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                    variants={stagger(0, 0.1)}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]"
                >
                    {/* Large VA Card (spans 2 columns on desktop) */}
                    <motion.div variants={fadeUp} className="md:col-span-2 md:row-span-2 h-full">
                        <TiltCard>
                            <div className="relative h-full w-full rounded-3xl overflow-hidden bg-brand-950 text-white premium-shadow border border-brand-900 group">
                                <motion.div 
                                    variants={imageReveal}
                                    className="absolute inset-0 opacity-40 mix-blend-overlay transition-transform duration-700 group-hover:scale-105"
                                >
                                    <Image 
                                        src="/images/va_service.png" 
                                        alt="Virtual Assistant Services" 
                                        fill 
                                        className="object-cover" 
                                    />
                                </motion.div>
                                <div className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-950/40 to-transparent" />
                                
                                <div className="relative h-full p-8 md:p-12 flex flex-col justify-end">
                                    <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium">
                                        <span className="relative flex size-2">
                                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
                                          <span className="relative inline-flex rounded-full size-2 bg-accent-500"></span>
                                        </span>
                                        Also Available
                                    </div>
                                    <h3 className="font-display text-3xl md:text-5xl font-bold mb-4 text-balance">
                                        Need admin help instead?
                                    </h3>
                                    <p className="text-brand-100/80 max-w-md text-lg mb-8 text-pretty">
                                        We run vetted virtual assistants to handle your back-office, starting from KES 25,000/mo.
                                    </p>
                                    <div>
                                        <ButtonLink href="/services/va" variant="outline" size="lg" className="border-white/30 hover:bg-white/10 backdrop-blur-sm">
                                            Explore VA Services <ArrowRight className="size-4 ml-2" />
                                        </ButtonLink>
                                    </div>
                                </div>
                            </div>
                        </TiltCard>
                    </motion.div>

                    {/* Small Card 1: Security */}
                    <motion.div variants={fadeUp} className="h-full">
                        <TiltCard>
                            <div className="h-full w-full bg-white rounded-3xl p-8 premium-shadow border border-slate-200 flex flex-col justify-between">
                                <div className="size-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 mb-6">
                                    <ShieldCheck className="size-6" />
                                </div>
                                <div>
                                    <h4 className="font-display text-xl font-bold text-slate-900 mb-2">Bank-Grade NDA</h4>
                                    <p className="text-slate-500 text-sm leading-relaxed text-balance">
                                        Your financials and proprietary pricing are encrypted and isolated per client. We never bid against you.
                                    </p>
                                </div>
                            </div>
                        </TiltCard>
                    </motion.div>

                    {/* Small Card 2: Tracking */}
                    <motion.div variants={fadeUp} className="h-full">
                        <TiltCard>
                            <div className="h-full w-full bg-white rounded-3xl p-8 premium-shadow border border-slate-200 flex flex-col justify-between">
                                <div className="size-12 rounded-2xl bg-accent-50 flex items-center justify-center text-accent-600 mb-6">
                                    <Clock className="size-6" />
                                </div>
                                <div>
                                    <h4 className="font-display text-xl font-bold text-slate-900 mb-2">24/7 Tracking</h4>
                                    <p className="text-slate-500 text-sm leading-relaxed text-balance">
                                        We monitor eGP, PPIP, and county portals constantly. If a deadline shifts or an addendum drops, we catch it.
                                    </p>
                                </div>
                            </div>
                        </TiltCard>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
