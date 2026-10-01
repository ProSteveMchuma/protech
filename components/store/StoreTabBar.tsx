"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { whatsappDisplay, whatsappHref } from "@/lib/whatsapp";
import { useCart } from "./CartProvider";

const tabs = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/cart", label: "Cart" },
];

export function StoreTabBar() {
  const pathname = usePathname();
  const cart = useCart();
  if (pathname === "/order" || pathname.startsWith("/orders/")) return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white pb-[env(safe-area-inset-bottom)] md:hidden" aria-label="Shop">
      <ul className="grid h-16 grid-cols-4">
        {tabs.map((tab) => {
          const active = tab.href === "/" ? pathname === "/" : pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          return (
            <li key={tab.href}>
              <Link href={tab.href} className={`flex h-full flex-col items-center justify-center gap-0.5 text-xs ${active ? "font-medium text-neutral-950" : "text-neutral-500"}`}>
                <span>{tab.label}</span>
                {tab.href === "/cart" && cart.count > 0 && <span className="font-mono text-[10px] tabular-nums">{cart.count}</span>}
              </Link>
            </li>
          );
        })}
        <li>
          <a href={whatsappHref("Hello ProPrint, I need help with an order.")} className="flex h-full flex-col items-center justify-center text-xs text-neutral-500" target="_blank" rel="noopener noreferrer">
            WhatsApp
            <span className="sr-only">{whatsappDisplay()}</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}
