import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

export const metadata: Metadata = {
    title: "How to number receipt and invoice books in Kenya",
    description:
        "A practical guide to sequential receipt and invoice book numbering for Kenyan print shops — prefixes, digits, duplicate/triplicate NCR sets, cut-and-stack order, and how to number a PDF in your browser with SerialPro.",
    keywords: ["receipt numbering Kenya", "invoice book numbering", "NCR numbering", "cut and stack numbering", "receipt book printing Nairobi", "sequential numbering PDF"],
    alternates: { canonical: "/learn/receipt-numbering" },
};

export default function ReceiptNumberingGuide() {
    return (
        <div className="min-h-screen bg-press px-4 pb-24 pt-32 text-slate-100 sm:px-6">
            <article className="mx-auto max-w-3xl">
                <p className="kicker text-cyan-300">Guide</p>
                <h1 className="mt-4 text-4xl font-black tracking-[-.04em] sm:text-5xl">How to number receipt and invoice books</h1>
                <p className="mt-6 text-lg leading-8 text-slate-300">
                    Every receipt, invoice and delivery-note book a Kenyan shop prints needs a unique, unbroken sequence of numbers.
                    Done by hand it is slow and error-prone — one skipped or repeated number means a reprint. Here is how to do it
                    correctly, and how to number a print-ready PDF in minutes.
                </p>

                <h2 className="mt-12 text-2xl font-black">1. Decide your numbering scheme</h2>
                <ul className="mt-4 space-y-2 text-slate-300">
                    <li className="flex gap-2"><Check className="mt-1 size-4 shrink-0 text-cyan-300" /> <span><b>Prefix</b> — a short code such as <code className="font-mono text-cyan-200">RCT-</code>, <code className="font-mono text-cyan-200">INV-</code> or a branch code.</span></li>
                    <li className="flex gap-2"><Check className="mt-1 size-4 shrink-0 text-cyan-300" /> <span><b>Digits</b> — pad to a fixed width (e.g. 6 digits: 000001) so every number lines up.</span></li>
                    <li className="flex gap-2"><Check className="mt-1 size-4 shrink-0 text-cyan-300" /> <span><b>Range</b> — the first and last number in the run.</span></li>
                    <li className="flex gap-2"><Check className="mt-1 size-4 shrink-0 text-cyan-300" /> <span><b>Sets per book</b> — how many leaves bind into one book, so ranges split into books cleanly.</span></li>
                </ul>

                <h2 className="mt-10 text-2xl font-black">2. Handle NCR (carbonless) duplicate and triplicate sets</h2>
                <p className="mt-4 leading-7 text-slate-300">
                    A duplicate book prints the same number on the white and canary plies; a triplicate adds pink. The number must
                    repeat across every ply of a set, then advance. SerialPro&apos;s <b>copies per serial</b> setting does this
                    automatically, and the production summary reminds you how to interleave the plies before binding.
                </p>

                <h2 className="mt-10 text-2xl font-black">3. Get the cut-and-stack order right</h2>
                <p className="mt-4 leading-7 text-slate-300">
                    When you print many-up on a press sheet and guillotine the stack into piles, the numbers must run in sequence
                    down each pile after cutting — not across the sheet. This &quot;cut-and-stack&quot; imposition is the step most
                    often done wrong by hand. SerialPro calculates the slot order for you and shows a live press-sheet preview so you
                    can see the sequence before you generate.
                </p>

                <h2 className="mt-10 text-2xl font-black">4. Keep compliance in mind</h2>
                <p className="mt-4 leading-7 text-slate-300">
                    VAT-registered businesses in Kenya must issue sequentially numbered tax documents, and KRA&apos;s move to
                    electronic invoicing (eTIMS) is pushing more small businesses to formalise their receipts. Physical numbered
                    books remain widely used, and a clean, unbroken sequence is the foundation of an auditable record.
                    ProPrint numbers your artwork; it does not file with KRA on your behalf.
                </p>

                <div className="mt-12 rounded-2xl border border-cyan-300/30 bg-cyan-300/5 p-6">
                    <h2 className="text-xl font-black">Number a receipt PDF now — free</h2>
                    <p className="mt-2 text-sm text-slate-300">Upload artwork, set your range, and download a press-ready numbered PDF. Artwork never leaves your browser.</p>
                    <Link href="/tools/serialpro" className="cta-primary mt-5 inline-flex px-5 py-2.5 text-sm">
                        Open SerialPro <ArrowRight className="size-4" />
                    </Link>
                </div>
            </article>
        </div>
    );
}
