"use client";

import { useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { AlertTriangle, Calculator, Check, Clipboard, Layers, Printer, ReceiptText, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";
import {
    deleteSave,
    saveRecord,
    type QuoteProSavedSettings,
} from "@/lib/proprint/local-saves";
import { calculateQuote, type QuoteInput } from "@/lib/proprint/quote";
import { getServerSessionImposition, getSessionImpositionSnapshot, subscribeSessionImposition } from "@/lib/proprint/session";
import { LocalSavesPanel } from "./LocalSavesPanel";
import { useLocalSaves } from "./useLocalSaves";

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
    taxPercent: 16,
};

type QuotePresetKey = "receipts" | "flyers" | "cards" | "letterheads" | "posters";

const QUOTE_PRESETS: Record<QuotePresetKey, { label: string; jobName: string; values: Partial<QuoteInput> }> = {
    receipts: {
        label: "Receipt books",
        jobName: "NCR receipt books",
        values: { itemsPerSheet: 4, sides: 1, spoilagePercent: 3, setupCost: 600, finishingPerPiece: 2, markupPercent: 35 },
    },
    flyers: {
        label: "A5 flyers",
        jobName: "A5 promotional flyers",
        values: { itemsPerSheet: 4, sides: 2, spoilagePercent: 5, setupCost: 300, finishingPerPiece: 0.5, markupPercent: 30 },
    },
    cards: {
        label: "Business cards",
        jobName: "Business cards",
        values: { itemsPerSheet: 20, sides: 2, spoilagePercent: 8, setupCost: 400, finishingPerPiece: 0.2, markupPercent: 40 },
    },
    letterheads: {
        label: "Letterheads",
        jobName: "A4 letterheads",
        values: { itemsPerSheet: 2, sides: 1, spoilagePercent: 3, setupCost: 400, finishingPerPiece: 0, markupPercent: 30 },
    },
    posters: {
        label: "Posters",
        jobName: "Posters",
        values: { itemsPerSheet: 1, sides: 1, spoilagePercent: 2, setupCost: 0, finishingPerPiece: 0, markupPercent: 45 },
    },
};

const MARGIN_FLOOR = 15;

const money = new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 2,
});

function NumberField({
    label,
    hint,
    value,
    min = 0,
    step = 1,
    onChange,
}: {
    label: string;
    hint?: string;
    value: number;
    min?: number;
    step?: number;
    onChange: (value: number) => void;
}) {
    return (
        <label className="quote-field">
            <span>{label}</span>
            <input
                type="number"
                min={min}
                step={step}
                value={value}
                onChange={(event) => onChange(event.target.value === "" ? 0 : Number(event.target.value))}
            />
            {hint && <small>{hint}</small>}
        </label>
    );
}

function Panel({ number, title, children }: { number: string; title: string; children: ReactNode }) {
    return (
        <section className="quote-panel">
            <h2>
                <span>{number}</span>
                {title}
            </h2>
            {children}
        </section>
    );
}

export function QuoteProStudio() {
    const [input, setInput] = useState(initialInput);
    const [jobName, setJobName] = useState("A5 promotional flyers");
    const [clientName, setClientName] = useState("");
    const [reference, setReference] = useState("QP-DRAFT");
    const [copied, setCopied] = useState(false);
    const [message, setMessage] = useState("");
    const saves = useLocalSaves<QuoteProSavedSettings>("quotepro");
    const [activeSaveId, setActiveSaveId] = useState<string | null>(null);
    const [customSaveName, setCustomSaveName] = useState<string | null>(null);
    const saveName = customSaveName ?? (jobName.trim() || "Untitled quote");
    const result = useMemo(() => calculateQuote(input), [input]);
    const update = (key: keyof QuoteInput, value: number) => setInput((current) => ({ ...current, [key]: value }));
    const valid = input.quantity > 0 && input.itemsPerSheet > 0;
    const [activePreset, setActivePreset] = useState<QuotePresetKey | null>(null);
    const [showVolumes, setShowVolumes] = useState(false);
    const sessionUp = useSyncExternalStore(subscribeSessionImposition, getSessionImpositionSnapshot, getServerSessionImposition);

    // Gross margin on the ex-tax selling price — what actually protects the shop.
    const marginPct = result.subtotal > 0 ? (result.markupAmount / result.subtotal) * 100 : 0;
    const marginLow = valid && marginPct < MARGIN_FLOOR;

    const breakdown = useMemo(() => {
        const setupOther = Math.max(0, input.setupCost) + Math.max(0, input.otherCost);
        const segments = [
            { label: "Paper", value: result.paperCost, color: "#22d3ee" },
            { label: "Printing", value: result.printCost, color: "#0891b2" },
            { label: "Setup + other", value: setupOther, color: "#818cf8" },
            { label: "Finishing", value: result.finishingCost, color: "#f59e0b" },
            { label: "Margin", value: result.markupAmount, color: "#10b981" },
        ].filter((s) => s.value > 0);
        const base = result.subtotal > 0 ? result.subtotal : 1;
        return segments.map((s) => ({ ...s, pct: (s.value / base) * 100 }));
    }, [input.setupCost, input.otherCost, result]);

    const volumeQuantities = useMemo(() => {
        const q = Math.max(1, Math.floor(input.quantity || 0));
        return Array.from(new Set([Math.max(1, Math.round(q / 2)), q, q * 2, q * 4])).sort((a, b) => a - b);
    }, [input.quantity]);

    function applyPreset(key: QuotePresetKey) {
        const preset = QUOTE_PRESETS[key];
        setInput((current) => ({ ...current, ...preset.values }));
        setJobName(preset.jobName);
        if (!activeSaveId) setCustomSaveName(null);
        setActivePreset(key);
        setMessage(`Loaded the ${preset.label.toLowerCase()} preset. Fine-tune any cost to match your shop.`);
    }

    function useSerialLayout() {
        if (sessionUp) {
            update("itemsPerSheet", sessionUp.piecesPerSheet);
            setMessage(`Using SerialPro layout: ${sessionUp.piecesPerSheet}-up${sessionUp.sheetLabel ? ` on ${sessionUp.sheetLabel}` : ""}.`);
        }
    }

    function handleSave() {
        const record = saveRecord<QuoteProSavedSettings>("quotepro", {
            id: activeSaveId ?? undefined,
            name: saveName,
            settings: { jobName, clientName, reference, input },
        });
        setActiveSaveId(record.id);
        setCustomSaveName(record.name);
        setMessage(`Saved “${record.name}” on this browser.`);
    }

    function handleLoad(id: string) {
        const record = saves.find((item) => item.id === id);
        if (!record) return;
        setJobName(record.settings.jobName);
        setClientName(record.settings.clientName);
        setReference(record.settings.reference);
        setInput(record.settings.input);
        setActiveSaveId(record.id);
        setCustomSaveName(record.name);
        setMessage(`Loaded “${record.name}”.`);
    }

    function handleDelete(id: string) {
        deleteSave("quotepro", id);
        if (activeSaveId === id) {
            setActiveSaveId(null);
            setCustomSaveName(null);
        }
        setMessage("Saved quote deleted from this browser.");
    }

    async function copySummary() {
        const summary = [
            `QUOTE ${reference || "QP-DRAFT"}`,
            `Job: ${jobName || "Untitled print job"}`,
            clientName ? `Client: ${clientName}` : "",
            `Quantity: ${Math.max(0, Math.floor(input.quantity)).toLocaleString()}`,
            `Production sheets: ${result.productionSheets.toLocaleString()}`,
            `Unit price: ${money.format(result.unitPrice)}`,
            `Total: ${money.format(result.total)}`,
        ]
            .filter(Boolean)
            .join("\n");
        await navigator.clipboard.writeText(summary);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
    }

    return (
        <div className="quote-workspace min-h-screen bg-press pb-16 pt-24 text-slate-100">
            <div className="mx-auto max-w-[1500px] px-4 sm:px-6">
                <header className="mb-6 flex flex-wrap items-end justify-between gap-4 print:hidden">
                    <div>
                        <p className="font-mono text-xs uppercase tracking-[.22em] text-cyan-300">Production beta / estimator 01</p>
                        <h1 className="mt-2 text-4xl font-black">QuotePro</h1>
                        <p className="mt-2 text-sm text-slate-400">Cost the job, protect your margin and quote with confidence.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                        <a href="/feedback?product=quotepro" className="rounded-full border border-cyan-300/30 px-3 py-2 font-bold text-cyan-200 hover:bg-cyan-300/10">
                            Send feedback
                        </a>
                        <span className="status-chip">
                            <ShieldCheck />
                            Data stays local
                        </span>
                        <span className="status-chip">
                            <Calculator />
                            Live calculation
                        </span>
                    </div>
                </header>

                {message && (
                    <div role="status" className="mb-4 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200 print:hidden">
                        {message}
                    </div>
                )}

                <div className="grid gap-4 xl:grid-cols-[360px_360px_minmax(420px,1fr)]">
                    <div className="space-y-4 print:hidden">
                        <Panel number="01" title="Job details">
                            <div className="mt-1">
                                <p className="mb-2 flex items-center gap-1.5 font-mono text-[.62rem] font-extrabold uppercase tracking-[.1em] text-slate-400">
                                    <Sparkles className="size-3 text-cyan-300" aria-hidden="true" />
                                    Job presets
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                    {(Object.keys(QUOTE_PRESETS) as QuotePresetKey[]).map((key) => (
                                        <button
                                            key={key}
                                            type="button"
                                            onClick={() => applyPreset(key)}
                                            className={`rounded-full border px-2.5 py-1 text-[.68rem] font-bold transition ${
                                                activePreset === key
                                                    ? "border-cyan-300 bg-cyan-300/15 text-cyan-100"
                                                    : "border-white/10 text-slate-300 hover:border-cyan-300/40 hover:text-cyan-200"
                                            }`}
                                        >
                                            {QUOTE_PRESETS[key].label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <label className="quote-field">
                                <span>Job name</span>
                                <input
                                    value={jobName}
                                    onChange={(event) => {
                                        setJobName(event.target.value);
                                        if (!activeSaveId) setCustomSaveName(null);
                                    }}
                                />
                            </label>
                            <label className="quote-field">
                                <span>Client</span>
                                <input value={clientName} placeholder="Optional" onChange={(event) => setClientName(event.target.value)} />
                            </label>
                            <label className="quote-field">
                                <span>Quote reference</span>
                                <input value={reference} onChange={(event) => setReference(event.target.value)} />
                            </label>
                            <div className="quote-grid">
                                <NumberField label="Quantity" value={input.quantity} onChange={(value) => update("quantity", value)} />
                                <NumberField label="Items / sheet" value={input.itemsPerSheet} min={1} onChange={(value) => update("itemsPerSheet", value)} />
                            </div>
                            {sessionUp && sessionUp.piecesPerSheet !== input.itemsPerSheet && (
                                <button
                                    type="button"
                                    onClick={useSerialLayout}
                                    className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-cyan-300/40 bg-cyan-300/10 px-3 py-1.5 text-xs font-bold text-cyan-100 hover:bg-cyan-300/15"
                                >
                                    <Layers className="size-3.5" aria-hidden="true" />
                                    Use SerialPro layout: {sessionUp.piecesPerSheet}-up
                                </button>
                            )}
                            <div className="quote-grid">
                                <NumberField label="Print sides" value={input.sides} min={1} onChange={(value) => update("sides", value)} />
                                <NumberField label="Spoilage %" value={input.spoilagePercent} step={0.5} onChange={(value) => update("spoilagePercent", value)} />
                            </div>
                            <LocalSavesPanel
                                label="Saved quotes"
                                records={saves}
                                activeId={activeSaveId}
                                draftName={saveName}
                                onDraftNameChange={setCustomSaveName}
                                onSave={handleSave}
                                onLoad={handleLoad}
                                onDelete={handleDelete}
                                hint="Quotes are stored only in this browser. Clearing site data removes them."
                            />
                        </Panel>
                        <button type="button" className="secondary-button" onClick={() => setInput(initialInput)}>
                            <RotateCcw />
                            Reset production costs
                        </button>
                    </div>

                    <div className="print:hidden">
                        <Panel number="02" title="Production costs">
                            <div className="quote-grid">
                                <NumberField label="Sheet cost" hint="Cost per parent sheet" value={input.sheetCost} step={0.01} onChange={(value) => update("sheetCost", value)} />
                                <NumberField label="Print / sheet / side" value={input.printCostPerSheet} step={0.01} onChange={(value) => update("printCostPerSheet", value)} />
                            </div>
                            <NumberField label="Setup cost" hint="Plates, make-ready or minimum machine charge" value={input.setupCost} step={0.01} onChange={(value) => update("setupCost", value)} />
                            <NumberField label="Finishing / piece" hint="Cutting, folding, binding or packing" value={input.finishingPerPiece} step={0.01} onChange={(value) => update("finishingPerPiece", value)} />
                            <NumberField label="Other costs" hint="Design, delivery or outsourced work" value={input.otherCost} step={0.01} onChange={(value) => update("otherCost", value)} />
                            <div className="quote-grid">
                                <NumberField label="Markup %" value={input.markupPercent} step={0.5} onChange={(value) => update("markupPercent", value)} />
                                <NumberField label="Tax %" hint="Kenya VAT is 16%. Set 0 for exempt goods." value={input.taxPercent} step={0.5} onChange={(value) => update("taxPercent", value)} />
                            </div>
                            {!valid && (
                                <p role="alert" className="mt-4 rounded-lg border border-rose-400/30 bg-rose-400/10 p-3 text-xs text-rose-200">
                                    Quantity and items per sheet must be greater than zero.
                                </p>
                            )}
                        </Panel>
                    </div>

                    <section className="quote-ticket" aria-live="polite">
                        <div className="quote-ticket-head">
                            <div>
                                <p>ProPrint / QuotePro</p>
                                <h2>{jobName || "Untitled print job"}</h2>
                                {clientName && <span>Prepared for {clientName}</span>}
                            </div>
                            <ReceiptText className="size-7 text-cyan-700" />
                        </div>
                        <div className="quote-ticket-meta">
                            <span>Reference</span>
                            <strong>{reference || "QP-DRAFT"}</strong>
                            <span>Quantity</span>
                            <strong>{Math.max(0, Math.floor(input.quantity)).toLocaleString()}</strong>
                        </div>
                        <div className="quote-ticket-lines">
                            <div>
                                <span>Base sheets</span>
                                <strong>{result.baseSheets.toLocaleString()}</strong>
                            </div>
                            <div>
                                <span>Spoilage sheets</span>
                                <strong>{result.spoilageSheets.toLocaleString()}</strong>
                            </div>
                            <div className="line-emphasis">
                                <span>Production sheets</span>
                                <strong>{result.productionSheets.toLocaleString()}</strong>
                            </div>
                            <div>
                                <span>Paper</span>
                                <strong>{money.format(result.paperCost)}</strong>
                            </div>
                            <div>
                                <span>Printing</span>
                                <strong>{money.format(result.printCost)}</strong>
                            </div>
                            <div>
                                <span>Setup + other</span>
                                <strong>{money.format(Math.max(0, input.setupCost) + Math.max(0, input.otherCost))}</strong>
                            </div>
                            <div>
                                <span>Finishing</span>
                                <strong>{money.format(result.finishingCost)}</strong>
                            </div>
                            <div className="line-emphasis">
                                <span>Direct production cost</span>
                                <strong>{money.format(result.directCost)}</strong>
                            </div>
                            <div>
                                <span>Markup ({Math.max(0, input.markupPercent)}%)</span>
                                <strong>{money.format(result.markupAmount)}</strong>
                            </div>
                            {input.taxPercent > 0 && (
                                <>
                                    <div>
                                        <span>Subtotal</span>
                                        <strong>{money.format(result.subtotal)}</strong>
                                    </div>
                                    <div>
                                        <span>Tax ({input.taxPercent}%)</span>
                                        <strong>{money.format(result.taxAmount)}</strong>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="quote-total">
                            <span>Total selling price</span>
                            <strong>{money.format(valid ? result.total : 0)}</strong>
                            <p>{money.format(valid ? result.unitPrice : 0)} per finished piece</p>
                        </div>
                        {valid && breakdown.length > 0 && (
                            <div className="quote-breakdown">
                                <div className="quote-breakdown-head">
                                    <span>Cost composition</span>
                                    <strong className={marginLow ? "text-amber-600" : "text-emerald-600"}>{marginPct.toFixed(0)}% margin</strong>
                                </div>
                                <div className="quote-breakdown-bar" role="img" aria-label={`Cost composition with ${marginPct.toFixed(0)} percent margin`}>
                                    {breakdown.map((segment) => (
                                        <span
                                            key={segment.label}
                                            style={{ width: `${segment.pct}%`, background: segment.color }}
                                            title={`${segment.label}: ${money.format(segment.value)}`}
                                        />
                                    ))}
                                </div>
                                <div className="quote-breakdown-legend">
                                    {breakdown.map((segment) => (
                                        <span key={segment.label}>
                                            <i style={{ background: segment.color }} aria-hidden="true" />
                                            {segment.label}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {marginLow && (
                            <p role="alert" className="quote-guardrail">
                                <AlertTriangle className="size-3.5 shrink-0" aria-hidden="true" />
                                Margin is below {MARGIN_FLOOR}%. Confirm this still covers overhead before you send it.
                            </p>
                        )}
                        {valid && (
                            <div className="quote-volumes">
                                <button type="button" className="quote-volumes-toggle" onClick={() => setShowVolumes((v) => !v)} aria-expanded={showVolumes}>
                                    <Layers className="size-3.5" aria-hidden="true" />
                                    {showVolumes ? "Hide quantity comparison" : "Compare quantities"}
                                </button>
                                {showVolumes && (
                                    <table className="quote-volumes-table">
                                        <thead>
                                            <tr>
                                                <th>Quantity</th>
                                                <th>Unit price</th>
                                                <th>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {volumeQuantities.map((q) => {
                                                const r = calculateQuote({ ...input, quantity: q });
                                                const current = q === Math.max(1, Math.floor(input.quantity || 0));
                                                return (
                                                    <tr key={q} className={current ? "is-current" : undefined}>
                                                        <td>{q.toLocaleString()}</td>
                                                        <td>{money.format(r.unitPrice)}</td>
                                                        <td>{money.format(r.total)}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        )}
                        <p className="quote-note">Internal estimate. Confirm stock, production method and applicable tax before issuing a customer quotation.</p>
                        <div className="quote-actions print:hidden">
                            <button type="button" onClick={() => void copySummary()}>
                                {copied ? <Check /> : <Clipboard />}
                                {copied ? "Copied" : "Copy summary"}
                            </button>
                            <button type="button" className="quote-print" onClick={() => window.print()}>
                                <Printer />
                                Print quote
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
