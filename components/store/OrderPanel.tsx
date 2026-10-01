"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ShoppingBag } from "lucide-react";
import type { CatalogProduct } from "@/lib/printshop/catalog";
import {
  allowsSides,
  formatKes,
  lineTotal,
  priceModel,
  quantitiesFor,
  turnaroundLabel,
  type Turnaround,
} from "@/lib/printshop/pricing";
import { useCart } from "./CartProvider";

export function OrderPanel({ product }: { product: CatalogProduct }) {
  const model = priceModel(product);
  const quantities = quantitiesFor(model);
  const sidesAllowed = allowsSides(product);
  const [quantity, setQuantity] = useState(quantities[model === "unit" ? 1 : 0] ?? 1);
  const [sides, setSides] = useState<1 | 2>(1);
  const [turnaround, setTurnaround] = useState<Turnaround>("standard");
  const [added, setAdded] = useState(false);
  const cart = useCart();

  if (model === "quote") {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
        <p className="text-sm font-semibold text-neutral-500">Custom quote</p>
        <p className="mt-2 text-sm leading-6 text-neutral-700">Page count, size and binding change this price. Send the specification and we will reply with a fixed quote.</p>
        <Link href={`/contact?product=${product.slug}`} className="mt-5 inline-flex min-h-11 items-center justify-center rounded-2xl bg-[#ff0030] px-5 font-semibold text-white">
          Request a quote
        </Link>
      </div>
    );
  }

  const priced = lineTotal({ fromKes: product.fromKes, model, quantity, sides, turnaround });
  const summary = [sidesAllowed && sides === 2 ? "Double-sided" : sidesAllowed ? "Single-sided" : null, turnaroundLabel[turnaround]]
    .filter(Boolean)
    .join(" · ");

  return (
    <form
      className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
      onSubmit={(event) => {
        event.preventDefault();
        cart.add({ slug: product.slug, title: product.title, quantity, unitKes: priced.unitKes, summary });
        setAdded(true);
      }}
    >
      <p className="text-xs font-bold uppercase tracking-[.16em] text-[#ff0030]">Configure</p>
      <p className="mt-2 font-mono text-3xl font-black tabular-nums text-neutral-950">{formatKes(priced.totalKes)}</p>
      <p className="mt-1 font-mono text-xs tabular-nums text-neutral-500">{formatKes(priced.unitKes)} each · {quantity.toLocaleString("en-KE")} pcs</p>

      <fieldset className="mt-5">
        <legend className="text-sm font-semibold">Quantity</legend>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {quantities.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => { setQuantity(value); setAdded(false); }}
              className={`min-h-11 rounded-xl border text-sm font-semibold tabular-nums ${quantity === value ? "border-[#ff0030] bg-[#fff1f3] text-[#ff0030]" : "border-neutral-200"}`}
            >
              {value.toLocaleString("en-KE")}
            </button>
          ))}
        </div>
      </fieldset>

      {sidesAllowed && (
        <fieldset className="mt-4">
          <legend className="text-sm font-semibold">Print option</legend>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {([1, 2] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => { setSides(value); setAdded(false); }}
                className={`min-h-11 rounded-xl border text-sm font-semibold ${sides === value ? "border-[#ff0030] bg-[#fff1f3] text-[#ff0030]" : "border-neutral-200"}`}
              >
                {value === 1 ? "Single-sided" : "Double-sided"}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <fieldset className="mt-4">
        <legend className="text-sm font-semibold">Turnaround</legend>
        <div className="mt-2 grid gap-2">
          {(Object.keys(turnaroundLabel) as Turnaround[]).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => { setTurnaround(value); setAdded(false); }}
              className={`min-h-11 rounded-xl border px-3 text-left text-sm font-semibold ${turnaround === value ? "border-[#ff0030] bg-[#fff1f3] text-[#ff0030]" : "border-neutral-200"}`}
            >
              {turnaroundLabel[value]}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs leading-5 text-neutral-500">Same-day Nairobi printing is available on selected digital jobs approved before 10:00. Rush applies to Nairobi production.</p>
      </fieldset>

      <button type="submit" className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#ff0030] font-semibold text-white">
        <ShoppingBag className="size-4" /> Add to cart
      </button>
      {added && (
        <p className="mt-3 flex items-center justify-between text-sm text-emerald-700">
          <span className="inline-flex items-center gap-1"><Check className="size-4" /> Added</span>
          <Link href="/cart" className="font-semibold text-[#ff0030]">View cart</Link>
        </p>
      )}
    </form>
  );
}
