"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Calculator, Check, Clipboard, Printer, ReceiptText, RotateCcw, ShieldCheck } from "lucide-react";
import { calculateQuote, type QuoteInput } from "@/lib/proprint/quote";

const initialInput: QuoteInput = {
    quantity: 1000,
    itemsPerSheet: 4,
    spoilagePercent: 5,
    sheetCost: 12,
    printCostPerSheet: 5,
    sides: 1,
    setupCost: 500,
    finishingPerPiece: 1,
    otherCost: 0,
    markupPercent: 30,
    taxPercent: 0,
};

const money = new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", minimumFractionDigits: 2 });

function NumberField({ label, hint, value, min = 0, step = 1, onChange }: { label: string; hint?: string; value: number; min?: number; step?: number; onChange: (value: number) => void }) {
    return <label className="quote-field"><span>{label}</span><input type="number" min={min} step={step} value={value} onChange={(event) => onChange(event.target.value === "" ? 0 : Number(event.target.value))} />{hint && <small>{hint}</small>}</label>;
}

function Panel({ number, title, children }: { number: string; title: string; children: ReactNode }) {
    return <section className="quote-panel"><h2><span>{number}</span>{title}</h2>{children}</section>;
}

export function QuoteProStudio() {
    const [input, setInput] = useState(initialInput);
    const [jobName, setJobName] = useState("A5 promotional flyers");
    const [clientName, setClientName] = useState("");
    const [reference, setReference] = useState("QP-DRAFT");
    const [copied, setCopied] = useState(false);
    const result = useMemo(() => calculateQuote(input), [input]);
    const update = (key: keyof QuoteInput, value: number) => setInput((current) => ({ ...current, [key]: value }));
    const valid = input.quantity > 0 && input.itemsPerSheet > 0;

    async function copySummary() {
        const summary = [
            `QUOTE ${reference || "QP-DRAFT"}`,
            `Job: ${jobName || "Untitled print job"}`,
            clientName ? `Client: ${clientName}` : "",
            `Quantity: ${Math.max(0, Math.floor(input.quantity)).toLocaleString()}`,
            `Production sheets: ${result.productionSheets.toLocaleString()}`,
            `Unit price: ${money.format(result.unitPrice)}`,
            `Total: ${money.format(result.total)}`,
        ].filter(Boolean).join("\n");
        await navigator.clipboard.writeText(summary);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
    }

    return <div className="quote-workspace min-h-screen bg-[#071019] pb-16 pt-24 text-slate-100">
        <div className="mx-auto max-w-[1500px] px-4 sm:px-6">
            <header className="mb-6 flex flex-wrap items-end justify-between gap-4 print:hidden">
                <div><p className="font-mono text-xs uppercase tracking-[.22em] text-cyan-300">Production beta / estimator 01</p><h1 className="mt-2 text-4xl font-black">QuotePro</h1><p className="mt-2 text-sm text-slate-400">Cost the job, protect your margin and quote with confidence.</p></div>
                <div className="flex flex-wrap items-center gap-2 text-xs"><a href="/feedback?product=quotepro" className="rounded-full border border-cyan-300/30 px-3 py-2 font-bold text-cyan-200 hover:bg-cyan-300/10">Send feedback</a><span className="status-chip"><ShieldCheck />Data stays local</span><span className="status-chip"><Calculator />Live calculation</span></div>
            </header>

            <div className="grid gap-4 xl:grid-cols-[360px_360px_minmax(420px,1fr)]">
                <div className="space-y-4 print:hidden">
                    <Panel number="01" title="Job details">
                        <label className="quote-field"><span>Job name</span><input value={jobName} onChange={(event) => setJobName(event.target.value)} /></label>
                        <label className="quote-field"><span>Client</span><input value={clientName} placeholder="Optional" onChange={(event) => setClientName(event.target.value)} /></label>
                        <label className="quote-field"><span>Quote reference</span><input value={reference} onChange={(event) => setReference(event.target.value)} /></label>
                        <div className="quote-grid"><NumberField label="Quantity" value={input.quantity} onChange={(value) => update("quantity", value)} /><NumberField label="Items / sheet" value={input.itemsPerSheet} min={1} onChange={(value) => update("itemsPerSheet", value)} /></div>
                        <div className="quote-grid"><NumberField label="Print sides" value={input.sides} min={1} onChange={(value) => update("sides", value)} /><NumberField label="Spoilage %" value={input.spoilagePercent} step={0.5} onChange={(value) => update("spoilagePercent", value)} /></div>
                    </Panel>
                    <button type="button" className="secondary-button" onClick={() => setInput(initialInput)}><RotateCcw />Reset production costs</button>
                </div>

                <div className="print:hidden"><Panel number="02" title="Production costs">
                    <div className="quote-grid"><NumberField label="Sheet cost" hint="Cost per parent sheet" value={input.sheetCost} step={0.01} onChange={(value) => update("sheetCost", value)} /><NumberField label="Print / sheet / side" value={input.printCostPerSheet} step={0.01} onChange={(value) => update("printCostPerSheet", value)} /></div>
                    <NumberField label="Setup cost" hint="Plates, make-ready or minimum machine charge" value={input.setupCost} step={0.01} onChange={(value) => update("setupCost", value)} />
                    <NumberField label="Finishing / piece" hint="Cutting, folding, binding or packing" value={input.finishingPerPiece} step={0.01} onChange={(value) => update("finishingPerPiece", value)} />
                    <NumberField label="Other costs" hint="Design, delivery or outsourced work" value={input.otherCost} step={0.01} onChange={(value) => update("otherCost", value)} />
                    <div className="quote-grid"><NumberField label="Markup %" value={input.markupPercent} step={0.5} onChange={(value) => update("markupPercent", value)} /><NumberField label="Tax %" hint="Set the rate that applies" value={input.taxPercent} step={0.5} onChange={(value) => update("taxPercent", value)} /></div>
                    {!valid && <p role="alert" className="mt-4 rounded-lg border border-rose-400/30 bg-rose-400/10 p-3 text-xs text-rose-200">Quantity and items per sheet must be greater than zero.</p>}
                </Panel></div>

                <section className="quote-ticket" aria-live="polite">
                    <div className="quote-ticket-head"><div><p>ProPrint / QuotePro</p><h2>{jobName || "Untitled print job"}</h2>{clientName && <span>Prepared for {clientName}</span>}</div><ReceiptText className="size-7 text-cyan-700" /></div>
                    <div className="quote-ticket-meta"><span>Reference</span><strong>{reference || "QP-DRAFT"}</strong><span>Quantity</span><strong>{Math.max(0, Math.floor(input.quantity)).toLocaleString()}</strong></div>
                    <div className="quote-ticket-lines">
                        <div><span>Base sheets</span><strong>{result.baseSheets.toLocaleString()}</strong></div>
                        <div><span>Spoilage sheets</span><strong>{result.spoilageSheets.toLocaleString()}</strong></div>
                        <div className="line-emphasis"><span>Production sheets</span><strong>{result.productionSheets.toLocaleString()}</strong></div>
                        <div><span>Paper</span><strong>{money.format(result.paperCost)}</strong></div>
                        <div><span>Printing</span><strong>{money.format(result.printCost)}</strong></div>
                        <div><span>Setup + other</span><strong>{money.format(Math.max(0, input.setupCost) + Math.max(0, input.otherCost))}</strong></div>
                        <div><span>Finishing</span><strong>{money.format(result.finishingCost)}</strong></div>
                        <div className="line-emphasis"><span>Direct production cost</span><strong>{money.format(result.directCost)}</strong></div>
                        <div><span>Markup ({Math.max(0, input.markupPercent)}%)</span><strong>{money.format(result.markupAmount)}</strong></div>
                        {input.taxPercent > 0 && <><div><span>Subtotal</span><strong>{money.format(result.subtotal)}</strong></div><div><span>Tax ({input.taxPercent}%)</span><strong>{money.format(result.taxAmount)}</strong></div></>}
                    </div>
                    <div className="quote-total"><span>Total selling price</span><strong>{money.format(valid ? result.total : 0)}</strong><p>{money.format(valid ? result.unitPrice : 0)} per finished piece</p></div>
                    <p className="quote-note">Internal estimate. Confirm stock, production method and applicable tax before issuing a customer quotation.</p>
                    <div className="quote-actions print:hidden"><button type="button" onClick={() => void copySummary()}>{copied ? <Check /> : <Clipboard />}{copied ? "Copied" : "Copy summary"}</button><button type="button" className="quote-print" onClick={() => window.print()}><Printer />Print quote</button></div>
                </section>
            </div>
        </div>
    </div>;
}
