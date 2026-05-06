"use client";

import { motion } from "framer-motion";
import {
    ClipboardList,
    Search,
    PencilLine,
    Send,
    LineChart,
} from "lucide-react";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

const STEPS = [
    {
        n: "01",
        icon: ClipboardList,
        title: "Onboarding & document audit",
        body: "We pull your KRA TCC, NSSF, NHIF, NITA, AGPO, CR12, audited accounts, and past performance into one source of truth and flag every expiry and gap inside week 1.",
    },
    {
        n: "02",
        icon: Search,
        title: "Pipeline matching",
        body: "Daily sweeps across PPIP, eGP, MyGov, ministry portals, and county sites. We surface only opportunities that fit your AGPO category, capacity, and location.",
    },
    {
        n: "03",
        icon: PencilLine,
        title: "Pre-bid: write & compliance check",
        body: "Technical proposal, financial proposal, BOQ formatted to the procuring entity's template, and a 100% line-by-line check against the PPADA 2015 mandatory-documents list.",
    },
    {
        n: "04",
        icon: Send,
        title: "Submission with stamped receipt",
        body: "We submit on eGP or physically, hit a 48-hour internal cutoff before the public deadline, and send you the stamped receipt the same day.",
    },
    {
        n: "05",
        icon: LineChart,
        title: "Win/loss debrief",
        body: "Win: we coordinate LPO, performance bond, and invoicing. Loss: we file a PPADA s.67 debrief request and rewrite the weak sections so the next bid scores higher.",
    },
] as const;

export function BidTimeline() {
    return (
        <motion.ol
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={stagger(0, 0.1)}
            className="grid gap-5 md:grid-cols-5 md:gap-4"
        >
            {STEPS.map((step) => {
                const Icon = step.icon;
                return (
                    <motion.li
                        key={step.n}
                        variants={fadeUp}
                        className="relative rounded-2xl border border-slate-200 bg-white p-6 premium-shadow-hover"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <span className="font-mono text-xs font-bold tracking-widest text-slate-400">
                                {step.n}
                            </span>
                            <span className="inline-flex size-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                                <Icon className="size-5" aria-hidden />
                            </span>
                        </div>
                        <h3 className="font-display text-lg font-bold text-slate-900 mb-2 leading-snug">
                            {step.title}
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            {step.body}
                        </p>
                    </motion.li>
                );
            })}
        </motion.ol>
    );
}
