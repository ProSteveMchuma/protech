import { HireForm } from "@/components/HireForm";
import { Badge } from "@/components/ui/Badge";
import { ShieldCheck } from "lucide-react";
import { Suspense } from "react";

export const metadata = {
    title: "Get a free proposal",
    description:
        "Tell us what you need. We'll reply with a tailored proposal within 24 hours — tender management or vetted Kenyan VAs.",
};

export default function HirePage() {
    return (
        <div className="bg-aurora min-h-screen py-16 md:py-24">
            <div className="container mx-auto px-5 max-w-2xl">
                <div className="text-center mb-10 md:mb-12">
                    <Badge tone="brand" pulse className="mb-5">
                        Get a free proposal
                    </Badge>
                    <h1 className="font-display text-4xl md:text-5xl font-bold text-brand-950 leading-[1.05] tracking-tight text-balance mb-4">
                        Tell us what you need.
                    </h1>
                    <p className="text-lg text-slate-600 leading-relaxed text-pretty max-w-md mx-auto">
                        Two short steps. We'll reply with a tailored proposal within 24 hours.
                    </p>
                </div>

                <Suspense
                    fallback={
                        <div className="text-center text-slate-500 py-16">Loading form…</div>
                    }
                >
                    <HireForm />
                </Suspense>

                <div className="mt-10 flex items-center justify-center gap-2 text-xs text-slate-500">
                    <ShieldCheck className="size-4 text-success-500" aria-hidden />
                    <span>
                        Risk-free trial · 24h response · Cancel anytime
                    </span>
                </div>
            </div>
        </div>
    );
}
