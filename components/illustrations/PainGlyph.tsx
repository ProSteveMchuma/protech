"use client";

/**
 * PainGlyph — the four-frame illustration support for PainStory.
 *
 *   1 — TCC certificate with red diagonal "EXPIRED" stamp
 *   2 — Stack of docs with one obviously unsigned page floating loose
 *   3 — AGPO certificate with a faded watermark
 *   4 — Same stack as 2, now signed and bound — resolution shot
 *
 * Larger than ProcessIllustration (~200-300px). Reads as muted/grayscale
 * on the dark backdrop with a single accent per frame.
 */

import { motion, useReducedMotion } from "framer-motion";

interface Props {
    frame: 1 | 2 | 3 | 4;
    className?: string;
}

const DANGER = "#DC2626";
const SUCCESS = "#10B981";
const SUN = "#F59E0B";
const ACCENT = "#06B6D4";

export function PainGlyph({ frame, className }: Props) {
    const reduce = useReducedMotion();
    const Inner = FRAMES[frame - 1];
    return (
        <motion.div
            className={className}
            aria-hidden
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
            <svg
                viewBox="0 0 240 240"
                width="100%"
                height="100%"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                role="presentation"
            >
                <Inner />
            </svg>
        </motion.div>
    );
}

/* ---------- Frame 1: TCC expired — diagonal red stamp ---------- */
function Frame1() {
    return (
        <g>
            {/* paper */}
            <rect
                x="40"
                y="32"
                width="160"
                height="180"
                rx="8"
                fill="white"
                stroke="#475569"
                strokeWidth="1.5"
            />
            {/* header — KRA crest area */}
            <rect x="40" y="32" width="160" height="34" rx="8" fill="#0A1628" opacity="0.85" />
            <text
                x="120"
                y="54"
                textAnchor="middle"
                fontFamily="ui-monospace, monospace"
                fontSize="11"
                fontWeight="700"
                fill="white"
            >
                KRA · TAX COMPLIANCE
            </text>
            {/* certificate body */}
            <text
                x="56"
                y="92"
                fontFamily="Inter, sans-serif"
                fontSize="9"
                fill="#475569"
            >
                Issued: 14 Apr 2025
            </text>
            <text
                x="56"
                y="108"
                fontFamily="Inter, sans-serif"
                fontSize="9"
                fill="#475569"
            >
                Valid until: 14 Apr 2026
            </text>
            {/* boxed PIN */}
            <rect
                x="56"
                y="130"
                width="128"
                height="34"
                rx="4"
                fill="#F1F5F9"
                stroke="#CBD5E1"
                strokeWidth="1"
            />
            <text
                x="120"
                y="153"
                textAnchor="middle"
                fontFamily="ui-monospace, monospace"
                fontSize="14"
                fontWeight="700"
                fill="#0A1628"
            >
                A0123456789X
            </text>
            {/* signature/seal hint */}
            <line x1="56" y1="190" x2="120" y2="190" stroke="#CBD5E1" strokeWidth="1" />

            {/* diagonal EXPIRED stamp — the dramatic moment */}
            <g transform="translate(120 120) rotate(-18) translate(-90 -32)">
                <rect
                    x="0"
                    y="0"
                    width="180"
                    height="64"
                    rx="6"
                    fill="none"
                    stroke={DANGER}
                    strokeWidth="3"
                    opacity="0.95"
                />
                <rect
                    x="6"
                    y="6"
                    width="168"
                    height="52"
                    rx="3"
                    fill="none"
                    stroke={DANGER}
                    strokeWidth="1.5"
                    opacity="0.7"
                />
                <text
                    x="90"
                    y="42"
                    textAnchor="middle"
                    fontFamily="ui-monospace, monospace"
                    fontSize="34"
                    fontWeight="800"
                    fill={DANGER}
                    opacity="0.95"
                    letterSpacing="2"
                >
                    EXPIRED
                </text>
            </g>
        </g>
    );
}

/* ---------- Frame 2: Stack with one unsigned page floating ---- */
function Frame2() {
    return (
        <g>
            {/* back paper */}
            <g transform="translate(48 64) rotate(-3 80 90)">
                <rect x="0" y="0" width="160" height="160" rx="8" fill="white" stroke="#475569" strokeWidth="1.5" />
                <g stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round">
                    <line x1="20" y1="32" x2="120" y2="32" />
                    <line x1="20" y1="48" x2="140" y2="48" />
                    <line x1="20" y1="64" x2="100" y2="64" />
                </g>
                {/* sig at bottom — done */}
                <path
                    d="M20 132 q8 -6 16 0 t16 0 t16 -2"
                    stroke="#0A1628"
                    strokeWidth="1.6"
                    fill="none"
                    strokeLinecap="round"
                />
            </g>
            {/* mid paper */}
            <g transform="translate(36 50)">
                <rect x="0" y="0" width="160" height="160" rx="8" fill="white" stroke="#475569" strokeWidth="1.5" />
                <g stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round">
                    <line x1="20" y1="32" x2="130" y2="32" />
                    <line x1="20" y1="48" x2="120" y2="48" />
                    <line x1="20" y1="64" x2="140" y2="64" />
                </g>
                <path
                    d="M20 132 q8 -6 16 0 t16 0 t16 -2"
                    stroke="#0A1628"
                    strokeWidth="1.6"
                    fill="none"
                    strokeLinecap="round"
                />
            </g>

            {/* the loose unsigned page — floating, tilted, "Page 47" */}
            <g transform="translate(118 14) rotate(14 80 80)">
                <rect
                    x="0"
                    y="0"
                    width="120"
                    height="160"
                    rx="6"
                    fill="white"
                    stroke={SUN}
                    strokeWidth="2"
                />
                <text
                    x="14"
                    y="22"
                    fontFamily="ui-monospace, monospace"
                    fontSize="9"
                    fontWeight="700"
                    fill={SUN}
                >
                    PAGE 47
                </text>
                <g stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round">
                    <line x1="14" y1="44" x2="98" y2="44" />
                    <line x1="14" y1="58" x2="80" y2="58" />
                    <line x1="14" y1="72" x2="92" y2="72" />
                </g>
                {/* the empty signature line */}
                <line x1="14" y1="130" x2="76" y2="130" stroke={DANGER} strokeWidth="1.4" strokeDasharray="3 3" />
                <text
                    x="14"
                    y="146"
                    fontFamily="Inter, sans-serif"
                    fontSize="9"
                    fontWeight="600"
                    fill={DANGER}
                >
                    UNSIGNED
                </text>
            </g>
        </g>
    );
}

/* ---------- Frame 3: AGPO with faded watermark ----------- */
function Frame3() {
    return (
        <g>
            <rect
                x="32"
                y="32"
                width="176"
                height="180"
                rx="8"
                fill="white"
                stroke="#475569"
                strokeWidth="1.5"
            />
            {/* header */}
            <rect x="32" y="32" width="176" height="38" rx="8" fill={ACCENT} opacity="0.18" />
            <text
                x="120"
                y="56"
                textAnchor="middle"
                fontFamily="ui-monospace, monospace"
                fontSize="12"
                fontWeight="700"
                fill="#0A1628"
            >
                AGPO CERTIFICATE
            </text>

            {/* faded watermark — large diagonal text */}
            <g opacity="0.18">
                <text
                    x="120"
                    y="148"
                    textAnchor="middle"
                    fontFamily="ui-monospace, monospace"
                    fontSize="30"
                    fontWeight="900"
                    fill="#475569"
                    transform="rotate(-22 120 148)"
                    letterSpacing="3"
                >
                    LAPSED
                </text>
            </g>

            {/* details */}
            <text x="48" y="98" fontFamily="Inter, sans-serif" fontSize="9" fill="#475569">
                Category: Youth (18–35)
            </text>
            <text x="48" y="114" fontFamily="Inter, sans-serif" fontSize="9" fill="#475569">
                Issued: 12 Mar 2024
            </text>
            <text x="48" y="130" fontFamily="Inter, sans-serif" fontSize="9" fill={DANGER} fontWeight="700">
                Valid until: 11 Mar 2026  ·  EXPIRED
            </text>

            {/* faded seal */}
            <g transform="translate(150 160)" opacity="0.45">
                <circle cx="22" cy="22" r="22" fill="none" stroke="#475569" strokeWidth="1.5" />
                <circle cx="22" cy="22" r="14" fill="none" stroke="#475569" strokeWidth="1" />
                <text
                    x="22"
                    y="26"
                    textAnchor="middle"
                    fontFamily="ui-monospace, monospace"
                    fontSize="6"
                    fontWeight="700"
                    fill="#475569"
                >
                    NT-AGPO
                </text>
            </g>
        </g>
    );
}

/* ---------- Frame 4: Same stack — now signed & bound ---------- */
function Frame4() {
    return (
        <g>
            {/* binding spine */}
            <rect
                x="44"
                y="46"
                width="14"
                height="160"
                rx="3"
                fill={SUCCESS}
                opacity="0.95"
            />
            {/* binding holes */}
            {[64, 96, 128, 160, 192].map((y) => (
                <circle key={y} cx="51" cy={y} r="2" fill="white" />
            ))}

            {/* paper */}
            <rect
                x="58"
                y="46"
                width="146"
                height="160"
                rx="6"
                fill="white"
                stroke="#475569"
                strokeWidth="1.5"
            />

            {/* lines — full */}
            <g stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round">
                <line x1="74" y1="68" x2="184" y2="68" />
                <line x1="74" y1="84" x2="174" y2="84" />
                <line x1="74" y1="100" x2="190" y2="100" />
                <line x1="74" y1="116" x2="160" y2="116" />
            </g>

            {/* every page initialled — small checkmark column */}
            {[68, 84, 100, 116].map((y) => (
                <g key={y}>
                    <circle cx="194" cy={y} r="5" fill={SUCCESS} opacity="0.18" />
                    <path
                        d={`M191 ${y} l2 2 l5 -5`}
                        stroke={SUCCESS}
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                    />
                </g>
            ))}

            {/* full signature + date stamp */}
            <line x1="74" y1="180" x2="160" y2="180" stroke="#94A3B8" strokeWidth="1" />
            <path
                d="M74 174 q10 -8 20 0 t20 0 t20 -2 t20 0"
                stroke="#0A1628"
                strokeWidth="1.8"
                fill="none"
                strokeLinecap="round"
            />
            {/* approval circle stamp */}
            <g transform="translate(154 138)">
                <circle cx="22" cy="22" r="20" fill="none" stroke={SUCCESS} strokeWidth="2" opacity="0.9" />
                <circle cx="22" cy="22" r="14" fill="none" stroke={SUCCESS} strokeWidth="1" opacity="0.7" />
                <path
                    d="M14 22 l5 5 l11 -11"
                    stroke={SUCCESS}
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />
            </g>
        </g>
    );
}

const FRAMES = [Frame1, Frame2, Frame3, Frame4];
