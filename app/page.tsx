import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/store/ProductCard";
import { business, pickup } from "@/lib/config";
import { productBySlug, shopGroups } from "@/lib/printshop/catalog";
import { groupImage } from "@/lib/printshop/images";
import { formatKes, FREE_DELIVERY_FROM_KES } from "@/lib/printshop/pricing";
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

const tiles = [
  { href: "/category/business-cards", label: "Business cards", hint: "Thick art card, short runs" },
  { href: "/category/banners", label: "Banners", hint: "Roll-ups, vinyl, backdrops" },
  { href: "/category/apparel", label: "Apparel", hint: "T-shirts, hoodies, jackets" },
];

export default function HomePage() {
  return (
    <div>
      <section className="bg-white py-3 sm:py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#ff0030]">ProPrint · Nairobi press</p>
          <div className="relative h-[min(70vw,360px)] min-h-[280px] overflow-hidden rounded-2xl shadow-2xl sm:h-[400px] sm:rounded-[2rem] md:h-[480px] md:rounded-[3rem]">
            <Image src={groupImage["business-cards"]} alt="A stack of printed business cards" fill priority sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent" />
            <div className="absolute inset-0 flex max-w-2xl flex-col justify-center px-5 pb-8 text-white sm:px-10 md:px-16">
              <span className="mb-4 w-fit rounded-lg bg-[#ff0030] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em]">Nairobi press</span>
              <h1 className="font-display text-4xl font-medium leading-[0.95] tracking-tight sm:text-6xl">Print, made to order.</h1>
              <p className="mt-4 max-w-sm text-sm font-medium leading-relaxed text-white/80 sm:text-lg">Cards, banners, apparel and packaging. The price is on the product. You pay by M-Pesa.</p>
              <Link href="/shop" className="mt-6 inline-flex h-12 w-fit items-center gap-2 rounded-2xl bg-white px-8 text-xs font-black uppercase tracking-widest text-neutral-950">
                Shop now <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto mb-8 max-w-7xl px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {tiles.map((tile) => (
            <Link key={tile.href} href={tile.href} className="group flex min-h-16 items-center justify-between rounded-2xl border border-neutral-100 bg-[#fff8f8] px-5 py-4 transition hover:border-red-200 hover:bg-white">
              <span>
                <span className="block text-sm font-black tracking-tight text-neutral-950">{tile.label}</span>
                <span className="text-[11px] font-medium text-neutral-500">{tile.hint}</span>
              </span>
              <span className="text-[#ff0030] transition group-hover:translate-x-0.5" aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-neutral-500">
            Paybill <span className="font-mono tabular-nums text-neutral-950">{business.paybill}</span>
            <span className="mx-2">·</span>
            Free delivery over {formatKes(FREE_DELIVERY_FROM_KES)}
            <span className="mx-2">·</span>
            Collect at {pickup.address}
          </p>
          <Link href="/shop" className="text-xs font-black uppercase tracking-widest text-[#ff0030]">Browse all</Link>
        </div>
      </section>

      <section className="mx-auto mb-8 max-w-7xl px-4 sm:px-8 lg:hidden lg:px-12" aria-labelledby="mobile-categories-heading">
        <div className="mb-4 flex items-end justify-between">
          <h2 id="mobile-categories-heading" className="text-lg font-black tracking-tight">Categories</h2>
          <Link href="/shop" className="text-xs font-bold text-[#ff0030]">All →</Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {shopGroups.map((group) => (
            <Link key={group.slug} href={`/category/${group.slug}`} className="flex min-h-12 items-center rounded-2xl border border-neutral-100 bg-neutral-50 px-4 py-3 text-xs font-bold text-neutral-700 hover:border-red-200">
              <span className="truncate">{group.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section id="products" className="mx-auto max-w-7xl px-4 pb-16 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="hidden w-1/4 shrink-0 lg:block">
            <div className="sticky top-36 overflow-hidden rounded-3xl border border-neutral-100 bg-white shadow-sm">
              <div className="border-b border-neutral-100 bg-neutral-50/80 p-6">
                <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest">
                  <span className="size-2 rounded-full bg-[#ff0030]" aria-hidden="true" />
                  Categories
                </h2>
              </div>
              <nav className="p-2">
                <ul className="space-y-1">
                  {shopGroups.map((group) => (
                    <li key={group.slug}>
                      <Link href={`/category/${group.slug}`} className="block rounded-2xl px-4 py-3 text-sm font-bold text-neutral-600 hover:bg-[#fff5f6] hover:text-[#ff0030]">{group.label}</Link>
                    </li>
                  ))}
                  <li className="mt-2 border-t border-neutral-100 pt-2">
                    <Link href="/shop" className="block rounded-2xl border border-dashed border-red-200 px-4 py-3 text-xs font-black uppercase tracking-widest text-[#ff0030] hover:bg-[#fff5f6]">Shop all products</Link>
                  </li>
                </ul>
              </nav>
              <div className="bg-[#fff5f6] p-6">
                <p className="text-[10px] font-bold uppercase tracking-tight text-[#ff0030]">Need a file checked?</p>
                <a href={whatsappHref("Hello ProPrint, I have a question before I order.")} className="mt-1 block text-xs text-neutral-600" target="_blank" rel="noopener noreferrer">WhatsApp {whatsappDisplay()}</a>
              </div>
            </div>
          </aside>
          <div className="min-w-0 flex-1">
            <div className="mb-5 flex items-end justify-between">
              <h2 className="text-lg font-black tracking-tight sm:text-2xl">Featured</h2>
              <Link href="/shop" className="text-xs font-bold text-[#ff0030]">All products</Link>
            </div>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
              {featured.map((product) => <ProductCard key={product.slug} product={product} />)}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
