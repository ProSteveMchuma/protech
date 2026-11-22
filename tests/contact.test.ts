import assert from "node:assert/strict";
import test from "node:test";
import { summarizeClicks } from "../lib/contact-clicks-summary.ts";
import { statusLabel } from "../lib/order-desk.ts";
import { callHref, whatsappOrderMessage } from "../lib/whatsapp.ts";

test("contact taps are counted by channel, page and day", () => {
  const now = new Date("2026-11-22T12:00:00Z");
  const summary = summarizeClicks(
    [
      { at: "2026-11-22T08:00:00Z", channel: "whatsapp", path: "/product/branded-mugs" },
      { at: "2026-11-22T09:00:00Z", channel: "call", path: "/" },
      { at: "2026-11-21T09:00:00Z", channel: "whatsapp", path: "/product/branded-mugs" },
    ],
    7,
    now,
  );
  assert.equal(summary.total, 3);
  assert.deepEqual(summary.byChannel, { whatsapp: 2, call: 1 });
  assert.deepEqual(summary.byPage[0], { path: "/product/branded-mugs", whatsapp: 2, call: 0 });
  assert.equal(summary.byDay.length, 7);
  assert.deepEqual(summary.byDay.at(-1), { day: "2026-11-22", whatsapp: 1, call: 1 });
});

test("the WhatsApp order message carries the chosen options and price", () => {
  const message = whatsappOrderMessage({ title: "Branded Mugs", summary: "White ceramic", quantity: 12, totalKes: 5880, url: "https://www.proinnovationtech.co.ke/product/branded-mugs" });
  assert.match(message, /Branded Mugs/);
  assert.match(message, /Options: White ceramic/);
  assert.match(message, /Quantity: 12/);
  assert.match(message, /KES 5,880/);
});

test("call links dial the Kenyan number in international form", () => {
  assert.equal(callHref(), "tel:+254719584549");
});

test("orders without an M-Pesa code read as pay after confirmation", () => {
  assert.match(statusLabel({ status: "received", mpesaCode: "" }), /confirm the artwork and price/);
  assert.match(statusLabel({ status: "received", mpesaCode: "SL12AB34CD" }), /M-Pesa code/);
});
