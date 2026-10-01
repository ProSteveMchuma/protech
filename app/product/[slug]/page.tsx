import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderPanel } from "@/components/store/OrderPanel";
import { ProductCard, swatch } from "@/components/store/ProductCard";
import { groupBySlug, productBySlug, products, productsInGroup } from "@/lib/printshop/catalog";
import { describe } from "@/lib/printshop/content";
import { formatKes, priceModel } from "@/lib/printshop/pricing";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = productBySlug(slug);
  if (!product) return { title: "Product" };
  const model = priceModel(product);
  return {
    title: `${product.title} in Kenya`,
    description: model === "quote" ? `${product.title}. Request a quote for production and delivery across Kenya.` : `${product.title} from ${formatKes(product.fromKes)}. Order online for Nairobi and nationwide delivery.`,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = productBySlug(slug);
  if (!product) notFound();
  const group = groupBySlug(product.group);
  const related = productsInGroup(product.group).filter((item) => item.slug !== product.slug).slice(0, 4);
  const model = priceModel(product);
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <p className="text-sm text-neutral-500">
        <Link href="/shop">Shop</Link>
        {group && <> / <Link href={`/category/${group.slug}`}>{group.label}</Link></>}
      </p>
      <div className="mt-6 grid items-start gap-8 lg:grid-cols-[1.1fr_.9fr]">
        <div>
          <div className="grid aspect-[4/3] place-items-center rounded-3xl" style={{ background: swatch(product.slug) }}>
            <p className="px-6 text-center text-3xl font-black text-white">{product.title}</p>
          </div>
          <h1 className="mt-6 text-4xl font-black tracking-tight">{product.title}</h1>
          <p className="mt-2 font-mono text-lg font-bold tabular-nums">{model === "quote" ? "Quoted per specification" : `From ${formatKes(product.fromKes)}`}</p>
          <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-700">{describe(product)}</p>
          <ul className="mt-6 grid gap-2 text-sm text-neutral-700">
            <li>No warehouse minimum. Print the quantity on the order.</li>
            <li>Files: PDF, AI or PNG at 300 DPI, with bleed on paper jobs.</li>
            <li>Paybill payment, then we confirm before the job is printed.</li>
          </ul>
        </div>
        <OrderPanel product={product} />
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
