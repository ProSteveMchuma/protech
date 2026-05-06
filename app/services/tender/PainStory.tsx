"use client";

/**
 * PainStory — Section 2 of /services/tender.
 *
 * Four scroll-pinned frames that walk the buyer from "the problem" to
 * "we exist for this". Each frame is a single dramatic line in display
 * type with a quieter sub-line underneath. The fourth frame is the
 * climax — gentler tone, leading into the pricing section.
 *
 * On viewports under `lg`, frames degrade to a simple stacked vertical
 * reveal — pinning on phones is jank — and to fully static when the
 * user has `prefers-reduced-motion: reduce` set.
 *
 * Pattern is parallel to `CostStory` in components/ScrollStory.tsx but
 * the content here is bidder-specific and the climax frame uses a
 * tonal shift (success-500 accent) rather than a typographic punchline.
 */

import { useRef } from "react";
import {
    motion,
    useScroll,
    useTransform,
    useReducedMotion,
    type MotionValue,
} from "framer-motion";

interface PainFrame {
    /** Big line — kinetic display type. */
    line: string;
    /** Quieter sub-line. */
    sub: string;
    /** Climax frame uses a softer treatment. */
    climax?: boolean;
}

const FRAMES: PainFrame[] = [
    {
        line: "4:58 PM.",
        sub: "Your TCC expired this morning. The deadline is in two minutes.",
    },
    {
        line: "Page 47, unsigned.",
        sub: "Same form, every bid, missed by everyone in the office.",
    },
    {
        line: "AGPO certificate. Lapsed.",
        sub: "The 30% reservation just slipped through your fingers.",
    },
    {
        climax: true,
        line: "This is what we fix.",
        sub: "Not bid wars. Paperwork.",
    },
];

export function PainStory() {
    const reduceMotion = useReducedMotion();
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end end"],
    });

    if (reduceMotion) {
        return <PainStoryStatic />;
    }

    return (
        <section
            aria-label="Why bidding alone is hard"
            className="relative bg-white"
        >
            {/* Mobile / tablet — stacked, no pinning */}
            <div className="lg:hidden">
                <PainStoryStatic />
            </div>

            {/* Desktop — pinned, scroll-driven */}
            <div ref={ref} className="hidden lg:block relative h-[400vh]">
                <div className="sticky top-0 h-screen w-full overflow-hidden">
                    {FRAMES.map((frame, i) => (
                        <PainFrameView
                            key={i}
                            frame={frame}
                            index={i}
                            total={FRAMES.length}
                            progress={scrollYProgress}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

function PainFrameView({
    frame,
    index,
    total,
    progress,
}: {
    frame: PainFrame;
    index: number;
    total: number;
    progress: MotionValue<number>;
}) {
    const slice = 1 / total;
    const start = index * slice;
    const end = (index + 1) * slice;
    const fadeIn = start + slice * 0.15;
    const fadeOut = end - slice * 0.15;

    const opacity = useTransform(
        progress,
        [start, fadeIn, fadeOut, end],
        index === 0
            ? [1, 1, 1, 0]
            : index === total - 1
                ? [0, 1, 1, 1]
                : [0, 1, 1, 0]
    );
    const scale = useTransform(
        progress,
        [start, fadeIn, fadeOut, end],
        [0.96, 1, 1, 1.02]
    );

    return (
        <motion.div
            style={{ opacity, scale }}
            className="absolute inset-0 flex items-center justify-center px-8"
        >
            <PainFrameContent frame={frame} />
        </motion.div>
    );
}

function PainFrameContent({ frame }: { frame: PainFrame }) {
    if (frame.climax) {
        return (
            <div className="text-center max-w-3xl">
                <h3 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-brand-950 leading-[1.05] tracking-tight text-balance mb-6">
                    {frame.line}
                </h3>
                <p className="font-display text-2xl md:text-3xl text-success-600 leading-tight">
                    {frame.sub}
                </p>
            </div>
        );
    }

    return (
        <div className="text-center max-w-3xl">
            <h3 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-brand-950 leading-[1.02] tracking-tight text-balance mb-8 tabular-nums">
                {frame.line}
            </h3>
            <p className="text-base md:text-xl text-slate-500 max-w-xl mx-auto text-pretty leading-relaxed">
                {frame.sub}
            </p>
        </div>
    );
}

function PainStoryStatic() {
    return (
        <div className="py-20 px-6 max-w-3xl mx-auto space-y-24">
            {FRAMES.map((frame, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center"
                >
                    <PainFrameContent frame={frame} />
                </motion.div>
            ))}
        </div>
    );
}
