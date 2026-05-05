import { ApplicationForm } from "@/components/ApplicationForm";
import { Badge } from "@/components/ui/Badge";
import { CheckCircle2, Briefcase, Wallet, TrendingUp } from "lucide-react";

export const metadata = {
    title: "Join the Talent Pool",
    description:
        "Apply to join Pro Remote Tasks' vetted network of remote Kenyan professionals. Premium clients. Guaranteed pay.",
};

const benefits = [
    {
        icon: <Briefcase className="size-5 text-brand-600" />,
        title: "Vetted opportunities",
        desc: "Work with clients who value quality, not the cheapest rate.",
    },
    {
        icon: <Wallet className="size-5 text-success-500" />,
        title: "Guaranteed payment",
        desc: "We invoice the client. You get paid on time, every time.",
    },
    {
        icon: <TrendingUp className="size-5 text-amber-500" />,
        title: "Career growth",
        desc: "Coaching and feedback to help you raise your rates over time.",
    },
];

export default function ApplyPage() {
    return (
        <div className="bg-aurora min-h-screen py-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-12">
                    <Badge tone="accent" pulse className="mb-5">Now accepting applications</Badge>
                    <h1 className="font-display text-4xl md:text-6xl font-bold text-brand-950 mb-5 text-balance">
                        Join the top 1% of <br />
                        <span className="text-gradient">Kenyan talent.</span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        We connect skilled professionals with high-paying international and local clients. No bidding wars. Just consistent, well-paid work.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-5 mb-14">
                    {benefits.map((b, i) => (
                        <div
                            key={i}
                            className="bg-white p-6 rounded-2xl border border-slate-200/70 premium-shadow-hover"
                        >
                            <div className="size-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center mb-4">
                                {b.icon}
                            </div>
                            <h3 className="font-bold text-slate-900 mb-1">{b.title}</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">{b.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-3xl premium-shadow border border-slate-200/70 p-8 md:p-12 relative overflow-hidden">
                    <div className="absolute -top-12 -left-12 size-40 bg-gradient-to-br from-success-500/15 to-brand-500/15 rounded-full blur-2xl pointer-events-none" />
                    <div className="max-w-2xl mx-auto relative">
                        <h2 className="font-display text-2xl font-bold text-slate-900 mb-1 text-center">
                            Talent application
                        </h2>
                        <p className="text-slate-500 text-sm mb-8 text-center">
                            Takes 3 minutes. We review every application within 48 hours.
                        </p>
                        <ApplicationForm />
                    </div>
                </div>

                <div className="mt-12 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-500">
                    <span className="inline-flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-success-500" /> 4-stage vetting
                    </span>
                    <span className="inline-flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-success-500" /> Long-term contracts
                    </span>
                    <span className="inline-flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-success-500" /> Pay above market rate
                    </span>
                </div>
            </div>
        </div>
    );
}
