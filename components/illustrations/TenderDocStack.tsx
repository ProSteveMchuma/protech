"use client";

/**
 * TenderDocStack — homepage hero anchor illustration.
 *
 * A loose stack of three tilted papers, with a stamped seal corner,
 * a checkmark column, a KRA-PIN-shaped strip, and a small accent dot
 * (echoing the Logo). Two-tone via currentColor + brand/accent.
 *
 * Subtle 6-second float loop on lg+ only. Hidden on mobile so the
 * H1 owns the screen.
 */

import { motion, useReducedMotion } from "framer-motion";

interface Props {
    className?: string;
    /** Side accent dot color — defaults to success-500 (emerald). */
    accentColor?: string;
}

export function TenderDocStack({ className, accentColor = "#10B981" }: Props) {
    const reduce = useReducedMotion();

    return (
        <motion.div
            className={className}
            aria-hidden
            initial={false}
            animate={reduce ? undefined : { y: [0, -8, 0] }}
            transition={
                reduce
                    ? undefined
                    : { duration: 6, ease: "easeInOut", repeat: Infinity }
            }
        >
            <svg
                viewBox="0 0 320 320"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="100%"
                role="presentation"
            >
                {/* Paper 1 — back, tilted left */}
                <g transform="translate(28 60) rotate(-7 110 130)">
                    <rect
                        x="0"
                        y="0"
                        width="220"
                        height="260"
                        rx="10"
                        fill="white"
                        stroke="#E2E8F0"
                        strokeWidth="1.5"
                    />
                    {/* lined rows */}
                    <g stroke="#CBD5E1" strokeLinecap="round" strokeWidth="2">
                        <line x1="22" y1="38" x2="170" y2="38" />
                        <line x1="22" y1="62" x2="190" y2="62" />
                        <line x1="22" y1="86" x2="160" y2="86" />
                        <line x1="22" y1="110" x2="180" y2="110" />
                        <line x1="22" y1="134" x2="150" y2="134" />
                    </g>
                    {/* Tiny "PIN: A0123456X" strip — paper-stub of compliance */}
                    <rect
                        x="22"
                        y="200"
                        width="120"
                        height="22"
                        rx="4"
                        fill="#F1F5F9"
                    />
                    <text
                        x="32"
                        y="215"
                        fontFamily="ui-monospace, monospace"
                        fontSize="10"
                        fontWeight="600"
                        fill="#0F172A"
                    >
                        KRA · A0123456X
                    </text>
                </g>

                {/* Paper 2 — middle, slight right tilt */}
                <g transform="translate(64 38) rotate(4 110 130)">
                    <rect
                        x="0"
                        y="0"
                        width="220"
                        height="260"
                        rx="10"
                        fill="white"
                        stroke="currentColor"
                        strokeOpacity="0.18"
                        strokeWidth="1.5"
                    />
                    {/* Header bar */}
                    <rect x="0" y="0" width="220" height="32" rx="10" fill="currentColor" opacity="0.08" />
                    <rect x="22" y="14" width="76" height="6" rx="3" fill="currentColor" opacity="0.6" />

                    {/* Compliance check rows */}
                    <g>
                        {[60, 92, 124, 156, 188].map((y, i) => (
                            <g key={i}>
                                <circle cx="32" cy={y} r="7" fill={accentColor} opacity={0.18} />
                                <path
                                    d={`M28 ${y} l3 3 l6 -6`}
                                    stroke={accentColor}
                                    strokeWidth="2.2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    fill="none"
                                />
                                <rect
                                    x="48"
                                    y={y - 4}
                                    width={i === 1 ? 130 : i === 3 ? 110 : 150}
                                    height="8"
                                    rx="3"
                                    fill="#E2E8F0"
                                />
                            </g>
                        ))}
                    </g>

                    {/* Stamp — circular + diagonal text approximation */}
                    <g transform="translate(150 168)">
                        <circle
                            cx="34"
                            cy="34"
                            r="32"
                            fill="none"
                            stroke="#06B6D4"
                            strokeWidth="2"
                            opacity="0.85"
                        />
                        <circle
                            cx="34"
                            cy="34"
                            r="24"
                            fill="none"
                            stroke="#06B6D4"
                            strokeWidth="1"
                            opacity="0.6"
                        />
                        <text
                            x="34"
                            y="32"
                            textAnchor="middle"
                            fontFamily="ui-monospace, monospace"
                            fontSize="7"
                            fontWeight="700"
                            fill="#06B6D4"
                            opacity="0.85"
                            transform="rotate(-12 34 32)"
                        >
                            APPROVED
                        </text>
                        <text
                            x="34"
                            y="44"
                            textAnchor="middle"
                            fontFamily="ui-monospace, monospace"
                            fontSize="6"
                            fontWeight="600"
                            fill="#06B6D4"
                            opacity="0.7"
                            transform="rotate(-12 34 44)"
                        >
                            PRT-2026
                        </text>
                    </g>
                </g>

                {/* Paper 3 — front, slight left tilt, a winning bid summary */}
                <g transform="translate(40 132) rotate(-3 110 90)">
                    <rect
                        x="0"
                        y="0"
                        width="240"
                        height="160"
                        rx="12"
                        fill="white"
                        stroke="currentColor"
                        strokeOpacity="0.22"
                        strokeWidth="1.5"
                    />
                    {/* "AWARDED" tag */}
                    <rect
                        x="20"
                        y="20"
                        width="84"
                        height="22"
                        rx="11"
                        fill={accentColor}
                        opacity="0.12"
                    />
                    <text
                        x="62"
                        y="35"
                        textAnchor="middle"
                        fontFamily="Inter, sans-serif"
                        fontSize="10"
                        fontWeight="700"
                        fill={accentColor}
                    >
                        AWARDED
                    </text>

                    {/* KES amount */}
                    <text
                        x="20"
                        y="80"
                        fontFamily="ui-monospace, monospace"
                        fontSize="22"
                        fontWeight="700"
                        fill="#0A1628"
                    >
                        KES 4,200,000
                    </text>
                    <text
                        x="20"
                        y="100"
                        fontFamily="Inter, sans-serif"
                        fontSize="11"
                        fill="#64748B"
                    >
                        County of Nakuru · supply
                    </text>

                    {/* Signature line */}
                    <line
                        x1="20"
                        y1="130"
                        x2="120"
                        y2="130"
                        stroke="#CBD5E1"
                        strokeWidth="1.2"
                    />
                    <path
                        d="M22 124 q8 -8 18 0 t18 0 t18 -2"
                        stroke="#0A1628"
                        strokeWidth="1.6"
                        fill="none"
                        strokeLinecap="round"
                    />

                    {/* Accent dot — echo the logo's "task complete" mark */}
                    <circle cx="218" cy="138" r="6" fill={accentColor} />
                </g>
            </svg>
        </motion.div>
    );
}
