import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ProductCard } from "@/components/store/ProductCard";
import { ShopFilters } from "@/components/store/ShopFilters";
import { filterProducts, products } from "@/lib/printshop/catalog";
import { interpretSearch } from "@/lib/printshop/search";

export const metadata: Metadata = {
  title: "All printing products",
  description: "Business cards, flyers, banners, apparel, mugs, stickers and signage. Filter by category and price, then order online for Nairobi and all 47 counties.",
};

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ q?: string; group?: string; band?: string }> }) {
  const query = await searchParams;
  if (query.q) {
    const hit = interpretSearch(query.q);
    if (hit) {
      const params = new URLSearchParams();
      if (hit.quantity) params.set("qty", String(hit.quantity));
      if (hit.hint) params.set("hint", hit.hint);
      redirect(`/product/${hit.slug}${params.size ? `?${params}` : ""}`);
    }
  }
  const list = filterProducts({ q: query.q, group: query.group, band: query.band });
  const band = query.band ?? "all";
  const group = query.group ?? "all";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8 lg:px-12">
      <h1 className="font-display text-4xl font-medium tracking-tight sm:text-5xl">Catalogue</h1>
      <p className="mt-4 max-w-xl text-neutral-600">{products.length} made-to-order products. The price is on each product, before you pay.</p>
      <ShopFilters group={group} band={band} q={query.q} />
      {query.q && <p className="mt-6 text-sm text-neutral-600">Results for “{query.q}”</p>}
      {list.length === 0 ? (
        <p className="mt-12 text-neutral-600">Nothing matches that filter. <Link href="/shop" className="text-neutral-950 underline">Clear it</Link>.</p>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {list.map((product) => <ProductCard key={product.slug} product={product} />)}
        </div>
      )}
    </div>
  );
}
