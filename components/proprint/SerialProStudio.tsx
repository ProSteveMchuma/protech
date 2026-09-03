"use client";

import { useEffect, useMemo, useState, type ChangeEvent, type MouseEvent } from "react";
import { PDFDocument } from "pdf-lib";
import { Download, FileDown, FileText, Grid3x3, Image as ImageIcon, LoaderCircle, LockKeyhole, MousePointer2, RotateCw, Scissors, ShieldCheck, Sparkles } from "lucide-react";
import { bestFitLayout, calculateLayout, layoutStats } from "@/lib/proprint/imposition";
import {
    deleteSave,
    saveRecord,
    type SerialProSavedSettings,
} from "@/lib/proprint/local-saves";
import { createBookManifest, manifestToCsv } from "@/lib/proprint/manifest";
import { generateProductionPdf } from "@/lib/proprint/pdf";
import { formatSerial } from "@/lib/proprint/serial";
import { writeSessionImposition } from "@/lib/proprint/session";
import { SHEET_PRESETS, type SheetPresetKey } from "@/lib/proprint/sheet-presets";
import type { OutputMode } from "@/lib/proprint/types";
import { track } from "@/lib/analytics";
import { LocalSavesPanel } from "./LocalSavesPanel";
import { PressSheetPreview } from "./PressSheetPreview";
import { useCloudMirror } from "./useCloudMirror";
import { useLocalSaves } from "./useLocalSaves";

const MAX_RECORDS = 5000;

type JobPresetKey = "receipt" | "invoice" | "ticket" | "certificate" | "label";

const JOB_PRESETS: Record<JobPresetKey, { label: string; hint: string; apply: Partial<SerialProSavedSettings> }> = {
    receipt: {
        label: "Receipt book",
        hint: "RCT- · 6 digits · 50 sets/book · cut-and-stack",
        apply: { prefix: "RCT-", suffix: "", padding: 6, setsPerBook: 50, mode: "cut-stack", copies: 1 },
    },
    invoice: {
        label: "Invoice",
        hint: "INV- · 5 digits · numbered pages",
        apply: { prefix: "INV-", suffix: "", padding: 5, setsPerBook: 50, mode: "number-only", copies: 1 },
    },
    ticket: {
        label: "Raffle / event ticket",
        hint: "TCK- · 5 digits · step-and-repeat",
        apply: { prefix: "TCK-", suffix: "", padding: 5, setsPerBook: 100, mode: "step-repeat", copies: 1 },
    },
    certificate: {
        label: "Certificate",
        hint: "CERT- · 4 digits · numbered pages",
        apply: { prefix: "CERT-", suffix: "", padding: 4, setsPerBook: 0, mode: "number-only", copies: 1 },
    },
    label: {
        label: "Serial label",
        hint: "SN- · 6 digits · step-and-repeat",
        apply: { prefix: "SN-", suffix: "", padding: 6, setsPerBook: 0, mode: "step-repeat", copies: 1 },
    },
};

function save(blob: Blob, name: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <label className="serial-field">
            <span>{label}</span>
            {children}
        </label>
    );
}

function defaultName(prefix: string, start: number, end: number) {
    const label = prefix.trim() || "Job";
    return `${label} ${start}-${end}`;
}

export function SerialProStudio() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState("");
    const [size, setSize] = useState<{ width: number; height: number } | null>(null);
    const [pages, setPages] = useState(0);
    const [templatePage, setTemplatePage] = useState(1);
    const [start, setStart] = useState(1);
    const [end, setEnd] = useState(100);
    const [prefix, setPrefix] = useState("RCT-");
    const [suffix, setSuffix] = useState("");
    const [padding, setPadding] = useState(6);
    const [copies, setCopies] = useState(1);
    const [setsPerBook, setSetsPerBook] = useState(50);
    const [fontSize, setFontSize] = useState(12);
    const [bold, setBold] = useState(true);
    const [second, setSecond] = useState(false);
    const [active, setActive] = useState(0);
    const [positions, setPositions] = useState([
        { x: 72, y: 88 },
        { x: 72, y: 12 },
    ]);
    const [mode, setMode] = useState<OutputMode>("cut-stack");
    const [preset, setPreset] = useState<SheetPresetKey>("SRA3");
    const [landscape, setLandscape] = useState(false);
    const [customWidth, setCustomWidth] = useState(320);
    const [customHeight, setCustomHeight] = useState(450);
    const [margin, setMargin] = useState(8);
    const [gx, setGx] = useState(4);
    const [gy, setGy] = useState(4);
    const [cropMarks, setCropMarks] = useState(true);
    const [busy, setBusy] = useState(false);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState("");
    const [previewTab, setPreviewTab] = useState<"artwork" | "sheet">("artwork");
    const [activePreset, setActivePreset] = useState<JobPresetKey | null>(null);
    const saves = useLocalSaves<SerialProSavedSettings>("serialpro");
    const { cloudActive, mirrorSave, mirrorDelete } = useCloudMirror<SerialProSavedSettings>("serialpro");
    const [activeSaveId, setActiveSaveId] = useState<string | null>(null);
    const [customSaveName, setCustomSaveName] = useState<string | null>(null);
    const saveName = customSaveName ?? defaultName(prefix, start, end);

    const unique = Math.max(0, end - start + 1);
    const records = unique * copies;
    const books = setsPerBook > 0 ? Math.ceil(unique / setsPerBook) : 0;
    const sheet = preset === "custom" ? { widthMm: customWidth, heightMm: customHeight } : SHEET_PRESETS[preset];
    const dims = landscape ? { widthMm: sheet.heightMm, heightMm: sheet.widthMm } : sheet;
    const layout = useMemo(
        () =>
            calculateLayout({
                itemWidthPt: size?.width ?? 0,
                itemHeightPt: size?.height ?? 0,
                sheetWidthMm: dims.widthMm,
                sheetHeightMm: dims.heightMm,
                marginMm: margin,
                horizontalGutterMm: gx,
                verticalGutterMm: gy,
                records,
            }),
        [size, dims.widthMm, dims.heightMm, margin, gx, gy, records]
    );
    const bestFit = useMemo(
        () =>
            size
                ? bestFitLayout({
                      itemWidthPt: size.width,
                      itemHeightPt: size.height,
                      sheetWidthMm: dims.widthMm,
                      sheetHeightMm: dims.heightMm,
                      marginMm: margin,
                      horizontalGutterMm: gx,
                      verticalGutterMm: gy,
                      records,
                  })
                : null,
        [size, dims.widthMm, dims.heightMm, margin, gx, gy, records]
    );
    const stats = useMemo(() => layoutStats(layout, records), [layout, records]);
    const impositionMode = mode === "number-only" ? null : mode;

    useEffect(() => {
        if (impositionMode && layout.piecesPerSheet > 0) {
            writeSessionImposition({
                piecesPerSheet: layout.piecesPerSheet,
                across: layout.across,
                down: layout.down,
                sheetLabel: preset === "custom" ? "Custom sheet" : SHEET_PRESETS[preset].label,
            });
        }
    }, [impositionMode, layout.piecesPerSheet, layout.across, layout.down, preset]);

    useEffect(() => {
        track("tool_opened", { tool: "serialpro" });
    }, []);

    const invalid =
        end < start
            ? "End number must be equal to or higher than start."
            : records > MAX_RECORDS
              ? `This job creates ${records.toLocaleString()} records. Generate it in batches of ${MAX_RECORDS.toLocaleString()} or fewer.`
              : mode !== "number-only" && size && layout.piecesPerSheet === 0
                ? `Your finished artwork does not fit on ${SHEET_PRESETS[preset].label} with the current margins and gutters.`
                : "";

    function currentSettings(): SerialProSavedSettings {
        return {
            start,
            end,
            prefix,
            suffix,
            padding,
            copies,
            setsPerBook,
            fontSize,
            bold,
            second,
            positions,
            mode,
            preset,
            landscape,
            customWidth,
            customHeight,
            margin,
            gx,
            gy,
            cropMarks,
            templatePage,
            sourceFileName: file?.name,
        };
    }

    function applySettings(settings: SerialProSavedSettings) {
        setStart(settings.start);
        setEnd(settings.end);
        setPrefix(settings.prefix);
        setSuffix(settings.suffix);
        setPadding(settings.padding);
        setCopies(settings.copies);
        setSetsPerBook(settings.setsPerBook);
        setFontSize(settings.fontSize);
        setBold(settings.bold);
        setSecond(settings.second);
        setPositions(settings.positions);
        setMode(settings.mode);
        setPreset(settings.preset as SheetPresetKey);
        setLandscape(settings.landscape);
        setCustomWidth(settings.customWidth);
        setCustomHeight(settings.customHeight);
        setMargin(settings.margin);
        setGx(settings.gx);
        setGy(settings.gy);
        setCropMarks(settings.cropMarks);
        setTemplatePage(settings.templatePage);
        setActive(0);
    }

    function applyPreset(key: JobPresetKey) {
        const preset = JOB_PRESETS[key];
        const s = preset.apply;
        if (s.prefix !== undefined) setPrefix(s.prefix);
        if (s.suffix !== undefined) setSuffix(s.suffix);
        if (s.padding !== undefined) setPadding(s.padding);
        if (s.setsPerBook !== undefined) setSetsPerBook(s.setsPerBook);
        if (s.mode !== undefined) setMode(s.mode);
        if (s.copies !== undefined) setCopies(s.copies);
        setActivePreset(key);
        track("preset_applied", { tool: "serialpro", preset: key });
        setMessage(`Loaded the ${preset.label.toLowerCase()} preset. Adjust any field to fine-tune.`);
    }

    function handleSave() {
        const settings = currentSettings();
        const record = saveRecord<SerialProSavedSettings>("serialpro", {
            id: activeSaveId ?? undefined,
            name: saveName,
            settings,
        });
        mirrorSave({ id: record.id, name: record.name, settings });
        setActiveSaveId(record.id);
        setCustomSaveName(record.name);
        setMessage(
            file
                ? `Saved “${record.name}”. Artwork stays in this browser session only — re-upload the PDF when you return.`
                : `Saved “${record.name}”. Upload the PDF when you are ready to generate.`
        );
    }

    function handleLoad(id: string) {
        const record = saves.find((item) => item.id === id);
        if (!record) return;
        applySettings(record.settings);
        setActiveSaveId(record.id);
        setCustomSaveName(record.name);
        const reminder = record.settings.sourceFileName
            ? ` Re-upload ${record.settings.sourceFileName} to generate.`
            : " Re-upload the artwork PDF to generate.";
        setMessage(`Loaded “${record.name}”.${file ? "" : reminder}`);
    }

    function handleDelete(id: string) {
        deleteSave("serialpro", id);
        mirrorDelete(id);
        if (activeSaveId === id) {
            setActiveSaveId(null);
            setCustomSaveName(null);
        }
        setMessage("Saved job deleted from this browser.");
    }

    async function upload(e: ChangeEvent<HTMLInputElement>) {
        const selected = e.target.files?.[0];
        setMessage("");
        if (!selected) return;
        if (selected.size > 30 * 1024 * 1024) {
            setMessage("Use a PDF smaller than 30 MB for this browser beta.");
            return;
        }
        try {
            const bytes = await selected.arrayBuffer();
            const pdf = await PDFDocument.load(bytes);
            const url = URL.createObjectURL(selected);
            if (preview) URL.revokeObjectURL(preview);
            setFile(selected);
            setPreview(url);
            setPages(pdf.getPageCount());
            setTemplatePage(1);
            setSize(pdf.getPage(0).getSize());
            track("pdf_uploaded", { tool: "serialpro", pages: pdf.getPageCount() });
        } catch {
            setMessage("This PDF could not be opened. Export a standard, non-password-protected PDF and try again.");
        }
    }

    async function changePage(value: number) {
        if (!file) return;
        const safe = Math.min(pages, Math.max(1, value));
        setTemplatePage(safe);
        const pdf = await PDFDocument.load(await file.arrayBuffer());
        setSize(pdf.getPage(safe - 1).getSize());
    }

    function place(e: MouseEvent<HTMLDivElement>) {
        const r = e.currentTarget.getBoundingClientRect();
        const next = [...positions];
        next[active] = {
            x: +(((e.clientX - r.left) / r.width) * 100).toFixed(1),
            y: +(((r.bottom - e.clientY) / r.height) * 100).toFixed(1),
        };
        setPositions(next);
    }

    async function generate() {
        if (!file || invalid) return;
        setBusy(true);
        setMessage("");
        setProgress(1);
        try {
            const bytes = await generateProductionPdf(
                {
                    source: await file.arrayBuffer(),
                    templatePage,
                    start,
                    end,
                    prefix,
                    suffix,
                    padding,
                    copies,
                    fontSize,
                    bold,
                    positions: second ? positions : [positions[0]],
                    mode,
                    layout,
                    marginMm: margin,
                    horizontalGutterMm: gx,
                    verticalGutterMm: gy,
                    cropMarks,
                },
                setProgress
            );
            save(new Blob([bytes.slice().buffer], { type: "application/pdf" }), `serialpro-${start}-${end}.pdf`);
            setProgress(100);
            track("output_downloaded", { tool: "serialpro", mode, records });
            setMessage("Production PDF generated and downloaded.");
        } catch (error) {
            setMessage(`SerialPro could not generate this job: ${error instanceof Error ? error.message : "Unknown PDF error"}`);
        } finally {
            setBusy(false);
        }
    }

    function manifest() {
        const csv = manifestToCsv(createBookManifest({ start, end, setsPerBook, prefix, suffix, padding }));
        save(new Blob([csv], { type: "text/csv;charset=utf-8" }), `serialpro-books-${start}-${end}.csv`);
    }

    const shown = formatSerial(start, prefix, suffix, padding);

    return (
        <div className="min-h-screen bg-press pb-16 pt-24 text-slate-100">
            <div className="mx-auto max-w-[1580px] px-4 sm:px-6">
                <header className="mb-5 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="font-mono text-xs uppercase tracking-[.22em] text-cyan-300">Production beta / workstation 01</p>
                        <h1 className="mt-2 text-4xl font-black">SerialPro</h1>
                        <p className="mt-2 text-sm text-slate-400">Numbering, book ranges and press-sheet imposition in your browser.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                        <a href="/feedback?product=serialpro" className="rounded-full border border-cyan-300/30 px-3 py-2 font-bold text-cyan-200 hover:bg-cyan-300/10">
                            Send feedback
                        </a>
                        <span className="status-chip">
                            <LockKeyhole />
                            Artwork stays local
                        </span>
                        <span className="status-chip">
                            <ShieldCheck />
                            No account required
                        </span>
                    </div>
                </header>
                {(message || invalid) && (
                    <div
                        role="status"
                        className={`mb-4 rounded-xl border px-4 py-3 text-sm ${
                            invalid || message.startsWith("SerialPro could") || message.startsWith("This PDF") || message.startsWith("Use a PDF")
                                ? "border-rose-400/30 bg-rose-400/10 text-rose-200"
                                : "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                        }`}
                    >
                        {invalid || message}
                    </div>
                )}
                <div className="grid gap-4 xl:grid-cols-[360px_minmax(420px,1fr)_360px]">
                    <aside className="console-panel">
                        <h2>01 / Job setup</h2>
                        <div className="mt-3">
                            <p className="mb-2 flex items-center gap-1.5 font-mono text-[.62rem] font-extrabold uppercase tracking-[.1em] text-slate-400">
                                <Sparkles className="size-3 text-cyan-300" aria-hidden="true" />
                                Quick start
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {(Object.keys(JOB_PRESETS) as JobPresetKey[]).map((key) => (
                                    <button
                                        key={key}
                                        type="button"
                                        title={JOB_PRESETS[key].hint}
                                        onClick={() => applyPreset(key)}
                                        className={`rounded-full border px-2.5 py-1 text-[.68rem] font-bold transition ${
                                            activePreset === key
                                                ? "border-cyan-300 bg-cyan-300/15 text-cyan-100"
                                                : "border-white/10 text-slate-300 hover:border-cyan-300/40 hover:text-cyan-200"
                                        }`}
                                    >
                                        {JOB_PRESETS[key].label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <label className="upload">
                            <FileText />
                            <b>Choose print-ready PDF</b>
                            <span>PDF · maximum 30 MB</span>
                            <input className="sr-only" type="file" accept=".pdf,application/pdf" onChange={upload} />
                        </label>
                        {file && (
                            <p className="truncate text-xs text-cyan-200">
                                {file.name} · {pages} page{pages === 1 ? "" : "s"}
                            </p>
                        )}
                        {pages > 1 && (
                            <Field label="Template page">
                                <input type="number" min="1" max={pages} value={templatePage} onChange={(e) => void changePage(+e.target.value)} />
                            </Field>
                        )}
                        <div className="two">
                            <Field label="Start">
                                <input type="number" min="0" value={start} onChange={(e) => setStart(+e.target.value)} />
                            </Field>
                            <Field label="End">
                                <input type="number" min="0" value={end} onChange={(e) => setEnd(+e.target.value)} />
                            </Field>
                        </div>
                        <div className="two">
                            <Field label="Prefix">
                                <input value={prefix} onChange={(e) => setPrefix(e.target.value)} />
                            </Field>
                            <Field label="Suffix">
                                <input value={suffix} onChange={(e) => setSuffix(e.target.value)} />
                            </Field>
                        </div>
                        <div className="two">
                            <Field label="Digits">
                                <input type="number" min="1" max="12" value={padding} onChange={(e) => setPadding(+e.target.value)} />
                            </Field>
                            <Field label="Copies / serial">
                                <select value={copies} onChange={(e) => setCopies(+e.target.value)}>
                                    {[1, 2, 3, 4, 5].map((n) => (
                                        <option key={n} value={n}>
                                            {n}
                                            {n === 2 ? " · duplicate" : n === 3 ? " · triplicate" : ""}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                        </div>
                        <Field label="Sets per book">
                            <input type="number" min="1" value={setsPerBook} onChange={(e) => setSetsPerBook(+e.target.value)} />
                        </Field>
                        <button className="secondary-button" disabled={!unique || setsPerBook < 1} onClick={manifest}>
                            <FileDown />
                            Download book manifest
                        </button>
                        <LocalSavesPanel
                            label="Saved jobs"
                            records={saves}
                            activeId={activeSaveId}
                            draftName={saveName}
                            onDraftNameChange={setCustomSaveName}
                            onSave={handleSave}
                            onLoad={handleLoad}
                            onDelete={handleDelete}
                            cloud={cloudActive}
                            hint={cloudActive ? "Synced to your ProPrint account. Artwork is never stored." : "Saves numbering and sheet setup on this device. Artwork is never stored."}
                        />
                    </aside>
                    <main className="preview-panel">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2>02 / {previewTab === "sheet" ? "Press-sheet preview" : "Placement preview"}</h2>
                                <p>
                                    {previewTab === "sheet"
                                        ? "How pieces tile on the press sheet, with live serial order."
                                        : "Click the artwork to place the active marker."}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                {previewTab === "artwork" ? (
                                    <>
                                        <button className={active === 0 ? "marker-active" : "marker-button"} onClick={() => setActive(0)}>
                                            Position 1
                                        </button>
                                        {second && (
                                            <button className={active === 1 ? "marker-active" : "marker-button"} onClick={() => setActive(1)}>
                                                Position 2
                                            </button>
                                        )}
                                    </>
                                ) : null}
                            </div>
                        </div>
                        {impositionMode && (
                            <div className="mt-3 inline-flex rounded-lg border border-white/10 bg-press p-0.5" role="tablist" aria-label="Preview mode">
                                <button
                                    role="tab"
                                    aria-selected={previewTab === "artwork"}
                                    onClick={() => setPreviewTab("artwork")}
                                    className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition ${
                                        previewTab === "artwork" ? "bg-cyan-300 text-slate-950" : "text-slate-300 hover:text-white"
                                    }`}
                                >
                                    <ImageIcon className="size-3.5" aria-hidden="true" />
                                    Artwork
                                </button>
                                <button
                                    role="tab"
                                    aria-selected={previewTab === "sheet"}
                                    onClick={() => setPreviewTab("sheet")}
                                    className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition ${
                                        previewTab === "sheet" ? "bg-cyan-300 text-slate-950" : "text-slate-300 hover:text-white"
                                    }`}
                                >
                                    <Grid3x3 className="size-3.5" aria-hidden="true" />
                                    Press sheet
                                </button>
                            </div>
                        )}
                        {impositionMode && bestFit?.improves && size && (
                            <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs text-amber-100">
                                <RotateCw className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                                <span>
                                    Rotating the artwork 90° fits{" "}
                                    <b className="font-mono">{bestFit.rotatedPiecesPerSheet}-up</b> instead of{" "}
                                    <b className="font-mono">{bestFit.piecesPerSheet}-up</b> on this sheet — fewer press sheets and less waste.
                                </span>
                            </div>
                        )}
                        {impositionMode && previewTab === "sheet" && size ? (
                            <PressSheetPreview
                                layout={layout}
                                itemWidthPt={size.width}
                                itemHeightPt={size.height}
                                marginMm={margin}
                                horizontalGutterMm={gx}
                                verticalGutterMm={gy}
                                mode={impositionMode}
                                start={start}
                                prefix={prefix}
                                suffix={suffix}
                                padding={padding}
                                copies={copies}
                                records={records}
                                cropMarks={cropMarks}
                            />
                        ) : impositionMode && previewTab === "sheet" && !size ? (
                            <div className="mt-4 grid min-h-[560px] place-items-center rounded-xl border border-white/10 bg-slate-950 text-center text-slate-500">
                                <div>
                                    <Grid3x3 className="mx-auto size-10" aria-hidden="true" />
                                    <b className="mt-4 block text-slate-300">Upload artwork to see the press sheet</b>
                                    <span className="mt-2 block text-sm">The imposition updates live as you change the sheet and margins.</span>
                                </div>
                            </div>
                        ) : (
                        <div className="relative mt-4 min-h-[560px] overflow-hidden rounded-xl bg-slate-950">
                            {preview ? (
                                <>
                                    <iframe
                                        title="Uploaded PDF preview"
                                        src={`${preview}#toolbar=0&navpanes=0&page=${templatePage}&view=Fit`}
                                        className="h-[70vh] min-h-[560px] w-full bg-white"
                                    />
                                    <div className="absolute inset-0 cursor-crosshair" onClick={place}>
                                        {positions.slice(0, second ? 2 : 1).map((p, i) => (
                                            <div
                                                key={i}
                                                className={`absolute -translate-x-1/2 translate-y-1/2 rounded bg-cyan-300 px-2 py-1 font-mono text-xs font-bold text-slate-950 ring-2 ${
                                                    active === i ? "ring-white" : "ring-cyan-900"
                                                }`}
                                                style={{ left: `${p.x}%`, bottom: `${p.y}%` }}
                                            >
                                                {shown}
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="grid min-h-[560px] place-items-center text-center text-slate-500">
                                    <div>
                                        <MousePointer2 className="mx-auto size-10" aria-hidden="true" />
                                        <b className="mt-4 block text-slate-300">Upload artwork to begin</b>
                                        <span className="mt-2 block text-sm">The source PDF never leaves this browser.</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        )}
                    </main>
                    <aside className="console-panel">
                        <h2>03 / Production setup</h2>
                        <div className="two">
                            <Field label="Font size">
                                <input type="number" min="6" max="72" value={fontSize} onChange={(e) => setFontSize(+e.target.value)} />
                            </Field>
                            <Field label="Weight">
                                <select value={bold ? "bold" : "regular"} onChange={(e) => setBold(e.target.value === "bold")}>
                                    <option value="bold">Bold</option>
                                    <option value="regular">Regular</option>
                                </select>
                            </Field>
                        </div>
                        <label className="check">
                            <input type="checkbox" checked={second} onChange={(e) => setSecond(e.target.checked)} />
                            Second serial position
                        </label>
                        <div className="mode-grid">
                            {(["number-only", "step-repeat", "cut-stack"] as OutputMode[]).map((value) => (
                                <button key={value} onClick={() => setMode(value)} className={mode === value ? "selected" : ""}>
                                    {value === "cut-stack" && <Scissors aria-hidden="true" />}
                                    {value.replace("-", " ")}
                                </button>
                            ))}
                        </div>
                        {mode !== "number-only" && (
                            <>
                                <Field label="Press sheet">
                                    <select value={preset} onChange={(e) => setPreset(e.target.value as SheetPresetKey)}>
                                        {Object.entries(SHEET_PRESETS).map(([key, value]) => (
                                            <option key={key} value={key}>
                                                {value.label}
                                            </option>
                                        ))}
                                    </select>
                                </Field>
                                {preset === "custom" && (
                                    <div className="two">
                                        <Field label="Width mm">
                                            <input type="number" min="50" value={customWidth} onChange={(e) => setCustomWidth(+e.target.value)} />
                                        </Field>
                                        <Field label="Height mm">
                                            <input type="number" min="50" value={customHeight} onChange={(e) => setCustomHeight(+e.target.value)} />
                                        </Field>
                                    </div>
                                )}
                                <label className="check">
                                    <input type="checkbox" checked={landscape} onChange={(e) => setLandscape(e.target.checked)} />
                                    Landscape sheet
                                </label>
                                <div className="three">
                                    <Field label="Margin">
                                        <input type="number" min="0" value={margin} onChange={(e) => setMargin(+e.target.value)} />
                                    </Field>
                                    <Field label="H gutter">
                                        <input type="number" min="0" value={gx} onChange={(e) => setGx(+e.target.value)} />
                                    </Field>
                                    <Field label="V gutter">
                                        <input type="number" min="0" value={gy} onChange={(e) => setGy(+e.target.value)} />
                                    </Field>
                                </div>
                                <label className="check">
                                    <input type="checkbox" checked={cropMarks} onChange={(e) => setCropMarks(e.target.checked)} />
                                    Crop marks
                                </label>
                            </>
                        )}
                        <div className="production-summary">
                            <h3>Production summary</h3>
                            <dl>
                                <div>
                                    <dt>Serial range</dt>
                                    <dd>
                                        {shown}—{formatSerial(end, prefix, suffix, padding)}
                                    </dd>
                                </div>
                                <div>
                                    <dt>Unique records</dt>
                                    <dd>{unique.toLocaleString()}</dd>
                                </div>
                                <div>
                                    <dt>Copies / finished pieces</dt>
                                    <dd>
                                        {copies} / {records.toLocaleString()}
                                    </dd>
                                </div>
                                <div>
                                    <dt>Books</dt>
                                    <dd>{books.toLocaleString()}</dd>
                                </div>
                                {mode !== "number-only" && (
                                    <>
                                        <div>
                                            <dt>Layout</dt>
                                            <dd>
                                                {layout.across} × {layout.down}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt>Pieces / sheet</dt>
                                            <dd>{layout.piecesPerSheet}</dd>
                                        </div>
                                        <div>
                                            <dt>Press sheets</dt>
                                            <dd>{layout.sheetsRequired.toLocaleString()}</dd>
                                        </div>
                                        <div>
                                            <dt>Sheet utilization</dt>
                                            <dd>{Math.round(stats.utilization * 100)}%</dd>
                                        </div>
                                        <div>
                                            <dt>Blank slots (last sheet)</dt>
                                            <dd>{stats.wastedSlots.toLocaleString()}</dd>
                                        </div>
                                    </>
                                )}
                            </dl>
                        </div>
                        <button className="primary-button" disabled={!file || !!invalid || busy} onClick={() => void generate()}>
                            {busy ? (
                                <>
                                    <LoaderCircle className="animate-spin" />
                                    Generating {progress}%
                                </>
                            ) : (
                                <>
                                    <Download />
                                    Generate production PDF
                                </>
                            )}
                        </button>
                        {busy && (
                            <div className="press-progress" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
                                <span style={{ width: `${progress}%` }} />
                            </div>
                        )}
                        <p className="mt-3 text-center text-[11px] text-slate-400">Test a small range before releasing a production run.</p>
                    </aside>
                </div>
            </div>
        </div>
    );
}
