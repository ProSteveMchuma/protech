import assert from "node:assert/strict";
import test from "node:test";
import { needsBatching, planBatches } from "../lib/proprint/batch.ts";

test("small runs need no batching", () => {
    assert.equal(needsBatching(1, 100, 1, 5000), false);
    assert.deepEqual(planBatches(1, 100, 1, 5000).length, 1);
});

test("batches join perfectly and cover the full range", () => {
    const batches = planBatches(1, 25000, 1, 5000);
    assert.equal(batches.length, 5);
    assert.equal(batches[0].start, 1);
    assert.equal(batches[0].end, 5000);
    // Each batch starts exactly one after the previous ends — no gaps, no overlaps.
    for (let i = 1; i < batches.length; i += 1) {
        assert.equal(batches[i].start, batches[i - 1].end + 1);
    }
    assert.equal(batches.at(-1)?.end, 25000);
    const total = batches.reduce((sum, b) => sum + (b.end - b.start + 1), 0);
    assert.equal(total, 25000);
});

test("copies reduce the unique serials per batch", () => {
    assert.equal(needsBatching(1, 2600, 2, 5000), true); // 5200 records
    const batches = planBatches(1, 2600, 2, 5000);
    assert.equal(batches.length, 2);
    assert.equal(batches[0].start, 1);
    assert.equal(batches[0].end, 2500); // floor(5000/2) unique per batch
    assert.equal(batches[0].records, 5000);
    assert.equal(batches[1].start, 2501);
    assert.equal(batches[1].end, 2600);
});
