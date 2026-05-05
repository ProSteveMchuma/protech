"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface Props {
    /** End value to count to. */
    value: number;
    /** Duration in ms. Default 1500. */
    duration?: number;
    prefix?: string;
    suffix?: string;
    /** Use Intl number formatting. */
    locale?: string;
    className?: string;
}

export function AnimatedCounter({
    value,
    duration = 1500,
    prefix = "",
    suffix = "",
    locale = "en-KE",
    className,
}: Props) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, amount: 0.6 });
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        if (!inView) return;
        const start = performance.now();
        let raf = 0;
        const tick = (now: number) => {
            const progress = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(value * eased);
            if (progress < 1) raf = requestAnimationFrame(tick);
            else setDisplay(value);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [inView, value, duration]);

    const formatted = Math.round(display).toLocaleString(locale);
    return (
        <span ref={ref} className={className}>
            {prefix}
            {formatted}
            {suffix}
        </span>
    );
}
