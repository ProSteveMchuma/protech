import { MM_TO_PT } from "./sheet-presets.ts";
import type { BestFitLayout, ImpositionLayout, LayoutStats } from "./types.ts";

export interface LayoutInput {
  itemWidthPt: number; itemHeightPt: number; sheetWidthMm: number; sheetHeightMm: number;
  marginMm: number; horizontalGutterMm: number; verticalGutterMm: number; records: number;
}

export function calculateLayout(input: LayoutInput): ImpositionLayout {
  const sheetWidthPt = input.sheetWidthMm * MM_TO_PT;
  const sheetHeightPt = input.sheetHeightMm * MM_TO_PT;
  const margin = Math.max(0, input.marginMm) * MM_TO_PT;
  const horizontalGutter = Math.max(0, input.horizontalGutterMm) * MM_TO_PT;
  const verticalGutter = Math.max(0, input.verticalGutterMm) * MM_TO_PT;
  const usableWidth = Math.max(0, sheetWidthPt - margin * 2);
  const usableHeight = Math.max(0, sheetHeightPt - margin * 2);
  const across = input.itemWidthPt > 0 ? Math.max(0, Math.floor((usableWidth + horizontalGutter) / (input.itemWidthPt + horizontalGutter))) : 0;
  const down = input.itemHeightPt > 0 ? Math.max(0, Math.floor((usableHeight + verticalGutter) / (input.itemHeightPt + verticalGutter))) : 0;
  const piecesPerSheet = across * down;
  return { across, down, piecesPerSheet, sheetsRequired: piecesPerSheet ? Math.ceil(input.records / piecesPerSheet) : 0, sheetWidthPt, sheetHeightPt };
}

/**
 * Compare the artwork imposed as-supplied against a 90° rotation and return the
 * orientation that fits more pieces per sheet. Rotating small items (receipts,
 * cards) frequently lifts an SRA3 sheet from 6-up to 8-up with no extra cost.
 */
export function bestFitLayout(input: LayoutInput): BestFitLayout {
  const normal = calculateLayout(input);
  const rotatedInput: LayoutInput = { ...input, itemWidthPt: input.itemHeightPt, itemHeightPt: input.itemWidthPt };
  const rotated = calculateLayout(rotatedInput);
  const improves = rotated.piecesPerSheet > normal.piecesPerSheet;
  return {
    layout: improves ? rotated : normal,
    rotated: improves,
    piecesPerSheet: normal.piecesPerSheet,
    rotatedPiecesPerSheet: rotated.piecesPerSheet,
    improves,
  };
}

/** Impressions produced beyond the records needed — the waste on the final partial sheet. */
export function layoutStats(layout: ImpositionLayout, records: number): LayoutStats {
  const capacity = layout.piecesPerSheet * layout.sheetsRequired;
  const wastedSlots = Math.max(0, capacity - Math.max(0, records));
  const utilization = capacity > 0 ? Math.max(0, records) / capacity : 0;
  return { capacity, wastedSlots, utilization };
}

export function recordIndexForSlot(mode: "step-repeat" | "cut-stack", sheet: number, slot: number, sheetsRequired: number, piecesPerSheet: number) {
  return mode === "cut-stack" ? slot * sheetsRequired + sheet : sheet * piecesPerSheet + slot;
}

export function simulateCutAndStack(totalRecords: number, piecesPerSheet: number) {
  if (totalRecords < 0 || piecesPerSheet < 1) return [];
  const sheets = Math.ceil(totalRecords / piecesPerSheet);
  const result: number[] = [];
  for (let slot = 0; slot < piecesPerSheet; slot += 1) {
    for (let sheet = 0; sheet < sheets; sheet += 1) {
      const index = recordIndexForSlot("cut-stack", sheet, slot, sheets, piecesPerSheet);
      if (index < totalRecords) result.push(index + 1);
    }
  }
  return result;
}
