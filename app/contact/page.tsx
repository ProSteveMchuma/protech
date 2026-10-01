import type { Metadata } from "next";
import { ContactForm } from "@/components/store/ContactForm";
import { business } from "@/lib/config";
import { productBySlug } from "@/lib/printshop/catalog";

export const metadata: Metadata = {
  title: "Contact",
  description: "Request a printing quote for business cards, banners, apparel, mugs and event sets. Nairobi production, delivery across Kenya.",
};

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ product?: string }> }) {
  const query = await searchParams;
  const product = query.product ? productBySlug(query.product) : undefined;
  const subject = product ? `Quote for ${product.title}` : query.product ? `Quote for ${query.product}` : "Printing quote";
  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[.8fr_1.2fr]">
      <div>
        <h1 className="text-4xl font-black tracking-tight">Contact us</h1>
        <p className="mt-3 text-neutral-600">Tell us the product, quantity and deadline. We reply with a price, a file check, or both.</p>
        <dl className="mt-6 grid gap-3 text-sm">
          <div><dt className="font-semibold">Email</dt><dd><a className="text-[#ff0030]" href={`mailto:${business.supportEmail}`}>{business.supportEmail}</a></dd></div>
          <div><dt className="font-semibold">Paybill</dt><dd className="font-mono tabular-nums">{business.paybill}</dd></div>
          <div><dt className="font-semibold">Desk hours</dt><dd>Monday–Friday 8:00–18:00, Saturday 9:00–16:00 EAT</dd></div>
          <div><dt className="font-semibold">Production</dt><dd>Nairobi, with delivery to all 47 counties</dd></div>
        </dl>
      </div>
      <ContactForm defaultSubject={subject} />
    </div>
  );
}
