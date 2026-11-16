import assert from "node:assert/strict";
import test from "node:test";
import { products } from "../lib/printshop/catalog.ts";

test("product titles are tidy for search results", () => {
  for (const product of products) {
    assert.equal(product.title, product.title.trim().replace(/\s+/g, " "), `${product.slug} has stray spaces`);
    assert.doesNotMatch(product.title, /\bprinting\b/, `${product.slug} has a lowercase "printing"`);
  }
});

test("product slugs are unique", () => {
  assert.equal(new Set(products.map((product) => product.slug)).size, products.length);
});
