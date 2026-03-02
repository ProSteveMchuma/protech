"use client";

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface PricingTier {
    name: string;
    price: string;
    description: string;
    features: string[];
    recommended?: boolean;
}

interface PricingTableProps {
    tiers: PricingTier[];
    serviceName: string;
}

export function PricingTable({ tiers, serviceName }: PricingTableProps) {
    return (
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
            {tiers.map((tier, i) => (
                <div
                    key={i}
                    className={`relative p-8 rounded-3xl border ${tier.recommended
                            ? "bg-slate-900 text-white border-slate-900 shadow-xl scale-105 z-10"
                            : "bg-white text-slate-900 border-slate-200"
                        }`}
                >
                    {tier.recommended && (
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide">
                            Best Value
                        </div>
                    )}

                    <h3 className="font-serif text-2xl font-bold mb-2">{tier.name}</h3>
                    <p className={`text-sm mb-6 ${tier.recommended ? "text-slate-300" : "text-slate-500"}`}>
                        {tier.description}
                    </p>
                    <div className="text-3xl font-bold mb-6">{tier.price}</div>

                    <ul className="space-y-4 mb-8">
                        {tier.features.map((feature, j) => (
                            <li key={j} className="flex items-center gap-3 text-sm">
                                <CheckCircle2 className={`size-5 ${tier.recommended ? "text-blue-400" : "text-emerald-500"}`} />
                                {feature}
                            </li>
                        ))}
                    </ul>

                    <Link
                        href={`/hire?service=${serviceName}&tier=${tier.name}`}
                        className={`flex items-center justify-center w-full py-4 rounded-xl font-bold transition-all ${tier.recommended
                                ? "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/50"
                                : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                            }`}
                    >
                        Select {tier.name}
                    </Link>
                </div>
            ))}
        </div>
    );
}
