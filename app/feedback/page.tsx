import type { Metadata } from "next";
import { ProductFeedbackForm } from "@/components/ProductFeedbackForm";

export const metadata: Metadata = { title: "Product feedback", description: "Share feedback about SerialPro or QuotePro with the ProPrint product team." };

export default async function FeedbackPage({ searchParams }: { searchParams: Promise<{ product?: string }> }) {
    const query = await searchParams;
    const product = query.product?.toLowerCase() === "quotepro" ? "QuotePro" : "SerialPro";
    return <div className="min-h-screen bg-[#071019] pb-24 pt-32 text-white"><div className="mx-auto grid max-w-5xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_.85fr]"><section className="pt-5"><p className="font-mono text-xs font-bold uppercase tracking-[.22em] text-cyan-300">Product feedback / {product}</p><h1 className="mt-6 text-5xl font-black leading-[.96] tracking-[-.05em] sm:text-6xl">Tell us what happened on the real job.</h1><p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">The most useful feedback includes what you were producing, what you expected, and where the workflow slowed down or failed.</p></section><aside className="rounded-2xl border border-white/10 bg-[#0c1822] p-6 sm:p-8"><ProductFeedbackForm product={product} /></aside></div></div>;
}
