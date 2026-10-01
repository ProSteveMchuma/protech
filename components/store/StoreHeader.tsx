"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { shopGroups } from "@/lib/printshop/catalog";
import { whatsappDisplay, whatsappHref } from "@/lib/whatsapp";
import { useCart } from "./CartProvider";

export function StoreHeader() {
  const cart = useCart();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-5 px-4 sm:px-6">
        <button type="button" className="grid size-11 place-items-center md:hidden" aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((value) => !value)}>
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
        <Link href="/" aria-label="ProPrint home"><Logo tone="shop" size={28} /></Link>
        <nav className="hidden items-center gap-5 text-sm text-neutral-600 md:flex" aria-label="Shop">
          <Link href="/shop" className="text-neutral-950">Shop</Link>
          <Link href="/about">About</Link>
        </nav>
        <form action="/shop" className="ml-auto hidden min-w-0 max-w-sm flex-1 md:block">
          <label className="relative block">
            <span className="sr-only">Search products</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
            <input name="q" placeholder="Search the catalogue" className="h-10 w-full rounded-full border border-neutral-200 bg-[#f6f4f1] pl-10 pr-4 text-sm outline-none focus:border-neutral-950" />
          </label>
        </form>
        <a href={whatsappHref()} className="ml-auto hidden text-sm text-neutral-600 md:ml-0 md:inline" target="_blank" rel="noopener noreferrer">WhatsApp {whatsappDisplay()}</a>
        <button type="button" className="ml-auto grid size-11 place-items-center md:ml-0 md:hidden" aria-label="Search" onClick={() => setSearchOpen((value) => !value)}>
          <Search className="size-5" />
        </button>
        <Link href="/cart" className="relative grid size-11 place-items-center" aria-label={`Cart, ${cart.count} items`}>
          <ShoppingBag className="size-5" />
          {cart.count > 0 && <span className="absolute right-1 top-1 grid min-w-4 place-items-center rounded-full bg-neutral-950 px-1 text-[10px] font-medium text-white">{cart.count}</span>}
        </Link>
      </div>
      {searchOpen && (
        <form action="/shop" className="border-t border-neutral-100 px-4 py-3 md:hidden">
          <input name="q" placeholder="Search the catalogue" className="h-11 w-full rounded-full border border-neutral-200 bg-[#f6f4f1] px-4 text-sm" />
        </form>
      )}
      {open && (
        <div className="border-t border-neutral-100 bg-white px-4 py-3 md:hidden">
          <Link href="/shop" onClick={() => setOpen(false)} className="block px-1 py-3 text-sm font-medium">Shop</Link>
          {shopGroups.map((group) => (
            <Link key={group.slug} href={`/category/${group.slug}`} onClick={() => setOpen(false)} className="block px-1 py-3 text-sm text-neutral-600">{group.label}</Link>
          ))}
          <Link href="/about" onClick={() => setOpen(false)} className="block px-1 py-3 text-sm text-neutral-600">About</Link>
          <a href={whatsappHref("Hello ProPrint, I need a print quote.")} onClick={() => setOpen(false)} className="block px-1 py-3 text-sm text-neutral-950" target="_blank" rel="noopener noreferrer">WhatsApp {whatsappDisplay()}</a>
        </div>
      )}
    </header>
  );
}
