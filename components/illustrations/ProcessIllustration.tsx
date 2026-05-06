"use client";

/**
 * ProcessIllustration — five-step icon-illustration used in BidProcess.
 *
 * Each step gets a tiny scene, two-tone (currentColor + accent).
 * Animated only on hover or when first scrolled into view (subtle).
 *
 *   1 — Tender lands ........ paper notice with 72:00:00 countdown
 *   2 — Compliance check .... vertical doc with green check rows
 *   3 — Bid written ......... typewriter sheet with filling lines
 *   4 — Submitted on time ... stamped envelope with 4:30 PM clock
 *   5 — Win/loss debrief .... magnifying glass over a results sheet
 */

import { motion, useReducedMotion } from "framer-motion";

interface Props {
    step: 1 | 2 | 3 | 4 | 5;
    className?: string;
}

const ACCENT = "#06B6D4";       // accent-500
const SUCCESS = "#10B981";      // success-500
const SUN = "#F59E0B";          // sun-500
const DANGER = "#DC2626";

export function ProcessIllustration({ step, className }: Props) {
    const reduce = useReducedMotion();
    const Inner = STEPS[step - 1];
    return (
        <motion.div
            className={className}
            aria-hidden
            initial={reduce ? false : { opacity: 0, scale: 0.92 }}
            whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
            <svg
                viewBox="0 0 120 120"
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

/* ---------- 1: Tender lands — paper with countdown ----------- */
function StepLands() {
    return (
        <g>
            {/* paper */}
            <rect
                x="22"
                y="18"
                width="76"
                height="92"
                rx="6"
                fill="white"
                stroke="currentColor"
                strokeOpacity="0.25"
                strokeWidth="1.5"
            />
            <rect x="22" y="18" width="76" height="18" rx="6" fill="currentColor" opacity="0.08" />
            <rect x="30" y="25" width="34" height="4" rx="2" fill="currentColor" opacity="0.6" />

            {/* lines */}
            <rect x="30" y="48" width="58" height="3" rx="1.5" fill="#E2E8F0" />
            <rect x="30" y="58" width="42" height="3" rx="1.5" fill="#E2E8F0" />

            {/* countdown badge */}
            <rect x="28" y="72" width="64" height="28" rx="6" fill={ACCENT} opacity="0.10" />
            <text
                x="60"
                y="91"
                textAnchor="middle"
                fontFamily="ui-monospace, monospace"
                fontSize="14"
                fontWeight="700"
                fill={ACCENT}
            >
                72:00:00
            </text>

            {/* corner ping */}
            <circle cx="100" cy="22" r="6" fill={ACCENT} />
            <circle cx="100" cy="22" r="11" fill={ACCENT} opacity="0.18" />
        </g>
    );
}

/* ---------- 2: Compliance check — doc with check rows --------- */
function StepCompliance() {
    return (
        <g>
            <rect
                x="24"
                y="14"
                width="72"
                height="92"
                rx="6"
                fill="white"
                stroke="currentColor"
                strokeOpacity="0.25"
                strokeWidth="1.5"
            />
            {[
                { y: 30, label: "KRA" },
                { y: 48, label: "NSSF" },
                { y: 66, label: "NHIF" },
                { y: 84, label: "AGPO" },
            ].map((row) => (
                <g key={row.y}>
                    <circle cx="36" cy={row.y} r="6" fill={SUCCESS} opacity="0.18" />
                    <path
                        d={`M32 ${row.y} l3 3 l6 -6`}
                        stroke={SUCCESS}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                    />
                    <rect x="48" y={row.y - 3} width="40" height="6" rx="2" fill="#E2E8F0" />
                </g>
            ))}
            {/* CR12 row */}
            <g>
                <circle cx="36" cy="102" r="6" fill={SUCCESS} opacity="0.18" />
                <path
                    d="M32 102 l3 3 l6 -6"
                    stroke={SUCCESS}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />
                <rect x="48" y="99" width="28" height="6" rx="2" fill="#E2E8F0" />
            </g>
        </g>
    );
}

/* ---------- 3: Bid written — typewriter sheet with caret -------- */
function StepWritten() {
    return (
        <g>
            <rect
                x="22"
                y="22"
                width="76"
                height="84"
                rx="6"
                fill="white"
                stroke="currentColor"
                strokeOpacity="0.25"
                strokeWidth="1.5"
            />
            {/* typewriter rail */}
            <rect x="22" y="22" width="76" height="10" rx="4" fill="currentColor" opacity="0.12" />

            {/* lines being filled */}
            <rect x="30" y="42" width="60" height="3" rx="1.5" fill="#0A1628" opacity="0.85" />
            <rect x="30" y="52" width="48" height="3" rx="1.5" fill="#0A1628" opacity="0.7" />
            <rect x="30" y="62" width="56" height="3" rx="1.5" fill="#0A1628" opacity="0.6" />
            <rect x="30" y="72" width="38" height="3" rx="1.5" fill="#0A1628" opacity="0.4" />
            {/* caret — being written */}
            <rect x="69" y="70" width="2" height="6" rx="1" fill={ACCENT}>
                <animate
                    attributeName="opacity"
                    values="1;0;1"
                    dur="1s"
                    repeatCount="indefinite"
                />
            </rect>

            {/* signature line at bottom */}
            <line
                x1="30"
                y1="92"
                x2="68"
                y2="92"
                stroke="#CBD5E1"
                strokeWidth="1"
            />
            <path
                d="M30 88 q5 -4 10 0 t10 0 t10 -1"
                stroke="#0A1628"
                strokeWidth="1.4"
                fill="none"
                strokeLinecap="round"
            />
        </g>
    );
}

/* ---------- 4: Submitted on time — stamped envelope with clock ---- */
function StepSubmitted() {
    return (
        <g>
            {/* envelope */}
            <rect
                x="18"
                y="36"
                width="84"
                height="56"
                rx="4"
                fill="white"
                stroke="currentColor"
                strokeOpacity="0.25"
                strokeWidth="1.5"
            />
            <path
                d="M18 40 L60 70 L102 40"
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.3"
                strokeWidth="1.5"
                strokeLinejoin="round"
            />

            {/* stamp — top-right */}
            <g transform="translate(74 22)">
                <circle
                    cx="14"
                    cy="14"
                    r="13"
                    fill="none"
                    stroke={SUCCESS}
                    strokeWidth="1.6"
                />
                <circle
                    cx="14"
                    cy="14"
                    r="9"
                    fill="none"
                    stroke={SUCCESS}
                    strokeWidth="0.8"
                />
                <text
                    x="14"
                    y="13"
                    textAnchor="middle"
                    fontFamily="ui-monospace, monospace"
                    fontSize="4.5"
                    fontWeight="700"
                    fill={SUCCESS}
                    transform="rotate(-12 14 13)"
                >
                    STAMPED
                </text>
                <text
                    x="14"
                    y="20"
                    textAnchor="middle"
                    fontFamily="ui-monospace, monospace"
                    fontSize="4"
                    fontWeight="600"
                    fill={SUCCESS}
                    transform="rotate(-12 14 20)"
                >
                    4:12 PM
                </text>
            </g>

            {/* clock — bottom-left */}
            <g transform="translate(20 70)">
                <circle cx="12" cy="12" r="11" fill="white" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.5" />
                {/* 4:30 hands */}
                <line x1="12" y1="12" x2="12" y2="5" stroke="#0A1628" strokeWidth="1.6" strokeLinecap="round" />
                <line x1="12" y1="12" x2="18" y2="14" stroke="#0A1628" strokeWidth="1.4" strokeLinecap="round" />
                <circle cx="12" cy="12" r="1.4" fill="#0A1628" />
            </g>
        </g>
    );
}

/* ---------- 5: Debrief — magnifying glass over results -------- */
function StepDebrief() {
    return (
        <g>
            <rect
                x="22"
                y="20"
                width="72"
                height="86"
                rx="6"
                fill="white"
                stroke="currentColor"
                strokeOpacity="0.25"
                strokeWidth="1.5"
            />
            {/* score rows */}
            <g>
                <rect x="30" y="32" width="20" height="3" rx="1.5" fill="#94A3B8" />
                <rect x="56" y="32" width="32" height="3" rx="1.5" fill="#0A1628" opacity="0.9" />
                <rect x="30" y="42" width="24" height="3" rx="1.5" fill="#94A3B8" />
                <rect x="56" y="42" width="22" height="3" rx="1.5" fill={DANGER} opacity="0.7" />
                <rect x="30" y="52" width="22" height="3" rx="1.5" fill="#94A3B8" />
                <rect x="56" y="52" width="28" height="3" rx="1.5" fill="#0A1628" opacity="0.6" />
            </g>
            {/* magnifier */}
            <g transform="translate(48 56)">
                <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="white"
                    fillOpacity="0.6"
                    stroke={ACCENT}
                    strokeWidth="2.2"
                />
                <line
                    x1="30"
                    y1="30"
                    x2="44"
                    y2="44"
                    stroke={ACCENT}
                    strokeWidth="3.2"
                    strokeLinecap="round"
                />
                {/* "62" technical score visible inside lens */}
                <text
                    x="18"
                    y="22"
                    textAnchor="middle"
                    fontFamily="ui-monospace, monospace"
                    fontSize="10"
                    fontWeight="700"
                    fill="#0A1628"
                >
                    62
                </text>
            </g>
            {/* sun glint */}
            <circle cx="92" cy="28" r="3" fill={SUN} opacity="0.6" />
        </g>
    );
}

const STEPS = [StepLands, StepCompliance, StepWritten, StepSubmitted, StepDebrief];
