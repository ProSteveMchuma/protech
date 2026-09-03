import assert from "node:assert/strict";
import test from "node:test";
import { evaluatePreflight, worstLevel } from "../lib/proprint/preflight.ts";

const MM = 72 / 25.4;

test("flags missing trim box as a warning", () => {
    const findings = evaluatePreflight({ mediaBox: { width: 210 * MM, height: 297 * MM }, trimBox: null, pageCount: 1 });
    const trim = findings.find((f) => f.id === "trim");
    assert.equal(trim?.level, "warn");
    assert.equal(worstLevel(findings), "warn");
});

test("passes artwork with adequate bleed", () => {
    // 3mm bleed on each side => media is 6mm larger than trim in each dimension.
    const findings = evaluatePreflight({
        mediaBox: { width: (210 + 6) * MM, height: (297 + 6) * MM },
        trimBox: { width: 210 * MM, height: 297 * MM },
        pageCount: 1,
    });
    assert.equal(findings.find((f) => f.id === "bleed")?.level, "pass");
    assert.equal(worstLevel(findings), "pass");
});

test("warns on insufficient bleed", () => {
    const findings = evaluatePreflight({
        mediaBox: { width: (210 + 1) * MM, height: (297 + 1) * MM },
        trimBox: { width: 210 * MM, height: 297 * MM },
        pageCount: 1,
    });
    assert.equal(findings.find((f) => f.id === "bleed")?.level, "warn");
});

test("fails on a zero-size page", () => {
    const findings = evaluatePreflight({ mediaBox: { width: 0, height: 0 }, trimBox: null, pageCount: 1 });
    assert.equal(worstLevel(findings), "fail");
});
