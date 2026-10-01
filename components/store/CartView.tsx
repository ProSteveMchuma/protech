"use client";

import Image from "next/image";
import Link from "next/link";
import { productBySlug } from "@/lib/printshop/catalog";
import { productImage } from "@/lib/printshop/images";
import { formatKes, FREE_DELIVERY_FROM_KES } from "@/lib/printshop/pricing";
import { useCart } from "./CartProvider";

export function CartView() {
  const cart = useCart();
  if (!cart.ready) return <p className="text-sm text-neutral-500">Loading your cart…</p>;
  if (cart.lines.length === 0) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-neutral-100 bg-white px-6 py-16 text-center shadow-sm">
        <h1 className="text-2xl font-extrabold tracking-tight">Your cart is empty</h1>
        <p className="mt-2 text-neutral-500">Looks like you have not added anything yet.</p>
        <Link href="/shop" className="mt-8 inline-flex h-12 items-center rounded-full bg-[#ff0030] px-6 text-sm font-bold text-white">Start shopping</Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-extrabold tracking-tight sm:mb-8 sm:text-3xl">Shopping cart</h1>
      <div className="flex flex-col gap-8 lg:flex-row">
        <ul className="space-y-4 lg:w-2/3">
          {cart.lines.map((line) => {
            const product = productBySlug(line.slug);
            return (
              <li key={line.lineId} className="flex flex-col items-center gap-4 rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm sm:flex-row sm:p-6">
                <Link href={`/product/${line.slug}`} className="relative size-24 shrink-0 overflow-hidden rounded-xl border border-neutral-200 bg-[#f8f6f4]">
                  {product && <Image src={productImage(product)} alt="" fill sizes="96px" className="object-cover" />}
                </Link>
                <div className="min-w-0 flex-1 text-center sm:text-left">
                  <Link href={`/product/${line.slug}`} className="text-lg font-bold">{line.title}</Link>
                  {line.summary && <p className="mt-1 text-sm text-neutral-500">{line.summary}</p>}
                  <p className="mt-2 font-mono text-lg font-bold tabular-nums text-[#ff0030]">{formatKes(line.totalKes)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-lg border border-neutral-200">
                    <button type="button" className="grid size-11 place-items-center text-lg font-bold text-neutral-500" aria-label={`Reduce quantity of ${line.title}`} onClick={() => cart.setQuantity(line.lineId, line.quantity - 1)}>−</button>
                    <span className="w-12 text-center font-mono text-sm tabular-nums">{line.quantity.toLocaleString("en-KE")}</span>
                    <button type="button" className="grid size-11 place-items-center text-lg font-bold text-neutral-500" aria-label={`Increase quantity of ${line.title}`} onClick={() => cart.setQuantity(line.lineId, line.quantity + 1)}>+</button>
                  </div>
                  <button type="button" className="grid size-11 place-items-center rounded-full text-neutral-400 hover:bg-red-50 hover:text-red-500" aria-label={`Remove ${line.title}`} onClick={() => cart.remove(line.lineId)}>
                    <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
        <aside className="lg:w-1/3">
          <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm lg:sticky lg:top-36">
            <h2 className="text-xl font-bold">Order summary</h2>
            <dl className="mt-6 space-y-4 text-sm text-neutral-600">
              <div className="flex justify-between gap-3">
                <dt>Subtotal</dt>
                <dd className="font-mono font-bold tabular-nums text-neutral-950">{formatKes(cart.subtotal)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Delivery or collection</dt>
                <dd className="text-right text-neutral-500">At checkout</dd>
              </div>
              <div className="flex justify-between gap-3 border-t border-neutral-100 pt-4 text-lg font-extrabold text-[#ff0030]">
                <dt>Total</dt>
                <dd className="font-mono tabular-nums">{formatKes(cart.subtotal)}</dd>
              </div>
            </dl>
            <p className="mt-4 text-xs leading-5 text-neutral-500">Free delivery over {formatKes(FREE_DELIVERY_FROM_KES)}. Collection at Karen Green, Langata Road is free. Pay by M-Pesa Paybill. We confirm the code before printing.</p>
            <Link href="/order" className="mt-6 hidden h-12 items-center justify-center rounded-full bg-[#ff0030] text-sm font-bold text-white lg:flex">Checkout now</Link>
          </div>
        </aside>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-neutral-200 bg-white p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
        <Link href="/order" className="flex h-12 items-center justify-center rounded-full bg-[#ff0030] text-sm font-bold text-white">Checkout · {formatKes(cart.subtotal)}</Link>
      </div>
    </div>
  );
}
