import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/store/ProductCard";
import { business } from "@/lib/config";
import { productBySlug, shopGroups } from "@/lib/printshop/catalog";
import { groupImage } from "@/lib/printshop/images";
import { formatKes } from "@/lib/printshop/pricing";
import { whatsappDisplay, whatsappHref } from "@/lib/whatsapp";

const featuredSlugs = [
  "business-cards-printing",
  "flyers-printing",
  "roll-up-banner-printing",
  "branded-t-shirt",
  "branded-mugs",
  "vinyl-sticker-printing",
  "letterheads-printing",
  "branded-kraft-bags",
];

const featured = featuredSlugs.flatMap((slug) => {
  const product = productBySlug(slug);
  return product ? [product] : [];
});

export default function HomePage() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 pb-10 pt-16 sm:px-6 lg:pt-24">
        <h1 className="max-w-3xl font-display text-5xl font-medium leading-[1.05] tracking-tight text-neutral-950 sm:text-7xl">Print, made to order.</h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-neutral-600">Cards, banners, apparel and packaging from a Nairobi press. The price is on the product. You pay by M-Pesa.</p>
        <Link href="/shop" className="mt-8 inline-flex h-12 items-center rounded-full bg-neutral-950 px-6 text-sm font-medium text-white">Browse the catalogue</Link>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <Image src={groupImage["business-cards"]} alt="A stack of printed business cards" width={1600} height={1200} priority className="aspect-[4/3] w-full bg-[#f6f4f1] object-cover" />
      </section>

      <section id="pricing" className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="flex flex-wrap gap-x-6 gap-y-2 border-b border-neutral-200 py-5 text-sm text-neutral-600">
          <span>Paybill <span className="font-mono tabular-nums text-neutral-950">{business.paybill}</span></span>
          <span>Nairobi delivery <span className="font-mono tabular-nums text-neutral-950">{formatKes(400)}</span></span>
          <span>Collect free at Karen Green, Langata Road</span>
          <a href={whatsappHref("Hello ProPrint, I have a question before I order.")} className="text-neutral-950" target="_blank" rel="noopener noreferrer">WhatsApp {whatsappDisplay()}</a>
        </p>
      </section>

      <section id="products" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl font-medium tracking-tight">The catalogue</h2>
          <Link href="/shop" className="text-sm text-neutral-600">All products</Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
          {featured.map((product) => <ProductCard key={product.slug} product={product} />)}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <h2 className="font-display text-3xl font-medium tracking-tight">Categories</h2>
        <ul className="mt-8 divide-y divide-neutral-200 border-y border-neutral-200">
          {shopGroups.map((group) => (
            <li key={group.slug}>
              <Link href={`/category/${group.slug}`} className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
                <span className="text-base font-medium text-neutral-950">{group.label}</span>
                <span className="text-sm text-neutral-500 sm:text-right">{group.summary}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
