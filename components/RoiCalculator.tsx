"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "./ui/Badge";
import { fadeUp } from "@/lib/motion";
import { OdometerNumber } from "./OdometerNumber";

export function RoiCalculator() {
    const [tenders, setTenders] = useState(4);

    // Basic assumptions
    const hoursPerTender = 14;
    const hoursSaved = tenders * hoursPerTender;
    
    // In-house: 1 manager (KES 65k) can handle ~4 bids/mo.
    const inHouseManagersNeeded = Math.ceil(tenders / 4);
    const inHouseCost = inHouseManagersNeeded * 65000;
    
    // PRT Cost: Tender Pro (35k) up to 4, Strategist (65k) up to 10, then maybe custom.
    const prtCost = tenders <= 4 ? 35000 : 65000;
    
    const moneySaved = Math.max(0, inHouseCost - prtCost);

    return (
        <motion.div 
            variants={fadeUp}
            className="w-full max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 premium-shadow p-8 md:p-12"
        >
            <div className="text-center mb-10">
                <Badge tone="brand" className="mb-4">ROI Calculator</Badge>
                <h3 className="font-display text-3xl md:text-4xl font-bold text-brand-950 mb-4">
                    The true cost of in-house bidding.
                </h3>
                <p className="text-slate-600">
                    Drag the slider to see how much time and money you save by outsourcing to PRT.
                </p>
            </div>

            <div className="mb-12">
                <div className="flex justify-between text-sm font-semibold text-slate-700 mb-4">
                    <span>Tenders per month</span>
                    <span className="font-mono text-brand-600 text-lg">{tenders}</span>
                </div>
                <input 
                    type="range" 
                    min="1" 
                    max="15" 
                    value={tenders} 
                    onChange={(e) => setTenders(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-2 font-mono">
                    <span>1</span>
                    <span>15</span>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 text-center">
                    <p className="text-sm font-semibold text-slate-500 mb-2">In-house Cost</p>
                    <div className="font-mono text-2xl font-bold text-slate-900">
                        KES <OdometerNumber value={inHouseCost} />
                    </div>
                    <p className="text-xs text-slate-400 mt-2">Salary & overhead</p>
                </div>
                
                <div className="bg-brand-50 rounded-2xl p-6 border border-brand-100 text-center">
                    <p className="text-sm font-semibold text-brand-600 mb-2">PRT Cost</p>
                    <div className="font-mono text-2xl font-bold text-brand-900">
                        KES <OdometerNumber value={prtCost} />
                    </div>
                    <p className="text-xs text-brand-500/70 mt-2">Flat monthly fee</p>
                </div>

                <div className="bg-success-50 rounded-2xl p-6 border border-success-200 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-success-500/10 animate-pulse pointer-events-none" />
                    <p className="text-sm font-semibold text-success-700 mb-2">Monthly Savings</p>
                    <div className="font-mono text-3xl font-bold text-success-600">
                        KES <OdometerNumber value={moneySaved} />
                    </div>
                    <p className="text-xs font-semibold text-success-600/80 mt-2">
                        + <OdometerNumber value={hoursSaved} /> hours saved
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
