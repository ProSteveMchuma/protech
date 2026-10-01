import assert from "node:assert/strict";
import test from "node:test";
import { productBySlug, products } from "../lib/printshop/catalog.ts";
import { deliveryFee, formatKes, lineTotal, priceModel, unitRate } from "../lib/printshop/pricing.ts";

test("catalog has the full made-to-order range", () => {
  assert.equal(products.length, 84);
  assert.ok(products.every((product) => product.slug && product.title && product.group));
  assert.equal(new Set(products.map((product) => product.slug)).size, 84);
});

test("business card short runs hold the published floor price", () => {
  const cards = products.find((product) => product.slug === "business-cards-printing");
  assert.ok(cards);
  assert.equal(priceModel(cards), "unit");
  assert.equal(unitRate(cards.fromKes, 100), 12);
  const priced = lineTotal({ fromKes: cards.fromKes, model: "unit", quantity: 100, sides: 1, turnaround: "standard" });
  assert.equal(priced.totalKes, 1200);
});

test("delivery is free above ten thousand shillings", () => {
  assert.equal(deliveryFee(4000, "Nairobi"), 400);
  assert.equal(deliveryFee(4000, "Kisumu"), 850);
  assert.equal(deliveryFee(10000, "Mombasa"), 0);
  assert.equal(formatKes(8500), "KES 8,500");
});

test("package products exist in the catalogue", () => {
  const slugs = [
    "flyers-printing",
    "brochure-printing",
    "roll-up-banner-printing",
    "posters-printing",
    "business-cards-printing",
    "letterheads-printing",
    "envelopes-printing",
    "receipt-books-printing",
    "presentation-folders-printing",
    "branded-t-shirt",
    "branded-mugs",
    "nametags",
  ];
  assert.equal(slugs.filter((slug) => productBySlug(slug)).length, slugs.length);
});
