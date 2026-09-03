export type QuoteInput = {
    quantity: number;
    itemsPerSheet: number;
    spoilagePercent: number;
    sheetCost: number;
    printCostPerSheet: number;
    sides: number;
    setupCost: number;
    finishingPerPiece: number;
    otherCost: number;
    markupPercent: number;
    taxPercent: number;
    /** Optional finishing breakdown — all additive, all default to 0. */
    cuttingPerSheet?: number;
    laminatePerPiece?: number;
    bindingPerBook?: number;
    books?: number;
};

export type QuoteResult = {
    baseSheets: number;
    spoilageSheets: number;
    productionSheets: number;
    paperCost: number;
    printCost: number;
    finishingCost: number;
    directCost: number;
    markupAmount: number;
    subtotal: number;
    taxAmount: number;
    total: number;
    unitPrice: number;
};

const finiteNonNegative = (value: number | undefined) => (typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : 0);

export function calculateQuote(input: QuoteInput): QuoteResult {
    const quantity = Math.floor(finiteNonNegative(input.quantity));
    const itemsPerSheet = Math.max(1, Math.floor(finiteNonNegative(input.itemsPerSheet)));
    const sides = Math.max(1, Math.floor(finiteNonNegative(input.sides)));
    const baseSheets = Math.ceil(quantity / itemsPerSheet);
    const spoilageSheets = Math.ceil(baseSheets * finiteNonNegative(input.spoilagePercent) / 100);
    const productionSheets = baseSheets + spoilageSheets;
    const paperCost = productionSheets * finiteNonNegative(input.sheetCost);
    const printCost = productionSheets * sides * finiteNonNegative(input.printCostPerSheet);
    const finishingCost =
        quantity * finiteNonNegative(input.finishingPerPiece) +
        quantity * finiteNonNegative(input.laminatePerPiece) +
        productionSheets * finiteNonNegative(input.cuttingPerSheet) +
        finiteNonNegative(input.books) * finiteNonNegative(input.bindingPerBook);
    const directCost = paperCost + printCost + finiteNonNegative(input.setupCost) + finishingCost + finiteNonNegative(input.otherCost);
    const markupAmount = directCost * finiteNonNegative(input.markupPercent) / 100;
    const subtotal = directCost + markupAmount;
    const taxAmount = subtotal * finiteNonNegative(input.taxPercent) / 100;
    const total = subtotal + taxAmount;

    return {
        baseSheets,
        spoilageSheets,
        productionSheets,
        paperCost,
        printCost,
        finishingCost,
        directCost,
        markupAmount,
        subtotal,
        taxAmount,
        total,
        unitPrice: quantity > 0 ? total / quantity : 0,
    };
}
