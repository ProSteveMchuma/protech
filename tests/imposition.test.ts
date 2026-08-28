import assert from "node:assert/strict";
import test from "node:test";
import { simulateCutAndStack } from "../lib/proprint/imposition.ts";

for (const [records, up] of [[10, 4], [16, 4], [25, 8], [100, 6], [1, 4], [3, 4], [101, 12]]) {
  test(`cut-and-stack reconstructs 1…${records} at ${up}-up`, () => {
    assert.deepEqual(simulateCutAndStack(records, up), Array.from({ length: records }, (_, index) => index + 1));
  });
}
