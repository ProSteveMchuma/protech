import assert from "node:assert/strict";
import test from "node:test";
import { products } from "../lib/printshop/catalog.ts";
import { groupImage, productImage } from "../lib/printshop/images.ts";

const prefix = "https://storage.googleapis.com/tenderpro-480721.firebasestorage.app/products/v3/";

test("category photos are public Firebase Storage URLs", () => {
  assert.equal(groupImage["business-cards"], `${prefix}business-cards.jpg`);
  assert.equal(groupImage.apparel, `${prefix}tshirt.jpg`);
});

test("each catalogue product has its own photo", () => {
  const files = products.map((product) => productImage(product));
  assert.equal(files.every((file) => file.startsWith(prefix)), true);
  assert.equal(new Set(files).size > 40, true);
});

test("similar names do not share the wrong object", () => {
  const image = (slug: string) => productImage(products.find((product) => product.slug === slug)!);
  assert.equal(image("wedding-cards-printing"), `${prefix}wedding-card.jpg`);
  assert.notEqual(image("wedding-cards-printing"), image("business-cards-printing"));
  assert.equal(image("branded-drawstring-bags"), `${prefix}drawstring.jpg`);
  assert.notEqual(image("branded-drawstring-bags"), image("branded-kraft-bags"));
  assert.equal(image("branded-pens"), `${prefix}pen.jpg`);
  assert.notEqual(image("branded-pens"), image("branded-mugs"));
  assert.equal(image("architectural-blueprints"), `${prefix}blueprint.jpg`);
  assert.notEqual(image("architectural-blueprints"), image("posters-printing"));
  assert.equal(image("round-neck-plain-t-shirt"), `${prefix}plain-tshirt.jpg`);
  assert.notEqual(image("round-neck-plain-t-shirt"), image("branded-t-shirt"));
});
