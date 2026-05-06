import {
    AlarmClock,
    AlertTriangle,
    ArrowRight,
    Bell,
    BookOpenCheck,
    CheckCircle2,
    FileText,
    Handshake,
    ListChecks,
    Lock,
    PiggyBank,
    Receipt,
    ShieldCheck,
    Sparkles,
    Target,
    XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { FaqSection } from "@/components/FaqSection";
import { PricingV2 } from "@/components/PricingV2";

import { TENDER_BUNDLE_ADDONS, TENDER_TIERS } from "@/lib/tender-tiers";

import { BidTimeline } from "./BidTimeline";

export const metadata = {
    title: "Tender Management for Kenyan SMEs",
    description:
        "Pro Remote Tasks finds, prepares, and submits Kenyan government and corporate tenders for you. PPADA-compliant bids, stamped on-time submissions, and post-loss debriefs. Pricing from KES 15,000/mo.",
};

const COMPLIANCE_TAGS = [
    "PPADA 2015",
    "AGPO",
    "eGP",
    "IFMIS",
    "KRA TCC",
    "PPIP",
] as const;

const COST_OF_INACTION = [
    {
        bidding: "Generic MyGov alerts buried in 200/week — you find the right tender 48 hours before close.",
        prt: "Filtered alerts to your AGPO category and capacity. 72h, 24h, and 4h WhatsApp deadline pings.",
    },
    {
        bidding: "KRA TCC quietly expired three weeks ago — disqualified before evaluation even opens the envelope.",
        prt: "Quarterly compliance audit catches an expiring TCC, NSSF, NHIF, NITA, AGPO or CR12 before it costs you.",
    },
    {
        bidding: "BOQ pages unsigned, financial proposal in the technical envelope. Auto-rejected on a technicality.",
        prt: "100% pre-submission check against the PPADA 2015 mandatory-documents list. Every page signed and stamped.",
    },
    {
        bidding: "AGPO certificate lapsed mid-FY. You watched two reserved tenders close without you.",
        prt: "AGPO renewal facilitation handled end-to-end. Eligibility check, document assembly, Treasury follow-up.",
    },
    {
        bidding: "Lost a bid and never asked why. Same gaps in your next four submissions. Same losses.",
        prt: "PPADA s.67 debrief request after every loss. Sections that scored low get rewritten before the next bid.",
    },
    {
        bidding: "Two staff burned a weekend formatting a BOQ in the wrong template. Submitted at 4:58pm Friday.",
        prt: "We hit a 48-hour internal cutoff before every public deadline. Stamped delivery receipt the same day.",
    },
] as const;

const PRO_DELIVERABLES = [
    {
        icon: Bell,
        title: "Filtered tender alerts",
        body: "Daily sweeps across PPIP, eGP, MyGov, and county portals. Up to 15 matches surfaced per week — only the ones that fit your AGPO category and capacity.",
    },
    {
        icon: ShieldCheck,
        title: "Document compliance",
        body: "Quarterly audit of KRA TCC, NSSF, NHIF, NITA, AGPO, CR12, audited accounts, and business permits. Expiry tracker keeps your stack tender-ready.",
    },
    {
        icon: FileText,
        title: "Bid writing",
        body: "Up to 4 full bid submissions a month. Technical proposal, financial proposal, and a compliance pack written to the procuring entity's template.",
    },
    {
        icon: ListChecks,
        title: "BOQ formatting",
        body: "BOQs typed in the exact template the procuring entity issued — no reformatting traps, no missing rows, no unit-rate transcription errors.",
    },
    {
        icon: Receipt,
        title: "eGP & physical submission",
        body: "We submit on egpkenya.go.ke or hand-deliver to the tender box. You get the stamped delivery receipt the same day.",
    },
    {
        icon: AlarmClock,
        title: "Deadline discipline",
        body: "WhatsApp reminders 72h, 24h, and 4h before close. Internal cutoff is always 48 hours before the public deadline. We do not file at 4:58pm.",
    },
    {
        icon: BookOpenCheck,
        title: "Post-loss debrief",
        body: "PPADA s.67 evaluation report requested after every loss. We rewrite the sections that scored low so you do not lose the same way twice.",
    },
    {
        icon: Handshake,
        title: "Bid bond facilitation",
        body: "Introductions to 2-3 partner banks and insurers issuing tender securities. You pay the bond cost; we run the paperwork.",
    },
] as const;

const TRUST_PROMISES = [
    {
        icon: PiggyBank,
        title: "Money-back week 1",
        body: "If we are not the right fit in your first onboarding week, you get a full refund. No reason required.",
    },
    {
        icon: Lock,
        title: "NDA on every bid",
        body: "Signed at onboarding. Financials live in a per-client encrypted folder. Only your assigned tender lead sees your numbers.",
    },
    {
        icon: Target,
        title: "One client per category",
        body: "At Strategist tier we accept one client per category per county or parastatal. You will not bid against another PRT client.",
    },
    {
        icon: ShieldCheck,
        title: "No facilitation payments",
        body: "We do not lobby, gift, or otherwise touch anything that conflicts with PPADA s.66. We win on documents, not introductions.",
    },
] as const;

const ADDON_LABELS: Record<string, string> = {
    "rush-bid": "Single Bid Rush",
    "agpo-facilitation": "AGPO Certificate Facilitation",
    "egp-onboarding": "eGP Supplier Onboarding",
    "bid-bond-facilitation": "Bid Bond Facilitation",
    "compliance-audit": "One-Off Compliance Audit",
    "loss-debrief": "Lost-Bid Debrief & Rework",
    "jv-structuring": "Joint Venture Structuring",
};

const STRATEGIST = TENDER_TIERS.find((t) => t.key === "tender-strategist");

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
            {/* Hero */}
            <section className="bg-brand-950 bg-grid text-white pt-20 pb-24 md:pt-28 md:pb-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-aurora-dark opacity-50 pointer-events-none" />
                <div className="container mx-auto px-4 relative z-10 max-w-4xl text-center">
                    <Badge tone="dark" pulse className="mb-6">
                        Tender Management · Flagship
                    </Badge>
                    <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6 text-balance">
                        Stop missing tenders. <br className="hidden sm:block" />
                        Start winning the ones that{" "}
                        <span className="text-gradient">fit you.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 text-pretty">
                        We find, prepare, and submit Kenyan government and corporate
                        tenders for SMEs. Filtered alerts, PPADA-compliant bids, stamped
                        on-time submissions, post-loss debriefs.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <ButtonLink href="#pricing" variant="primary" size="xl">
                            See packages <ArrowRight className="size-5" />
                        </ButtonLink>
                        <ButtonLink
                            href="/hire?service=tender"
                            variant="outline"
                            size="xl"
                        >
                            Talk to sales
                        </ButtonLink>
                    </div>
                    <div className="mt-12">
                        <p className="text-xs uppercase tracking-widest text-slate-400 mb-4">
                            Built around Kenyan procurement reality
                        </p>
                        <ul className="flex flex-wrap justify-center gap-2">
                            {COMPLIANCE_TAGS.map((tag) => (
                                <li
                                    key={tag}
                                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-mono tracking-wide text-slate-200"
                                >
                                    <span className="size-1.5 rounded-full bg-success-500" />
                                    {tag}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Cost of doing nothing */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-12">
                        <Badge tone="sun" className="mb-3">
                            Cost of doing nothing
                        </Badge>
                        <h2 className="font-display text-3xl md:text-5xl font-bold text-slate-900 mb-4 text-balance">
                            One missed deadline can cost you the whole quarter.
                        </h2>
                        <p className="text-slate-600 max-w-2xl mx-auto text-pretty">
                            Most lost tenders in Kenya are not lost on price. They are lost on
                            an expired TCC, an unsigned BOQ page, the wrong submission
                            envelope, or a 4:58pm scramble that did not make it through the
                            tender box. Here is what changes the day you sign on.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                        <div className="rounded-3xl border border-rose-200/70 bg-rose-50/40 p-6 md:p-8">
                            <div className="flex items-center gap-2 mb-5">
                                <span className="inline-flex size-9 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
                                    <AlertTriangle className="size-5" aria-hidden />
                                </span>
                                <h3 className="font-display text-xl font-bold text-rose-900">
                                    Bidding alone
                                </h3>
                            </div>
                            <ul className="space-y-4">
                                {COST_OF_INACTION.map((row, i) => (
                                    <li
                                        key={i}
                                        className="flex items-start gap-3 text-sm text-slate-700 leading-relaxed"
                                    >
                                        <XCircle
                                            className="size-5 shrink-0 mt-0.5 text-rose-500"
                                            aria-hidden
                                        />
                                        <span>{row.bidding}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="rounded-3xl border border-success-500/30 bg-emerald-50/40 p-6 md:p-8">
                            <div className="flex items-center gap-2 mb-5">
                                <span className="inline-flex size-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                                    <ShieldCheck className="size-5" aria-hidden />
                                </span>
                                <h3 className="font-display text-xl font-bold text-emerald-900">
                                    With Pro Remote Tasks
                                </h3>
                            </div>
                            <ul className="space-y-4">
                                {COST_OF_INACTION.map((row, i) => (
                                    <li
                                        key={i}
                                        className="flex items-start gap-3 text-sm text-slate-800 leading-relaxed"
                                    >
                                        <CheckCircle2
                                            className="size-5 shrink-0 mt-0.5 text-success-500"
                                            aria-hidden
                                        />
                                        <span>{row.prt}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* What we handle */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-12">
                        <Badge tone="brand" className="mb-3">
                            What we handle for you
                        </Badge>
                        <h2 className="font-display text-3xl md:text-5xl font-bold text-slate-900 mb-4 text-balance">
                            Eight things off your desk, on day one.
                        </h2>
                        <p className="text-slate-600 max-w-2xl mx-auto text-pretty">
                            Tender Pro deliverables — the workhorse tier most clients buy.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {PRO_DELIVERABLES.map((item) => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={item.title}
                                    className="rounded-2xl bg-white border border-slate-200/70 p-6 hover:border-brand-300 transition group"
                                >
                                    <div className="size-11 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Icon className="size-5" aria-hidden />
                                    </div>
                                    <h3 className="font-bold text-slate-900 mb-1.5">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        {item.body}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section
                id="pricing"
                className="py-24 bg-white scroll-mt-24"
            >
                <div className="container mx-auto px-4">
                    <div className="text-center mb-14 max-w-3xl mx-auto">
                        <Badge tone="success" className="mb-3">
                            Three tiers. Pay monthly.
                        </Badge>
                        <h2 className="font-display text-3xl md:text-5xl font-bold text-slate-900 mb-4 text-balance">
                            Pick the tier that matches the tenders you chase.
                        </h2>
                        <p className="text-slate-600 text-pretty">
                            Prices in{" "}
                            <span className="font-mono">
                                KES
                            </span>
                            . Month-to-month. Cancel with 15 days notice.
                        </p>
                    </div>
                    <PricingV2 tiers={PRICING_TIERS} serviceName="tender" />
                    {STRATEGIST ? (
                        <p className="mt-6 text-center text-xs text-slate-500 max-w-3xl mx-auto px-4">
                            Strategist tier reserves one client per category per county or
                            parastatal. Confirmed on the discovery call.
                        </p>
                    ) : null}
                </div>
            </section>

            {/* Add-ons */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="md:flex md:items-end md:justify-between mb-10 gap-6">
                        <div>
                            <Badge tone="neutral" className="mb-3">
                                One-off add-ons
                            </Badge>
                            <h2 className="font-display text-2xl md:text-4xl font-bold text-slate-900 text-balance">
                                Need just one piece? Buy it on its own.
                            </h2>
                        </div>
                        <p className="text-sm text-slate-600 max-w-md mt-3 md:mt-0">
                            Useful for non-retainer clients, or when a Tender Pro client needs
                            extra capacity beyond the monthly bid cap.
                        </p>
                    </div>

                    <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.values(TENDER_BUNDLE_ADDONS).map((addon) => (
                            <li
                                key={addon.key}
                                className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-brand-300 transition flex flex-col"
                            >
                                <div className="flex items-start justify-between gap-3 mb-2">
                                    <h3 className="font-bold text-slate-900 leading-snug">
                                        {ADDON_LABELS[addon.key] ?? addon.name}
                                    </h3>
                                    <span className="font-mono tabular-nums text-sm font-bold text-brand-700 whitespace-nowrap">
                                        from KES {addon.priceKES.toLocaleString()}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed flex-1">
                                    {addon.description}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* How a bid runs */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-12">
                        <Badge tone="accent" className="mb-3">
                            How a bid actually runs
                        </Badge>
                        <h2 className="font-display text-3xl md:text-5xl font-bold text-slate-900 mb-4 text-balance">
                            Five steps from onboarding to debrief.
                        </h2>
                        <p className="text-slate-600 max-w-2xl mx-auto text-pretty">
                            What Tender Pro looks like once you sign the engagement letter.
                        </p>
                    </div>
                    <BidTimeline />
                </div>
            </section>

            {/* Trust strip */}
            <section className="py-20 bg-brand-950 text-white bg-grid relative overflow-hidden">
                <div className="absolute inset-0 bg-aurora-dark opacity-40 pointer-events-none" />
                <div className="container mx-auto px-4 max-w-6xl relative z-10">
                    <div className="text-center mb-10">
                        <Badge tone="dark" className="mb-3">
                            Commercial promises
                        </Badge>
                        <h2 className="font-display text-2xl md:text-4xl font-bold text-balance">
                            What we put in writing.
                        </h2>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {TRUST_PROMISES.map((promise) => {
                            const Icon = promise.icon;
                            return (
                                <div
                                    key={promise.title}
                                    className="rounded-2xl border border-white/10 bg-white/5 p-6"
                                >
                                    <span className="inline-flex size-10 items-center justify-center rounded-xl bg-white/10 text-accent-300 mb-4">
                                        <Icon className="size-5" aria-hidden />
                                    </span>
                                    <h3 className="font-bold mb-1.5">{promise.title}</h3>
                                    <p className="text-sm text-slate-300 leading-relaxed">
                                        {promise.body}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <FaqSection items={FAQ_ITEMS} />

            {/* Final CTA */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="relative rounded-[2rem] overflow-hidden conic-border z-0">
                        <div className="relative bg-gradient-to-br from-brand-950 via-brand-900 to-slate-950 rounded-[calc(2rem-2px)] p-12 md:p-16 text-center text-white bg-grid">
                            <Badge tone="dark" className="mb-6">
                                <Sparkles className="size-3" /> Talk to a tender lead
                            </Badge>
                            <h2 className="font-display text-4xl md:text-6xl font-bold mb-5 text-balance">
                                Ready to bid like the firms that{" "}
                                <span className="text-gradient">win?</span>
                            </h2>
                            <p className="text-slate-300 max-w-xl mx-auto mb-10 text-lg">
                                30-minute discovery call, no pitch deck. We will look at your
                                last three lost bids and tell you what we would do
                                differently.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <ButtonLink
                                    href="/hire?service=tender"
                                    variant="primary"
                                    size="xl"
                                >
                                    Talk to sales <ArrowRight className="size-5" />
                                </ButtonLink>
                                <ButtonLink href="#pricing" variant="outline" size="xl">
                                    See packages
                                </ButtonLink>
                            </div>
                            <p className="mt-8 text-xs text-slate-400">
                                Lipa Na M-Pesa Paybill{" "}
                                <span className="font-mono text-slate-200">767363</span> ·
                                Account = your full name. Onboarded within 4 business hours
                                of payment verification.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
