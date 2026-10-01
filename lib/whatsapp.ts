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
  const base = `https://wa.me/${whatsappNumber()}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
