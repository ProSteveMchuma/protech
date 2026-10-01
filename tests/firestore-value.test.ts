import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { toFirestoreData } from "../lib/firestore-value.ts";

test("firestore documents omit empty fields", () => {
  const stored = toFirestoreData({ id: "a", artwork: undefined, lines: [{ summary: "Single-sided", note: undefined }] });
  assert.deepEqual(stored, { id: "a", lines: [{ summary: "Single-sided" }] });
});

test("firestore rules keep customer data on the server", () => {
  const rules = readFileSync(new URL("../firestore.rules", import.meta.url), "utf8");
  assert.match(rules, /allow read, write: if false/);
});
