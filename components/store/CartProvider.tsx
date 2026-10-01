"use client";

import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";

export type CartLine = {
  lineId: string;
  slug: string;
  title: string;
  quantity: number;
  unitKes: number;
  summary: string;
};

type CartValue = {
  lines: CartLine[];
  ready: boolean;
  count: number;
  subtotal: number;
  add: (line: Omit<CartLine, "lineId">) => void;
  remove: (lineId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartValue | null>(null);
const STORAGE_KEY = "proprint-cart";
const CHANGE_EVENT = "proprint-cart-change";

function parseCart(raw: string | null): CartLine[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as CartLine[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((line) => line && typeof line.lineId === "string" && typeof line.unitKes === "number" && line.unitKes > 0 && line.quantity > 0);
  } catch {
    return [];
  }
}

let cachedRaw: string | null = null;
let cachedLines: CartLine[] = [];

function readCart() {
  if (typeof window === "undefined") return cachedLines;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) return cachedLines;
  cachedRaw = raw;
  cachedLines = parseCart(raw);
  return cachedLines;
}

function writeCart(lines: CartLine[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const lines = useSyncExternalStore(subscribe, readCart, () => []);
  const value = useMemo<CartValue>(() => {
    return {
      lines,
      ready: true,
      count: lines.length,
      subtotal: lines.reduce((sum, line) => sum + line.unitKes * line.quantity, 0),
      add: (line) => writeCart([{ ...line, lineId: crypto.randomUUID() }, ...readCart()]),
      remove: (lineId) => writeCart(readCart().filter((line) => line.lineId !== lineId)),
      clear: () => writeCart([]),
    };
  }, [lines]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside CartProvider");
  return value;
}
