"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { CartDrawer } from "./CartDrawer";
import { CartProvider } from "./CartProvider";
import { StoreFooter } from "./StoreFooter";
import { StoreHeader } from "./StoreHeader";
import { StoreTabBar } from "./StoreTabBar";
import { WhatsAppButton } from "./WhatsAppButton";

const studioPrefixes = ["/tools", "/admin", "/beta", "/feedback", "/apply", "/hire", "/guides", "/services", "/legal", "/checkout"];

export function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const studio = studioPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  return (
    <CartProvider>
      {studio ? (
        <>
          <Navbar />
          {children}
          <Footer />
        </>
      ) : (
        <div className="bg-white text-neutral-950">
          <StoreHeader />
          {children}
          <StoreFooter />
          <StoreTabBar />
          <CartDrawer />
          <WhatsAppButton />
        </div>
      )}
    </CartProvider>
  );
}
