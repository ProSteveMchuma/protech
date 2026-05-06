/**
 * /services/va — Stripe-clean × Apple-storytelling.
 *
 * VA is the supporting service. Tender is the flagship. This page is
 * intentionally quieter: no theatrical scroll moments, no animated icon
 * grid, no hero theatre. Four sections, type and air, conversion path
 * obvious from the first viewport.
 *
 *   1. Hero ............ Light surface. One headline. One CTA.
 *   2. What a VA does .. Two-column prose + check-list. No icons.
 *   3. Pricing ......... PricingV2 matrix. Three tiers. No add-ons.
 *   4. FAQ + close ..... Five Qs, then a quiet light closing block.
 *
 * If you are tempted to add a scroll-driven moment here, don't.
 */

import { ArrowRight, CheckCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { FaqSection } from "@/components/FaqSection";
import { PricingV2 } from "@/components/PricingV2";

export const metadata = {
    title: "Hire a Managed Virtual Assistant in Kenya",
    description:
        "Reclaim your inbox with a vetted Kenyan VA — managed by Pro Remote Tasks, not freelance. Monthly retainer from KES 25,000. Replacement guaranteed in week one.",
};

const PRICING_TIERS = [
    {
        name: "Starter VA",
        price: "KES 25,000/mo",
        description:
            "For solo founders who need 10 hours of admin off their plate.",
        pkgKey: "va-starter",
        features: [
            "10 hrs/week dedicated time",
            "Inbox triage & calendar scheduling",
            "Basic data entry & research",
            "Weekly progress report",
            "Account-manager oversight",
        ],
    },
    {
        name: "Growth VA",
        price: "KES 40,000/mo",
        description:
            "For scaling teams that need a real second set of hands.",
        pkgKey: "va-growth",
        recommended: true,
        features: [
            "20 hrs/week dedicated time",
            "Inbox + calendar mastery",
            "Customer support email replies",
            "Travel & logistics planning",
            "Light social media scheduling",
            "Dedicated account manager",
        ],
    },
    {
        name: "Executive VA",
        price: "KES 75,000/mo",
        description:
            "For busy executives who need full-time leverage on the desk.",
        pkgKey: "va-executive",
        features: [
            "40 hrs/week (full-time)",
            "Full inbox management",
            "Project & vendor coordination",
            "Lifestyle & errands handling",
            "Research briefs on demand",
            "Priority response on weekdays",
        ],
    },
];

const VA_TASKS = [
    "Inbox triage and reply drafting",
    "Calendar scheduling and meeting defence",
    "Travel and logistics booking",
    "CRM and spreadsheet data entry",
    "Customer support email replies",
    "Light social media scheduling",
    "Research briefs and summaries",
    "Expense tracking and receipts",
];

const FAQ_ITEMS = [
    {
        question: "How quickly can I start?",
        answer:
            "Twenty-four to forty-eight hours from your intake call. We match you against an already-vetted bench, walk you through onboarding, and your VA is in your inbox the next business day.",
    },
    {
        question: "Are your VAs based in Kenya?",
        answer:
            "Yes. Every VA on our bench is Kenyan, English-fluent, and works from a stable connection on EAT business hours. That is how we deliver senior-level admin work at Kenyan rates.",
    },
    {
        question: "Can I scale my plan up or down?",
        answer:
            "Yes, with fifteen days notice. Most clients start at Growth and move up once they trust the workflow. Downgrades are equally simple — no penalty, no contract drama.",
    },
    {
        question: "What if my VA isn't a fit?",
        answer:
            "Free replacement in week one, no questions asked. After week one we still replace, but with a short call so we match you better the second time.",
    },
    {
        question: "Do you handle confidential work?",
        answer:
            "Standard. We sign an NDA at onboarding and store client documents in a per-client encrypted folder. Only your assigned VA and account manager have access.",
    },
];

export default function VAServicePage() {
    return (
        <>
            {/* ---------------------------------------------------------- */}
            {/*  1 · HERO — Stripe-clean, LIGHT surface                    */}
            {/* ---------------------------------------------------------- */}
            <section
                aria-label="Managed virtual assistants for Kenyan businesses"
                className="relative bg-aurora overflow-hidden flex items-center min-h-[100svh] lg:min-h-[70vh] py-20"
            >
                <div className="container mx-auto px-6 lg:px-8 max-w-4xl relative z-10">
                    <div className="text-center">
                        <div className="mb-10 inline-flex">
                            <Badge tone="brand">Virtual Assistants</Badge>
                        </div>

                        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-brand-950 leading-tight tracking-tight text-balance mb-8">
                            Reclaim your inbox.
                        </h1>

                        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed text-pretty mb-12">
                            A vetted Kenyan VA, ready in 24 hours. Managed
                            service — not freelance — billed as a simple
                            monthly retainer.
                        </p>

                        <div className="flex justify-center">
                            <ButtonLink
                                href="#pricing"
                                variant="primary"
                                size="xl"
                            >
                                See packages
                                <ArrowRight className="size-5" />
                            </ButtonLink>
                        </div>

                        <div className="mt-8">
                            <a
                                href="/hire?service=va"
                                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-brand-700 transition-colors"
                            >
                                or talk to sales
                                <ArrowRight className="size-3.5" aria-hidden />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* ---------------------------------------------------------- */}
            {/*  2 · WHAT A VA DOES — two-column prose + check-list        */}
            {/* ---------------------------------------------------------- */}
            <section className="relative bg-white py-24 md:py-32">
                <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
                    <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
                        <div>
                            <div className="mb-5 inline-flex">
                                <Badge tone="neutral">The work</Badge>
                            </div>
                            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-brand-950 leading-tight text-balance">
                                What a Pro Remote Tasks VA actually does.
                            </h2>
                            <p className="mt-6 text-base md:text-lg text-slate-600 leading-relaxed text-pretty">
                                Concrete admin work, done daily, with an
                                account manager checking quality before it
                                lands on your desk. No vague "general
                                assistance" — these are the eight buckets we
                                staff against.
                            </p>
                        </div>

                        <ul className="space-y-3 md:pt-2">
                            {VA_TASKS.map((task) => (
                                <li
                                    key={task}
                                    className="flex items-start gap-3 text-base text-slate-800"
                                >
                                    <CheckCircle2
                                        className="size-4 text-success-500 shrink-0 mt-1.5"
                                        aria-hidden
                                    />
                                    <span className="leading-relaxed">
                                        {task}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* ---------------------------------------------------------- */}
            {/*  3 · PRICING — three tiers, no add-ons                     */}
            {/* ---------------------------------------------------------- */}
            <section
                id="pricing"
                className="relative bg-slate-50 py-32 md:py-40 scroll-mt-24"
            >
                <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
                    <div className="text-center mb-16 md:mb-20 max-w-3xl mx-auto">
                        <div className="mb-5 inline-flex">
                            <Badge tone="success">Pricing</Badge>
                        </div>
                        <h2 className="font-display text-4xl md:text-5xl font-bold text-brand-950 leading-tight text-balance mb-6">
                            Simple monthly. Cancel anytime.
                        </h2>
                        <p className="text-base md:text-lg text-slate-600 text-pretty">
                            Free replacement in week one if your VA is not
                            the right fit. No long contract, no hourly
                            negotiation.
                        </p>
                    </div>

                    <PricingV2 tiers={PRICING_TIERS} serviceName="va" />
                </div>
            </section>

            {/* ---------------------------------------------------------- */}
            {/*  4 · FAQ + quiet closing block                             */}
            {/* ---------------------------------------------------------- */}
            <FaqSection items={FAQ_ITEMS} />

            <section className="relative bg-white py-24 md:py-32">
                <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
                    <div className="text-center">
                        <h2 className="font-display text-3xl md:text-5xl font-bold text-brand-950 leading-tight tracking-tight text-balance mb-12">
                            Ready for a second pair of hands?
                        </h2>

                        <div className="flex flex-col items-center gap-6">
                            <ButtonLink
                                href="/hire?service=va"
                                variant="primary"
                                size="xl"
                            >
                                Get a free intake call
                                <ArrowRight className="size-5" />
                            </ButtonLink>
                            <a
                                href="#pricing"
                                className="text-sm font-medium text-slate-500 hover:text-brand-700 transition-colors inline-flex items-center gap-1.5"
                            >
                                or browse packages
                                <ArrowRight className="size-3.5" aria-hidden />
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
