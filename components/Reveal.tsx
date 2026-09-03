"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Children, type ReactNode } from "react";
import { fadeUp, stagger as staggerVariants, viewportOnce } from "@/lib/motion";

interface RevealProps {
    children: ReactNode;
    className?: string;
    /** Stagger direct children into view instead of revealing the block as one. */
    stagger?: boolean;
}

export function Reveal({ children, className, stagger = false }: RevealProps) {
    const reduce = useReducedMotion();

    if (reduce) {
        return <div className={className}>{children}</div>;
    }

    if (stagger) {
        return (
            <motion.div
                className={className}
                variants={staggerVariants()}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
            >
                {Children.map(children, (child) => (
                    <motion.div variants={fadeUp} className="h-full">
                        {child}
                    </motion.div>
                ))}
            </motion.div>
        );
    }

    return (
        <motion.div className={className} variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce}>
            {children}
        </motion.div>
    );
}
