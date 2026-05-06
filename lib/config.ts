/**
 * Public business config used across the site.
 * Override via environment variables in production.
 */
export const business = {
    name: "Pro Remote Tasks",
    short: "PRT",
    tagline: "World-class talent. Kenyan rates. Zero hassle.",
    domain: "proremotetasks.co.ke",
    paybill: process.env.MPESA_PAYBILL || "767363",
    /** Phone shown on contact / WhatsApp button (E.164 without +). */
    whatsapp: process.env.WHATSAPP_NUMBER || "",
    supportEmail: process.env.SUPPORT_EMAIL || "hello@proremotetasks.co.ke",
};

export const PACKAGES: Record<
    string,
    { service: string; tier: string; amount: number }
> = {
    "tender-watch": { service: "Tender Management", tier: "Tender Watch", amount: 15000 },
    "tender-pro": { service: "Tender Management", tier: "Tender Pro", amount: 65000 },
    "tender-strategist": { service: "Tender Management", tier: "Tender Strategist", amount: 180000 },
    "va-starter": { service: "Virtual Assistant", tier: "Starter VA", amount: 25000 },
    "va-growth": { service: "Virtual Assistant", tier: "Growth VA", amount: 40000 },
    "va-executive": { service: "Virtual Assistant", tier: "Executive VA", amount: 75000 },
};
