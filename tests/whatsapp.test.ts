import assert from "node:assert/strict";
import test from "node:test";
import { whatsappDisplay, whatsappHref, whatsappNumber } from "../lib/whatsapp.ts";

test("the shop WhatsApp number is the Nairobi desk", () => {
  const previous = process.env.WHATSAPP_NUMBER;
  delete process.env.WHATSAPP_NUMBER;
  assert.equal(whatsappNumber(), "254719584549");
  assert.equal(whatsappDisplay(), "0719 584 549");
  assert.equal(whatsappHref("Hello"), "https://wa.me/254719584549?text=Hello");
  if (previous === undefined) delete process.env.WHATSAPP_NUMBER;
  else process.env.WHATSAPP_NUMBER = previous;
});
