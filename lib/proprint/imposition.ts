import { MM_TO_PT } from "./sheet-presets.ts";
import type { ImpositionLayout } from "./types.ts";

export function calculateLayout(input: {
  itemWidthPt: number; itemHeightPt: number; sheetWidthMm: number; sheetHeightMm: number;
  marginMm: number; horizontalGutterMm: number; verticalGutterMm: number; records: number;
}): ImpositionLayout {
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
