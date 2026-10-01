"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { productBySlug } from "@/lib/printshop/catalog";
import { productImage } from "@/lib/printshop/images";
import { formatKes, FREE_DELIVERY_FROM_KES } from "@/lib/printshop/pricing";
import { useCart } from "./CartProvider";

export function CartDrawer() {
  const cart = useCart();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cart.drawerOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") cart.closeDrawer();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [cart.drawerOpen, cart.closeDrawer]);

  if (!cart.drawerOpen) return null;

  const remaining = Math.max(0, FREE_DELIVERY_FROM_KES - cart.subtotal);
  const unlocked = cart.subtotal >= FREE_DELIVERY_FROM_KES;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button type="button" className="absolute inset-0 bg-black/50 backdrop-blur-sm" aria-label="Close cart" onClick={cart.closeDrawer} />
      <div ref={panelRef} className="relative flex h-full max-h-[100dvh] w-full max-w-md flex-col bg-white pt-[env(safe-area-inset-top,0px)] shadow-2xl">
        <div className="flex shrink-0 items-center justify-between border-b border-neutral-100 bg-neutral-50 px-4 py-4 sm:px-6">
          <h2 className="text-lg font-bold">Your cart ({cart.lines.length})</h2>
          <button type="button" aria-label="Close cart" className="grid size-11 place-items-center rounded-full text-neutral-500 hover:bg-neutral-200" onClick={cart.closeDrawer}>
            <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="shrink-0 border-b border-neutral-100 bg-[#fff5f6] p-4">
          {unlocked ? (
            <p className="rounded-lg border border-red-100 bg-white px-3 py-2 text-center text-sm font-bold text-[#ff0030]">Free delivery unlocked on orders of {formatKes(FREE_DELIVERY_FROM_KES)}+</p>
          ) : (
            <div>
              <p className="mb-1.5 text-center text-xs text-neutral-600">
                Add <span className="font-bold text-[#ff0030]">{formatKes(remaining)}</span> more for free delivery
              </p>
              <div className="h-2 overflow-hidden rounded-full bg-white">
                <div className="h-full bg-[#ff0030]" style={{ width: `${Math.min((cart.subtotal / FREE_DELIVERY_FROM_KES) * 100, 100)}%` }} />
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6">
          {cart.lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-neutral-500">
              <p className="text-lg font-medium text-neutral-900">Your cart is empty</p>
              <p className="mt-2 text-sm">Choose a product, set the specification, then add it here.</p>
              <Link href="/shop" onClick={cart.closeDrawer} className="mt-6 inline-flex h-11 items-center rounded-full bg-[#ff0030] px-6 text-sm font-bold text-white">Continue shopping</Link>
            </div>
          ) : (
            cart.lines.map((line) => {
              const product = productBySlug(line.slug);
              return (
                <div key={line.lineId} className="flex gap-3 sm:gap-4">
                  <Link href={`/product/${line.slug}`} onClick={cart.closeDrawer} className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-[#f8f6f4] sm:size-20">
                    {product && <Image src={productImage(product)} alt="" fill sizes="80px" className="object-cover" />}
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-start justify-between gap-2">
                      <h3 className="line-clamp-2 text-sm font-bold">{line.title}</h3>
                      <button type="button" aria-label={`Remove ${line.title}`} className="-mr-2 -mt-2 grid size-11 shrink-0 place-items-center text-neutral-400 hover:text-red-500" onClick={() => cart.remove(line.lineId)}>
                        <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                    {line.summary && <p className="mb-1 line-clamp-2 text-xs text-neutral-500">{line.summary}</p>}
                    <p className="mb-2 text-sm font-bold text-[#ff0030]">{formatKes(line.totalKes)}</p>
                    <div className="flex w-28 items-center rounded-lg border border-neutral-200">
                      <button type="button" aria-label="Decrease quantity" className="grid h-11 w-10 place-items-center text-lg text-neutral-500" onClick={() => cart.setQuantity(line.lineId, line.quantity - 1)}>−</button>
                      <span className="flex-1 text-center font-mono text-sm tabular-nums">{line.quantity}</span>
                      <button type="button" aria-label="Increase quantity" className="grid h-11 w-10 place-items-center text-lg text-neutral-500" onClick={() => cart.setQuantity(line.lineId, line.quantity + 1)}>+</button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {cart.lines.length > 0 && (
          <div className="shrink-0 border-t border-neutral-100 bg-neutral-50 px-4 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))] pt-5 sm:px-6">
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-neutral-600">Subtotal</span>
              <span className="font-mono text-lg font-bold tabular-nums">{formatKes(cart.subtotal)}</span>
            </div>
            <p className="mb-4 text-center text-xs text-neutral-500">Delivery or collection is confirmed at checkout. Pay by M-Pesa Paybill.</p>
            <div className="space-y-3">
              <Link href="/order" onClick={cart.closeDrawer} className="flex h-12 items-center justify-center rounded-full bg-[#ff0030] text-sm font-bold text-white">Checkout now</Link>
              <Link href="/cart" onClick={cart.closeDrawer} className="flex h-12 items-center justify-center rounded-full border border-[#ff0030] text-sm font-bold text-[#ff0030]">View cart</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
