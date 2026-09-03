"use client";

import { FolderOpen, Save, Trash2 } from "lucide-react";
import { formatSavedWhen, type SavedRecord } from "@/lib/proprint/local-saves";

type Props<T> = {
    label: string;
    records: Array<SavedRecord<T>>;
    activeId: string | null;
    draftName: string;
    onDraftNameChange: (value: string) => void;
    onSave: () => void;
    onLoad: (id: string) => void;
    onDelete: (id: string) => void;
    hint?: string;
};

export function LocalSavesPanel<T>({
    label,
    records,
    activeId,
    draftName,
    onDraftNameChange,
    onSave,
    onLoad,
    onDelete,
    hint,
}: Props<T>) {
    return (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/[.03] p-3">
            <div className="flex items-center justify-between gap-2">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[.14em] text-slate-500">
                    {label}
                </p>
                <span className="font-mono text-[10px] text-slate-600">{records.length} saved</span>
            </div>
            <div className="mt-3 flex gap-2">
                <input
                    value={draftName}
                    onChange={(event) => onDraftNameChange(event.target.value)}
                    placeholder="Name this setup"
                    className="min-w-0 flex-1 rounded-lg border border-white/12 bg-press px-3 py-2 text-xs text-slate-100 outline-none placeholder:text-slate-600 focus:border-cyan-300"
                />
                <button
                    type="button"
                    onClick={onSave}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-cyan-300 px-3 py-2 text-xs font-black text-press hover:bg-cyan-200"
                >
                    <Save className="size-3.5" />
                    Save
                </button>
            </div>
            {hint && <p className="mt-2 text-[11px] leading-4 text-slate-500">{hint}</p>}
            {records.length === 0 ? (
                <p className="mt-3 text-[11px] text-slate-500">No saved setups yet. Save the current job to reuse it later on this browser.</p>
            ) : (
                <ul className="mt-3 max-h-44 space-y-1.5 overflow-y-auto">
                    {records.map((record) => (
                        <li
                            key={record.id}
                            className={`rounded-lg border px-2.5 py-2 ${
                                activeId === record.id
                                    ? "border-cyan-300/40 bg-cyan-300/10"
                                    : "border-white/8 bg-press/60"
                            }`}
                        >
                            <div className="flex items-start justify-between gap-2">
                                <button
                                    type="button"
                                    onClick={() => onLoad(record.id)}
                                    className="min-w-0 flex-1 text-left"
                                >
                                    <span className="block truncate text-xs font-bold text-slate-100">
                                        {record.name}
                                    </span>
                                    <span className="mt-0.5 block font-mono text-[10px] text-slate-500">
                                        {formatSavedWhen(record.updatedAt)}
                                    </span>
                                </button>
                                <div className="flex shrink-0 gap-1">
                                    <button
                                        type="button"
                                        aria-label={`Load ${record.name}`}
                                        onClick={() => onLoad(record.id)}
                                        className="grid size-8 place-items-center rounded-md border border-white/10 text-cyan-200 hover:bg-cyan-300/10"
                                    >
                                        <FolderOpen className="size-3.5" />
                                    </button>
                                    <button
                                        type="button"
                                        aria-label={`Delete ${record.name}`}
                                        onClick={() => onDelete(record.id)}
                                        className="grid size-8 place-items-center rounded-md border border-white/10 text-rose-200 hover:bg-rose-400/10"
                                    >
                                        <Trash2 className="size-3.5" />
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
