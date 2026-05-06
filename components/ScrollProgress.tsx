"use client";

/**
 * ScrollProgress — 2px brand-gradient line stuck to top:0 of every page.
 * Only visible on tall pages (>2 viewport heights) — short pages don't
 * benefit from it and it just looks like decoration.
 */

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";

export function ScrollProgress() {
    const reduce = useReducedMotion();
    const { scrollYProgress } = useScroll();
    const x = useSpring(scrollYProgress, {
        stiffness: 120,
        damping: 24,
        restDelta: 0.001,
    });

    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const check = () => {
            setVisible(
                document.documentElement.scrollHeight >
                    window.innerHeight * 2
            );
        };
        check();
        window.addEventListener("resize", check);
        // ResizeObserver fires when the document height grows/shrinks across
        // navigations (Next.js swaps the page tree, body height updates).
        const ro = new ResizeObserver(check);
        ro.observe(document.body);
        return () => {
            window.removeEventListener("resize", check);
            ro.disconnect();
        };
    }, []);

    if (!visible) return null;

    return (
        <motion.div
            aria-hidden
            className="fixed left-0 right-0 top-0 h-[2px] origin-left z-[60] pointer-events-none"
            style={{
                scaleX: reduce ? scrollYProgress : x,
                background:
                    "linear-gradient(90deg, var(--color-brand-500), var(--color-accent-500), var(--color-success-500))",
            }}
        />
    );
}
