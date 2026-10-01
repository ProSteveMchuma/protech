"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { whatsappDisplay, whatsappHref } from "@/lib/whatsapp";
import { useCart } from "./CartProvider";

export function hidesStoreTabBar(pathname: string) {
  return pathname === "/order" || pathname.startsWith("/orders/") || pathname === "/cart" || pathname.startsWith("/product/");
}

export function StoreTabBar() {
  const pathname = usePathname();
  const cart = useCart();
  if (hidesStoreTabBar(pathname)) return null;

  const shopActive = pathname === "/shop" || pathname.startsWith("/category/");
  const items = [
    { href: "/", label: "Home", active: pathname === "/" },
    { href: "/shop", label: "Shop", active: shopActive },
    { href: "/cart", label: "Cart", active: pathname === "/cart", count: cart.count },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-100 bg-white/90 pb-[env(safe-area-inset-bottom)] shadow-[0_-5px_20px_rgba(0,0,0,0.04)] backdrop-blur-md md:hidden" aria-label="Shop">
      <ul className="grid h-16 grid-cols-4">
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className={`flex h-full flex-col items-center justify-center gap-0.5 text-[10px] font-medium ${item.active ? "text-[#ff0030]" : "text-neutral-500"}`}>
              {item.href === "/" && <HomeIcon active={item.active} />}
              {item.href === "/shop" && <ShopIcon active={item.active} />}
              {item.href === "/cart" && (
                <span className="relative">
                  <CartIcon active={item.active} />
                  {item.count ? <span className="absolute -right-2 -top-2 grid size-4 place-items-center rounded-full bg-[#ff0030] text-[10px] font-bold text-white">{item.count}</span> : null}
                </span>
              )}
              {item.label}
            </Link>
          </li>
        ))}
        <li>
          <a href={whatsappHref("Hello ProPrint, I need help with an order.")} className="flex h-full flex-col items-center justify-center gap-0.5 text-[10px] font-medium text-neutral-500" target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon />
            WhatsApp
            <span className="sr-only">{whatsappDisplay()}</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg className="size-6" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? 0 : 2} aria-hidden="true">
      {active
        ? <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        : <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />}
    </svg>
  );
}

function ShopIcon({ active }: { active: boolean }) {
  return (
    <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.4 : 2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h10" />
    </svg>
  );
}

function CartIcon({ active }: { active: boolean }) {
  return (
    <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.4 : 2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg className="size-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.5 3.5A11 11 0 0 0 2.1 17.2L1 23l6-1.6A11 11 0 0 0 20.5 3.5Zm-8.5 17a9.1 9.1 0 0 1-4.6-1.3l-.3-.2-3.6.9.9-3.5-.2-.3A9.1 9.1 0 1 1 12 20.5Z" />
    </svg>
  );
}
