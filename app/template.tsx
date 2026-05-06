"use client";

/**
 * Per-route page transition. Next.js re-mounts `template.tsx` on every
 * navigation (unlike `layout.tsx` which is preserved), so this is the
 * right place for a soft 250ms crossfade + tiny y-shift.
 *
 * Key is the pathname so each route gets a fresh entrance. Reduced-motion
 * users get instant render.
 */

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const reduce = useReducedMotion();

    if (reduce) return <>{children}</>;

    return (
        <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
            {children}
        </motion.div>
    );
}
