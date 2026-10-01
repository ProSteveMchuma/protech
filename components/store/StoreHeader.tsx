"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { shopGroups } from "@/lib/printshop/catalog";
import { useCart } from "./CartProvider";

export function StoreHeader() {
  const cart = useCart();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <button type="button" className="grid size-11 place-items-center rounded-xl border border-neutral-200 md:hidden" aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((value) => !value)}>
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
        <Link href="/" className="mr-auto" aria-label="ProPrint home"><Logo tone="shop" size={32} /></Link>
        <form action="/shop" className="hidden min-w-0 flex-1 md:block">
          <label className="relative block">
            <span className="sr-only">Search products</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
            <input name="q" placeholder="Search business cards, banners, stickers, books…" className="h-11 w-full rounded-2xl border border-neutral-200 bg-neutral-50 pl-10 pr-4 text-sm outline-none focus:border-[#ff0030]" />
          </label>
        </form>
        <button type="button" className="grid size-11 place-items-center rounded-xl border border-neutral-200 md:hidden" aria-label="Search" onClick={() => setSearchOpen((value) => !value)}>
          <Search className="size-5" />
        </button>
        <Link href="/contact" className="hidden text-sm font-semibold text-neutral-600 md:inline">Quote</Link>
        <Link href="/cart" className="relative grid size-11 place-items-center rounded-xl border border-neutral-200" aria-label={`Cart, ${cart.count} items`}>
          <ShoppingBag className="size-5" />
          {cart.count > 0 && <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-[#ff0030] px-1 text-[10px] font-bold text-white">{cart.count}</span>}
        </Link>
      </div>
      {searchOpen && (
        <form action="/shop" className="border-t border-neutral-100 px-4 py-3 md:hidden">
          <input name="q" placeholder="Search products" className="h-11 w-full rounded-2xl border border-neutral-200 px-4 text-sm" />
        </form>
      )}
      {open && (
        <div className="border-t border-neutral-100 bg-white px-4 py-3 md:hidden">
          <Link href="/shop" onClick={() => setOpen(false)} className="block rounded-xl px-3 py-3 font-semibold">All Products</Link>
          {shopGroups.map((group) => (
            <Link key={group.slug} href={`/category/${group.slug}`} onClick={() => setOpen(false)} className="block rounded-xl px-3 py-3 font-semibold">{group.label}</Link>
          ))}
          <Link href="/packages" onClick={() => setOpen(false)} className="block rounded-xl px-3 py-3 font-semibold">Packages</Link>
          <Link href="/print-on-demand" onClick={() => setOpen(false)} className="block rounded-xl px-3 py-3 font-semibold">Print on demand</Link>
          <Link href="/contact" onClick={() => setOpen(false)} className="mt-2 block rounded-2xl bg-[#ff0030] px-3 py-3 text-center font-semibold text-white">Get a free quote</Link>
        </div>
      )}
    </header>
  );
}
