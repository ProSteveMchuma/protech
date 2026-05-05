import { PricingV2 } from "@/components/PricingV2";
import { FaqSection } from "@/components/FaqSection";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRight, Brain, MessageSquare, BarChart3 } from "lucide-react";

export const metadata = {
    title: "Social Media Management for Kenyan Businesses",
    description:
        "Strategy, content, and community engagement that turns followers into customers. Run by Pro Remote Tasks experts.",
};

const tiers = [
    {
        name: "Starter Social",
        price: "KES 35,000/mo",
        description: "Consistent presence for small businesses.",
        pkgKey: "social-starter",
        features: [
            "2 platforms (IG, FB)",
            "12 posts / month",
            "Basic graphic design",
            "Caption copywriting",
            "Monthly performance report",
        ],
    },
    {
        name: "Growth Social",
        price: "KES 60,000/mo",
        description: "Aggressive growth for ambitious brands.",
        pkgKey: "social-growth",
        features: [
            "3 platforms (IG, FB, LinkedIn / TikTok)",
            "20 posts + 4 reels / month",
            "Community management",
            "Hashtag & SEO strategy",
            "Bi-weekly strategy calls",
        ],
        recommended: true,
    },
    {
        name: "Viral Authority",
        price: "KES 120,000/mo",
        description: "Full-scale content production and management.",
        pkgKey: "social-viral",
        features: [
            "4 platforms",
            "Daily posting (30 / month)",
            "8 reels + script + edit",
            "Influencer outreach",
            "24/7 community management",
        ],
    },
];

const pillars = [
    {
        icon: <Brain className="size-6 text-brand-600" />,
        title: "Strategy first",
        desc: "We analyze competitors, audience, and trends before posting a single thing.",
    },
    {
        icon: <MessageSquare className="size-6 text-amber-500" />,
        title: "Real engagement",
        desc: "We don't post and ghost. We reply to comments and DMs to build community.",
    },
    {
        icon: <BarChart3 className="size-6 text-success-500" />,
        title: "Data driven",
        desc: "Monthly reports show exactly what's working and how much you're growing.",
    },
];

export default function SocialServicePage() {
    return (
        <>
            {/* Hero */}
            <section className="bg-brand-950 bg-grid text-white pt-20 pb-24 md:pt-28 md:pb-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-aurora-dark opacity-50 pointer-events-none" />
                <div className="container mx-auto px-4 relative z-10 max-w-4xl text-center">
                    <Badge tone="dark" pulse className="mb-6">
                        Social Media Management
                    </Badge>
                    <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6 text-balance">
                        Turn followers into <br />
                        <span className="text-gradient-warm">paying customers.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 text-pretty">
                        Social media is a full-time job. Let our team run strategy, content, and engagement while you run your business.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <ButtonLink href="#pricing" variant="primary" size="xl">
                            See packages <ArrowRight className="size-5" />
                        </ButtonLink>
                        <ButtonLink href="/hire?service=social" variant="outline" size="xl">
                            Get a free audit
                        </ButtonLink>
                    </div>
                </div>
            </section>

            {/* Pillars */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="text-center mb-12">
                        <Badge tone="sun" className="mb-3">More than just posting</Badge>
                        <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900">
                            Three pillars. One outcome.
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-5">
                        {pillars.map((p, i) => (
                            <div
                                key={i}
                                className="p-7 bg-slate-50 rounded-2xl border border-slate-100 hover:border-amber-300 transition"
                            >
                                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-5">
                                    {p.icon}
                                </div>
                                <h3 className="font-display text-xl font-bold text-slate-900 mb-2">{p.title}</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">{p.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="py-24 bg-slate-50 scroll-mt-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-14">
                        <Badge tone="success" className="mb-3">Transparent monthly packages</Badge>
                        <h2 className="font-display text-3xl md:text-5xl font-bold text-slate-900 mb-4 text-balance">
                            Cancel anytime. No long contracts.
                        </h2>
                    </div>
                    <PricingV2 tiers={tiers} serviceName="social" />
                </div>
            </section>

            <FaqSection
                items={[
                    { question: "Do you create the content or do I?", answer: "Our team handles everything from idea to graphic to scheduling. You just approve the calendar." },
                    { question: "Which platforms do you cover?", answer: "Instagram, Facebook, LinkedIn, TikTok, and X (Twitter)." },
                    { question: "How do you measure success?", answer: "Reach, engagement, follower growth, and click-through-rate — reported monthly." },
                ]}
            />
        </>
    );
}
