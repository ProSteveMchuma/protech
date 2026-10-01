import type { Metadata } from "next";
import Link from "next/link";
import { business } from "@/lib/config";

export const metadata: Metadata = { title: "Account", description: "How ProPrint confirms print orders and quotes." };

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-4xl font-black tracking-tight">Your orders</h1>
      <p className="mt-4 leading-7 text-neutral-700">Confirmations go to the email on the order. To check a job, write to <a className="font-semibold text-[#ff0030]" href={`mailto:${business.supportEmail}`}>{business.supportEmail}</a> with your name and M-Pesa code.</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/contact" className="inline-flex h-11 items-center rounded-2xl bg-[#ff0030] px-4 font-semibold text-white">Ask about an order</Link>
        <Link href="/cart" className="inline-flex h-11 items-center rounded-2xl border border-neutral-200 px-4 font-semibold">Open cart</Link>
      </div>
    </div>
  );
}
