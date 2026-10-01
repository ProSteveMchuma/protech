import assert from "node:assert/strict";
import test from "node:test";
import { artworkContentType, artworkExtension, loginBlocked, recordLoginFailure, resetLoginAttempts, statusAfterPayment } from "../lib/order-desk.ts";
import { whatsappHrefFor } from "../lib/whatsapp.ts";

test("confirming a new order moves it to confirmed", () => {
  assert.equal(statusAfterPayment("received", "confirmed"), "confirmed");
  assert.equal(statusAfterPayment("printing", "rejected"), "printing");
  assert.equal(statusAfterPayment("received", "rejected"), "received");
});

test("artwork accepts pdf and jpg, including a missing browser type", () => {
  assert.equal(artworkExtension("application/pdf"), "pdf");
  assert.equal(artworkExtension("image/gif"), null);
  assert.equal(artworkContentType("card.PDF", ""), "application/pdf");
});

test("eight failed sign-ins block the next one", () => {
  resetLoginAttempts();
  const now = 1_000;
  for (let attempt = 0; attempt < 8; attempt += 1) recordLoginFailure("desk", now);
  assert.equal(loginBlocked("desk", now + 1), true);
  assert.equal(loginBlocked("desk", now + 16 * 60 * 1000), false);
});

test("a customer WhatsApp link uses their number", () => {
  assert.equal(whatsappHrefFor("254719584549", "Hello"), "https://wa.me/254719584549?text=Hello");
});
