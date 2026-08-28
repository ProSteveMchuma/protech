import type { SheetPreset } from "./types";

export const MM_TO_PT = 72 / 25.4;

export const SHEET_PRESETS = {
  A4: { label: "A4 · 210 × 297 mm", widthMm: 210, heightMm: 297 },
  A3: { label: "A3 · 297 × 420 mm", widthMm: 297, heightMm: 420 },
  SRA3: { label: "SRA3 · 320 × 450 mm", widthMm: 320, heightMm: 450 },
  "12x18": { label: "12 × 18 in · 304.8 × 457.2 mm", widthMm: 304.8, heightMm: 457.2 },
  "13x19": { label: "13 × 19 in · 330.2 × 482.6 mm", widthMm: 330.2, heightMm: 482.6 },
  custom: { label: "Custom sheet", widthMm: 320, heightMm: 450 },
} satisfies Record<string, SheetPreset>;

export type SheetPresetKey = keyof typeof SHEET_PRESETS;
