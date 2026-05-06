"use client";

/**
 * BidProcess — client wrapper for the 5-step bid timeline.
 *
 * Lives here (not on page.tsx) because Lucide icon components are
 * functions and Next refuses to serialize them across the Server →
 * Client boundary. Putting `BID_STEPS` inside a `"use client"` module
 * keeps the icons on the client side end-to-end.
 */

import {
    BellRing,
    ClipboardCheck,
    FileText,
    LineChart,
    Send,
} from "lucide-react";

import { ProcessStory, type ProcessStep } from "@/components/ScrollStory";

const BID_STEPS: ProcessStep[] = [
    {
        icon: ClipboardCheck,
        title: "Onboarding & document audit.",
        desc: "Week one we pull your KRA TCC, NSSF, NHIF, NITA, AGPO, CR12, audited accounts, and past performance into one source of truth — and flag every expiry before it costs you a bid.",
        cue: "TCC valid · NSSF current · AGPO renewing in 41 days · CR12 dated.",
    },
    {
        icon: BellRing,
        title: "Pipeline matching.",
        desc: "Daily sweeps across PPIP, eGP, MyGov, and county portals. Only the tenders that fit your AGPO category, capacity, and location reach your WhatsApp.",
        cue: "MOH/SUP/2026-014 — Medical supplies, Nakuru. Closes Fri 4:30pm.",
    },
    {
        icon: FileText,
        title: "Pre-bid: write & compliance check.",
        desc: "Technical proposal, financial proposal, BOQ formatted to the procuring entity's template, and a 100% line-by-line check against the PPADA 2015 mandatory-documents list.",
        cue: "Technical: 28 pages. BOQ: 14 line items. Compliance: 9/9.",
    },
    {
        icon: Send,
        title: "Submission with stamped receipt.",
        desc: "eGP upload or hand-delivery to the tender box. Internal cutoff is always 48 hours before the public deadline. We do not file at 4:58pm.",
        cue: "Stamped 4:12pm. Receipt #2026-014-0387. You're in.",
    },
    {
        icon: LineChart,
        title: "Win or loss — debrief either way.",
        desc: "Win: we coordinate LPO, performance bond, and invoicing. Loss: we file a PPADA s.67 debrief request and rewrite the weak sections so the next bid scores higher.",
        cue: "s.67 debrief filed · technical 62/70 · financial 28/30 · rewrite drafted.",
    },
];

export function BidProcess() {
    return <ProcessStory steps={BID_STEPS} />;
}
