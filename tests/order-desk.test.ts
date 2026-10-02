import assert from "node:assert/strict";
import test from "node:test";
import { artworkContentType, artworkExtension, loginBlocked, printingBlockReason, recordLoginFailure, resetLoginAttempts, statusAfterPayment, statusChangeAllowed } from "../lib/order-desk.ts";
import { whatsappHrefFor } from "../lib/whatsapp.ts";

test("confirming a new order moves it to confirmed", () => {
  assert.equal(statusAfterPayment("received", "confirmed"), "confirmed");
  assert.equal(statusAfterPayment("printing", "rejected"), "printing");
  assert.equal(statusAfterPayment("received", "rejected"), "received");
});

test("printing waits for payment and an accepted file on every line", () => {
  const paid = { status: "confirmed" as const, fulfillment: "pickup" as const, payment: { state: "confirmed" }, lines: [{ fileState: "received" }] };
  assert.equal(printingBlockReason(paid), "Accept the artwork on every line before printing.");
  assert.equal(statusChangeAllowed(paid, "printing"), "Accept the artwork on every line before printing.");
  const ready = { ...paid, lines: [{ fileState: "accepted" }] };
  assert.equal(printingBlockReason(ready), null);
  assert.equal(statusChangeAllowed({ ...ready, status: "printing" }, "dispatched"), "This order is for collection. Mark it ready.");
  assert.equal(statusChangeAllowed({ ...ready, status: "printing", fulfillment: "delivery" }, "ready"), "This order is for delivery. Mark it dispatched.");
  assert.equal(statusChangeAllowed({ ...ready, status: "confirmed" }, "ready"), "Print the job before it leaves the press.");
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
