"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/Logo";
import { pickup } from "@/lib/config";
import { formatKes, FREE_DELIVERY_FROM_KES } from "@/lib/printshop/pricing";
import { useCart } from "./CartProvider";

const helpLinks = [
  { href: "/contact", label: "Contact" },
  { href: "/about", label: "About" },
  { href: "/print-on-demand", label: "How ordering works" },
  { href: "/terms", label: "Print terms" },
];

export function StoreHeader() {
  const cart = useCart();
  const [helpOpen, setHelpOpen] = useState(false);
  const helpRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onPointer(event: MouseEvent) {
      if (helpRef.current && !helpRef.current.contains(event.target as Node)) setHelpOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setHelpOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-100 bg-white/90 backdrop-blur-md">
      <div className="border-b border-neutral-100 bg-[#fff5f6] py-1.5">
        <p className="px-4 text-center text-[10px] font-medium uppercase tracking-widest text-neutral-700 md:text-xs">
          Free delivery on orders over <span className="font-black text-[#ff0030] underline decoration-red-200 decoration-2">{formatKes(FREE_DELIVERY_FROM_KES)}</span>
          <span className="hidden md:inline"> — collect free at {pickup.address}</span>
        </p>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:gap-6 sm:px-8 lg:px-12">
        <Link href="/" aria-label="ProPrint home" className="shrink-0">
          <Logo tone="shop" size={28} />
        </Link>

        <form action="/shop" className="hidden min-w-0 max-w-2xl flex-1 md:block">
          <label className="relative block">
            <span className="sr-only">Search products</span>
            <svg className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" /></svg>
            <input name="q" placeholder="Search cards, banners, apparel…" className="h-11 w-full rounded-full border border-neutral-200 bg-neutral-50 pl-11 pr-4 text-sm outline-none focus:border-[#ff0030] focus:bg-white" />
          </label>
        </form>

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <Link href="/shop" className="hidden text-sm font-black text-neutral-950 lg:inline">Shop</Link>
          <div className="relative hidden lg:block" ref={helpRef}>
            <button type="button" className="flex items-center gap-1 text-sm font-black text-neutral-950" aria-expanded={helpOpen} aria-controls="help-menu" onClick={() => setHelpOpen((open) => !open)}>
              Help
              <svg className={`size-3 transition ${helpOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {helpOpen && (
              <div id="help-menu" className="absolute right-0 z-50 mt-2 w-52 rounded-xl border border-neutral-100 bg-white py-1 shadow-lg">
                {helpLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="block px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-[#fff5f6] hover:text-[#ff0030]" onClick={() => setHelpOpen(false)}>
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link href="/account" aria-label="Account" className="grid size-11 place-items-center rounded-full bg-neutral-50 text-neutral-700">
            <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </Link>
          <button type="button" onClick={cart.toggleDrawer} aria-label={`Open cart${cart.count ? `, ${cart.count} item${cart.count === 1 ? "" : "s"}` : ""}`} className="flex items-center gap-2">
            <span className="relative grid size-11 place-items-center rounded-full bg-neutral-50">
              <svg className="size-6 text-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              {cart.count > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full border-2 border-white bg-[#ff0030] px-1 text-[10px] font-bold text-white">{cart.count}</span>}
            </span>
            <span className="hidden text-sm font-black uppercase tracking-widest lg:inline">Cart</span>
          </button>
        </div>
      </div>

      <form action="/shop" className="border-t border-neutral-100 px-4 pb-3 pt-2 md:hidden">
        <label className="relative block">
          <span className="sr-only">Search products</span>
          <svg className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" /></svg>
          <input name="q" placeholder="Search the catalogue" className="h-11 w-full rounded-full border border-neutral-200 bg-neutral-50 pl-11 pr-4 text-sm outline-none focus:border-[#ff0030]" />
        </label>
      </form>
    </header>
  );
}
