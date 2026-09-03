/**
 * Splits a large numbering run into press-safe batches while guaranteeing the
 * serial sequence joins perfectly across batches (the #1 production incident is
 * a skipped or duplicated serial when operators split ranges by hand).
 */

export interface SerialBatch {
    index: number;
    start: number;
    end: number;
    /** Finished records in this batch = unique serials * copies. */
    records: number;
}

export function planBatches(start: number, end: number, copies: number, maxRecords: number): SerialBatch[] {
    const safeCopies = Math.max(1, Math.floor(copies));
    const safeMax = Math.max(1, Math.floor(maxRecords));
    if (end < start) return [];

    // How many unique serials fit under the record cap for this copy count.
    const uniquePerBatch = Math.max(1, Math.floor(safeMax / safeCopies));
    const batches: SerialBatch[] = [];
    let cursor = start;
    let index = 0;
    while (cursor <= end) {
        const batchEnd = Math.min(end, cursor + uniquePerBatch - 1);
        const unique = batchEnd - cursor + 1;
        batches.push({ index, start: cursor, end: batchEnd, records: unique * safeCopies });
        cursor = batchEnd + 1;
        index += 1;
    }
    return batches;
}

/** True when a run must be batched to stay under the per-file record cap. */
export function needsBatching(start: number, end: number, copies: number, maxRecords: number): boolean {
    if (end < start) return false;
    const unique = end - start + 1;
    return unique * Math.max(1, copies) > maxRecords;
}
