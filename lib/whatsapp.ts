import { business } from "./config.ts";

const fallback = "254719584549";

export function whatsappNumber() {
  const digits = (business.whatsapp || fallback).replace(/\D/g, "");
  if (digits.startsWith("254") && digits.length === 12) return digits;
  if (digits.startsWith("0") && digits.length === 10) return `254${digits.slice(1)}`;
  return fallback;
}

export function whatsappDisplay() {
  const number = whatsappNumber();
  return `0${number.slice(3, 6)} ${number.slice(6, 9)} ${number.slice(9)}`;
}

export function whatsappHref(text?: string) {
  return whatsappHrefFor(whatsappNumber(), text);
}

export function whatsappHrefFor(phone: string, text?: string) {
  const digits = phone.replace(/\D/g, "");
  const number = digits.startsWith("254") && digits.length === 12 ? digits : whatsappNumber();
  const base = `https://wa.me/${number}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

// Calls go to the same line as WhatsApp unless NEXT_PUBLIC_CALL_NUMBER is set.
export function callNumber() {
  const digits = (process.env.NEXT_PUBLIC_CALL_NUMBER || "").replace(/\D/g, "");
  if (digits.startsWith("254") && digits.length === 12) return digits;
  if (digits.startsWith("0") && digits.length === 10) return `254${digits.slice(1)}`;
  return whatsappNumber();
}

export function callHref() {
  return `tel:+${callNumber()}`;
}

export function callDisplay() {
  const number = callNumber();
  return `0${number.slice(3, 6)} ${number.slice(6, 9)} ${number.slice(9)}`;
}

export function whatsappOrderMessage(order: { title: string; summary?: string; quantity?: number; totalKes?: number; turnaround?: string; url?: string }) {
  const lines = [`Hello ProPrint, I'd like to order ${order.title}.`];
  if (order.summary) lines.push(`Options: ${order.summary}`);
  if (order.quantity) lines.push(`Quantity: ${order.quantity.toLocaleString("en-KE")}`);
  if (order.turnaround) lines.push(`Turnaround: ${order.turnaround}`);
  if (order.totalKes) lines.push(`Price on the website: KES ${order.totalKes.toLocaleString("en-KE")}`);
  if (order.url) lines.push(order.url);
  return lines.join("\n");
}
