import assert from "node:assert/strict";
import test from "node:test";
import {
    hasEntitlement,
    minimumPlanFor,
    planFeatures,
    planFromPackageKey,
} from "../lib/entitlements.ts";

test("package keys map to the right plan ids", () => {
    assert.equal(planFromPackageKey("serialpro-monthly"), "tool-pro");
    assert.equal(planFromPackageKey("prepress-monthly"), "prepress");
    assert.equal(planFromPackageKey("shop-monthly"), "shop");
    assert.equal(planFromPackageKey(undefined), "free");
    assert.equal(planFromPackageKey("nonsense"), "free");
});

test("free plan unlocks no paid features", () => {
    assert.equal(planFeatures("free").length, 0);
    assert.equal(hasEntitlement("free", "cloudSave"), false);
    assert.equal(hasEntitlement(null, "brandedPdf"), false);
});

test("higher tiers are supersets of lower tiers", () => {
    const toolPro = planFeatures("tool-pro");
    const prepress = planFeatures("prepress");
    const shop = planFeatures("shop");
    for (const feature of toolPro) assert.ok(prepress.includes(feature));
    for (const feature of prepress) assert.ok(shop.includes(feature));
    assert.ok(shop.includes("teamWorkspace"));
    assert.equal(hasEntitlement("tool-pro", "teamWorkspace"), false);
});

test("qr serials require prepress or higher", () => {
    assert.equal(hasEntitlement("tool-pro", "qrSerials"), false);
    assert.equal(hasEntitlement("prepress", "qrSerials"), true);
    assert.equal(minimumPlanFor("qrSerials"), "prepress");
    assert.equal(minimumPlanFor("cloudSave"), "tool-pro");
    assert.equal(minimumPlanFor("teamWorkspace"), "shop");
});
