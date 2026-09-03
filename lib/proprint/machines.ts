/**
 * Machine cost profiles and "propose the cheapest machine" — the signature
 * feature of serious estimating tools. Digital bills per click; offset bills
 * plates + make-ready + per-impression. Pure and unit-testable.
 */

export type MachineType = "digital" | "offset";

export interface MachineProfile {
    id: string;
    name: string;
    type: MachineType;
    /** Minimum job charge (applied to the machine's own cost). */
    minCharge: number;
    /** Digital: cost per sheet per side (a "click"). */
    clickPerSide?: number;
    /** Offset: plate cost per side. */
    platePerSide?: number;
    /** Offset: fixed make-ready. */
    makeReady?: number;
    /** Offset: cost per impression (sheet per side). */
    impressionPerSide?: number;
}

export interface MachineEstimate {
    setup: number;
    printCost: number;
    total: number;
    /** Per-sheet-per-side running rate, for mapping into the quote input. */
    perSheetPerSide: number;
}

const nn = (v: number | undefined) => (Number.isFinite(v) && (v as number) > 0 ? (v as number) : 0);

export function estimateMachineCost(profile: MachineProfile, sheets: number, sides: number): MachineEstimate {
    const s = Math.max(0, Math.floor(sheets));
    const d = Math.max(1, Math.floor(sides));
    if (profile.type === "digital") {
        const perSheetPerSide = nn(profile.clickPerSide);
        const printCost = s * d * perSheetPerSide;
        const total = Math.max(nn(profile.minCharge), printCost);
        return { setup: 0, printCost, total, perSheetPerSide };
    }
    const setup = nn(profile.platePerSide) * d + nn(profile.makeReady);
    const perSheetPerSide = nn(profile.impressionPerSide);
    const printCost = s * d * perSheetPerSide;
    const total = Math.max(nn(profile.minCharge), setup + printCost);
    return { setup, printCost, total, perSheetPerSide };
}

export interface MachineChoice {
    profile: MachineProfile;
    estimate: MachineEstimate;
}

/** Pick the machine with the lowest total for this run. Digital usually wins short runs; offset wins long runs. */
export function cheapestMachine(profiles: MachineProfile[], sheets: number, sides: number): MachineChoice | null {
    let best: MachineChoice | null = null;
    for (const profile of profiles) {
        const estimate = estimateMachineCost(profile, sheets, sides);
        if (!best || estimate.total < best.estimate.total) best = { profile, estimate };
    }
    return best;
}

/** Sensible starter profiles for a Kenyan digital-first shop. */
export const DEFAULT_MACHINES: MachineProfile[] = [
    { id: "toner-a3", name: "Toner A3 (digital)", type: "digital", minCharge: 300, clickPerSide: 4 },
    { id: "toner-sra3", name: "Production toner SRA3", type: "digital", minCharge: 500, clickPerSide: 3 },
    { id: "offset-gto", name: "Offset (GTO)", type: "offset", minCharge: 2500, platePerSide: 700, makeReady: 800, impressionPerSide: 0.6 },
];
