import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/store/ProductCard";
import { groupBySlug, productsInGroup, shopGroups } from "@/lib/printshop/catalog";

export function generateStaticParams() {
  return shopGroups.map((group) => ({ slug: group.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const group = groupBySlug(slug);
  if (!group) return { title: "Category" };
  return { title: `${group.label} printing in Kenya`, description: group.summary };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const group = groupBySlug(slug);
  if (!group) notFound();
  const items = productsInGroup(group.slug);
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <p className="text-sm text-neutral-500"><Link href="/shop">Catalogue</Link> / {group.label}</p>
      <h1 className="mt-3 font-display text-4xl font-medium tracking-tight sm:text-5xl">{group.label}</h1>
      <p className="mt-4 max-w-xl text-neutral-600">{group.summary}</p>
      <div className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {items.map((product) => <ProductCard key={product.slug} product={product} />)}
      </div>
    </div>
  );
}
