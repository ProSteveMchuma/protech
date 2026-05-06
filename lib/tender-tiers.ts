/**
 * Tender management — flagship service tiers and add-ons.
 *
 * Pricing ladder anchored to real Kenyan SME spend patterns:
 *   - Tier 1 is reachable for a sole-prop chasing county supply tenders.
 *   - Tier 2 is the bulk of the market: SMEs that already win some work
 *     but lose bids on technicalities and missed deadlines.
 *   - Tier 3 is for serious bidders chasing KES 20M+ awards where a
 *     win-share fee is justifiable for both sides.
 *
 * No tier promises a win — PPRA marketing rules and basic decency forbid it.
 * We sell process discipline, document compliance, and submitted-on-time bids.
 */

export type TenderBilling = "monthly" | "per-bid" | "hybrid";

export interface TenderObjection {
    objection: string;
    response: string;
}

export interface TenderTier {
    /** URL-safe slug, also used as PACKAGES key when wired into checkout. */
    key: string;
    /** Customer-facing tier name. */
    name: string;
    /** Integer KES. Monthly retainer for "monthly"/"hybrid", per-bid fee for "per-bid". */
    priceKES: number;
    billing: TenderBilling;
    /** One-line outcome promise. No win guarantees. */
    tagline: string;
    /** One-line ideal-customer description. */
    ideal: string;
    /** Concrete deliverables, 5-8 items. */
    included: string[];
    /** Explicit exclusions so scope is unambiguous. */
    notIncluded: string[];
    /** Sales objections we'll hear in discovery calls + the honest response. */
    commonObjections: TenderObjection[];
    /** Optional success fee as a percentage of awarded contract value (higher tiers only). */
    successFee?: number;
    /** Mark the recommended tier in pricing UI. */
    recommended?: boolean;
}

export const TENDER_TIERS: TenderTier[] = [
    {
        // Tier 1 — entry retainer. Priced at ~KES 15k so a sole-prop with
        // 5-20M annual revenue can absorb it without thinking twice.
        // Pure information + compliance hygiene. No bid writing yet.
        key: "tender-watch",
        name: "Tender Watch",
        priceKES: 15000,
        billing: "monthly",
        tagline:
            "Stop missing tenders that fit you. Daily alerts, deadline tracking, document readiness.",
        ideal: "Sole-prop or new SME registered on eGP, chasing county and parastatal supply tenders under KES 5M.",
        included: [
            "Daily tender alerts filtered to your AGPO category and capacity (PPIP, eGP, MyGov, county portals)",
            "Up to 15 matching opportunities surfaced per week with closing-date countdown",
            "Quarterly compliance audit: KRA TCC, NSSF, NHIF, NITA, AGPO, CR12 expiry tracker",
            "eGP supplier profile review and category-mapping advice",
            "Mandatory-document checklist per opportunity (cover letter, PIN, TCC, AGPO, audited accounts)",
            "WhatsApp deadline reminders 72h, 24h, and 4h before submission close",
            "Monthly 30-min strategy call to review pipeline",
        ],
        notIncluded: [
            "Writing technical or financial proposals",
            "Physical or eGP submission of bids",
            "Bid bond facilitation",
            "BOQ pricing or costing support",
            "Post-award contract management",
        ],
        commonObjections: [
            {
                objection: "I already get tender alerts free from MyGov and PPIP.",
                response:
                    "You do — and you're getting 200+ unfiltered alerts a week and missing the three that actually fit you. We filter to your AGPO category, capacity, and location, and we chase the deadline so you don't.",
            },
            {
                objection: "KES 15,000 a month is a lot if I don't win anything.",
                response:
                    "One missed TCC renewal disqualifies you from every tender for 30+ days. The retainer pays for itself the first time we catch an expiring document before a submission.",
            },
            {
                objection: "Can you guarantee I'll win a tender?",
                response:
                    "No, and anyone who promises that is lying — PPRA scoring is the procuring entity's job, not ours. What we guarantee is that you'll submit more bids, on time, with every mandatory document attached.",
            },
        ],
    },
    {
        // Tier 2 — the workhorse. Mid-market retainer where most revenue
        // will come from. Bid writing capped at 4/month because beyond that
        // the unit economics break without a success fee.
        key: "tender-pro",
        name: "Tender Pro",
        priceKES: 65000,
        billing: "monthly",
        tagline:
            "We write, package, and submit your bids. You sign and show up to deliver.",
        ideal: "Established SME (KES 10-50M revenue) already winning some county or parastatal work but losing bids on technicalities and bandwidth.",
        included: [
            "Everything in Tender Watch",
            "Up to 4 full bid submissions per month: technical proposal, financial proposal, BOQ formatting, compliance pack",
            "100% pre-submission compliance check against PPADA 2015 mandatory-documents list",
            "Bid bond facilitation: introductions to 2-3 partner banks/insurers (you pay the bond cost separately)",
            "eGP and physical submission handling, with stamped delivery receipt",
            "Past-performance and reference-letter library maintained for you",
            "Loss-debrief request to procuring entity after every unsuccessful bid",
            "Bi-weekly 45-min pipeline and pricing-strategy call",
        ],
        notIncluded: [
            "Bid bond cash or premium (paid directly to bank/insurer)",
            "AGPO certificate facilitation (separate add-on)",
            "Joint-venture agreement drafting (we coordinate with your lawyer)",
            "PPARB appeals or procurement litigation",
            "Bids above KES 20M contract value (move to Tender Strategist)",
        ],
        commonObjections: [
            {
                objection: "KES 65,000 a month is the cost of a junior staff hire.",
                response:
                    "A junior staff hire doesn't know PPADA 2015, can't read a BOQ trap, and won't catch an unsigned page at 11pm before submission. We replace ~40 hours of bid-prep work a month, not a generalist desk.",
            },
            {
                objection: "What if you miss a submission deadline?",
                response:
                    "We commit to a 48-hour internal cutoff before every public deadline. If we miss a submission window we caused, that bid month is free. We track this publicly in your monthly report.",
            },
            {
                objection: "My bids are confidential — pricing especially.",
                response:
                    "Standard. We sign an NDA at onboarding, store financials in a per-client encrypted folder, and only the assigned tender lead sees your numbers. We do not bid against you on any tender, ever.",
            },
            {
                objection: "Why only 4 bids a month?",
                response:
                    "Because more than 4 means rushed work and lost technicalities — exactly what you're hiring us to fix. If you genuinely need 6-8 bids/month, that's Tender Strategist territory.",
            },
        ],
        recommended: true,
    },
    {
        // Tier 3 — high-touch + success fee. Retainer covers the floor;
        // the 3% success fee is what makes deep strategic work viable on
        // KES 20M+ contracts. Capped fee on very large wins keeps it sane.
        key: "tender-strategist",
        name: "Tender Strategist",
        priceKES: 180000,
        billing: "hybrid",
        successFee: 3,
        tagline:
            "Senior bid strategy, joint-venture structuring, and unlimited submissions for serious bidders.",
        ideal: "Established firm targeting KES 20M+ awards, framework contracts, or multi-year ministry/parastatal supply deals.",
        included: [
            "Everything in Tender Pro, with no monthly bid cap",
            "Senior bid lead assigned, plus a writer and a compliance officer",
            "Strategic shortlist: we pick the 6-10 tenders/quarter you should chase, not just match",
            "Joint-venture and sub-contracting structuring with capacity/financial-eligibility modelling",
            "Pricing strategy: BOQ benchmarking against past awards on PPIP for the same category",
            "Pre-bid clarification questions drafted and submitted on your behalf",
            "Post-award handover: LPO chasing, performance-bond coordination, invoicing schedule setup",
            "PPARB review-and-appeal coordination with your advocate when grounds exist",
            "Monthly executive review with founder/MD and our head of tenders",
        ],
        notIncluded: [
            "Cash for bid bonds, performance bonds, or advance-payment guarantees",
            "Legal fees for PPARB appeals (we coordinate; your advocate represents)",
            "Project delivery, staffing, or fulfilment of awarded contracts",
            "Lobbying, facilitation payments, or anything that touches PPADA s.66 conflict-of-interest rules",
        ],
        commonObjections: [
            {
                objection: "180k retainer plus 3% success fee feels like double-charging.",
                response:
                    "The retainer covers a 3-person team chasing your pipeline whether you win or lose this month. The success fee aligns us with your outcome on the wins that justify it. On a KES 30M award, our 3% (KES 900k) is less than what most bid consultants quote upfront with no skin in the game.",
            },
            {
                objection: "What's the cap on the success fee?",
                response:
                    "3% on the first KES 50M of any single award, 1.5% on the portion above that, capped at KES 3M per award. We'd rather you keep winning and refer us than feel gouged on one big contract.",
            },
            {
                objection: "Can you really represent me on PPARB appeals?",
                response:
                    "We coordinate the file, draft the technical grounds, and brief your advocate. PPARB representation itself is your lawyer's job — anyone telling you otherwise doesn't understand s.167 of PPADA 2015.",
            },
            {
                objection: "How do I know you're not running the same playbook for my competitor?",
                response:
                    "We accept one client per category per county/parastatal at the Strategist tier. It's in our onboarding contract. If we already have a client bidding for KeNHA roadworks in your category, we tell you on the discovery call.",
            },
        ],
    },
];

export interface TenderAddon {
    key: string;
    name: string;
    priceKES: number;
    description: string;
}

/** One-off services for clients on any retainer (or none). Priced to be useful, not extractive. */
export const TENDER_BUNDLE_ADDONS: Record<string, TenderAddon> = {
    "rush-bid": {
        key: "rush-bid",
        name: "Single Bid Rush",
        priceKES: 35000,
        description:
            "One full bid submission inside 5 working days: technical proposal, BOQ formatting, compliance pack, eGP or physical submission. For non-retainer clients or extra bids beyond the Pro cap.",
    },
    "agpo-facilitation": {
        key: "agpo-facilitation",
        name: "AGPO Certificate Facilitation",
        priceKES: 8000,
        description:
            "End-to-end AGPO application handling: eligibility check, document assembly (CR12, IDs, PINs, ownership proof), online submission on agpo.go.ke, follow-up with Treasury until issued. Government fee is zero — you only pay our facilitation. Typical turnaround 5-14 working days.",
    },
    "egp-onboarding": {
        key: "egp-onboarding",
        name: "eGP Supplier Onboarding",
        priceKES: 12000,
        description:
            "Full registration on egpkenya.go.ke: KRA PIN linking, category mapping, document upload, profile optimisation, and a 30-min walkthrough of the supplier dashboard so your team can use it without us.",
    },
    "bid-bond-facilitation": {
        key: "bid-bond-facilitation",
        name: "Bid Bond Facilitation",
        priceKES: 5000,
        description:
            "Introduction and document packaging for 2-3 partner banks or insurers issuing tender securities. Bond premiums (typically 0.5-2% of bid value) and any collateral are paid by you directly to the issuer.", // TODO: verify current partner-bank issuance rates each year
    },
    "compliance-audit": {
        key: "compliance-audit",
        name: "One-Off Compliance Audit",
        priceKES: 10000,
        description:
            "Standalone review of your full document stack — KRA TCC, NSSF, NHIF, NITA, AGPO, CR12, audited accounts, business permits — with an expiry calendar and gap-fix list. Useful before a big bid push or after a disqualification.",
    },
    "loss-debrief": {
        key: "loss-debrief",
        name: "Lost-Bid Debrief & Rework",
        priceKES: 15000,
        description:
            "We request the evaluation report from the procuring entity under PPADA s.67, analyse where you lost points, and rewrite the relevant sections of your standard bid template so you don't repeat the same mistake.",
    },
    "jv-structuring": {
        key: "jv-structuring",
        name: "Joint Venture Structuring",
        priceKES: 45000,
        description:
            "Capacity and financial-eligibility modelling for a JV bid, draft JV memorandum of understanding (your lawyer finalises), and combined past-performance pack. Useful when a tender requires capacity you don't have alone.",
    },
};
