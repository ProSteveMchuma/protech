"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { clsx } from "clsx";
import { Logo } from "./Logo";
import { ButtonLink } from "./ui/Button";
import { Badge } from "./ui/Badge";

export interface MobileNavLink {
    name: string;
    href: string;
    flagship?: boolean;
}

interface Props {
    open: boolean;
    onClose: () => void;
    links: MobileNavLink[];
}

export function MobileMenu({ open, onClose, links }: Props) {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    key="overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="fixed inset-0 z-[60] md:hidden bg-brand-950/95 backdrop-blur-xl overflow-y-auto"
                >
                    <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
                        <Link href="/" onClick={onClose} className="text-white">
                            <Logo variant="mark" size={36} />
                        </Link>
                        <button
                            onClick={onClose}
                            aria-label="Close menu"
                            className="size-10 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10"
                        >
                            <X className="size-5" />
                        </button>
                    </div>

                    <motion.nav
                        initial="hidden"
                        animate="visible"
                        variants={{
                            visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
                        }}
                        className="px-6 py-8 flex flex-col gap-2"
                    >
                        {links.map((link) => (
                            <motion.div
                                key={link.name}
                                variants={{
                                    hidden: { opacity: 0, y: 12 },
                                    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                                }}
                            >
                                <Link
                                    href={link.href}
                                    onClick={onClose}
                                    className={clsx(
                                        "flex items-center justify-between gap-3 border-b border-white/10",
                                        link.flagship
                                            ? "py-5 my-1 px-4 -mx-4 rounded-2xl bg-white/5 border-white/15 ring-1 ring-brand-400/30"
                                            : "py-4"
                                    )}
                                >
                                    <span
                                        className={clsx(
                                            "font-display font-bold text-white",
                                            link.flagship ? "text-3xl" : "text-2xl"
                                        )}
                                    >
                                        {link.name}
                                    </span>
                                    {link.flagship ? (
                                        <span className="flex items-center gap-2">
                                            <Badge tone="success" pulse>
                                                Flagship
                                            </Badge>
                                            <ArrowRight className="size-5 text-white/80" />
                                        </span>
                                    ) : null}
                                </Link>
                            </motion.div>
                        ))}
                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 16 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                            }}
                            className="mt-8 grid gap-3"
                        >
                            <ButtonLink
                                href="/services/tender#pricing"
                                variant="primary"
                                size="xl"
                                fullWidth
                                onClick={onClose}
                            >
                                See tender packages
                            </ButtonLink>
                            <ButtonLink
                                href="/hire?service=tender"
                                variant="success"
                                size="lg"
                                fullWidth
                                onClick={onClose}
                            >
                                Talk to sales
                            </ButtonLink>
                        </motion.div>
                    </motion.nav>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
