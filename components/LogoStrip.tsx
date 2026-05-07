"use client";

import { motion } from "framer-motion";
import { ShieldCheck, FileCheck, Landmark, Building2, Gavel } from "lucide-react";

const LOGOS = [
    { name: "PPRA Compliant", icon: ShieldCheck },
    { name: "AGPO Registered", icon: FileCheck },
    { name: "County Governments", icon: Landmark },
    { name: "Corporate Tenders", icon: Building2 },
    { name: "e-Procurement Ready", icon: Gavel },
];

// Duplicate for seamless looping
const MARQUEE_ITEMS = [...LOGOS, ...LOGOS, ...LOGOS];

export function LogoStrip() {
    return (
        <div className="w-full overflow-hidden bg-white border-y border-slate-100 py-6 md:py-8 flex items-center relative mask-edges">
            {/* CSS mask to fade out the edges */}
            <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-white via-transparent to-white w-full" />
            
            <motion.div
                className="flex gap-12 md:gap-24 whitespace-nowrap min-w-max pr-12 md:pr-24 items-center"
                animate={{ x: [0, "-33.33%"] }}
                transition={{
                    repeat: Infinity,
                    ease: "linear",
                    duration: 20,
                }}
            >
                {MARQUEE_ITEMS.map((item, i) => {
                    const Icon = item.icon;
                    return (
                        <div key={i} className="flex items-center gap-3 text-slate-400 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                            <Icon className="size-6 md:size-8" strokeWidth={1.5} />
                            <span className="font-display font-semibold text-lg md:text-xl tracking-tight">
                                {item.name}
                            </span>
                        </div>
                    );
                })}
            </motion.div>
        </div>
    );
}
