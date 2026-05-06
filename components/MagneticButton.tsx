"use client";

/**
 * MagneticButton — wraps an existing element (a Button, ButtonLink, an <a>)
 * and on `hover: hover` devices gently translates the wrapped child toward
 * the cursor when the cursor is within ~80px. Max travel ~6px in any
 * direction, eased.
 *
 * Skipped on touch devices and under `prefers-reduced-motion: reduce`.
 * The wrapped element remains perfectly clickable when not magnetized.
 */

import { useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

interface Props {
    children: React.ReactNode;
    /** Maximum pull (px). Default 6. */
    strength?: number;
    /** Activation radius (px). Default 80. */
    radius?: number;
    className?: string;
}

export function MagneticButton({
    children,
    strength = 6,
    radius = 80,
    className,
}: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const reduce = useReducedMotion();
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const sx = useSpring(x, { stiffness: 220, damping: 22, mass: 0.4 });
    const sy = useSpring(y, { stiffness: 220, damping: 22, mass: 0.4 });

    useEffect(() => {
        if (reduce) return;
        const el = ref.current;
        if (!el) return;

        const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
        if (!mq.matches) return;

        const onMove = (e: MouseEvent) => {
            const rect = el.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = e.clientX - cx;
            const dy = e.clientY - cy;
            const dist = Math.hypot(dx, dy);
            if (dist > radius) {
                x.set(0);
                y.set(0);
                return;
            }
            // Falloff: closer to centre = stronger pull, capped at `strength`.
            const t = 1 - dist / radius;
            x.set((dx / radius) * strength * t * 2);
            y.set((dy / radius) * strength * t * 2);
        };
        const onLeave = () => {
            x.set(0);
            y.set(0);
        };

        window.addEventListener("mousemove", onMove);
        el.addEventListener("mouseleave", onLeave);
        return () => {
            window.removeEventListener("mousemove", onMove);
            el.removeEventListener("mouseleave", onLeave);
        };
    }, [radius, strength, x, y, reduce]);

    return (
        <motion.div
            ref={ref}
            style={reduce ? undefined : { x: sx, y: sy }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
