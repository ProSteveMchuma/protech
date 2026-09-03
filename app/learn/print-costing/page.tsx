import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

export const metadata: Metadata = {
    title: "How to price a print job in Kenya (without losing money)",
    description:
        "A print costing guide for Kenyan shops: sheets and spoilage, paper and click costs, setup, finishing, markup and 16% VAT — plus how to protect your margin and quote in seconds with QuotePro.",
    keywords: ["print costing Kenya", "print estimating", "how to price printing", "print quotation Kenya", "printing markup", "print pricing calculator"],
    alternates: { canonical: "/learn/print-costing" },
};

export default function PrintCostingGuide() {
    return (
        <div className="min-h-screen bg-press px-4 pb-24 pt-32 text-slate-100 sm:px-6">
            <article className="mx-auto max-w-3xl">
                <p className="kicker text-cyan-300">Guide</p>
                <h1 className="mt-4 text-4xl font-black tracking-[-.04em] sm:text-5xl">How to price a print job without losing money</h1>
                <p className="mt-6 text-lg leading-8 text-slate-300">
                    Underquote and you work for free; overquote and you lose the job. A reliable print price is built up from a few
                    real costs, then protected with a margin. Here is the model, and how to run it in seconds.
                </p>

                <h2 className="mt-12 text-2xl font-black">The costing model</h2>
                <ol className="mt-4 space-y-3 text-slate-300">
                    <li className="flex gap-2"><Check className="mt-1 size-4 shrink-0 text-cyan-300" /> <span><b>Sheets</b> = quantity ÷ items per sheet, rounded up. Get items-per-sheet from your imposition.</span></li>
                    <li className="flex gap-2"><Check className="mt-1 size-4 shrink-0 text-cyan-300" /> <span><b>Spoilage</b> — add a few percent of sheets for make-ready and waste.</span></li>
                    <li className="flex gap-2"><Check className="mt-1 size-4 shrink-0 text-cyan-300" /> <span><b>Paper</b> = production sheets × cost per sheet.</span></li>
                    <li className="flex gap-2"><Check className="mt-1 size-4 shrink-0 text-cyan-300" /> <span><b>Printing</b> = sheets × sides × click/impression cost. Digital bills per click; offset adds plates and make-ready.</span></li>
                    <li className="flex gap-2"><Check className="mt-1 size-4 shrink-0 text-cyan-300" /> <span><b>Finishing</b> — cutting per sheet, binding per book, laminating and packing per piece.</span></li>
                    <li className="flex gap-2"><Check className="mt-1 size-4 shrink-0 text-cyan-300" /> <span><b>Markup</b> on the direct cost — this is your margin. Then add <b>16% VAT</b> if applicable.</span></li>
                </ol>

                <h2 className="mt-10 text-2xl font-black">Pick the cheapest machine</h2>
                <p className="mt-4 leading-7 text-slate-300">
                    Short runs are usually cheaper on digital; long runs flip to offset once plates and make-ready are spread across
                    enough sheets. QuotePro can hold your machine rates and propose the lowest-cost machine for each job automatically.
                </p>

                <h2 className="mt-10 text-2xl font-black">Protect your margin</h2>
                <p className="mt-4 leading-7 text-slate-300">
                    Always check the margin on the ex-VAT selling price, not just the shilling total. QuotePro shows a live cost
                    composition and warns you when a quote drops below a healthy margin, so you never send a job that quietly loses money.
                </p>

                <div className="mt-12 rounded-2xl border border-cyan-300/30 bg-cyan-300/5 p-6">
                    <h2 className="text-xl font-black">Cost a job now — free</h2>
                    <p className="mt-2 text-sm text-slate-300">Enter quantity and costs and get a clear, VAT-aware price with a protected margin in seconds.</p>
                    <Link href="/tools/quotepro" className="cta-primary mt-5 inline-flex px-5 py-2.5 text-sm">
                        Open QuotePro <ArrowRight className="size-4" />
                    </Link>
                </div>
            </article>
        </div>
    );
}
