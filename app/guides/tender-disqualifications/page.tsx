import { cookies } from "next/headers";
import Link from "next/link";
import {
    AlertTriangle,
    ArrowRight,
    CheckCircle2,
    FileText,
    Printer,
    ShieldCheck,
    Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { EmailGate } from "@/components/EmailGate";
import { PrintGuideButton } from "@/components/PrintGuideButton";
import { TENDER_TIERS } from "@/lib/tender-tiers";
import { GUIDE_COOKIE } from "@/lib/lead-magnet";

import "./guide.css";

export const metadata = {
    title: "10 reasons Kenyan SMEs get disqualified from tenders",
    description:
        "Free guide: the ten most common ways Kenyan SMEs lose government tenders before evaluation even starts — expired KRA TCC, missing AGPO, BOQ math errors, late submission — and how to avoid every one. Written by the Pro Remote Tasks tender desk, anchored in PPADA 2015.",
    alternates: { canonical: "/guides/tender-disqualifications" },
    openGraph: {
        title: "10 reasons Kenyan SMEs get disqualified from tenders",
        description:
            "The 10 most common technical disqualifications on Kenyan public tenders, and the checklist to avoid each one. Free guide from Pro Remote Tasks.",
        type: "article",
        url: "/guides/tender-disqualifications",
    },
    twitter: {
        card: "summary_large_image",
        title: "10 reasons Kenyan SMEs get disqualified from tenders",
        description:
            "Free guide. PPADA 2015 anchored. Written by the Pro Remote Tasks tender desk.",
    },
};

interface Reason {
    id: string;
    title: string;
    whatHappens: string;
    example: { entity: string; story: string };
    avoid: string[];
}

const REASONS: Reason[] = [
    {
        id: "kra-tcc",
        title: "Expired KRA Tax Compliance Certificate at submission",
        whatHappens:
            "A current Tax Compliance Certificate from KRA is a mandatory document on virtually every Kenyan public tender — it is one of the basic eligibility requirements under PPADA 2015 (s.55). The certificate is valid for 12 months. Evaluators check the issue and expiry dates on the cover; if it has lapsed by even one day at the bid-opening date, the bid is rejected at preliminary evaluation before the technical envelope is ever scored.",
        example: {
            entity: "County Government of Nakuru — general supplies",
            story:
                "An SME submitted a strong technical proposal and the lowest financial bid for a KES 3.2M stationery supply tender. Their TCC had expired four days before the bid-opening date. The evaluation committee disqualified them at preliminary evaluation and awarded the contract to the second-lowest bidder.",
        },
        avoid: [
            "Renew on iTax 30 days before expiry — the system reissues in minutes if your tax filings are clean.",
            "Calendar every staff member who handles bids with the TCC expiry date.",
            "Attach a fresh PDF print of the certificate, not a months-old scan, with every bid.",
            "If you have an outstanding KRA balance, clear or set up an installment plan now — TCC issuance blocks until you do.",
        ],
    },
    {
        id: "agpo",
        title: "AGPO certificate missing or expired on AGPO-reserved tenders",
        whatHappens:
            "AGPO (Access to Government Procurement Opportunities) reserves 30% of public tenders for enterprises owned by women, youth (18 to 35), and persons with disabilities. If a tender is marked AGPO-only, you must submit a current AGPO certificate issued by the National Treasury. No certificate, or an expired one, equals automatic disqualification at preliminary evaluation. The certificate has a defined validity period — confirm yours on agpo.go.ke before submission rather than going by memory.",
        example: {
            entity: "Ministry of Health — youth-reserved supply lot",
            story:
                "A youth-owned ICT firm bid on a hospital-equipment supply tender reserved for AGPO. Their certificate had lapsed three weeks earlier. The procuring entity disqualified the bid at preliminary evaluation. The owner was still under 35 and fully eligible — the renewal had simply been missed.",
        },
        avoid: [
            "Log in to agpo.go.ke today and note your certificate expiry date.",
            "Renew before expiry; the application is free and typically takes 5 to 14 working days.",
            "Keep a fresh CR12, IDs, KRA PINs and ownership proof in one folder for renewals.",
            "If a director ages out past 35 (youth category), restructure ownership before your next renewal — do not wait until rejection.",
        ],
    },
    {
        id: "unsigned-pages",
        title: "Unsigned or uninitialed pages on the bid documents",
        whatHappens:
            "Most Kenyan tender documents require every page of the bid — including the BOQ, technical proposal, and form of tender — to be signed or initialed by an authorised signatory, with the company stamp where indicated. Evaluation committees flip through the entire submission at the preliminary stage. A single unsigned BOQ page or a missing initial on the form of tender is grounds for disqualification under the procuring entity's instructions to bidders, and they exercise it routinely.",
        example: {
            entity: "Kenya Power — civil works contractor",
            story:
                "A contractor submitted a 240-page bid for a substation works tender. The team rushed the final binding the night before submission and missed initialling pages 187 to 192 of the BOQ. The bid was disqualified at preliminary evaluation despite being technically responsive.",
        },
        avoid: [
            "Use a signing checklist: form of tender, every BOQ page, every technical-proposal page, declarations.",
            "Sign in blue ink so signatures stay visible on a black-and-white photocopy.",
            "Stamp where stamping is required (cover, form of tender, declarations) — not just the cover.",
            "Have a second person flip every page after signing as a four-eyes check before binding.",
        ],
    },
    {
        id: "boq-math",
        title: "Mathematical errors in the Bills of Quantities",
        whatHappens:
            "BOQ arithmetic errors — a wrong unit-rate multiplied out, an extension that does not equal quantity times rate, totals that do not sum across the page — are corrected by the evaluation committee under PPADA 2015. The procuring entity is allowed to amend the figures and the bidder is bound by the corrected total, even if it sinks the bid. In practice, large discrepancies often lead the committee to declare the bid non-responsive and disqualify it outright as 'major arithmetical errors'.",
        example: {
            entity: "Kenya Rural Roads Authority — gravelling works",
            story:
                "A medium-sized contractor priced 18 BOQ items for a county feeder-road job. Two unit-rate extensions were typed manually rather than formula-linked. Quantity x rate did not match the extension on those two lines, totalling a KES 380,000 discrepancy. The committee corrected the bid downward, then declared it non-responsive on the grounds of 'major arithmetical inconsistency' and moved to the next bidder.",
        },
        avoid: [
            "Use formula-linked spreadsheets for every BOQ — never type a total manually.",
            "Cross-check that page totals roll up to the grand summary before printing.",
            "Have a second estimator audit unit rates and extensions on a fresh copy.",
            "If the issued BOQ is a locked PDF, retype into a clean spreadsheet with formulas, then transfer numbers to the official format last.",
        ],
    },
    {
        id: "late-submission",
        title: "Submission after the deadline (sometimes by minutes)",
        whatHappens:
            "Procuring entities are required to reject any bid received after the deadline stated in the tender notice. There is no grace window. On eGP, the portal closes automatically — if you click submit at the moment the clock turns, the system records you as late. For physical submissions, the tender box is locked at the stated time; bids handed over even five minutes later are returned unopened. PPADA s.78 codifies this and the appeals board has consistently upheld it.",
        example: {
            entity: "Kenya Pipeline Company — fuel-handling equipment",
            story:
                "A supplier raced to deliver a physical bid through Nairobi traffic and reached the office at 10.07am — seven minutes after the 10.00am deadline. The procurement officer sealed the tender box at exactly 10.00am. The bid was returned unopened that afternoon, a KES 14M opportunity gone for the price of a delayed boda-boda.",
        },
        avoid: [
            "Set an internal deadline 48 hours before the public deadline. Treat it as the real one.",
            "For eGP, click submit at least 4 hours before close — uploads time out, browsers crash.",
            "For physical submissions, dispatch the day before with a return-path receipt.",
            "Keep the stamped acknowledgement slip — that is your proof you were in the box on time.",
        ],
    },
    {
        id: "mandatory-forms",
        title: "Missing or wrong-format mandatory forms",
        whatHappens:
            "Every Kenyan public tender lists a set of mandatory documents at the preliminary-evaluation stage: certificate of incorporation or business registration, CR12 (current — typically issued within 6 to 12 months of submission, depending on the entity), KRA PIN, valid TCC, valid business permit for the relevant county, NSSF and NHIF compliance, and the tender-specific declaration forms. Missing one — or supplying a CR12 the registrar issued 18 months ago when the tender requires a recent one — is a one-line disqualification. The bid is dead before the technical envelope is opened.",
        example: {
            entity: "Nairobi City County — cleaning services framework",
            story:
                "A cleaning firm with three years of strong delivery history submitted a complete bid except their CR12 was 14 months old. The instructions to bidders required a CR12 dated within six months of the deadline. Disqualified at preliminary evaluation; their incumbency on the previous contract was not enough to save the bid.",
        },
        avoid: [
            "Build a single 'mandatory pack' folder updated quarterly: cert of incorporation, recent CR12, KRA PIN, TCC, NSSF, NHIF, NITA, business permit.",
            "Read the instructions to bidders for the specific issue-date windows on each document — they vary.",
            "Order a fresh CR12 from BRS the same week you start a bid; it is cheap and quick.",
            "Match form formats exactly — if the entity supplies a tender-form template, fill that template, not your own.",
        ],
    },
    {
        id: "bid-bond",
        title: "Bid bond issued by a non-listed bank/insurer or in the wrong format",
        whatHappens:
            "Most works and high-value supply tenders require a bid bond — typically 1 to 2 percent of the bid value — issued by a bank or insurer the procuring entity recognises. Bonds from unlisted insurers, or in a format that does not match the template in the tender document, get rejected at preliminary evaluation. The same is true if the validity period is shorter than required, or if the bond is in the wrong name, wrong amount, or addressed to the wrong procuring entity.",
        example: {
            entity: "Kenya Urban Roads Authority — drainage construction",
            story:
                "A contractor supplied a bid bond from an insurer that was not on the procuring entity's approved list. The bond amount and validity were correct, but the issuer was not. The bid was disqualified at preliminary evaluation. Switching the bond to a recognised issuer would have taken three working days had the contractor asked earlier.",
        },
        avoid: [
            "Confirm the procuring entity's approved bank and insurer list before requesting the bond.",
            "Use the bond template included in the tender document verbatim — do not let the issuer reword it.",
            "Check three numbers on the bond: amount, validity period, and beneficiary name.",
            "Allow at least a week for issuance; rush bonds invite errors and sometimes get refused outright.",
        ],
    },
    {
        id: "audited-financials",
        title: "Audited financials missing for the years the tender requires",
        whatHappens:
            "Tenders above a certain threshold require audited financial statements — usually the last two or three years — signed by a registered auditor. Bidders fail this requirement in three ways: missing one of the required years, supplying management accounts instead of audited statements, or supplying audits signed by an auditor who is not a registered ICPAK member. Any of the three lands the bid in the disqualified pile at preliminary evaluation.",
        example: {
            entity: "Parastatal corporation — IT services contract",
            story:
                "A growing IT firm bid on a three-year support contract that required audited financials for the last three years. Their most recent audit was nine months overdue with their accountant. They submitted two audited years and one set of management accounts. Disqualified at preliminary evaluation despite a strong technical proposal.",
        },
        avoid: [
            "Close audits within 6 months of year-end — chasing them at bid time costs you tenders.",
            "Use a registered ICPAK auditor; the procuring entity sometimes verifies the practising certificate.",
            "Keep three years of signed audits scanned in one folder, ready to attach.",
            "If a year is genuinely missing, decide before submission whether to pass on the bid rather than submit a flawed pack.",
        ],
    },
    {
        id: "wrong-category",
        title: "Bidding outside your registered AGPO or supplier category",
        whatHappens:
            "On eGP and on most procuring entities' supplier rolls, you are registered against specific category codes — for example general supplies, ICT equipment, civil works class NCA-7, or medical consumables. Bidding for a tender that falls outside the category you are registered in (or, for AGPO, outside the categories your AGPO certificate covers) is a fast preliminary-evaluation rejection. The procuring entity is not required to consider whether you are technically capable; the registration mismatch alone disqualifies you.",
        example: {
            entity: "Ministry-level supply tender — laboratory equipment",
            story:
                "A general-supplies firm bid on a laboratory-equipment tender. They had supplied similar items informally before, but were not registered under medical or laboratory equipment on eGP. Disqualified at preliminary evaluation on category mismatch. Adding the category to their eGP profile would have taken a few days had they done it before bidding.",
        },
        avoid: [
            "Audit your eGP supplier categories quarterly — add categories you are growing into.",
            "For NCA-classified works, confirm the class number required by the tender against your current registration.",
            "Match AGPO certificate categories to the tender's category before you start writing the bid.",
            "If the category is genuinely wrong for you, walk away — submitting anyway is wasted effort.",
        ],
    },
    {
        id: "site-visit",
        title: "No-show at a mandatory site visit or pre-bid clarification meeting",
        whatHappens:
            "Many works, services, and complex-supply tenders include a mandatory site visit or pre-bid clarification meeting. Attendance is recorded by signature, and a stamped certificate of attendance is issued. Bids submitted without the certificate — when the tender document marked the visit as mandatory — are disqualified at preliminary evaluation. The same applies to pre-bid clarification meetings flagged as compulsory.",
        example: {
            entity: "Sub-county hospital — minor renovation works",
            story:
                "A small contractor read the tender, prepared a strong bid, and submitted on time. They had skipped the mandatory site visit, assuming photos online would be enough. Their bid was returned at preliminary evaluation because the attendance certificate was missing. The award went to a less experienced contractor who had walked the site.",
        },
        avoid: [
            "Read the instructions to bidders for the words 'mandatory' or 'compulsory' against site visit and pre-bid meeting.",
            "Attend in person where possible; dispatch a designated representative with a written authorisation if not.",
            "Collect the stamped attendance certificate the same day — do not leave without it.",
            "Use the visit to ask questions you would otherwise put in writing during the clarification window.",
        ],
    },
];

export default async function TenderDisqualificationsGuide() {
    const cookieStore = await cookies();
    const unlocked = cookieStore.get(GUIDE_COOKIE)?.value === "1";

    return (
        <article className="guide-root bg-white">
            {/* Hero */}
            <header className="bg-brand-950 bg-grid text-white pt-20 pb-20 md:pt-24 md:pb-24 relative overflow-hidden guide-hero">
                <div className="absolute inset-0 bg-aurora-dark opacity-50 pointer-events-none" />
                <div className="container mx-auto px-4 relative z-10 max-w-3xl">
                    <Badge tone="sun" className="mb-5">
                        Free Guide · Pro Remote Tasks
                    </Badge>
                    <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.05] mb-5 text-balance">
                        10 reasons Kenyan SMEs get disqualified from tenders
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-2xl mb-8 text-pretty">
                        And how to avoid every one. Written by the Pro Remote Tasks tender
                        desk, anchored in PPADA 2015 and the rules procuring entities
                        actually apply at preliminary evaluation.
                    </p>
                    <ul className="flex flex-wrap gap-2 text-xs font-mono">
                        {["PPADA 2015", "AGPO", "eGP", "KRA TCC", "BOQ", "Bid bonds"].map(
                            (tag) => (
                                <li
                                    key={tag}
                                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-slate-200"
                                >
                                    <span className="size-1.5 rounded-full bg-success-500" />
                                    {tag}
                                </li>
                            )
                        )}
                    </ul>
                    {unlocked && (
                        <div className="mt-10 flex flex-wrap gap-3 items-center">
                            <PrintGuideButton variant="primary" />
                            <p className="text-xs text-slate-400 max-w-sm">
                                Tip: in the print dialog choose &ldquo;Save as PDF&rdquo; as the
                                destination. Margins, default. Background graphics, on.
                            </p>
                        </div>
                    )}
                </div>
            </header>

            {/* Intro / TOC */}
            <section className="py-14 bg-white guide-section">
                <div className="container mx-auto px-4 max-w-3xl">
                    <p className="text-slate-700 text-lg leading-relaxed mb-8">
                        Most lost Kenyan tenders are not lost on price or on technical
                        merit. They are lost on technicalities at preliminary evaluation —
                        an expired certificate, an unsigned page, a BOQ math slip, a bid
                        bond from the wrong insurer. Below are the ten failures we see most
                        often when SMEs ask us to review a lost bid. Each one is fixable in
                        a working week.
                    </p>
                    <ol className="grid sm:grid-cols-2 gap-2 text-sm border border-slate-200 rounded-2xl p-5 bg-slate-50/60">
                        {REASONS.map((r, i) => (
                            <li key={r.id} className="flex gap-2 text-slate-700">
                                <span className="font-mono tabular-nums text-slate-400 shrink-0 w-6">
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                                <a
                                    href={`#reason-${i + 1}`}
                                    className="hover:text-brand-700 transition"
                                >
                                    {r.title}
                                </a>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            <div className={unlocked ? "" : "guide-locked"} aria-hidden={!unlocked}>
                {/* The reasons */}
                <section className="bg-white guide-reasons">
                    <div className="container mx-auto px-4 max-w-3xl">
                        {REASONS.map((reason, i) => (
                            <div
                                key={reason.id}
                                id={`reason-${i + 1}`}
                                className="reason-block py-14 border-t border-slate-200 first:border-t-0 first:pt-0 scroll-mt-24"
                            >
                                <div className="flex items-start gap-5 mb-6">
                                    <div className="shrink-0 size-20 md:size-24 rounded-2xl bg-brand-100 text-brand-700 font-display font-bold text-5xl md:text-6xl flex items-center justify-center leading-none reason-numeral">
                                        {String(i + 1).padStart(2, "0")}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-1">
                                            Reason {i + 1} of 10
                                        </p>
                                        <h2 className="font-display text-2xl md:text-3xl font-bold text-slate-900 leading-tight text-balance">
                                            {reason.title}
                                        </h2>
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <div>
                                        <h3 className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-2 inline-flex items-center gap-1.5">
                                            <AlertTriangle className="size-3.5" aria-hidden />
                                            What happens
                                        </h3>
                                        <p className="text-slate-700 leading-relaxed">
                                            {reason.whatHappens}
                                        </p>
                                    </div>

                                    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 reason-example">
                                        <h3 className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-2 inline-flex items-center gap-1.5">
                                            <FileText className="size-3.5" aria-hidden />
                                            Example
                                        </h3>
                                        <p className="text-sm font-bold text-slate-900 mb-1">
                                            {reason.example.entity}
                                        </p>
                                        <p className="text-sm text-slate-700 leading-relaxed">
                                            {reason.example.story}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-3 inline-flex items-center gap-1.5">
                                            <ShieldCheck className="size-3.5" aria-hidden />
                                            How to avoid this
                                        </h3>
                                        <ul className="space-y-2">
                                            {reason.avoid.map((item, idx) => (
                                                <li
                                                    key={idx}
                                                    className="flex items-start gap-2.5 text-slate-700 leading-relaxed"
                                                >
                                                    <CheckCircle2
                                                        className="size-5 shrink-0 mt-0.5 text-success-500"
                                                        aria-hidden
                                                    />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* What we do about it — soft CTA back to tender tiers */}
                <section className="py-20 bg-slate-50 guide-section">
                    <div className="container mx-auto px-4 max-w-3xl">
                        <Badge tone="brand" className="mb-3">
                            What we do about it
                        </Badge>
                        <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-3 text-balance">
                            None of this is hard. It is just consistent.
                        </h2>
                        <p className="text-slate-700 leading-relaxed mb-8">
                            Every disqualification above is a checklist failure under time
                            pressure. The Pro Remote Tasks tender desk runs that checklist
                            for you on every bid — across three tiers, depending on how much
                            of the bid lifecycle you want off your desk.
                        </p>
                        <div className="grid md:grid-cols-3 gap-4">
                            {TENDER_TIERS.map((tier) => (
                                <Link
                                    key={tier.key}
                                    href={`/services/tender#pricing`}
                                    className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-brand-300 transition flex flex-col"
                                >
                                    <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-1">
                                        {tier.recommended ? "Most chosen" : "Tier"}
                                    </p>
                                    <h3 className="font-display font-bold text-slate-900 text-xl mb-1">
                                        {tier.name}
                                    </h3>
                                    <p className="font-mono tabular-nums text-sm text-brand-700 font-bold mb-3">
                                        KES {tier.priceKES.toLocaleString()}/mo
                                    </p>
                                    <p className="text-sm text-slate-600 leading-relaxed flex-1">
                                        {tier.tagline}
                                    </p>
                                    <span className="inline-flex items-center gap-1 text-sm text-brand-700 font-semibold mt-4">
                                        See what&rsquo;s included
                                        <ArrowRight className="size-4" />
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Print/Save callout */}
                {unlocked && (
                    <section className="py-16 bg-white guide-section guide-print-callout">
                        <div className="container mx-auto px-4 max-w-3xl">
                            <div className="rounded-3xl border border-slate-200 bg-slate-50/60 p-8 md:p-10 flex flex-col md:flex-row gap-6 md:items-center">
                                <div className="size-14 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center shrink-0">
                                    <Printer className="size-6" aria-hidden />
                                </div>
                                <div className="flex-1">
                                    <h2 className="font-display text-xl md:text-2xl font-bold text-slate-900 mb-1">
                                        Want this guide as a PDF?
                                    </h2>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        Print this page and choose &ldquo;Save as PDF&rdquo; as the
                                        destination in your browser. The print stylesheet hides the
                                        navigation, gate, and buttons — you get a clean document
                                        you can email to your bid team.
                                    </p>
                                </div>
                                <PrintGuideButton variant="dark" label="Save as PDF" />
                            </div>
                        </div>
                    </section>
                )}

                {/* Final CTA */}
                <section className="py-20 bg-white guide-section guide-final-cta">
                    <div className="container mx-auto px-4 max-w-3xl">
                        <div className="relative rounded-[2rem] overflow-hidden conic-border z-0">
                            <div className="relative bg-gradient-to-br from-brand-950 via-brand-900 to-slate-950 rounded-[calc(2rem-2px)] p-10 md:p-14 text-center text-white bg-grid">
                                <Badge tone="dark" className="mb-5">
                                    <Sparkles className="size-3" /> Talk to a tender lead
                                </Badge>
                                <h2 className="font-display text-3xl md:text-5xl font-bold mb-4 text-balance">
                                    Bring us your last lost bid.
                                </h2>
                                <p className="text-slate-300 max-w-xl mx-auto mb-8 text-base md:text-lg">
                                    30-minute call, no pitch deck. We will tell you which of these
                                    ten reasons cost you the bid and what we would do differently
                                    on the next submission.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <ButtonLink
                                        href="/hire?service=tender&utm_source=lead-magnet"
                                        variant="primary"
                                        size="xl"
                                    >
                                        Talk to us <ArrowRight className="size-5" />
                                    </ButtonLink>
                                    <ButtonLink
                                        href="/services/tender"
                                        variant="outline"
                                        size="xl"
                                    >
                                        See packages
                                    </ButtonLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Gate — only renders when locked */}
            {!unlocked && <EmailGate />}
        </article>
    );
}
