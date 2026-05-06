"use client";

/**
 * OdometerNumber — a counter that rolls each digit through 0-9 once
 * before settling on its final value. Visually identical to the
 * existing tween-counter when at rest, but every digit briefly
 * cycles when in view.
 *
 * Used on cost-reveal frames and the homepage price anchor. Avoids
 * decorative use elsewhere — it earns the screen for the *anchor*
 * number, not every figure on the page.
 *
 * Reduced-motion: shows the final value immediately.
 */

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

interface Props {
    value: number;
    /** Total roll duration in ms. Default 1400. */
    duration?: number;
    locale?: string;
    className?: string;
}

const DIGIT_HEIGHT_EM = 1.05;

export function OdometerNumber({
    value,
    duration = 1400,
    locale = "en-KE",
    className,
}: Props) {
    const reduce = useReducedMotion();
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, amount: 0.6 });
    const [displayed, setDisplayed] = useState(reduce ? value : 0);

    useEffect(() => {
        if (reduce) {
            setDisplayed(value);
            return;
        }
        if (!inView) return;
        const start = performance.now();
        let raf = 0;
        const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            // ease-out-cubic
            const eased = 1 - Math.pow(1 - t, 3);
            setDisplayed(Math.round(value * eased));
            if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [inView, value, duration, reduce]);

    const formatted = displayed.toLocaleString(locale);
    const finalFormatted = value.toLocaleString(locale);

    return (
        <span ref={ref} className={className}>
            {/* Visible string — accessible, copyable */}
            <span className="sr-only">{finalFormatted}</span>
            <span aria-hidden className="inline-flex">
                {formatted.split("").map((ch, i) => (
                    <DigitCell key={`${i}-${ch}`} ch={ch} />
                ))}
            </span>
        </span>
    );
}

function DigitCell({ ch }: { ch: string }) {
    if (!/^\d$/.test(ch)) {
        // separator — render flat
        return <span>{ch}</span>;
    }
    const target = parseInt(ch, 10);
    return (
        <span
            className="inline-block overflow-hidden align-baseline"
            style={{ height: `${DIGIT_HEIGHT_EM}em` }}
        >
            <motion.span
                className="inline-flex flex-col items-center"
                initial={{ y: 0 }}
                animate={{ y: `-${target * DIGIT_HEIGHT_EM}em` }}
                transition={{
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                }}
            >
                {Array.from({ length: 10 }, (_, n) => (
                    <span
                        key={n}
                        style={{ height: `${DIGIT_HEIGHT_EM}em`, lineHeight: `${DIGIT_HEIGHT_EM}em` }}
                    >
                        {n}
                    </span>
                ))}
            </motion.span>
        </span>
    );
}
