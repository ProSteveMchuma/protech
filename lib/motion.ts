import type { Variants, Transition } from "framer-motion";

const easeOutExpo = [0.16, 1, 0.3, 1] as const;

const baseTransition: Transition = {
    duration: 0.6,
    ease: easeOutExpo,
};

export const fadeUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: baseTransition },
};

export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6, ease: easeOutExpo } },
};

export const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1, transition: baseTransition },
};

export const slideX: Variants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 32 : -32,
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
        transition: { duration: 0.4, ease: easeOutExpo },
    },
    exit: (direction: number) => ({
        x: direction > 0 ? -32 : 32,
        opacity: 0,
        transition: { duration: 0.25, ease: easeOutExpo },
    }),
};

export const stagger = (delayChildren = 0, staggerChildren = 0.08): Variants => ({
    hidden: {},
    visible: {
        transition: { delayChildren, staggerChildren },
    },
});

export const imageReveal: Variants = {
    hidden: { opacity: 0, scale: 1.05, filter: "blur(4px)" },
    visible: { opacity: 1, scale: 1, filter: "blur(0px)", transition: { duration: 0.8, ease: easeOutExpo } },
};

export const hoverScale = {
    hover: { scale: 1.02, transition: { duration: 0.2, ease: "easeOut" } },
    tap: { scale: 0.98, transition: { duration: 0.1, ease: "easeOut" } }
};

export const viewportOnce = { once: true, amount: 0.3 } as const;
