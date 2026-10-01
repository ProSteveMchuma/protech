import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ProductCard } from "@/components/store/ProductCard";
import { filterProducts, products, shopGroups } from "@/lib/printshop/catalog";
import { interpretSearch } from "@/lib/printshop/search";
import { whatsappDisplay, whatsappHref } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "All printing products",
  description: "Business cards, flyers, banners, apparel, mugs, stickers and signage. Filter by category and price, then order online for Nairobi and all 47 counties.",
};

const bands = [
  ["all", "All prices"],
  ["under-1000", "Under KES 1,000"],
  ["mid", "KES 1,000–10,000"],
  ["premium", "Premium"],
] as const;

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
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-[.16em] text-[#ff0030]">Shop</p>
      <h1 className="mt-2 text-4xl font-black tracking-tight">All printing products</h1>
      <p className="mt-3 max-w-2xl text-neutral-600">Browse {products.length} made-to-order products. Same-day printing in Nairobi on selected jobs, and delivery to every county. <a className="font-semibold text-[#128C7E]" href={whatsappHref("Hello ProPrint, help me find a product.")} target="_blank" rel="noopener noreferrer">WhatsApp {whatsappDisplay()}</a></p>
      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        <Link href={`/shop?band=${band}`} className={`shrink-0 rounded-full px-3 py-2 text-sm font-semibold ${group === "all" ? "bg-neutral-950 text-white" : "bg-neutral-100"}`}>All</Link>
        {shopGroups.map((item) => (
          <Link key={item.slug} href={`/shop?group=${item.slug}&band=${band}${query.q ? `&q=${encodeURIComponent(query.q)}` : ""}`} className={`shrink-0 rounded-full px-3 py-2 text-sm font-semibold ${group === item.slug ? "bg-neutral-950 text-white" : "bg-neutral-100"}`}>{item.nav}</Link>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {bands.map(([value, label]) => (
          <Link key={value} href={`/shop?band=${value}${group !== "all" ? `&group=${group}` : ""}${query.q ? `&q=${encodeURIComponent(query.q)}` : ""}`} className={`rounded-full border px-3 py-2 text-sm font-semibold ${band === value ? "border-[#ff0030] text-[#ff0030]" : "border-neutral-200"}`}>{label}</Link>
        ))}
      </div>
      {query.q && <p className="mt-4 text-sm">Results for “{query.q}”</p>}
      {list.length === 0 ? (
        <p className="mt-10 text-neutral-600">Nothing matches that filter. <Link href="/shop" className="font-semibold text-[#ff0030]">Clear it</Link> or <Link href="/contact" className="font-semibold text-[#ff0030]">ask for a custom job</Link>.</p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((product) => <ProductCard key={product.slug} product={product} />)}
        </div>
      )}
    </div>
  );
}
