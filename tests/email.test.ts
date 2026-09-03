import assert from "node:assert/strict";
import test from "node:test";
import { leadToHtml } from "../lib/email.ts";

test("escapes submitted values in notification emails", () => {
    const html = leadToHtml("Product Feedback", { email: "person@example.com", message: "<script>alert('x')</script>" });
    assert.doesNotMatch(html, /<script>/);
    assert.match(html, /&lt;script&gt;/);
});
