"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import { BookOpen, Plus, Save, ShieldCheck, Trash2, Wand2 } from "lucide-react";
import {
    createDefaultProgramme,
    programmeDisplayName,
    type ProgrammeContent,
} from "@/lib/proprint/programme/schema";
import { clampSheetCount, sheetsForProgramme } from "@/lib/proprint/programme/layout";
import { getProgrammeTemplate, listProgrammeTemplates } from "@/lib/proprint/programme/templates";
import {
    deleteProgrammeSave,
    formatProgrammeSavedWhen,
    getProgrammeSaveSnapshot,
    getServerProgrammeSaveSnapshot,
    saveProgrammeRecord,
    subscribeProgrammeSaves,
} from "@/lib/proprint/programme/saves";
import { ProgrammeFoldPreview } from "./ProgrammeFoldPreview";
import { ProgrammeImportWizard } from "./ProgrammeImportWizard";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <label className="serial-field">
            <span>{label}</span>
            {children}
        </label>
    );
}

export function ProgrammeStudio() {
    const [content, setContent] = useState<ProgrammeContent>(() => createDefaultProgramme());
    const [sheetIndex, setSheetIndex] = useState(0);
    const [activeSaveId, setActiveSaveId] = useState<string | null>(null);
    const [customName, setCustomName] = useState<string | null>(null);
    const [message, setMessage] = useState("");
    const [wizardOpen, setWizardOpen] = useState(false);
    const saves = useSyncExternalStore(
        subscribeProgrammeSaves,
        getProgrammeSaveSnapshot,
        getServerProgrammeSaveSnapshot
    );
    const template = getProgrammeTemplate(content.templateId);
    const sheets = sheetsForProgramme(content);
    const saveName = customName ?? programmeDisplayName(content);

    const patchIdentity = useCallback((patch: Partial<ProgrammeContent["identity"]>) => {
        setContent((current) => ({ ...current, identity: { ...current.identity, ...patch } }));
    }, []);

    const patchAck = useCallback((patch: Partial<ProgrammeContent["acknowledgement"]>) => {
        setContent((current) => ({
            ...current,
            acknowledgement: { ...current.acknowledgement, ...patch },
        }));
    }, []);

    function handleSave() {
        const record = saveProgrammeRecord({
            id: activeSaveId ?? undefined,
            name: saveName,
            content,
        });
        setActiveSaveId(record.id);
        setCustomName(record.name);
        setMessage(`Saved “${record.name}” on this browser. Photos are not stored yet.`);
    }

    function handleLoad(id: string) {
        const record = saves.find((item) => item.id === id);
        if (!record) return;
        setContent(record.settings.content);
        setActiveSaveId(record.id);
        setCustomName(record.name);
        setSheetIndex(0);
        setMessage(`Loaded “${record.name}”.`);
    }

    function handleDelete(id: string) {
        deleteProgrammeSave(id);
        if (activeSaveId === id) {
            setActiveSaveId(null);
            setCustomName(null);
        }
        setMessage("Saved programme deleted from this browser.");
    }

    function setAttributesFromText(value: string) {
        const attributes = value
            .split(/[,|·]/)
            .map((item) => item.trim())
            .filter(Boolean)
            .slice(0, 8);
        patchIdentity({ attributes });
    }

    return (
        <div className="min-h-screen bg-press pb-16 pt-24 text-slate-100">
            <div className="mx-auto max-w-[1580px] px-4 sm:px-6">
                <header className="mb-5 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="font-mono text-xs uppercase tracking-[.22em] text-cyan-300">
                            Production beta / programme 01
                        </p>
                        <h1 className="mt-2 text-4xl font-black">ProgrammePro</h1>
                        <p className="mt-2 text-sm text-slate-400">
                            Build an A3-fold funeral programme for Kenyan print shops — cover first, press-ready next.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                        <button
                            type="button"
                            onClick={() => setWizardOpen(true)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-cyan-300/40 bg-cyan-300/10 px-3 py-2 font-bold text-cyan-100 hover:bg-cyan-300/20"
                        >
                            <Wand2 className="size-3.5" />
                            Smart import
                        </button>
                        <a
                            href="/feedback?product=programme"
                            className="rounded-full border border-cyan-300/30 px-3 py-2 font-bold text-cyan-200 hover:bg-cyan-300/10"
                        >
                            Send feedback
                        </a>
                        <span className="status-chip">
                            <ShieldCheck />
                            Content stays local
                        </span>
                        <span className="status-chip">
                            <BookOpen />
                            A3 fold · A4 panels
                        </span>
                    </div>
                </header>

                {message && (
                    <div
                        role="status"
                        className="mb-4 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200"
                    >
                        {message}
                    </div>
                )}

                <div className="grid gap-4 xl:grid-cols-[340px_minmax(520px,1fr)_300px]">
                    <aside className="console-panel space-y-1">
                        <h2>01 / Content</h2>
                        <p className="mt-2 text-xs leading-5 text-slate-500">
                            Fill cover and acknowledgement, or use <b className="text-slate-300">Smart import</b> to draft
                            from a family write-up. Every field stays editable.
                        </p>

                        <Field label="Display first name">
                            <input
                                value={content.identity.displayFirstName}
                                onChange={(e) => patchIdentity({ displayFirstName: e.target.value })}
                            />
                        </Field>
                        <Field label="Surname line">
                            <input
                                value={content.identity.surnameLine}
                                onChange={(e) => patchIdentity({ surnameLine: e.target.value })}
                            />
                        </Field>
                        <Field label="Cover title">
                            <input
                                value={content.identity.coverTitle}
                                onChange={(e) => patchIdentity({ coverTitle: e.target.value })}
                            />
                        </Field>
                        <Field label="Role line">
                            <input
                                value={content.identity.roleLine}
                                onChange={(e) => patchIdentity({ roleLine: e.target.value })}
                            />
                        </Field>
                        <div className="two">
                            <Field label="Sunrise">
                                <input
                                    value={content.identity.sunrise}
                                    onChange={(e) => patchIdentity({ sunrise: e.target.value })}
                                />
                            </Field>
                            <Field label="Sunset">
                                <input
                                    value={content.identity.sunset}
                                    onChange={(e) => patchIdentity({ sunset: e.target.value })}
                                />
                            </Field>
                        </div>
                        <Field label="Attributes (comma separated)">
                            <input
                                value={content.identity.attributes.join(", ")}
                                onChange={(e) => setAttributesFromText(e.target.value)}
                                placeholder="Loving, Kind, Strong"
                            />
                        </Field>
                        <Field label="Dedication footer">
                            <input
                                value={content.identity.dedication}
                                onChange={(e) => patchIdentity({ dedication: e.target.value })}
                            />
                        </Field>
                        <Field label="Motto">
                            <input
                                value={content.identity.motto}
                                onChange={(e) => patchIdentity({ motto: e.target.value })}
                            />
                        </Field>
                        <Field label="Service date">
                            <input
                                value={content.identity.serviceDate}
                                onChange={(e) => patchIdentity({ serviceDate: e.target.value })}
                                placeholder="Optional"
                            />
                        </Field>
                        <Field label="Service time">
                            <input
                                value={content.identity.serviceTime}
                                onChange={(e) => patchIdentity({ serviceTime: e.target.value })}
                                placeholder="Optional"
                            />
                        </Field>
                        <Field label="Venue">
                            <input
                                value={content.identity.venue}
                                onChange={(e) => patchIdentity({ venue: e.target.value })}
                                placeholder="Optional"
                            />
                        </Field>

                        <div className="mt-5 border-t border-white/10 pt-4">
                            <h3 className="font-mono text-[10px] font-bold uppercase tracking-[.14em] text-slate-500">
                                Acknowledgement
                            </h3>
                            <Field label="Title">
                                <input
                                    value={content.acknowledgement.title}
                                    onChange={(e) => patchAck({ title: e.target.value })}
                                />
                            </Field>
                            <Field label="Body">
                                <textarea
                                    className="programme-textarea"
                                    rows={5}
                                    value={content.acknowledgement.body}
                                    onChange={(e) => patchAck({ body: e.target.value })}
                                />
                            </Field>
                            <Field label="Footer line">
                                <input
                                    value={content.acknowledgement.footerLine}
                                    onChange={(e) => patchAck({ footerLine: e.target.value })}
                                />
                            </Field>
                        </div>
                    </aside>

                    <main className="preview-panel">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2>02 / A3 fold preview</h2>
                                <p>Left and right panels as printed on one A3 sheet.</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {sheets.map((_, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        className={sheetIndex === index ? "marker-active" : "marker-button"}
                                        onClick={() => setSheetIndex(index)}
                                    >
                                        Sheet {index + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="mt-4 overflow-x-auto">
                            <ProgrammeFoldPreview content={content} sheetIndex={sheetIndex} />
                        </div>
                    </main>

                    <aside className="console-panel">
                        <h2>03 / Template & save</h2>
                        <Field label="Template">
                            <select
                                value={content.templateId}
                                onChange={(e) =>
                                    setContent((current) => ({
                                        ...current,
                                        templateId: e.target.value as ProgrammeContent["templateId"],
                                    }))
                                }
                            >
                                {listProgrammeTemplates().map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <p className="mt-2 text-xs leading-5 text-slate-500">
                            {template.mood}. {template.description}
                        </p>
                        <Field label="A3 sheets">
                            <select
                                value={content.sheetCount}
                                onChange={(e) => {
                                    const sheetCount = clampSheetCount(Number(e.target.value));
                                    setContent((current) => ({ ...current, sheetCount }));
                                    setSheetIndex((index) => Math.min(index, sheetCount - 1));
                                }}
                            >
                                {[1, 2, 3, 4].map((count) => (
                                    <option key={count} value={count}>
                                        {count} sheet{count === 1 ? "" : "s"} · {count * 2} panels
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <div className="mt-4 rounded-xl border border-white/10 bg-white/[.03] p-3">
                            <div className="flex items-center justify-between gap-2">
                                <p className="font-mono text-[10px] font-bold uppercase tracking-[.14em] text-slate-500">
                                    Saved programmes
                                </p>
                                <span className="font-mono text-[10px] text-slate-600">{saves.length} saved</span>
                            </div>
                            <div className="mt-3 flex gap-2">
                                <input
                                    value={saveName}
                                    onChange={(e) => setCustomName(e.target.value)}
                                    className="min-w-0 flex-1 rounded-lg border border-white/12 bg-press px-3 py-2 text-xs text-slate-100 outline-none focus:border-cyan-300"
                                />
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-cyan-300 px-3 py-2 text-xs font-black text-press hover:bg-cyan-200"
                                >
                                    <Save className="size-3.5" />
                                    Save
                                </button>
                            </div>
                            <p className="mt-2 text-[11px] leading-4 text-slate-500">
                                Settings only on this browser. Photo slots arrive in Milestone 3.
                            </p>
                            {saves.length === 0 ? (
                                <p className="mt-3 text-[11px] text-slate-500">No saved programmes yet.</p>
                            ) : (
                                <ul className="mt-3 max-h-48 space-y-1.5 overflow-y-auto">
                                    {saves.map((record) => (
                                        <li
                                            key={record.id}
                                            className={`rounded-lg border px-2.5 py-2 ${
                                                activeSaveId === record.id
                                                    ? "border-cyan-300/40 bg-cyan-300/10"
                                                    : "border-white/8 bg-press/60"
                                            }`}
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <button
                                                    type="button"
                                                    className="min-w-0 flex-1 text-left"
                                                    onClick={() => handleLoad(record.id)}
                                                >
                                                    <span className="block truncate text-xs font-bold text-slate-100">
                                                        {record.name}
                                                    </span>
                                                    <span className="mt-0.5 block font-mono text-[10px] text-slate-500">
                                                        {formatProgrammeSavedWhen(record.updatedAt)}
                                                    </span>
                                                </button>
                                                <button
                                                    type="button"
                                                    aria-label={`Delete ${record.name}`}
                                                    onClick={() => handleDelete(record.id)}
                                                    className="grid size-8 place-items-center rounded-md border border-white/10 text-rose-200 hover:bg-rose-400/10"
                                                >
                                                    <Trash2 className="size-3.5" />
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <button
                            type="button"
                            className="secondary-button"
                            onClick={() => {
                                setContent(createDefaultProgramme());
                                setActiveSaveId(null);
                                setCustomName(null);
                                setSheetIndex(0);
                                setMessage("Reset to Floral Matriarch sample content.");
                            }}
                        >
                            <Plus />
                            Reset sample content
                        </button>
                        <p className="mt-4 text-xs leading-5 text-slate-500">
                            PDF export with bleed ships in Milestone 3. Preview is the fold layout shops will print.
                        </p>
                    </aside>
                </div>
            </div>
            <ProgrammeImportWizard
                open={wizardOpen}
                onClose={() => setWizardOpen(false)}
                onApply={(next, meta) => {
                    setContent(next);
                    setActiveSaveId(null);
                    setCustomName(null);
                    setSheetIndex(0);
                    setMessage(
                        `Smart import applied (${meta.engine}). Review the fold preview — every field remains editable.`
                    );
                }}
            />
        </div>
    );
}
