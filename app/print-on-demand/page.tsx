import type { Metadata } from "next";
import Link from "next/link";
import { deliveryTowns } from "@/lib/printshop/content";
import { formatKes } from "@/lib/printshop/pricing";

export const metadata: Metadata = {
  title: "Print on demand in Kenya",
  description: "Print t-shirts, mugs, notebooks, flyers, posters, banners and business cards after the order is placed. No stock to hold. Nairobi production and delivery to all 47 counties.",
};

const audiences = [
  ["Startups and SMEs", "Launch with a small stationery and apparel run, then reprint when the design changes."],
  ["Creators and campaigns", "Sell or give away a design without paying for a warehouse of unsold shirts."],
  ["NGOs and institutions", "Order the quantity a project actually needs, with an invoice your finance team can file."],
  ["Event teams", "Badges, flyers, banners and shirts timed to a conference, wedding or activation."],
];

const reasons = [
  ["Cost", "You pay for the pieces you order. There is no bulk buy sitting in a store room."],
  ["Flexibility", "Change the artwork between orders. Each run can carry a different offer or event date."],
  ["Speed", "Standard production is 2–3 business days. Rush is only on selected digital paper jobs."],
  ["Customisation", "Names, photos, logos and short quotes can sit on apparel, drinkware and paper."],
];

const offer = [
  ["branded-t-shirt", "T-shirt printing", "Events, staff uniforms and small fashion runs. No minimum beyond the quantity you choose."],
  ["branded-mugs", "Mug printing", "Gifts and corporate sets with a logo, quote or photo."],
  ["notebook-printing", "Notebook printing", "Branded notebooks for offices, events and retail."],
  ["flyers-printing", "Flyers and brochures", "Short and medium runs with clear colour on gloss or silk paper."],
  ["posters-printing", "Posters and banners", "A2, A1 and custom large format, plus roll-up hardware."],
  ["business-cards-printing", "Business cards", "350gsm card, lamination and Spot UV when the brand needs it."],
];

export default function PrintOnDemandPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-[.16em] text-[#ff0030]">Print on demand</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Print on demand in Kenya</h1>
      <p className="mt-4 text-lg leading-8 text-neutral-700">Print on demand means the product is printed after the order exists. You skip the upfront stock, you waste less, and you can still put a professional mark on paper, fabric and drinkware.</p>

      <h2 className="mt-10 text-2xl font-black">What it is</h2>
      <p className="mt-3 leading-7 text-neutral-700">Traditional bulk printing asks you to guess a quantity. Print on demand prints one item or a few hundred, then stops. That suits a new company, a one-day event, and a brand that changes its offer often.</p>

      <h2 className="mt-10 text-2xl font-black">Who it is for</h2>
      <div className="mt-4 grid gap-3">
        {audiences.map(([title, copy]) => (
          <section key={title} className="rounded-2xl border border-neutral-200 p-4">
            <h3 className="font-bold">{title}</h3>
            <p className="mt-1 text-sm leading-6 text-neutral-600">{copy}</p>
          </section>
        ))}
      </div>

      <h2 className="mt-10 text-2xl font-black">Why it fits Kenya right now</h2>
      <ul className="mt-4 grid gap-3">
        {reasons.map(([title, copy]) => (
          <li key={title} className="rounded-2xl bg-neutral-50 p-4">
            <b>{title}.</b> <span className="text-neutral-700">{copy}</span>
          </li>
        ))}
      </ul>

      <h2 className="mt-10 text-2xl font-black">What you can order</h2>
      <div className="mt-4 grid gap-3">
        {offer.map(([slug, title, copy]) => (
          <Link key={slug} href={`/product/${slug}`} className="rounded-2xl border border-neutral-200 p-4 hover:border-[#ff0030]">
            <h3 className="font-bold">{title}</h3>
            <p className="mt-1 text-sm leading-6 text-neutral-600">{copy}</p>
          </Link>
        ))}
      </div>

      <h2 className="mt-10 text-2xl font-black">How to start</h2>
      <ol className="mt-4 list-decimal space-y-3 pl-5 leading-7 text-neutral-700">
        <li>Send the design or the idea. Ready artwork is welcome. A logo and a sentence is enough to start design support.</li>
        <li>Choose the product and the quantity. The price on each product page updates as you do.</li>
        <li>Approve a sample when the job is custom or large.</li>
        <li>We print and deliver. Nairobi first, then the rest of the country.</li>
      </ol>

      <h2 id="delivery" className="mt-10 text-2xl font-black">Delivery</h2>
      <p className="mt-3 leading-7 text-neutral-700">Fast delivery inside Nairobi is {formatKes(400)}. Outside Nairobi is {formatKes(850)}. Orders above {formatKes(10000)} are delivered free. Towns we ship to every week include:</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {deliveryTowns.map((town) => <li key={town} className="rounded-full bg-neutral-100 px-3 py-1 text-sm font-semibold">{town}</li>)}
      </ul>
      <p className="mt-4 leading-7 text-neutral-700">The same service reaches the rest of the 47 counties. Individuals, SMEs and corporate buyers use the same order path.</p>

      <div className="mt-10 rounded-2xl bg-[#ff0030] p-6 text-white">
        <h2 className="text-2xl font-black">Start the first order</h2>
        <p className="mt-2 text-sm leading-6 text-white/90">Pick a product for an instant price, or write to us if the job needs a person to look at the file.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/shop" className="inline-flex h-11 items-center rounded-2xl bg-white px-4 font-semibold text-neutral-950">Open the shop</Link>
          <Link href="/contact" className="inline-flex h-11 items-center rounded-2xl border border-white/40 px-4 font-semibold">Contact the desk</Link>
        </div>
      </div>
    </article>
  );
}
