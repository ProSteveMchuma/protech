"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Logo } from "./Logo";
import { ButtonLink } from "./ui/Button";

interface NavLink {
    name: string;
    href: string;
}

interface Props {
    open: boolean;
    onClose: () => void;
    links: NavLink[];
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
                    className="fixed inset-0 z-[60] md:hidden bg-brand-950/95 backdrop-blur-xl"
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
                        className="px-6 py-10 flex flex-col gap-2"
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
                                    className="block py-4 text-2xl font-display font-bold text-white border-b border-white/10"
                                >
                                    {link.name}
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
                            <ButtonLink href="/hire" variant="primary" size="xl" fullWidth onClick={onClose}>
                                Hire Talent
                            </ButtonLink>
                            <ButtonLink
                                href="/checkout?pkg=va-growth"
                                variant="success"
                                size="lg"
                                fullWidth
                                onClick={onClose}
                            >
                                Pay with M-Pesa
                            </ButtonLink>
                        </motion.div>
                    </motion.nav>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
