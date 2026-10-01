"use client";

import Image from "next/image";
import Link from "next/link";
import { productBySlug } from "@/lib/printshop/catalog";
import { productImage } from "@/lib/printshop/images";
import { formatKes } from "@/lib/printshop/pricing";
import { useCart } from "./CartProvider";

export function CartView() {
  const cart = useCart();
  if (!cart.ready) return <p className="text-sm text-neutral-500">Loading your cart…</p>;
  if (cart.lines.length === 0) {
    return (
      <div className="mx-auto max-w-lg py-10 text-center">
        <h1 className="font-display text-4xl font-medium tracking-tight">Your cart is empty</h1>
        <p className="mt-3 text-neutral-600">Looks like you have not added anything yet.</p>
        <Link href="/shop" className="mt-8 inline-flex h-12 items-center rounded-full bg-neutral-950 px-6 text-sm font-medium text-white">Start shopping</Link>
      </div>
    );
  }

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-12">
      <div>
        <h1 className="font-display text-4xl font-medium tracking-tight">Shopping cart</h1>
        <ul className="mt-6 divide-y divide-neutral-200 border-y border-neutral-200">
          {cart.lines.map((line) => {
            const product = productBySlug(line.slug);
            return (
              <li key={line.lineId} className="flex gap-4 py-5">
                <Link href={`/product/${line.slug}`} className="relative size-20 shrink-0 overflow-hidden bg-[#f6f4f1] sm:size-24">
                  {product && <Image src={productImage(product)} alt="" fill className="object-cover" sizes="96px" />}
                </Link>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <Link href={`/product/${line.slug}`} className="font-medium leading-6">{line.title}</Link>
                    <p className="shrink-0 font-mono text-sm tabular-nums">{formatKes(line.totalKes)}</p>
                  </div>
                  {line.summary && <p className="mt-1 text-sm leading-5 text-neutral-500">{line.summary}</p>}
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="inline-flex h-11 items-center rounded-full border border-neutral-200">
                      <button type="button" className="grid size-11 place-items-center text-lg" aria-label={`Reduce quantity of ${line.title}`} onClick={() => cart.setQuantity(line.lineId, line.quantity - 1)}>−</button>
                      <span className="min-w-8 text-center font-mono text-sm tabular-nums">{line.quantity.toLocaleString("en-KE")}</span>
                      <button type="button" className="grid size-11 place-items-center text-lg" aria-label={`Increase quantity of ${line.title}`} onClick={() => cart.setQuantity(line.lineId, line.quantity + 1)}>+</button>
                    </div>
                    <button type="button" className="text-sm text-neutral-500" onClick={() => cart.remove(line.lineId)}>Remove</button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <aside className="mt-8 border border-neutral-200 p-5 lg:sticky lg:top-24 lg:mt-16">
        <h2 className="text-sm font-medium">Order summary</h2>
        <dl className="mt-4 grid gap-2 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-neutral-600">Subtotal</dt>
            <dd className="font-mono tabular-nums">{formatKes(cart.subtotal)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-neutral-600">Delivery or collection</dt>
            <dd className="text-neutral-500">At checkout</dd>
          </div>
          <div className="flex justify-between gap-3 border-t border-neutral-200 pt-3 text-base">
            <dt>Total</dt>
            <dd className="font-mono tabular-nums">{formatKes(cart.subtotal)}</dd>
          </div>
        </dl>
        <p className="mt-3 text-xs leading-5 text-neutral-500">Free delivery over KES 10,000. Collection at Karen Green, Langata Road is free.</p>
        <Link href="/order" className="mt-5 hidden h-12 items-center justify-center rounded-full bg-neutral-950 text-sm font-medium text-white lg:flex">Continue to checkout</Link>
        <p className="mt-3 hidden text-center text-xs text-neutral-500 lg:block">Pay by M-Pesa Paybill. We confirm the code before printing.</p>
      </aside>
      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-neutral-200 bg-white p-3 lg:hidden">
        <Link href="/order" className="flex h-12 items-center justify-center rounded-full bg-neutral-950 text-sm font-medium text-white">Checkout · {formatKes(cart.subtotal)}</Link>
      </div>
    </div>
  );
}
