import assert from "node:assert/strict";
import test from "node:test";
import { accountRole, normalizeShopPhone, orderBelongsToAccount, safeCallback } from "../lib/shop-account.ts";

test("the founder email is staff and a customer stays a customer", () => {
  assert.equal(accountRole("ProInnovationTech@gmail.com", undefined, ["proinnovationtech@gmail.com"]), "admin");
  assert.equal(accountRole("amina@example.com", undefined, ["proinnovationtech@gmail.com"]), "user");
  assert.equal(accountRole("amina@example.com", "admin", ["proinnovationtech@gmail.com"]), "admin");
});

test("an order follows the email or the phone, and never moves between accounts", () => {
  const account = { uid: "user-1", email: "Amina@example.com", phone: "0712345678" };
  assert.equal(orderBelongsToAccount({ customer: { email: "amina@example.com", phone: "" } }, account), true);
  assert.equal(orderBelongsToAccount({ customer: { email: "other@example.com", phone: "254712345678" } }, account), true);
  assert.equal(orderBelongsToAccount({ userId: "user-2", customer: { email: "amina@example.com", phone: "0712345678" } }, account), false);
  assert.equal(orderBelongsToAccount({ userId: "user-1", customer: { email: "other@example.com", phone: "" } }, account), true);
  assert.equal(normalizeShopPhone("0712 345 678"), "254712345678");
  assert.equal(safeCallback("https://evil.example"), "/account");
  assert.equal(safeCallback("/admin"), "/admin");
});
