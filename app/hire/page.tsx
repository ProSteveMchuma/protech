import { HireForm } from "@/components/HireForm";
import { Badge } from "@/components/ui/Badge";
import { ShieldCheck, Clock, Wallet, Smartphone } from "lucide-react";
import { Suspense } from "react";

export const metadata = {
    title: "Hire Vetted Kenyan Talent",
    description:
        "Tell us what you need. We'll match you with a vetted Kenyan VA, social media manager, or content writer within 24 hours.",
};

const guarantees = [
    {
        icon: <ShieldCheck className="size-5 text-success-500" />,
        title: "Risk-free trial",
        desc: "Not happy in week 1? We replace at no cost.",
    },
    {
        icon: <Clock className="size-5 text-brand-500" />,
        title: "Start in 24 hours",
        desc: "Most matches go live within 24-48 hours.",
    },
    {
        icon: <Wallet className="size-5 text-amber-500" />,
        title: "Flat monthly fee",
        desc: "No hourly negotiations. No surprises.",
    },
    {
        icon: <Smartphone className="size-5 text-accent-500" />,
        title: "M-Pesa friendly",
        desc: "Pay via Paybill or bank transfer.",
    },
];

export default function HirePage() {
    return (
        <div className="bg-aurora min-h-screen py-20">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="grid lg:grid-cols-5 gap-12 items-start">
                    <div className="lg:col-span-2">
                        <Badge tone="brand" pulse className="mb-5">Start in 24 hours</Badge>
                        <h1 className="font-display text-4xl md:text-5xl font-bold text-brand-950 mb-5 leading-tight text-balance">
                            Scale your business with <br />
                            <span className="text-gradient">world-class talent.</span>
                        </h1>
                        <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                            Tell us what you need. We'll match you with a vetted Kenyan pro from our managed pool. No HR headaches, no payroll, no surprises — just results.
                        </p>

                        <div className="space-y-5">
                            {guarantees.map((g, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="size-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                                        {g.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">{g.title}</h3>
                                        <p className="text-slate-500 text-sm">{g.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-3xl premium-shadow border border-slate-200/70 p-8 md:p-10 relative overflow-hidden">
                            <div className="absolute -top-12 -right-12 size-40 bg-gradient-to-br from-brand-500/15 to-accent-500/15 rounded-full blur-2xl pointer-events-none" />
                            <div className="relative">
                                <h2 className="font-display text-2xl font-bold text-slate-900 mb-1">
                                    Project request
                                </h2>
                                <p className="text-slate-500 text-sm mb-8">
                                    Free, no commitment. We'll reply with a tailored proposal within 24 hours.
                                </p>
                                <Suspense fallback={<div className="text-slate-500">Loading form…</div>}>
                                    <HireForm />
                                </Suspense>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
