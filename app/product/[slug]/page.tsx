import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/store/ProductCard";
import { groupBySlug, productBySlug, products, productsInGroup } from "@/lib/printshop/catalog";
import { productImage } from "@/lib/printshop/images";
import { formatKes, shelfKes } from "@/lib/printshop/pricing";
import { OrderPanel } from "@/components/store/OrderPanel";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = productBySlug(slug);
  if (!product) return { title: "Product" };
  const from = shelfKes(product);
  return {
    title: `${product.title} in Kenya`,
    description: from ? `${product.title} from ${formatKes(from)}. Order online for Nairobi and nationwide delivery.` : `${product.title}. Request a quote for production and delivery across Kenya.`,
  };
}

export default async function ProductPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ qty?: string; hint?: string }> }) {
  const { slug } = await params;
  const query = await searchParams;
  const quantity = Number(query.qty);
  const product = productBySlug(slug);
  if (!product) notFound();
  const group = groupBySlug(product.group);
  const related = productsInGroup(product.group).filter((item) => item.slug !== product.slug).slice(0, 4);
  const from = shelfKes(product);
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <p className="text-sm text-neutral-500">
        <Link href="/shop">Shop</Link>
        {group && <> / <Link href={`/category/${group.slug}`}>{group.label}</Link></>}
      </p>
      <div className="mt-6 grid items-start gap-8 lg:grid-cols-[1.1fr_.9fr]">
        <div>
          <Image src={productImage(product)} alt={product.title} width={1200} height={900} priority className="aspect-[4/3] w-full rounded-3xl object-cover" />
          <h1 className="mt-6 text-4xl font-black tracking-tight">{product.title}</h1>
          <p className="mt-2 font-mono text-lg font-bold tabular-nums">{from ? `From ${formatKes(from)}` : "Quoted per specification"}</p>
          <p className="mt-4 max-w-xl text-neutral-600">Set the quantity on the right. Send a PDF or PNG after you pay. We print in Nairobi once the M-Pesa code matches.</p>
        </div>
        <OrderPanel product={product} initialQuantity={Number.isFinite(quantity) && quantity > 0 ? quantity : undefined} hint={query.hint} />
      </div>
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-black">Related products</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => <ProductCard key={item.slug} product={item} />)}
          </div>
        </section>
      )}
    </div>
  );
}
