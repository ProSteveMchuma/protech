import assert from "node:assert/strict";
import test from "node:test";
import { productBySlug, products } from "../lib/printshop/catalog.ts";
import { interpretSearch } from "../lib/printshop/search.ts";
import { allowsRush, defaultSpec, deliveryFee, formatKes, priceModel, quoteProduct, shelfKes, shelfOffer, shippingFee } from "../lib/printshop/pricing.ts";

test("catalog has the full made-to-order range", () => {
  assert.equal(products.length, 84);
  assert.ok(products.every((product) => product.slug && product.title && product.group));
  assert.equal(new Set(products.map((product) => product.slug)).size, 84);
});

test("business cards use the published run prices", () => {
  const cards = productBySlug("business-cards-printing");
  assert.ok(cards);
  const single = defaultSpec(cards);
  assert.ok(single);
  assert.equal(quoteProduct(cards, { ...single, quantity: 100, group: "Printed Sides : Single-Sided" })?.totalKes, 1200);
  assert.equal(quoteProduct(cards, { ...single, quantity: 101, group: "Printed Sides : Single-Sided" })?.quantity, 200);
  assert.equal(quoteProduct(cards, { ...single, quantity: 101, group: "Printed Sides : Single-Sided" })?.totalKes, 2300);
  assert.equal(quoteProduct(cards, { ...single, quantity: 1000, group: "Printed Sides : Single-Sided" })?.totalKes, 7000);
  assert.equal(quoteProduct(cards, { ...single, quantity: 100, group: "Printed Sides : Double-Sided" })?.totalKes, 1400);
  const gloss = quoteProduct(cards, { ...single, quantity: 100, options: { Lamination: "Gloss" } });
  assert.equal(gloss?.totalKes, 1400);
  assert.equal(gloss?.job.finishing[0]?.per, "piece");
  assert.equal(shelfOffer(cards)?.quantity, 100);
  assert.equal(shelfKes(cards), 1200);
});

test("rush is a flat fee and delivery stays free above ten thousand", () => {
  const cards = productBySlug("business-cards-printing");
  assert.ok(cards);
  const spec = defaultSpec(cards);
  assert.ok(spec);
  assert.equal(quoteProduct(cards, { ...spec, quantity: 100, turnaround: "rush" })?.totalKes, 2700);
  assert.equal(deliveryFee(4000, "Nairobi"), 400);
  assert.equal(deliveryFee(4000, "Kisumu"), 850);
  assert.equal(deliveryFee(10000, "Mombasa"), 0);
  assert.equal(shippingFee(4000, "Nairobi", "pickup"), 0);
  assert.equal(shippingFee(4000, "Kisumu", "delivery"), 850);
  assert.equal(formatKes(8500), "KES 8,500");
});

test("banners, shirts and books price from their own rules", () => {
  const banner = productBySlug("banner-printing");
  const shirt = productBySlug("branded-t-shirt");
  const book = productBySlug("book-printing");
  assert.ok(banner && shirt && book);
  const bannerSpec = defaultSpec(banner);
  const shirtSpec = defaultSpec(shirt);
  const bookSpec = defaultSpec(book);
  assert.ok(bannerSpec && shirtSpec && bookSpec);
  assert.equal(quoteProduct(banner, { ...bannerSpec, width: 2, height: 1, quantity: 1 })?.totalKes, 2400);
  assert.equal(quoteProduct(banner, { ...bannerSpec, width: 1, height: 1, quantity: 1, options: { Finishing: "Add Eyelets/Grommets" } })?.totalKes, 1300);
  assert.equal(quoteProduct(banner, { ...bannerSpec, width: 2, height: 1, quantity: 1, turnaround: "rush" })?.totalKes, 2400);
  assert.equal(allowsRush("banner-printing", { group: bannerSpec.group }), false);
  const cardSpec = defaultSpec(productBySlug("business-cards-printing")!);
  assert.equal(allowsRush("business-cards-printing", cardSpec!), true);
  assert.equal(quoteProduct(shirt, { ...shirtSpec, group: "Round Neck", quantity: 10 })?.totalKes, 9500);
  assert.equal(quoteProduct(book, { ...bookSpec, size: "A5 Size", quantity: 1, pages: 100, color: "color" })?.totalKes, 470);
  const spot = productBySlug("spot-uv-business-cards");
  assert.ok(spot);
  assert.equal(shelfOffer(spot)?.quantity, 200);
  assert.equal(shelfKes(spot), 11000);
  assert.equal(priceModel(book), "unit");
});

test("search opens a product with the quantity", () => {
  assert.deepEqual(interpretSearch("A5 flyers 500"), { slug: "flyers-printing", quantity: 500, hint: "A5" });
  assert.equal(interpretSearch("polo shirts 10")?.slug, "branded-t-shirt");
  assert.equal(interpretSearch("polo shirts 10")?.quantity, 10);
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
