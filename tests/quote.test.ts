import assert from "node:assert/strict";
import test from "node:test";
import { calculateQuote } from "../lib/proprint/quote.ts";

test("calculates a two-sided print quote with spoilage, markup and tax", () => {
    const result = calculateQuote({ quantity: 1000, itemsPerSheet: 4, spoilagePercent: 10, sheetCost: 12, printCostPerSheet: 5, sides: 2, setupCost: 500, finishingPerPiece: 1.5, otherCost: 300, markupPercent: 25, taxPercent: 16 });
    assert.equal(result.baseSheets, 250);
    assert.equal(result.spoilageSheets, 25);
    assert.equal(result.productionSheets, 275);
    assert.equal(result.directCost, 8350);
    assert.equal(result.total, 12107.5);
    assert.equal(result.unitPrice, 12.1075);
});

test("finishing breakdown adds cutting, laminate and binding on top of per-piece", () => {
    const result = calculateQuote({
        quantity: 1000, itemsPerSheet: 4, spoilagePercent: 0, sheetCost: 0, printCostPerSheet: 0, sides: 1,
        setupCost: 0, finishingPerPiece: 1, otherCost: 0, markupPercent: 0, taxPercent: 0,
        cuttingPerSheet: 2, laminatePerPiece: 0.5, bindingPerBook: 20, books: 10,
    });
    // per-piece 1000*1 + laminate 1000*0.5 + cutting 250 sheets*2 + binding 10*20 = 1000 + 500 + 500 + 200
    assert.equal(result.finishingCost, 2200);
    assert.equal(result.directCost, 2200);
});

test("rounds sheets up and handles a zero quantity", () => {
    const partial = calculateQuote({ quantity: 101, itemsPerSheet: 4, spoilagePercent: 0, sheetCost: 10, printCostPerSheet: 0, sides: 1, setupCost: 0, finishingPerPiece: 0, otherCost: 0, markupPercent: 0, taxPercent: 0 });
    assert.equal(partial.productionSheets, 26);
    assert.equal(partial.total, 260);

    const empty = calculateQuote({ quantity: 0, itemsPerSheet: 4, spoilagePercent: 0, sheetCost: 10, printCostPerSheet: 0, sides: 1, setupCost: 0, finishingPerPiece: 0, otherCost: 0, markupPercent: 0, taxPercent: 0 });
    assert.equal(empty.unitPrice, 0);
});
