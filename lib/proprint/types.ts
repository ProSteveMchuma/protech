export type OutputMode = "number-only" | "step-repeat" | "cut-stack";

export interface SheetPreset {
  label: string;
  widthMm: number;
  heightMm: number;
}

export interface ImpositionLayout {
  across: number;
  down: number;
  piecesPerSheet: number;
  sheetsRequired: number;
  sheetWidthPt: number;
  sheetHeightPt: number;
}

export interface LayoutStats {
  capacity: number;
  wastedSlots: number;
  utilization: number;
}

export interface BestFitLayout {
  layout: ImpositionLayout;
  rotated: boolean;
  piecesPerSheet: number;
  rotatedPiecesPerSheet: number;
  improves: boolean;
}
