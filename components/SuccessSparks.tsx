"use client";

/**
 * SuccessSparks — a tasteful 6-8 dot radial burst, 600ms, brand colours.
 * Used after `/hire` and `/checkout` succeed. NOT confetti — we are not
 * a party.
 *
 * Renders absolutely positioned at the centre of its container, so the
 * parent should be `relative`. Skipped under `prefers-reduced-motion`.
 */

import { motion, useReducedMotion } from "framer-motion";

const SPARKS = [
    { angle: -90, color: "#3b82f6" },
    { angle: -45, color: "#06b6d4" },
    { angle: 0, color: "#10b981" },
    { angle: 45, color: "#3b82f6" },
    { angle: 90, color: "#06b6d4" },
    { angle: 135, color: "#10b981" },
    { angle: 180, color: "#3b82f6" },
    { angle: 225, color: "#06b6d4" },
];

const DISTANCE = 56; // px

export function SuccessSparks({ className }: { className?: string }) {
    const reduce = useReducedMotion();
    if (reduce) return null;

    return (
        <div
            aria-hidden
            className={
                "pointer-events-none absolute inset-0 flex items-center justify-center " +
                (className ?? "")
            }
        >
            {SPARKS.map((s, i) => {
                const rad = (s.angle * Math.PI) / 180;
                const tx = Math.cos(rad) * DISTANCE;
                const ty = Math.sin(rad) * DISTANCE;
                return (
                    <motion.span
                        key={i}
                        className="absolute size-2 rounded-full"
                        style={{ backgroundColor: s.color }}
                        initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
                        animate={{
                            x: tx,
                            y: ty,
                            opacity: [0, 1, 0],
                            scale: [0.4, 1, 0.5],
                        }}
                        transition={{
                            duration: 0.6,
                            ease: [0.16, 1, 0.3, 1],
                            delay: i * 0.015,
                        }}
                    />
                );
            })}
        </div>
    );
}
