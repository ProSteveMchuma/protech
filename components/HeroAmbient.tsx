"use client";

/**
 * HeroAmbient — a single, very-blurred orb that lazily follows the
 * cursor on the homepage and tender hero. Pointer-events disabled,
 * so it never intercepts clicks. Disabled on touch devices and under
 * `prefers-reduced-motion: reduce`.
 *
 * Use *one per page* to preserve the rule "one cinematic moment".
 */

import { useEffect, useRef } from "react";
import { motion, useReducedMotion, useSpring } from "framer-motion";

interface Props {
    /**
     * Tone of the orb — controls the gradient. "light" for the
     * homepage hero (light surface), "dark" for the tender hero.
     */
    tone?: "light" | "dark";
}

export function HeroAmbient({ tone = "light" }: Props) {
    const reduce = useReducedMotion();
    const ref = useRef<HTMLDivElement>(null);

    // Spring lag — orb is always ~120ms behind the cursor.
    const x = useSpring(0, { stiffness: 60, damping: 18, mass: 0.6 });
    const y = useSpring(0, { stiffness: 60, damping: 18, mass: 0.6 });

    useEffect(() => {
        if (reduce) return;
        const el = ref.current?.parentElement;
        if (!el) return;

        // Touch / coarse pointer? Skip.
        const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
        if (!mq.matches) return;

        const onMove = (e: MouseEvent) => {
            const rect = el.getBoundingClientRect();
            x.set(e.clientX - rect.left);
            y.set(e.clientY - rect.top);
        };
        // Seed near the centre so the orb has a sensible resting place.
        const rect = el.getBoundingClientRect();
        x.set(rect.width * 0.5);
        y.set(rect.height * 0.4);

        el.addEventListener("mousemove", onMove);
        return () => el.removeEventListener("mousemove", onMove);
    }, [reduce, x, y]);

    if (reduce) return null;

    const gradient =
        tone === "dark"
            ? "radial-gradient(circle, rgba(6, 182, 212, 0.55) 0%, rgba(59, 130, 246, 0.25) 35%, transparent 70%)"
            : "radial-gradient(circle, rgba(59, 130, 246, 0.32) 0%, rgba(6, 182, 212, 0.18) 35%, transparent 70%)";

    return (
        <motion.div
            ref={ref}
            aria-hidden
            className="hidden lg:block pointer-events-none absolute z-0"
            style={{
                x,
                y,
                width: 520,
                height: 520,
                marginLeft: -260,
                marginTop: -260,
                background: gradient,
                filter: "blur(60px)",
                willChange: "transform",
                mixBlendMode: tone === "dark" ? "screen" : "normal",
            }}
        />
    );
}
