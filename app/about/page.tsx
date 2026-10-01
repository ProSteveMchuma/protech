import type { Metadata } from "next";
import Link from "next/link";
import { business } from "@/lib/config";

export const metadata: Metadata = {
  title: "About",
  description: "ProPrint is the online print desk of Pro Innovation. Made-to-order business cards, banners, apparel and gifts, produced in Nairobi and delivered across Kenya.",
};

const points = [
  ["Business printing", "Cards, letterheads, envelopes, receipt books and the stationery a company hands out every week."],
  ["Marketing materials", "Flyers, brochures, posters and banners for a launch, a tender meeting or an open day."],
  ["Custom apparel", "T-shirts, hoodies, caps and uniforms printed after the order, not pulled from a generic shelf."],
  ["A checked file", "Artwork is reviewed for resolution, bleed and colour before it reaches the press."],
  ["A known turnaround", "Standard jobs in 2–3 business days. Express and Nairobi rush when the date is tight."],
  ["Delivery with a number on it", "KES 400 in Nairobi, KES 850 outside, free above KES 10,000, across all 47 counties."],
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-[.16em] text-[#ff0030]">About</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Kenya’s online print desk</h1>
      <p className="mt-4 text-lg leading-8 text-neutral-700">{business.name} runs ProPrint so a business can order professional print without holding stock. The shop is online. Production is in Nairobi. The parcel goes to the county you name.</p>
      <p className="mt-4 leading-7 text-neutral-700">The same company builds production software for print shops — numbering, imposition and quoting — at the tools linked below. The storefront you are on is for customers who need the print itself.</p>
      <div className="mt-8 grid gap-3">
        {points.map(([title, copy]) => (
          <section key={title} className="rounded-2xl border border-neutral-200 p-4">
            <h2 className="font-bold">{title}</h2>
            <p className="mt-1 text-sm leading-6 text-neutral-600">{copy}</p>
          </section>
        ))}
      </div>
      <div className="mt-8 rounded-2xl bg-neutral-950 p-6 text-white">
        <h2 className="text-xl font-black">Talk to the desk</h2>
        <p className="mt-2 text-sm leading-6 text-white/75">{business.supportEmail}<br />Monday–Friday 8:00–18:00, Saturday 9:00–16:00 EAT<br />Paybill <span className="font-mono tabular-nums">{business.paybill}</span></p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/contact" className="inline-flex h-11 items-center rounded-2xl bg-[#ff0030] px-4 text-sm font-semibold">Contact</Link>
          <Link href="/tools/quotepro" className="inline-flex h-11 items-center rounded-2xl border border-white/20 px-4 text-sm font-semibold">Production tools</Link>
        </div>
      </div>
    </div>
  );
}
