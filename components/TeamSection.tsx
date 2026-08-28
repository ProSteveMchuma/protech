"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fadeUp, stagger, viewportOnce, imageReveal } from "@/lib/motion";
import { TiltCard } from "./ui/TiltCard";

const TEAM = [
    {
        name: "Steve Mchuma",
        role: "Founder & Lead Strategist",
        image: "/images/team_steve.png",
        superpower: "Specialist in PPRA compliance and government bid strategy."
    },
    {
        name: "Aisha Onyango",
        role: "Head of Compliance",
        image: "/images/team_aisha.png",
        superpower: "Ensures zero disqualifications due to documentation errors."
    },
    {
        name: "David Kipkorir",
        role: "Operations Lead",
        image: "/images/team_david.png",
        superpower: "Orchestrates seamless tender submissions before the deadline."
    }
];

export function TeamSection() {
    return (
        <section className="py-24 md:py-32 bg-slate-50 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
            <div className="absolute -left-[20%] -top-[20%] w-[60%] h-[60%] rounded-full bg-brand-50/50 blur-3xl pointer-events-none" />
            
            <div className="container mx-auto px-6 lg:px-8 max-w-6xl relative z-10">
                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                    variants={fadeUp}
                    className="text-center max-w-3xl mx-auto mb-16 md:mb-24"
                >
                    <h2 className="font-display text-4xl md:text-5xl font-bold text-brand-950 mb-6">
                        The team behind the wins.
                    </h2>
                    <p className="text-lg text-slate-600">
                        We are ex-procurement officers, legal experts, and bid strategists who know exactly what it takes to win a tender in Kenya.
                    </p>
                </motion.div>

                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                    variants={stagger(0, 0.15)}
                    className="grid md:grid-cols-3 gap-8 md:gap-12"
                >
                    {TEAM.map((member) => (
                        <motion.div key={member.name} variants={fadeUp} className="h-full">
                            <TiltCard>
                                <div className="group h-full bg-white rounded-3xl p-6 border border-slate-200 premium-shadow">
                                    <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden mb-6 bg-slate-100">
                                        <motion.div variants={imageReveal} className="w-full h-full origin-bottom">
                                            <Image
                                                src={member.image}
                                                alt={`Portrait of ${member.name}`}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                sizes="(max-width: 768px) 100vw, 33vw"
                                            />
                                        </motion.div>
                                    </div>
                                    <div className="text-center px-2">
                                        <h3 className="font-display text-xl font-bold text-slate-900 mb-1">{member.name}</h3>
                                        <p className="text-brand-600 font-medium text-sm mb-4">{member.role}</p>
                                        <p className="text-slate-500 text-sm leading-relaxed">{member.superpower}</p>
                                    </div>
                                </div>
                            </TiltCard>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
