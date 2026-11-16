import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/store/ProductCard";
import { groupBySlug, productBySlug, products, productsInGroup } from "@/lib/printshop/catalog";
import { describe } from "@/lib/printshop/content";
import { absoluteImage, productImage } from "@/lib/printshop/images";
import { FREE_DELIVERY_FROM_KES, formatKes, NAIROBI_DELIVERY_KES, OUTSIDE_NAIROBI_DELIVERY_KES, shelfKes, shelfOffer, shelfPriceLabel } from "@/lib/printshop/pricing";
import { pickup } from "@/lib/config";
import { whatsappDisplay, whatsappHref } from "@/lib/whatsapp";
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
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: { title: `${product.title} | ProPrint`, url: `/product/${product.slug}`, images: [{ url: productImage(product), alt: product.title }] },
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
  const offer = shelfOffer(product);
  const shelfLabel = shelfPriceLabel(product);
  const priceLine = offer ? `${shelfLabel.price} ${shelfLabel.detail}` : "Quoted per specification";
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: describe(product),
    image: absoluteImage(productImage(product)),
    url: `https://www.proinnovationtech.co.ke/product/${product.slug}`,
    ...(typeof from === "number" && from > 0
      ? { offers: { "@type": "Offer", price: from, priceCurrency: "KES" } }
      : {}),
  };
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 pb-24 sm:px-6 lg:py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
        <Image src={productImage(product)} alt={product.title} width={1200} height={900} priority className="aspect-[4/3] w-full bg-[#f6f4f1] object-cover lg:sticky lg:top-24" />
        <div>
          <p className="text-sm text-neutral-500">
            <Link href="/shop">Catalogue</Link>
            {group && <> / <Link href={`/category/${group.slug}`}>{group.label}</Link></>}
          </p>
          <h1 className="mt-3 font-display text-4xl font-medium tracking-tight sm:text-5xl">{product.title}</h1>
          <p className="mt-3 font-mono text-lg tabular-nums text-neutral-950">{priceLine}</p>
          <p className="mt-2 text-sm text-neutral-600">Nairobi delivery {formatKes(NAIROBI_DELIVERY_KES)}. Other counties {formatKes(OUTSIDE_NAIROBI_DELIVERY_KES)}. Free over {formatKes(FREE_DELIVERY_FROM_KES)}. Or collect free at {pickup.address}.</p>
          <div className="mt-6">
            <OrderPanel product={product} initialQuantity={Number.isFinite(quantity) && quantity > 0 ? quantity : undefined} hint={query.hint} />
          </div>
          <a href={whatsappHref(`Hello ProPrint, I want to order ${product.title}.`)} className="mt-4 inline-flex h-11 items-center text-sm text-neutral-600" target="_blank" rel="noopener noreferrer">
            Ask on WhatsApp {whatsappDisplay()}
          </a>
        </div>
      </div>
      <section className="mt-12 max-w-3xl">
        <h2 className="font-display text-2xl font-medium">Details</h2>
        <p className="mt-3 leading-7 text-neutral-600">{describe(product)}</p>
      </section>
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-3xl font-medium">Related</h2>
          <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {related.map((item) => <ProductCard key={item.slug} product={item} />)}
          </div>
        </section>
      )}
    </div>
  );
}
