/**
 * Plan → feature entitlements. Pure and framework-free so it can run on the
 * server (gating APIs), the client (hiding paid UI), and in unit tests.
 *
 * The core tools stay free forever — gating only ever applies to convenience
 * and paid add-ons (cloud sync, branded output, QR serials, batch, etc.).
 */

export type PlanId = "free" | "tool-pro" | "prepress" | "shop";

export type Feature =
    | "cloudSave"
    | "brandedPdf"
    | "qrSerials"
    | "batchExport"
    | "multiLineQuotes"
    | "machineCatalog"
    | "teamWorkspace";

export const FEATURES: Feature[] = [
    "cloudSave",
    "brandedPdf",
    "qrSerials",
    "batchExport",
    "multiLineQuotes",
    "machineCatalog",
    "teamWorkspace",
];

/** What each paid plan unlocks. Higher tiers are supersets of lower ones. */
const PLAN_FEATURES: Record<PlanId, Feature[]> = {
    free: [],
    "tool-pro": ["cloudSave", "brandedPdf", "batchExport"],
    prepress: ["cloudSave", "brandedPdf", "batchExport", "qrSerials", "multiLineQuotes", "machineCatalog"],
    shop: ["cloudSave", "brandedPdf", "batchExport", "qrSerials", "multiLineQuotes", "machineCatalog", "teamWorkspace"],
};

/** Maps the paybill PACKAGES keys (lib/config.ts) to plan ids. */
export function planFromPackageKey(key: string | null | undefined): PlanId {
    switch (key) {
        case "serialpro-monthly":
            return "tool-pro";
        case "prepress-monthly":
            return "prepress";
        case "shop-monthly":
            return "shop";
        default:
            return "free";
    }
}

export function planFeatures(plan: PlanId): Feature[] {
    return PLAN_FEATURES[plan] ?? [];
}

export function hasEntitlement(plan: PlanId | null | undefined, feature: Feature): boolean {
    if (!plan) return false;
    return planFeatures(plan).includes(feature);
}

/** The lowest-cost plan that unlocks a feature — used to prompt an upgrade. */
export function minimumPlanFor(feature: Feature): PlanId {
    const order: PlanId[] = ["tool-pro", "prepress", "shop"];
    return order.find((plan) => PLAN_FEATURES[plan].includes(feature)) ?? "shop";
}

export const PLAN_LABELS: Record<PlanId, string> = {
    free: "Free",
    "tool-pro": "Tool Pro",
    prepress: "Prepress",
    shop: "Shop",
};

export const FEATURE_LABELS: Record<Feature, string> = {
    cloudSave: "Cloud-saved jobs & presets",
    brandedPdf: "Branded quote & invoice PDF",
    qrSerials: "QR / barcode serials",
    batchExport: "Large-run batch export",
    multiLineQuotes: "Multi-line quotes",
    machineCatalog: "Machine & stock catalog",
    teamWorkspace: "Team workspace",
};
