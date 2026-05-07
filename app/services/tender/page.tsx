/**
 * /services/tender — Stripe-clean × Apple-storytelling.
 *
 * Five sections in order. One focus per section.
 *   1. Hero ............ "Bid like the firms that win." One CTA.
 *   2. Pain ............ Scroll-pinned 4-frame reveal of bidder pain.
 *   3. Pricing ......... Full PricingV2 matrix + quiet add-ons strip.
 *   4. Process ......... Scroll-driven 5-step bid timeline.
 *   5. FAQ + close ..... 5 questions, lead-magnet line, one closing CTA.
 *
 * The previous nine-section brochure shape was deliberately cut down.
 * Anything not in this file was chrome.
 */

import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { FaqSection } from "@/components/FaqSection";
import { PricingV2 } from "@/components/PricingV2";
import { HeroAmbient } from "@/components/HeroAmbient";
import { MagneticButton } from "@/components/MagneticButton";
import { RoiCalculator } from "@/components/RoiCalculator";

import { TENDER_BUNDLE_ADDONS, TENDER_TIERS } from "@/lib/tender-tiers";

import { BidProcess } from "./BidProcess";
import { PainStory } from "./PainStory";

export const metadata = {
    title: "Tender Management for Kenyan SMEs",
    description:
        "Pro Remote Tasks finds, prepares, and submits Kenyan government and corporate tenders for you. PPADA-compliant bids, stamped on-time submissions, and post-loss debriefs. Pricing from KES 15,000/mo.",
};

const PRICING_TIERS = TENDER_TIERS.map((t) => ({
    name: t.name,
    price: `KES ${t.priceKES.toLocaleString()}/mo`,
    description: t.tagline,
    pkgKey: t.key,
    recommended: t.recommended,
    priceNote:
        t.key === "tender-strategist"
            ? "plus a small success fee on awards · discussed in discovery call"
            : undefined,
    features: t.included,
}));

const FAQ_ITEMS = [
    {
        question: "Can you guarantee I will win a tender?",
        answer:
            "No, and anyone who promises that is lying — PPRA scoring is the procuring entity's job, not ours. What we guarantee is that you submit more bids, on time, with every mandatory document attached and every BOQ page signed.",
    },
    {
        question: "KES 65,000 a month is the cost of a junior staff hire.",
        answer:
            "A junior hire does not know PPADA 2015, cannot read a BOQ trap, and will not catch an unsigned page at 11pm before submission. Tender Pro replaces around 40 hours of bid-prep work a month, not a generalist desk.",
    },
    {
        question: "What if you miss a submission deadline?",
        answer:
            "We commit to a 48-hour internal cutoff before every public deadline. If we miss a submission window we caused, that bid month is free. We track this in your monthly report — there is nowhere to hide it.",
    },
    {
        question: "My bids are confidential — pricing especially.",
        answer:
            "Standard. We sign an NDA at onboarding, store financials in a per-client encrypted folder, and only the assigned tender lead sees your numbers. We never bid against you on any tender.",
    },
    {
        question: "I already get free alerts from MyGov and PPIP.",
        answer:
            "You do — and you are getting 200+ unfiltered alerts a week and missing the three that actually fit you. We filter to your AGPO category, capacity, and location, and we chase the deadline so you do not.",
    },
    {
        question: "How do I know you are not running the same playbook for my competitor?",
        answer:
            "At Strategist tier we accept one client per category per county or parastatal. It is in our onboarding contract. If we already have a client bidding for the same category, we tell you on the discovery call.",
    },
];

export default function TenderServicePage() {
    return (
        <>
            {/* ---------------------------------------------------------- */}
            {/*  1 · HERO — Stripe-clean                                   */}
            {/* ---------------------------------------------------------- */}
            <section
                aria-label="Tender management for Kenyan SMEs"
                className="relative bg-stamp text-white overflow-hidden flex items-center min-h-[100svh] lg:min-h-[80vh] py-20"
            >
                <div
                    aria-hidden
                    className="absolute inset-0 bg-aurora-dark opacity-60 pointer-events-none"
                />
                <div
                    aria-hidden
                    className="absolute inset-0 bg-stars pointer-events-none opacity-50"
                />
                <HeroAmbient tone="dark" />

                <div className="container mx-auto px-6 lg:px-8 max-w-5xl relative z-10">
                    <div className="text-center">
                        <div className="mb-10 inline-flex">
                            <Badge tone="dark" pulse>
                                Tender Management
                            </Badge>
                        </div>

                        <h1 className="font-display text-6xl sm:text-7xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.02] tracking-tight text-balance mb-8">
                            Bid like the firms that win.
                        </h1>

                        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed text-pretty mb-12">
                            We track PPADA-compliant tenders across eGP and county portals,
                            write the bid, and submit before the WhatsApp deadline ping —
                            so you never lose another one to paperwork.
                        </p>

                        <div className="flex justify-center">
                            <MagneticButton>
                                <ButtonLink href="#pricing" variant="primary" size="xl">
                                    See packages
                                    <ArrowRight className="size-5" />
                                </ButtonLink>
                            </MagneticButton>
                        </div>

                        <div className="mt-8">
                            <a
                                href="/hire?service=tender"
                                className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
                            >
                                or talk to sales
                                <ArrowRight className="size-3.5" aria-hidden />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* ---------------------------------------------------------- */}
            {/*  2 · PAIN — pinned scroll story                            */}
            {/* ---------------------------------------------------------- */}
            <PainStory />

            {/* ---------------------------------------------------------- */}
            {/*  3 · PRICING — full matrix + quiet add-ons                 */}
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
                        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-brand-950 leading-tight text-balance mb-6">
                            Three tiers. One flat invoice.
                        </h2>
                        <p className="text-base md:text-lg text-slate-600 text-pretty">
                            Month-to-month. Cancel with 15 days notice. If we are not
                            the right fit in week one, you get a full refund.
                        </p>
                    </div>

                    <div className="mb-24">
                        <RoiCalculator />
                    </div>

                    <PricingV2 tiers={PRICING_TIERS} serviceName="tender" />

                    {/* Add-ons strip — quiet, below the fold of the pricing matrix */}
                    <div className="mt-24 md:mt-28 max-w-4xl mx-auto">
                        <div className="text-center mb-10">
                            <p className="text-xs uppercase tracking-[0.25em] font-bold text-slate-500">
                                Need a one-off?
                            </p>
                        </div>
                        <ul className="grid sm:grid-cols-2 gap-3">
                            {Object.values(TENDER_BUNDLE_ADDONS).map((addon) => (
                                <li
                                    key={addon.key}
                                    className="rounded-xl border border-slate-200 bg-white px-5 py-4"
                                >
                                    <div className="flex items-baseline justify-between gap-3 mb-1.5">
                                        <h3 className="font-semibold text-sm text-slate-900 leading-snug">
                                            {addon.name}
                                        </h3>
                                        <span className="font-mono tabular-nums text-xs font-semibold text-slate-500 whitespace-nowrap">
                                            from KES {addon.priceKES.toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 leading-relaxed">
                                        {addon.description}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* ---------------------------------------------------------- */}
            {/*  4 · PROCESS — scroll-driven 5-step timeline               */}
            {/* ---------------------------------------------------------- */}
            <section className="relative bg-white py-32 md:py-40">
                <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
                    <div className="text-center mb-20 md:mb-28 max-w-3xl mx-auto">
                        <div className="mb-5 inline-flex">
                            <Badge tone="accent">How a bid runs</Badge>
                        </div>
                        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-brand-950 leading-tight text-balance">
                            From engagement letter to stamped receipt.
                        </h2>
                    </div>

                    <BidProcess />
                </div>
            </section>

            {/* ---------------------------------------------------------- */}
            {/*  5 · FAQ + final close                                     */}
            {/* ---------------------------------------------------------- */}
            <FaqSection items={FAQ_ITEMS} />

            {/* Quiet lead-magnet mention — between FAQ and closing CTA */}
            <section className="bg-white pb-12">
                <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
                    <p className="text-center text-base md:text-lg text-slate-600 leading-relaxed text-balance">
                        Still deciding? Our free guide walks through the{" "}
                        <a
                            href="/guides/tender-disqualifications?utm_source=tender-page"
                            className="font-semibold text-brand-700 hover:text-brand-800 underline decoration-brand-200 underline-offset-4 decoration-2 hover:decoration-brand-500 transition"
                        >
                            10 reasons Kenyan SMEs get disqualified
                        </a>
                        {" "}— the technicalities that lose more bids than price ever does.
                    </p>
                </div>
            </section>

            <section className="relative bg-stamp text-white py-32 md:py-40 overflow-hidden">
                <div
                    aria-hidden
                    className="absolute inset-0 bg-aurora-dark opacity-60 pointer-events-none"
                />
                <div
                    aria-hidden
                    className="absolute inset-0 bg-stars pointer-events-none opacity-50"
                />
                <div className="container mx-auto px-6 lg:px-8 max-w-3xl relative z-10">
                    <div className="text-center">
                        <h2 className="font-display text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight text-balance mb-12">
                            Ready to bid better?
                        </h2>

                        <div className="flex flex-col items-center gap-6">
                            <MagneticButton>
                                <ButtonLink
                                    href="/hire?service=tender"
                                    variant="primary"
                                    size="xl"
                                >
                                    Get a free proposal
                                    <ArrowRight className="size-5" />
                                </ButtonLink>
                            </MagneticButton>
                            <a
                                href="#pricing"
                                className="text-sm font-medium text-slate-300 hover:text-white transition-colors inline-flex items-center gap-1.5"
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
