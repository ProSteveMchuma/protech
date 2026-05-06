"use client";

/**
 * ScrollStory — the homepage's two theatrical scroll moments.
 *
 * Two modes:
 *   `cost`    — three full-viewport frames with a counted number per frame,
 *               revealing the size of the problem. The third frame is the
 *               typographic punchline ("It's not bid wars. It's paperwork.").
 *   `process` — vertical timeline with a gradient track that fills as the
 *               user scrolls past four pinned step cards.
 *
 * Both modes degrade on small viewports (<lg) to a simple stacked reveal —
 * scroll-pinning on phones is jank — and to fully static when the user has
 * `prefers-reduced-motion: reduce` set.
 *
 * The two modes share the same scroll-driven primitive but render very
 * different content. Co-locating them avoids two near-identical files.
 */

import { useRef } from "react";
import {
    motion,
    useScroll,
    useTransform,
    useReducedMotion,
    type MotionValue,
} from "framer-motion";
import {
    BellRing,
    ShieldCheck,
    FileText,
    CheckCircle2,
    type LucideIcon,
} from "lucide-react";
import { AnimatedCounter } from "./AnimatedCounter";

/* ------------------------------------------------------------------ */
/*  COST mode — section 2                                             */
/* ------------------------------------------------------------------ */

interface CostFrame {
    /** A counted number ("2.4" or numeric). Render as plain text if string. */
    value: number | string;
    /** Symbol prefix shown in mono before the value (e.g. "KES "). */
    prefix?: string;
    /** Symbol suffix shown after the value (e.g. " trillion"). */
    suffix?: string;
    /** Headline below the number. */
    headline: string;
    /** Optional sub-line. */
    sub?: string;
    /** When true, render no number — just the kinetic-typography line. */
    typographic?: boolean;
}

const COST_FRAMES: CostFrame[] = [
    {
        prefix: "KES ",
        value: "Trillions",
        headline: "in Kenyan tenders go out every year.",
        sub: "Across the national government, 47 counties, parastatals, and corporate procurement.",
    },
    {
        value: "9 in 10",
        headline: "Kenyan SMEs miss the ones they could win.",
        sub: "Not on price. On expired TCCs, unsigned BOQs, and 4:58pm scrambles.",
    },
    {
        typographic: true,
        value: "",
        headline: "It's not bid wars.",
        sub: "It's paperwork.",
    },
];

function CostStory() {
    const reduceMotion = useReducedMotion();
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end end"],
    });

    if (reduceMotion) {
        return <CostStoryStatic />;
    }

    return (
        <section
            aria-label="The cost of missed tenders"
            className="relative bg-white"
        >
            {/* Mobile / tablet — stacked reveals, no pinning */}
            <div className="lg:hidden">
                <CostStoryStatic />
            </div>

            {/* Desktop — pinned, scroll-driven */}
            <div ref={ref} className="hidden lg:block relative h-[300vh]">
                <div className="sticky top-0 h-screen w-full overflow-hidden">
                    {COST_FRAMES.map((frame, i) => (
                        <CostFrameView
                            key={i}
                            frame={frame}
                            index={i}
                            total={COST_FRAMES.length}
                            progress={scrollYProgress}
                        />
                    ))}

                    {/* Quiet outro, fades in as the last frame is fading out */}
                    <CostOutro progress={scrollYProgress} />
                </div>
            </div>
        </section>
    );
}

function CostFrameView({
    frame,
    index,
    total,
    progress,
}: {
    frame: CostFrame;
    index: number;
    total: number;
    progress: MotionValue<number>;
}) {
    // Each frame owns a slice of [0,1]. Crossfade the seams.
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
            <CostFrameContent frame={frame} animate={index === 0} />
        </motion.div>
    );
}

function CostFrameContent({
    frame,
    animate,
}: {
    frame: CostFrame;
    /** Animate the counter on first paint (only the first frame; others come in via opacity). */
    animate?: boolean;
}) {
    if (frame.typographic) {
        return (
            <div className="text-center max-w-4xl">
                <KineticLine
                    text={frame.headline}
                    className="font-display text-6xl md:text-7xl lg:text-8xl font-bold text-brand-950 leading-[1.05] tracking-tight text-balance mb-6 block"
                />
                {frame.sub && (
                    <KineticLine
                        text={frame.sub}
                        delay={0.4}
                        className="font-display text-4xl md:text-5xl text-slate-500 leading-tight block"
                    />
                )}
            </div>
        );
    }

    const isNumeric = typeof frame.value === "number";

    return (
        <div className="text-center max-w-3xl">
            <div className="font-display text-7xl md:text-8xl lg:text-9xl font-bold text-gradient leading-none tabular-nums mb-8">
                {frame.prefix && (
                    <span className="font-mono text-5xl md:text-6xl lg:text-7xl text-brand-500 align-top mr-2">
                        {frame.prefix}
                    </span>
                )}
                {isNumeric && animate ? (
                    <AnimatedCounter value={frame.value as number} duration={1800} />
                ) : (
                    <span>{frame.value}</span>
                )}
                {frame.suffix && (
                    <span className="text-4xl md:text-5xl lg:text-6xl text-brand-700 ml-3 font-display">
                        {frame.suffix}
                    </span>
                )}
            </div>
            <p className="font-display text-2xl md:text-3xl text-slate-900 mb-3 text-balance leading-snug">
                {frame.headline}
            </p>
            {frame.sub && (
                <p className="text-base md:text-lg text-slate-500 max-w-xl mx-auto text-pretty">
                    {frame.sub}
                </p>
            )}
        </div>
    );
}

/**
 * Kinetic display line — splits the text on whitespace and staggers
 * each word in (slide-up + fade). Used for the CostStory punchline
 * frame and its sub-line.
 *
 * On `prefers-reduced-motion: reduce` the line renders flat.
 */
function KineticLine({
    text,
    className,
    delay = 0,
}: {
    text: string;
    className?: string;
    delay?: number;
}) {
    const reduce = useReducedMotion();
    if (reduce) {
        return <span className={className}>{text}</span>;
    }
    const words = text.split(/(\s+)/); // keep whitespace tokens
    return (
        <motion.span
            className={className}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            variants={{
                hidden: {},
                visible: {
                    transition: {
                        delayChildren: delay,
                        staggerChildren: 0.06,
                    },
                },
            }}
        >
            {words.map((w, i) =>
                /^\s+$/.test(w) ? (
                    <span key={i}>{w}</span>
                ) : (
                    <motion.span
                        key={i}
                        className="inline-block will-change-transform"
                        variants={{
                            hidden: { opacity: 0, y: 18 },
                            visible: {
                                opacity: 1,
                                y: 0,
                                transition: {
                                    duration: 0.55,
                                    ease: [0.16, 1, 0.3, 1],
                                },
                            },
                        }}
                    >
                        {w}
                    </motion.span>
                )
            )}
        </motion.span>
    );
}

function CostOutro({ progress }: { progress: MotionValue<number> }) {
    // Fade in at the very end of the third frame.
    const opacity = useTransform(progress, [0.85, 0.97, 1], [0, 1, 1]);
    return (
        <motion.div
            style={{ opacity }}
            className="absolute inset-x-0 bottom-12 flex justify-center"
        >
            <p className="text-sm uppercase tracking-[0.25em] font-bold text-slate-400">
                We fix the paperwork ↓
            </p>
        </motion.div>
    );
}

function CostStoryStatic() {
    return (
        <div className="py-20 px-6 max-w-3xl mx-auto space-y-24">
            {COST_FRAMES.map((frame, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center"
                >
                    <CostFrameContent frame={frame} animate={true} />
                </motion.div>
            ))}
            <p className="text-center text-sm uppercase tracking-[0.25em] font-bold text-slate-400">
                We fix the paperwork ↓
            </p>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  PROCESS mode — section 3                                          */
/* ------------------------------------------------------------------ */

export interface ProcessStep {
    icon: LucideIcon;
    title: string;
    desc: string;
    /** Mock document fragment text. */
    cue: string;
    /** Optional richer illustration shown alongside text on md+. */
    illustration?: React.ReactNode;
}

const HOMEPAGE_PROCESS_STEPS: ProcessStep[] = [
    {
        icon: BellRing,
        title: "Tender lands.",
        desc: "Filtered alert hits your WhatsApp 72 hours before close — only the ones that fit your AGPO category and capacity.",
        cue: "MOH/SUP/2026-014 — Medical supplies, Nakuru. Closes Fri 4:30pm.",
    },
    {
        icon: ShieldCheck,
        title: "Compliance check.",
        desc: "KRA TCC, NSSF, NHIF, AGPO, CR12 — all current, all attached. We catch the expiry before the procuring entity does.",
        cue: "TCC valid · NSSF current · CR12 dated · AGPO category B confirmed.",
    },
    {
        icon: FileText,
        title: "Bid written.",
        desc: "Technical proposal drafted, BOQ formatted to the procuring entity's template, financial sealed in a separate envelope.",
        cue: "Technical: 28 pages. BOQ: 14 line items. Financial: sealed, separate.",
    },
    {
        icon: CheckCircle2,
        title: "Submitted on time.",
        desc: "eGP upload or physical delivery, with stamped receipt landing in your inbox before close-of-business.",
        cue: "Stamped 4:12pm. Receipt #2026-014-0387. You're in.",
    },
];

export function ProcessStory({ steps }: { steps?: ProcessStep[] } = {}) {
    const reduceMotion = useReducedMotion();
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start 80%", "end 20%"],
    });

    // Track fill — 0 to 1 across the section length.
    const trackHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    const data = steps && steps.length > 0 ? steps : HOMEPAGE_PROCESS_STEPS;

    return (
        <div ref={ref} className="relative max-w-4xl mx-auto">
            {/* Vertical track — only on md+ */}
            <div className="hidden md:block absolute left-8 top-4 bottom-4 w-px bg-slate-200">
                <motion.div
                    style={{ height: reduceMotion ? "100%" : trackHeight }}
                    className="w-px bg-gradient-to-b from-brand-500 via-accent-500 to-success-500"
                />
            </div>

            <ol className="space-y-16 md:space-y-24">
                {data.map((step, i) => (
                    <ProcessStepView key={i} step={step} index={i} />
                ))}
            </ol>
        </div>
    );
}

function ProcessStepView({
    step,
    index,
}: {
    step: ProcessStep;
    index: number;
}) {
    const Icon = step.icon;
    return (
        <motion.li
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.05,
            }}
            className="relative md:pl-24"
        >
            {/* Node dot on the track */}
            <span
                aria-hidden
                className="hidden md:flex absolute left-4 top-2 size-9 items-center justify-center rounded-full bg-white border border-slate-200 ring-4 ring-white shadow-sm"
            >
                <Icon className="size-4 text-brand-600" />
            </span>

            <div className="flex md:hidden items-center gap-3 mb-4">
                <span className="size-9 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center">
                    <Icon className="size-4 text-brand-600" />
                </span>
                <span className="font-mono text-xs uppercase tracking-widest text-slate-500">
                    Step {String(index + 1).padStart(2, "0")}
                </span>
            </div>

            <span className="hidden md:block font-mono text-xs uppercase tracking-widest text-slate-400 mb-2">
                Step {String(index + 1).padStart(2, "0")}
            </span>

            <div className="md:grid md:grid-cols-[1fr_140px] md:gap-8 md:items-start">
                <div className="min-w-0">
                    <h3 className="font-display text-3xl md:text-4xl font-bold text-brand-950 mb-3 text-balance">
                        {step.title}
                    </h3>
                    <p className="text-base md:text-lg text-slate-600 leading-relaxed mb-5 max-w-xl">
                        {step.desc}
                    </p>

                    {/* Document fragment cue */}
                    <div className="inline-flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 max-w-xl">
                        <span className="mt-1 size-1.5 rounded-full bg-success-500 shrink-0" />
                        <span className="font-mono text-xs md:text-sm text-slate-700 leading-relaxed">
                            {step.cue}
                        </span>
                    </div>
                </div>

                {step.illustration && (
                    <div
                        className="hidden md:block size-[120px] text-brand-700 shrink-0"
                        aria-hidden
                    >
                        {step.illustration}
                    </div>
                )}
            </div>
        </motion.li>
    );
}

/* ------------------------------------------------------------------ */
/*  Default export — the cost story (section 2's primary use)         */
/* ------------------------------------------------------------------ */

export default CostStory;
export { CostStory };
