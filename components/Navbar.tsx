"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { clsx } from "clsx";
import { Logo } from "./Logo";
import { MobileMenu, type MobileNavLink } from "./MobileMenu";
import { ButtonLink } from "./ui/Button";
import { Badge } from "./ui/Badge";

const links: MobileNavLink[] = [
    { name: "Tender", href: "/services/tender", flagship: true },
    { name: "Virtual Assistants", href: "/services/va" },
    { name: "Guide", href: "/guides/tender-disqualifications" },
    { name: "Apply", href: "/apply" },
];

export function Navbar() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <>
            <nav
                className={clsx(
                    "sticky top-0 z-50 transition-all duration-300",
                    scrolled
                        ? "glass border-b border-slate-200/60 shadow-sm"
                        : "bg-transparent border-b border-transparent"
                )}
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
                    <Link
                        href="/"
                        aria-label="Pro Remote Tasks home"
                        className="flex items-center text-brand-950 hover:opacity-90 transition shrink-0"
                    >
                        <Logo variant="lockup" size={32} className="text-[14px]" />
                    </Link>

                    <div className="hidden md:flex items-center gap-0.5">
                        {links.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={clsx(
                                    "relative px-2.5 py-2 text-sm font-medium transition group inline-flex items-center gap-1.5",
                                    link.flagship
                                        ? "text-brand-700 hover:text-brand-800 font-semibold"
                                        : "text-slate-600 hover:text-brand-700"
                                )}
                            >
                                {link.name}
                                {link.flagship && (
                                    <Badge
                                        tone="success"
                                        className="!px-1.5 !py-0 !text-[9px] leading-tight"
                                    >
                                        Flagship
                                    </Badge>
                                )}
                                <span className="absolute left-2.5 right-2.5 -bottom-px h-px bg-brand-600 origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                            </Link>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center gap-2 shrink-0">
                        <ButtonLink href="/checkout?pkg=va-growth" variant="ghost" size="sm">
                            Pay
                        </ButtonLink>
                        <ButtonLink href="/hire?service=tender" variant="dark" size="sm">
                            Talk to sales
                        </ButtonLink>
                    </div>

                    <button
                        className="md:hidden size-10 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100"
                        onClick={() => setOpen(true)}
                        aria-label="Open menu"
                    >
                        <Menu className="size-5" />
                    </button>
                </div>
            </nav>
            <MobileMenu open={open} onClose={() => setOpen(false)} links={links} />
        </>
    );
}
