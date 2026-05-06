"use client";

/**
 * Homepage — Stripe-clean × Apple-storytelling.
 *
 * Seven sections in order. One focus per section.
 *   1. Hero ............ "Win more tenders." One CTA.
 *   2. Cost ............ Scroll-pinned 3-frame reveal of the problem size.
 *   3. How ............. Scroll-driven 4-step process timeline.
 *   4. Pricing-light ... Anchor card. KES 15,000 + see all tiers.
 *   5. Trust ........... One quote. No carousel.
 *   6. Also: VA ........ Single-line footnote for VA-only leads.
 *   7. Final CTA ....... Dark surface. "Ready to bid better?" One CTA.
 *
 * Anything else is chrome and was deliberately removed in this redesign.
 */

import { motion } from "framer-motion";
import { ArrowRight, ArrowDown } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CostStory, ProcessStory } from "@/components/ScrollStory";
import { fadeUp, stagger } from "@/lib/motion";
import { TENDER_TIERS } from "@/lib/tender-tiers";

const TENDER_WATCH = TENDER_TIERS.find((t) => t.key === "tender-watch");
const TENDER_WATCH_PRICE = TENDER_WATCH?.priceKES ?? 15000;

export default function Home() {
    return (
        <>
            {/* ---------------------------------------------------------- */}
            {/*  1 · HERO                                                  */}
            {/* ---------------------------------------------------------- */}
            <section
                aria-label="Pro Remote Tasks — tender management for Kenyan SMEs"
                className="relative bg-aurora overflow-hidden flex items-center min-h-[100svh] lg:min-h-[80vh] py-20"
            >
                <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={stagger(0.05, 0.12)}
                        className="text-center"
                    >
                        <motion.div variants={fadeUp} className="mb-10 inline-flex">
                            <Badge tone="brand" pulse>
                                Tender Management · For Kenyan SMEs
                            </Badge>
                        </motion.div>

                        <motion.h1
                            variants={fadeUp}
                            className="font-display text-6xl sm:text-7xl md:text-7xl lg:text-8xl font-bold text-brand-950 leading-[1.02] tracking-tight text-balance mb-8"
                        >
                            Win more tenders.
                        </motion.h1>

                        <motion.p
                            variants={fadeUp}
                            className="text-lg md:text-xl text-slate-600 max-w-xl mx-auto leading-relaxed text-pretty mb-12"
                        >
                            We find the tenders that fit you, write the bid, and
                            submit on time.
                        </motion.p>

                        <motion.div variants={fadeUp} className="flex justify-center">
                            <ButtonLink
                                href="/hire?service=tender"
                                variant="primary"
                                size="xl"
                            >
                                Get a free proposal
                                <ArrowRight className="size-5" />
                            </ButtonLink>
                        </motion.div>

                        <motion.div variants={fadeUp} className="mt-8">
                            <a
                                href="#how"
                                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-brand-700 transition-colors"
                            >
                                or see how it works
                                <ArrowDown className="size-4" aria-hidden />
                            </a>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* ---------------------------------------------------------- */}
            {/*  2 · THE COST — pinned scroll story                        */}
            {/* ---------------------------------------------------------- */}
            <CostStory />

            {/* ---------------------------------------------------------- */}
            {/*  3 · HOW IT WORKS                                          */}
            {/* ---------------------------------------------------------- */}
            <section
                id="how"
                className="relative bg-slate-50 py-32 md:py-40 scroll-mt-24"
            >
                <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.4 }}
                        variants={stagger(0, 0.08)}
                        className="text-center mb-20 md:mb-28"
                    >
                        <motion.div variants={fadeUp} className="mb-5 inline-flex">
                            <Badge tone="accent">How it works</Badge>
                        </motion.div>
                        <motion.h2
                            variants={fadeUp}
                            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-brand-950 leading-tight text-balance"
                        >
                            From tender notice to stamped receipt.
                        </motion.h2>
                    </motion.div>

                    <ProcessStory />
                </div>
            </section>

            {/* ---------------------------------------------------------- */}
            {/*  4 · PRICING-LIGHT — single anchor card                    */}
            {/* ---------------------------------------------------------- */}
            <section className="relative bg-white py-32 md:py-40">
                <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/60 premium-shadow p-10 md:p-16 text-center"
                    >
                        <p className="text-xs uppercase tracking-[0.25em] font-bold text-slate-500 mb-6">
                            Starting at
                        </p>
                        <div className="flex items-baseline justify-center gap-2 mb-6">
                            <span className="font-mono tabular-nums font-bold text-5xl md:text-7xl text-brand-950 leading-none">
                                KES {TENDER_WATCH_PRICE.toLocaleString()}
                            </span>
                            <span className="font-mono text-base md:text-lg text-slate-500">
                                /month
                            </span>
                        </div>
                        <p className="text-base md:text-lg text-slate-600 max-w-md mx-auto mb-10 text-pretty">
                            Filtered tender alerts, compliance audit, and deadline
                            tracking. From day one.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <ButtonLink
                                href="/services/tender#pricing"
                                variant="primary"
                                size="lg"
                            >
                                See all tiers
                                <ArrowRight className="size-4" />
                            </ButtonLink>
                            <a
                                href="/hire?service=tender"
                                className="text-sm font-medium text-slate-600 hover:text-brand-700 transition-colors inline-flex items-center gap-1.5"
                            >
                                or talk to sales
                                <ArrowRight className="size-3.5" />
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ---------------------------------------------------------- */}
            {/*  5 · TRUST — one quote                                     */}
            {/* ---------------------------------------------------------- */}
            <section className="relative bg-slate-50 py-32 md:py-40">
                <div className="container mx-auto px-6 lg:px-8 max-w-4xl">
                    <motion.figure
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="text-center"
                    >
                        <p className="text-xs uppercase tracking-[0.25em] font-bold text-slate-500 mb-8">
                            From a recent client
                        </p>

                        <blockquote className="font-display text-2xl md:text-3xl lg:text-4xl text-brand-950 leading-snug text-balance mb-10">
                            <span className="text-brand-300 mr-1" aria-hidden>
                                &ldquo;
                            </span>
                            We had not won a county tender in three years. Pro Remote
                            Tasks caught two expired compliance docs in week one,
                            then packaged a Nakuru County supply bid the way the
                            procuring entity actually wanted it. We won.
                            <span className="text-brand-300 ml-1" aria-hidden>
                                &rdquo;
                            </span>
                        </blockquote>

                        <figcaption className="space-y-4">
                            <div className="text-sm md:text-base text-slate-600">
                                — Kipchoge W., Rift Valley Supplies &amp; General
                                Contractors
                            </div>
                            <div className="inline-flex">
                                <Badge tone="success">
                                    <span className="font-mono tabular-nums">
                                        Won KES 4.2M county supply
                                    </span>
                                </Badge>
                            </div>
                        </figcaption>
                    </motion.figure>
                </div>
            </section>

            {/* ---------------------------------------------------------- */}
            {/*  6 · ALSO AVAILABLE: VA — quiet single-line footnote       */}
            {/* ---------------------------------------------------------- */}
            <section className="relative bg-white py-20 md:py-24">
                <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
                    <p className="text-center text-base md:text-lg text-slate-600 leading-relaxed text-balance">
                        Need admin help instead? We also run vetted virtual
                        assistants from{" "}
                        <span className="font-mono tabular-nums font-semibold text-slate-900">
                            KES 25,000/mo
                        </span>
                        .{" "}
                        <a
                            href="/services/va"
                            className="font-semibold text-brand-700 hover:text-brand-800 underline decoration-brand-200 underline-offset-4 decoration-2 hover:decoration-brand-500 transition"
                        >
                            See VA packages →
                        </a>
                    </p>
                </div>
            </section>

            {/* ---------------------------------------------------------- */}
            {/*  7 · FINAL CTA                                             */}
            {/* ---------------------------------------------------------- */}
            <section className="relative bg-brand-950 bg-grid text-white py-32 md:py-40 overflow-hidden">
                {/* Soft brand glow, kept subtle — no rotating border. */}
                <div
                    aria-hidden
                    className="absolute inset-0 bg-aurora-dark opacity-60 pointer-events-none"
                />

                <div className="container mx-auto px-6 lg:px-8 max-w-3xl relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="text-center"
                    >
                        <h2 className="font-display text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight text-balance mb-12">
                            Ready to bid better?
                        </h2>

                        <div className="flex flex-col items-center gap-6">
                            <ButtonLink
                                href="/hire?service=tender"
                                variant="primary"
                                size="xl"
                            >
                                Get a free proposal
                                <ArrowRight className="size-5" />
                            </ButtonLink>
                            <a
                                href="/services/tender#pricing"
                                className="text-sm font-medium text-slate-300 hover:text-white transition-colors inline-flex items-center gap-1.5"
                            >
                                or pay a package directly
                                <ArrowRight className="size-3.5" />
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>
        </>
    );
}
