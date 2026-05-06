import { Suspense } from "react";
import { CheckoutForm } from "@/components/CheckoutForm";
import { Badge } from "@/components/ui/Badge";
import { ShieldCheck, Smartphone } from "lucide-react";
import { business } from "@/lib/config";

export const metadata = {
    title: "M-Pesa Checkout",
    description: "Pay your package via M-Pesa Paybill. Verified within 4 hours.",
};

export default function CheckoutPage() {
    return (
        <div className="bg-aurora min-h-screen py-16 md:py-24">
            <div className="container mx-auto px-5 max-w-2xl">
                <div className="text-center mb-10 md:mb-12">
                    <Badge tone="success" pulse className="mb-5">
                        <Smartphone className="size-3" /> Lipa Na M-Pesa
                    </Badge>
                    <h1 className="font-display text-4xl md:text-5xl font-bold text-brand-950 leading-tight tracking-tight text-balance mb-4">
                        Pay via M-Pesa.
                    </h1>
                    <p className="text-lg text-slate-600 leading-relaxed text-pretty max-w-md mx-auto">
                        Use Paybill{" "}
                        <span className="font-mono font-bold text-brand-950">
                            {business.paybill}
                        </span>{" "}
                        with your full name as the account. We verify within 4 business hours.
                    </p>
                </div>

                <Suspense
                    fallback={
                        <div className="text-center text-slate-500 py-16">
                            Loading checkout…
                        </div>
                    }
                >
                    <CheckoutForm />
                </Suspense>

                <div className="mt-10 flex items-center justify-center gap-2 text-xs text-slate-500 text-center">
                    <ShieldCheck className="size-4 text-success-500 shrink-0" aria-hidden />
                    <span>
                        Money-back week 1 · 24-48h onboarding · Cancel anytime
                    </span>
                </div>
            </div>
        </div>
    );
}
