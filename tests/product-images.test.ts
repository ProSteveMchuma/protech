import assert from "node:assert/strict";
import test from "node:test";
import { groupImage, productImage } from "../lib/printshop/images.ts";

const prefix = "https://storage.googleapis.com/tenderpro-480721.firebasestorage.app/products/";

test("category photos are public Firebase Storage URLs", () => {
  assert.equal(groupImage["business-cards"], `${prefix}business-cards.jpg`);
  assert.equal(groupImage.apparel, `${prefix}tshirt.jpg`);
});

test("product photos match the closest Firebase file", () => {
  assert.equal(productImage({ slug: "hoodie-printing", title: "Hoodie", group: "apparel" }), `${prefix}hoodie.jpg`);
  assert.equal(productImage({ slug: "flyers-printing", title: "Flyers", group: "flyers-posters" }), `${prefix}flyers.jpg`);
});
