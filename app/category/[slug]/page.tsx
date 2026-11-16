import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { ProductCard } from "@/components/store/ProductCard";
import { groupBySlug, productBySlug, productsInGroup, shopGroups } from "@/lib/printshop/catalog";
import { specBlocks } from "@/lib/printshop/content";
import { groupImage } from "@/lib/printshop/images";
import { breadcrumbJsonLd, categoryItemListJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return shopGroups.map((group) => ({ slug: group.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const group = groupBySlug(slug);
  if (!group) return { title: "Category" };
  const count = productsInGroup(group.slug).length;
  const description = `${group.summary} ${count} products, priced online. Pay by M-Pesa; delivery across Kenya.`;
  return {
    title: group.heading,
    description,
    alternates: { canonical: `/category/${group.slug}` },
    openGraph: { title: `${group.heading} | ProPrint`, description, url: `/category/${group.slug}`, images: [{ url: groupImage[group.slug], alt: group.label }] },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const group = groupBySlug(slug);
  if (!group) notFound();
  const items = productsInGroup(group.slug);
  const spec = specBlocks.find((block) => block.group === group.slug);
  const popular = (spec?.links ?? []).flatMap((link) => {
    const product = productBySlug(link);
    return product ? [product] : [];
  });
  const otherGroups = shopGroups.filter((item) => item.slug !== group.slug);
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Catalogue", path: "/shop" },
            { name: group.label, path: `/category/${group.slug}` },
          ]),
          categoryItemListJsonLd(group.slug, items),
        ]}
      />
      <nav aria-label="Breadcrumb" className="text-sm text-neutral-500"><Link href="/shop">Catalogue</Link> / {group.label}</nav>
      <h1 className="mt-3 font-display text-4xl font-medium tracking-tight sm:text-5xl">{group.heading}</h1>
      <p className="mt-4 max-w-xl text-neutral-600">{group.summary} Every product shows its price before you pay.</p>
      <div className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {items.map((product) => <ProductCard key={product.slug} product={product} />)}
      </div>

      {spec && (
        <section className="mt-16 max-w-3xl" aria-labelledby="category-details">
          <h2 id="category-details" className="font-display text-2xl font-medium">{spec.title}</h2>
          <p className="mt-3 leading-7 text-neutral-600">{spec.body}</p>
          {popular.length > 0 && (
            <p className="mt-3 leading-7 text-neutral-600">
              Most ordered:{" "}
              {popular.map((product, index) => (
                <span key={product.slug}>
                  {index > 0 && (index === popular.length - 1 ? " and " : ", ")}
                  <Link href={`/product/${product.slug}`} className="font-semibold text-neutral-950 underline decoration-red-200 underline-offset-2 hover:text-[#ff0030]">{product.title}</Link>
                </span>
              ))}
              .
            </p>
          )}
          <p className="mt-3 leading-7 text-neutral-600">
            Printed in Nairobi and delivered to all 47 counties, or collected free at our Karen office. See <Link href="/print-on-demand" className="font-semibold text-neutral-950 underline decoration-red-200 underline-offset-2">how ordering works</Link>.
          </p>
        </section>
      )}

      <section className="mt-12" aria-labelledby="other-categories">
        <h2 id="other-categories" className="text-sm font-black uppercase tracking-widest text-neutral-500">Other categories</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {otherGroups.map((item) => (
            <li key={item.slug}>
              <Link href={`/category/${item.slug}`} className="inline-flex min-h-11 items-center rounded-full border border-neutral-200 px-4 text-sm font-semibold text-neutral-700 hover:border-red-200 hover:text-[#ff0030]">{item.label}</Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
