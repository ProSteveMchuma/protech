import { Suspense } from "react";
import { CheckoutForm } from "@/components/CheckoutForm";
import { Badge } from "@/components/ui/Badge";
import { ShieldCheck, Clock, RotateCcw, Smartphone } from "lucide-react";
import { business } from "@/lib/config";

export const metadata = {
    title: "M-Pesa Checkout",
    description: "Pay your package via M-Pesa Paybill. Verified within 4 hours.",
};

export default function CheckoutPage() {
    return (
        <div className="bg-aurora min-h-screen py-20">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="grid lg:grid-cols-5 gap-12 items-start">
                    <div className="lg:col-span-2">
                        <Badge tone="success" pulse className="mb-5">
                            <Smartphone className="size-3" /> Lipa Na M-Pesa
                        </Badge>
                        <h1 className="font-display text-4xl md:text-5xl font-bold text-brand-950 mb-5 leading-tight text-balance">
                            Pay via <span className="text-gradient">M-Pesa.</span>
                        </h1>
                        <p className="text-slate-600 mb-10 text-lg leading-relaxed">
                            Use Safaricom Paybill <strong className="font-mono">{business.paybill}</strong> with your full name as the account number. Drop the M-Pesa confirmation code and we'll verify within 4 business hours.
                        </p>
                        <ul className="space-y-4">
                            {[
                                { icon: <ShieldCheck className="size-5 text-success-500" />, t: "100% money-back in week 1" },
                                { icon: <Clock className="size-5 text-brand-500" />, t: "Onboarding within 24-48 hours" },
                                { icon: <RotateCcw className="size-5 text-amber-500" />, t: "Cancel any time with 15 days notice" },
                            ].map((it, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-700">
                                    <span className="size-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                                        {it.icon}
                                    </span>
                                    {it.t}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-3 bg-white rounded-3xl premium-shadow border border-slate-200/70 p-8 md:p-10 relative overflow-hidden">
                        <div className="absolute -top-12 -right-12 size-40 bg-gradient-to-br from-success-500/15 to-accent-500/15 rounded-full blur-2xl pointer-events-none" />
                        <div className="relative">
                            <Suspense fallback={<div className="text-slate-500">Loading checkout…</div>}>
                                <CheckoutForm />
                            </Suspense>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
