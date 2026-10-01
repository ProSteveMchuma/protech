"use client";

import Link from "next/link";
import { formatKes } from "@/lib/printshop/pricing";
import { whatsappDisplay, whatsappHref } from "@/lib/whatsapp";
import { useCart } from "./CartProvider";

export function CartView() {
  const cart = useCart();
  if (!cart.ready) return <p className="text-sm text-neutral-500">Loading your cart…</p>;
  if (cart.lines.length === 0) {
    return (
      <div>
        <h1 className="text-4xl font-black tracking-tight">Your cart is empty</h1>
        <Link href="/shop" className="mt-6 inline-flex h-12 items-center rounded-full bg-neutral-950 px-5 font-semibold text-white">Browse products</Link>
        <a href={whatsappHref("Hello ProPrint, I need help choosing a product.")} className="mt-4 block text-sm font-semibold text-[#128C7E]" target="_blank" rel="noopener noreferrer">Or ask on WhatsApp {whatsappDisplay()}</a>
      </div>
    );
  }
  return (
    <div>
      <h1 className="text-4xl font-black tracking-tight">Cart</h1>
      <ul className="mt-6 divide-y divide-neutral-200 border-y border-neutral-200">
        {cart.lines.map((line) => (
          <li key={line.lineId} className="flex flex-wrap items-start justify-between gap-3 py-4">
            <div>
              <Link href={`/product/${line.slug}`} className="font-bold">{line.title}</Link>
              <p className="text-sm text-neutral-500">{line.quantity.toLocaleString("en-KE")} × {formatKes(line.unitKes)}</p>
              <p className="text-sm text-neutral-500">{line.summary}</p>
            </div>
            <div className="text-right">
              <p className="font-mono font-bold tabular-nums">{formatKes(line.totalKes)}</p>
              <button type="button" className="mt-1 text-sm text-neutral-500" onClick={() => cart.remove(line.lineId)}>Remove</button>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-right font-mono text-2xl font-black tabular-nums">{formatKes(cart.subtotal)}</p>
      <p className="text-right text-xs text-neutral-500">Delivery is added at checkout. Free above KES 10,000.</p>
      <Link href="/order" className="mt-6 inline-flex h-12 items-center rounded-full bg-neutral-950 px-5 font-semibold text-white">Continue to payment</Link>
      <a href={whatsappHref("Hello ProPrint, I have a question about the items in my cart.")} className="mt-4 block text-sm font-semibold text-[#128C7E]" target="_blank" rel="noopener noreferrer">Question about this order? WhatsApp {whatsappDisplay()}</a>
    </div>
  );
}
