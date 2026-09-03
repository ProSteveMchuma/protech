import assert from "node:assert/strict";
import test from "node:test";
import { mapAuthError, mapFirestoreError } from "../lib/proprint/auth-errors.ts";
import { decideLocalImport, parseSavedRecord, toFirestoreSave } from "../lib/proprint/saved-record.ts";

test("parseSavedRecord accepts a complete shop save", () => {
    const parsed = parseSavedRecord("save-1", {
        kind: "serialpro",
        name: "Receipt books",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-02T00:00:00.000Z",
        settings: { start: 1, end: 100 },
    });
    assert.equal(parsed?.id, "save-1");
    assert.equal(parsed?.kind, "serialpro");
    assert.equal(parsed?.name, "Receipt books");
});

test("parseSavedRecord rejects the wrong kind, empty names, and missing settings", () => {
    assert.equal(
        parseSavedRecord("save-1", { kind: "quotepro", name: "Q", createdAt: "a", updatedAt: "b", settings: {} }, "serialpro"),
        null
    );
    assert.equal(
        parseSavedRecord("save-1", { kind: "serialpro", name: "  ", createdAt: "a", updatedAt: "b", settings: {} }),
        null
    );
    assert.equal(
        parseSavedRecord("save-1", { kind: "serialpro", name: "Job", createdAt: "a", updatedAt: "b" }),
        null
    );
});

test("toFirestoreSave drops undefined settings fields", () => {
    const payload = toFirestoreSave({
        id: "save-1",
        kind: "serialpro",
        name: "Job",
        createdAt: "a",
        updatedAt: "b",
        settings: { start: 1, sourceFileName: undefined },
    });
    assert.deepEqual(payload.settings, { start: 1 });
    assert.equal("id" in payload, false);
});

test("decideLocalImport copies local setups only when the shop is empty", () => {
    assert.equal(decideLocalImport({ alreadyImported: false, cloudCount: 0, localCount: 2 }), "import");
    assert.equal(decideLocalImport({ alreadyImported: true, cloudCount: 0, localCount: 2 }), "skip");
    assert.equal(decideLocalImport({ alreadyImported: false, cloudCount: 1, localCount: 2 }), "skip");
    assert.equal(decideLocalImport({ alreadyImported: false, cloudCount: 0, localCount: 0 }), "skip");
});

test("auth and firestore errors stay operator-readable", () => {
    assert.equal(mapAuthError({ code: "auth/invalid-credential" }), "Email or password is incorrect.");
    assert.equal(mapAuthError({ code: "auth/email-already-in-use" }), "An account already exists for this email. Sign in instead.");
    assert.equal(mapAuthError({ code: "auth/operation-not-allowed" }), "Email sign-in is not enabled for this Firebase project yet.");
    assert.match(mapFirestoreError({ code: "permission-denied" }), /Firestore rules/);
});
