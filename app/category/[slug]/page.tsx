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
      <p className="text-sm text-neutral-500"><Link href="/shop">All products</Link> / {group.label}</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight">{group.label}</h1>
      <p className="mt-3 max-w-2xl text-neutral-600">{group.summary} {items.length} products in this range.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((product) => <ProductCard key={product.slug} product={product} />)}
      </div>
    </div>
  );
}
