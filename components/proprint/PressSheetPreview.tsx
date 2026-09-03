"use client";

import { useMemo } from "react";
import { layoutStats, recordIndexForSlot } from "@/lib/proprint/imposition";
import { formatSerial, productionRecordSerial } from "@/lib/proprint/serial";
import type { ImpositionLayout, OutputMode } from "@/lib/proprint/types";

interface PressSheetPreviewProps {
    layout: ImpositionLayout;
    itemWidthPt: number;
    itemHeightPt: number;
    marginMm: number;
    horizontalGutterMm: number;
    verticalGutterMm: number;
    mode: Exclude<OutputMode, "number-only">;
    start: number;
    prefix: string;
    suffix: string;
    padding: number;
    copies: number;
    records: number;
    cropMarks: boolean;
}

const MM_TO_PT = 72 / 25.4;

export function PressSheetPreview({
    layout,
    itemWidthPt,
    itemHeightPt,
    marginMm,
    horizontalGutterMm,
    verticalGutterMm,
    mode,
    start,
    prefix,
    suffix,
    padding,
    copies,
    records,
    cropMarks,
}: PressSheetPreviewProps) {
    const stats = useMemo(() => layoutStats(layout, records), [layout, records]);
    const { across, down, piecesPerSheet, sheetsRequired, sheetWidthPt, sheetHeightPt } = layout;

    const margin = Math.max(0, marginMm) * MM_TO_PT;
    const gx = Math.max(0, horizontalGutterMm) * MM_TO_PT;
    const gy = Math.max(0, verticalGutterMm) * MM_TO_PT;

    if (piecesPerSheet === 0 || sheetWidthPt === 0 || sheetHeightPt === 0) {
        return (
            <div className="grid min-h-[560px] place-items-center rounded-xl border border-rose-400/20 bg-rose-400/5 text-center text-sm text-rose-200">
                <div className="max-w-xs px-6">
                    <b className="block text-rose-100">Artwork does not fit</b>
                    <span className="mt-2 block text-rose-200/80">
                        Reduce margins or gutters, or choose a larger press sheet. Rotating the artwork may also help.
                    </span>
                </div>
            </div>
        );
    }

    // Label density: only render serial text when the cells are large enough to read.
    const showLabels = piecesPerSheet <= 40;
    const labelFontPt = Math.min(itemWidthPt, itemHeightPt) * 0.22;

    const cells = Array.from({ length: piecesPerSheet }, (_, slot) => {
        const col = slot % across;
        const row = Math.floor(slot / across);
        const x = margin + col * (itemWidthPt + gx);
        const y = margin + row * (itemHeightPt + gy);
        // Serial that lands in this slot on the FIRST press sheet — shows the real flow.
        const record = recordIndexForSlot(mode, 0, slot, sheetsRequired, piecesPerSheet);
        const serialValue = start + productionRecordSerial(record, copies);
        const inRange = record < records;
        return { slot, x, y, serialValue, inRange };
    });

    const utilizationPct = Math.round(stats.utilization * 100);
    const utilizationTone =
        utilizationPct >= 80 ? "text-emerald-300" : utilizationPct >= 55 ? "text-cyan-200" : "text-amber-300";

    return (
        <div className="mt-4">
            <div
                className="relative overflow-hidden rounded-xl border border-white/10 bg-slate-950 p-4"
                role="img"
                aria-label={`Press sheet preview: ${across} across by ${down} down, ${piecesPerSheet} pieces per sheet, ${sheetsRequired} sheets, ${utilizationPct}% sheet utilization.`}
            >
                <svg
                    viewBox={`-8 -8 ${sheetWidthPt + 16} ${sheetHeightPt + 16}`}
                    className="mx-auto block h-[52vh] max-h-[560px] w-auto max-w-full"
                    preserveAspectRatio="xMidYMid meet"
                >
                    {/* Press sheet */}
                    <rect
                        x={0}
                        y={0}
                        width={sheetWidthPt}
                        height={sheetHeightPt}
                        rx={4}
                        fill="var(--color-press-panel)"
                        stroke="rgb(255 255 255 / 0.18)"
                        strokeWidth={1.5}
                    />
                    {/* Margin guide */}
                    {margin > 0 && (
                        <rect
                            x={margin}
                            y={margin}
                            width={Math.max(0, sheetWidthPt - margin * 2)}
                            height={Math.max(0, sheetHeightPt - margin * 2)}
                            fill="none"
                            stroke="rgb(103 232 249 / 0.18)"
                            strokeDasharray="6 6"
                            strokeWidth={1}
                        />
                    )}
                    {cells.map((cell) => (
                        <g key={cell.slot}>
                            <rect
                                x={cell.x}
                                y={cell.y}
                                width={itemWidthPt}
                                height={itemHeightPt}
                                rx={2}
                                fill={cell.inRange ? "rgb(103 232 249 / 0.08)" : "rgb(255 255 255 / 0.02)"}
                                stroke={cell.inRange ? "rgb(103 232 249 / 0.55)" : "rgb(148 163 184 / 0.25)"}
                                strokeWidth={1}
                                strokeDasharray={cell.inRange ? undefined : "4 4"}
                            />
                            {cropMarks && (
                                <>
                                    <line x1={cell.x} y1={cell.y - 5} x2={cell.x} y2={cell.y - 1} stroke="rgb(226 232 240 / 0.6)" strokeWidth={0.75} />
                                    <line x1={cell.x - 5} y1={cell.y} x2={cell.x - 1} y2={cell.y} stroke="rgb(226 232 240 / 0.6)" strokeWidth={0.75} />
                                </>
                            )}
                            {showLabels && (
                                <text
                                    x={cell.x + itemWidthPt / 2}
                                    y={cell.y + itemHeightPt / 2}
                                    fill={cell.inRange ? "#a5f3fc" : "#64748b"}
                                    fontSize={labelFontPt}
                                    fontFamily="var(--font-mono), monospace"
                                    fontWeight={700}
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                >
                                    {cell.inRange ? formatSerial(cell.serialValue, prefix, suffix, padding) : "—"}
                                </text>
                            )}
                        </g>
                    ))}
                </svg>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg border border-white/10 bg-white/[.03] px-2 py-2">
                    <p className="font-mono text-lg font-black tabular-nums text-slate-100">
                        {across}×{down}
                    </p>
                    <p className="mt-0.5 text-[10px] uppercase tracking-wider text-slate-400">Layout · {piecesPerSheet}-up</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[.03] px-2 py-2">
                    <p className={`font-mono text-lg font-black tabular-nums ${utilizationTone}`}>{utilizationPct}%</p>
                    <p className="mt-0.5 text-[10px] uppercase tracking-wider text-slate-400">Sheet used</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[.03] px-2 py-2">
                    <p className="font-mono text-lg font-black tabular-nums text-slate-100">{sheetsRequired.toLocaleString()}</p>
                    <p className="mt-0.5 text-[10px] uppercase tracking-wider text-slate-400">Press sheets</p>
                </div>
            </div>
            <p className="mt-2 text-center text-[11px] text-slate-400">
                Sheet 1 of {sheetsRequired.toLocaleString()} · serial order shown for {mode === "cut-stack" ? "cut-and-stack" : "step-and-repeat"}
                {stats.wastedSlots > 0 && ` · ${stats.wastedSlots.toLocaleString()} blank slot${stats.wastedSlots === 1 ? "" : "s"} on the last sheet`}
            </p>
        </div>
    );
}
