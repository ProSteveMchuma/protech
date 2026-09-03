import assert from "node:assert/strict";
import test from "node:test";
import { bestFitLayout, calculateLayout, layoutStats, simulateCutAndStack } from "../lib/proprint/imposition.ts";
import { MM_TO_PT } from "../lib/proprint/sheet-presets.ts";

for (const [records, up] of [[10, 4], [16, 4], [25, 8], [100, 6], [1, 4], [3, 4], [101, 12]]) {
  test(`cut-and-stack reconstructs 1…${records} at ${up}-up`, () => {
    assert.deepEqual(simulateCutAndStack(records, up), Array.from({ length: records }, (_, index) => index + 1));
  });
}

test("bestFitLayout recommends rotation when it fits more pieces", () => {
  // A 90 × 60 mm item on a 200 × 100 mm sheet: 2-up as-supplied, 3-up rotated.
  const input = {
    itemWidthPt: 90 * MM_TO_PT,
    itemHeightPt: 60 * MM_TO_PT,
    sheetWidthMm: 200,
    sheetHeightMm: 100,
    marginMm: 0,
    horizontalGutterMm: 0,
    verticalGutterMm: 0,
    records: 300,
  };
  const fit = bestFitLayout(input);
  assert.equal(fit.piecesPerSheet, 2);
  assert.equal(fit.rotatedPiecesPerSheet, 3);
  assert.equal(fit.improves, true);
  assert.equal(fit.rotated, true);
  assert.equal(fit.layout.piecesPerSheet, 3);
});

test("bestFitLayout keeps original orientation for a square item", () => {
  const input = {
    itemWidthPt: 100 * MM_TO_PT,
    itemHeightPt: 100 * MM_TO_PT,
    sheetWidthMm: 320,
    sheetHeightMm: 450,
    marginMm: 8,
    horizontalGutterMm: 4,
    verticalGutterMm: 4,
    records: 100,
  };
  const fit = bestFitLayout(input);
  assert.equal(fit.improves, false);
  assert.equal(fit.rotated, false);
});

test("layoutStats reports capacity, waste and utilization", () => {
  const layout = calculateLayout({
    itemWidthPt: 210 * MM_TO_PT,
    itemHeightPt: 148 * MM_TO_PT,
    sheetWidthMm: 320,
    sheetHeightMm: 450,
    marginMm: 8,
    horizontalGutterMm: 4,
    verticalGutterMm: 4,
    records: 100,
  });
  const stats = layoutStats(layout, 100);
  assert.equal(stats.capacity, layout.piecesPerSheet * layout.sheetsRequired);
  assert.equal(stats.wastedSlots, stats.capacity - 100);
  assert.ok(stats.utilization > 0 && stats.utilization <= 1);
});

test("layoutStats handles an empty layout without dividing by zero", () => {
  const stats = layoutStats({ across: 0, down: 0, piecesPerSheet: 0, sheetsRequired: 0, sheetWidthPt: 0, sheetHeightPt: 0 }, 0);
  assert.equal(stats.capacity, 0);
  assert.equal(stats.wastedSlots, 0);
  assert.equal(stats.utilization, 0);
});
