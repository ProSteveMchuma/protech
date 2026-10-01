import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/store/ProductCard";
import { productBySlug, shopGroups } from "@/lib/printshop/catalog";
import { faqs } from "@/lib/printshop/content";
import { groupImage } from "@/lib/printshop/images";
import { formatKes } from "@/lib/printshop/pricing";

const featured = ["business-cards-printing", "flyers-printing", "roll-up-banner-printing", "branded-t-shirt"].flatMap((slug) => {
  const product = productBySlug(slug);
  return product ? [product] : [];
});

export default function HomePage() {
  return (
    <div>
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_.9fr] lg:py-24">
        <div>
          <h1 className="max-w-xl text-4xl font-black leading-[1.05] tracking-tight text-neutral-950 sm:text-6xl">Printing, ordered in a few minutes.</h1>
          <p className="mt-5 max-w-md text-lg leading-8 text-neutral-600">Cards, flyers, banners, shirts and mugs. The price updates before you pay. We print in Nairobi and deliver across Kenya.</p>
          <Link href="/shop" className="mt-8 inline-flex h-12 items-center rounded-full bg-[#ff0030] px-6 font-semibold text-white">Browse products</Link>
        </div>
        <Image src={groupImage["business-cards"]} alt="A stack of printed business cards" width={1200} height={900} priority className="aspect-[4/3] w-full rounded-3xl object-cover" />
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
        <h2 className="text-2xl font-black tracking-tight">Shop by category</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {shopGroups.map((group) => (
            <Link key={group.slug} href={`/category/${group.slug}`} className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
              <Image src={groupImage[group.slug]} alt="" width={800} height={600} className="aspect-[4/3] w-full object-cover" />
              <p className="px-4 py-3 text-sm font-semibold">{group.label}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-black tracking-tight">Start here</h2>
          <Link href="/shop" className="text-sm font-semibold text-[#ff0030]">All products</Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => <ProductCard key={product.slug} product={product} />)}
        </div>
      </section>

      <section className="border-y border-neutral-200 bg-neutral-50">
        <ol className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
          {[
            ["1", "Choose the product", "Size, quantity and finish. The total is on the same screen."],
            ["2", "Pay by M-Pesa", "The Paybill amount already includes delivery."],
            ["3", "Send the artwork", "PDF or PNG. We print after the payment matches."],
          ].map(([step, title, copy]) => (
            <li key={step}>
              <p className="font-mono text-sm text-[#ff0030]">{step}</p>
              <h2 className="mt-2 font-bold">{title}</h2>
              <p className="mt-1 text-sm leading-6 text-neutral-600">{copy}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-black tracking-tight">Delivery</h2>
        <p className="mt-3 leading-7 text-neutral-600">Nairobi is {formatKes(400)}. The rest of Kenya is {formatKes(850)}. Orders above {formatKes(10000)} ship free. Same-day printing in Nairobi when the file is approved before 10:00.</p>
        <div className="mt-8 divide-y divide-neutral-200 border-y border-neutral-200">
          {faqs.slice(0, 4).map((item) => (
            <details key={item.q} className="py-4">
              <summary className="cursor-pointer font-semibold">{item.q}</summary>
              <p className="mt-2 text-sm leading-6 text-neutral-600">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
