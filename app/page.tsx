import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/store/ProductCard";
import { products, shopGroups } from "@/lib/printshop/catalog";
import { deliveryTowns, faqs, specBlocks } from "@/lib/printshop/content";
import { formatKes, priceModel } from "@/lib/printshop/pricing";

const steps = [
  ["01", "Choose and customise", "Pick a product, set the quantity, sides and turnaround, and watch the price update."],
  ["02", "Send your artwork", "PDF, AI or PNG at 300 DPI. If you only have a logo, ask for design help on the quote."],
  ["03", "We print and deliver", "Same-day in Nairobi on selected jobs, 2–3 days standard, then to your door in any county."],
];

export default function HomePage() {
  const ticker = products.filter((product) => product.fromKes > 0).slice(0, 12);
  return (
    <div>
      <section className="border-b border-neutral-200 bg-[#fff8f8]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_.8fr] lg:py-20">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#ff0030]">Kenya’s online print shop</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black leading-[1.02] tracking-tight sm:text-6xl">Online printing for businesses, events and every occasion.</h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-neutral-600">Premium materials and precise colour. Upload your artwork and order online for same-day printing in Nairobi, with delivery across all 47 counties.</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/shop" className="inline-flex h-12 items-center rounded-2xl bg-[#ff0030] px-5 font-semibold text-white">Browse all products</Link>
              <Link href="/contact" className="text-sm font-semibold text-neutral-700">Get a free quote</Link>
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm text-neutral-600">
              {["Same-day in Nairobi", "Quality checked before press", "Nationwide delivery"].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-3 self-end">
            {products.filter((product) => ["branded-t-shirt", "business-cards-printing", "roll-up-banner-printing", "branded-mugs"].includes(product.slug)).map((product) => (
              <Link key={product.slug} href={`/product/${product.slug}`} className="rounded-2xl border border-neutral-200 bg-white p-4">
                <p className="text-sm font-bold leading-5">{product.title}</p>
                <p className="mt-3 font-mono text-sm font-bold tabular-nums">From {formatKes(product.fromKes)}</p>
              </Link>
            ))}
          </div>
        </div>
        <div className="overflow-hidden border-t border-neutral-200 bg-white">
          <div className="shop-marquee flex w-max gap-8 py-3">
            {[...ticker, ...ticker].map((product, index) => (
              <span key={`${product.slug}-${index}`} className="text-sm font-semibold text-neutral-700">
                {product.title} <span className="font-mono tabular-nums text-[#ff0030]">From {formatKes(product.fromKes)}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Shop by print category</h2>
        <p className="mt-3 max-w-2xl text-neutral-600">From a single business card to a full event brand. Printed after you order, then delivered.</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {shopGroups.map((group) => (
            <Link key={group.slug} href={`/category/${group.slug}`} className="rounded-2xl border border-neutral-200 p-5 hover:border-[#ff0030]">
              <h3 className="font-bold">{group.label}</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-600">{group.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      {shopGroups.map((group) => {
        const items = products.filter((product) => product.group === group.slug).slice(0, 4);
        if (items.length === 0) return null;
        return (
          <section key={group.slug} className="border-t border-neutral-100">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
              <div className="flex items-end justify-between gap-4">
                <h2 className="text-2xl font-black tracking-tight">{group.label}</h2>
                <Link href={`/category/${group.slug}`} className="text-sm font-semibold text-[#ff0030]">View all</Link>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {items.map((product) => <ProductCard key={product.slug} product={product} />)}
              </div>
            </div>
          </section>
        );
      })}

      <section className="bg-neutral-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <h2 className="text-3xl font-black tracking-tight">From your idea to your doorstep in 3 steps</h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {steps.map(([index, title, copy]) => (
              <li key={index} className="rounded-2xl border border-white/10 p-5">
                <p className="font-mono text-sm text-[#ff8aa0]">{index}</p>
                <h3 className="mt-4 text-xl font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/70">{copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="max-w-3xl text-3xl font-black tracking-tight">Materials, finishes and what each range is for</h2>
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {specBlocks.map((block) => (
            <article key={block.title} className="rounded-2xl border border-neutral-200 p-5">
              <h3 className="text-lg font-bold">{block.title}</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-600">{block.body}</p>
              <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold text-[#ff0030]">
                {block.links.map((slug) => {
                  const product = products.find((item) => item.slug === slug);
                  if (!product) return null;
                  return <Link key={slug} href={`/product/${slug}`}>{product.title}</Link>;
                })}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-neutral-200 bg-neutral-50">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-black tracking-tight">Printing across all 47 counties</h2>
            <p className="mt-3 text-neutral-600">Nairobi delivery is {formatKes(400)}. Outside Nairobi is {formatKes(850)}. Orders above {formatKes(10000)} ship free. Same-day printing is available in Nairobi.</p>
          </div>
          <ul className="flex flex-wrap gap-2">
            {deliveryTowns.map((town) => (
              <li key={town} className="rounded-full border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold">{town}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h2 className="text-3xl font-black tracking-tight">Printing questions</h2>
        <div className="mt-6 divide-y divide-neutral-200 border-y border-neutral-200">
          {faqs.map((item) => (
            <details key={item.q} className="group py-4">
              <summary className="cursor-pointer list-none font-semibold">{item.q}</summary>
              <p className="mt-2 text-sm leading-6 text-neutral-600">{item.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/shop" className="inline-flex h-12 items-center gap-2 rounded-2xl bg-[#ff0030] px-5 font-semibold text-white">Browse all products <ArrowRight className="size-4" /></Link>
          <Link href="/contact" className="inline-flex h-12 items-center font-semibold">Get a free quote</Link>
        </div>
      </section>
      <p className="sr-only">{products.filter((product) => priceModel(product) === "quote").length} products are quoted on request.</p>
    </div>
  );
}
