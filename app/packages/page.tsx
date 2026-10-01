import type { Metadata } from "next";
import Link from "next/link";
import { bundleItems, bundles } from "@/lib/printshop/content";
import { defaultSpec, formatKes, quoteProduct } from "@/lib/printshop/pricing";

export const metadata: Metadata = {
  title: "Business packages",
  description: "Printing bundles for Kenyan businesses: stationery, startup kits, branding and event sets. Bundle pricing is 10% under the separate shelf prices.",
};

function bundlePrice(slugs: string[]) {
  const total = bundleItems(slugs).reduce((sum, product) => {
    const spec = defaultSpec(product);
    if (!spec) return sum;
    return sum + (quoteProduct(product, spec)?.totalKes ?? 0);
  }, 0);
  return Math.round(total * 0.9);
}

export default function PackagesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-[.16em] text-[#ff0030]">Bundles</p>
      <h1 className="mt-2 text-4xl font-black tracking-tight">Business packages</h1>
      <p className="mt-3 max-w-2xl text-neutral-600">Curated sets for a launch, a front desk or an exhibition. Each package is priced at 10% under ordering the same pieces separately. Adjust quantities on the product pages, or ask for a custom mix.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {bundles.map((bundle) => {
          const items = bundleItems(bundle.slugs);
          return (
            <article key={bundle.slug} id={bundle.slug} className="rounded-2xl border border-neutral-200 p-6">
              <h2 className="text-2xl font-black">{bundle.title}</h2>
              <p className="mt-2 text-sm leading-6 text-neutral-600">{bundle.summary}</p>
              <ul className="mt-4 grid gap-2 text-sm font-semibold">
                {items.map((item) => (
                  <li key={item.slug}><Link href={`/product/${item.slug}`} className="hover:text-[#ff0030]">{item.title}</Link></li>
                ))}
              </ul>
              <p className="mt-5 font-mono text-2xl font-black tabular-nums">{formatKes(bundlePrice(bundle.slugs))}</p>
              <p className="text-xs text-neutral-500">From price at the standard specification for each item, 10% under buying them separately.</p>
              <Link href={`/contact?product=${bundle.slug}`} className="mt-4 inline-flex h-11 items-center rounded-2xl bg-[#ff0030] px-4 text-sm font-semibold text-white">Request this package</Link>
            </article>
          );
        })}
      </div>
      <div className="mt-10 rounded-2xl bg-neutral-950 p-6 text-white">
        <h2 className="text-2xl font-black">Need a custom package?</h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-white/75">Tell us the products, quantities and the date you need them. We will send one quote instead of five separate carts.</p>
        <Link href="/contact" className="mt-4 inline-flex h-11 items-center rounded-2xl bg-white px-4 text-sm font-semibold text-neutral-950">Request a custom quote</Link>
      </div>
    </div>
  );
}
