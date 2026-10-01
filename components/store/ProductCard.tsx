import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CatalogProduct } from "@/lib/printshop/catalog";
import { formatKes, priceModel } from "@/lib/printshop/pricing";

export function swatch(slug: string) {
  let hash = 0;
  for (const char of slug) hash = (hash * 33 + char.charCodeAt(0)) % 360;
  return `hsl(${hash} 58% 38%)`;
}

export function ProductCard({ product }: { product: CatalogProduct }) {
  const quote = priceModel(product) === "quote";
  return (
    <Link href={`/product/${product.slug}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white transition hover:border-[#ff0030]">
      <div className="relative grid aspect-[4/3] place-items-center overflow-hidden" style={{ background: swatch(product.slug) }}>
        <span className="px-4 text-center text-lg font-black tracking-tight text-white/95">{product.title.split(" ").slice(0, 2).join(" ")}</span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-semibold text-neutral-500">{product.category}</p>
        <h3 className="mt-1 line-clamp-2 min-h-12 font-bold leading-6 text-neutral-950">{product.title}</h3>
        <div className="mt-auto flex items-center justify-between pt-4">
          <b className="font-mono text-sm tabular-nums text-neutral-950">{quote ? "Quote" : formatKes(product.fromKes)}</b>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#ff0030]">
            Order Now <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
