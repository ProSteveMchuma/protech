"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { clsx } from "clsx";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { ButtonLink } from "./ui/Button";

const links = [
    { name: "Services", href: "/#services" },
    { name: "VA", href: "/services/va" },
    { name: "Social", href: "/services/social" },
    { name: "Content", href: "/services/content" },
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
                        className="flex items-center text-brand-950 hover:opacity-90 transition"
                    >
                        <Logo variant="lockup" size={32} className="text-[14px]" />
                    </Link>

                    <div className="hidden md:flex items-center gap-1">
                        {links.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="relative px-3 py-2 text-sm font-medium text-slate-600 hover:text-brand-700 transition group"
                            >
                                {link.name}
                                <span className="absolute left-3 right-3 -bottom-px h-px bg-brand-600 origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                            </Link>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center gap-2">
                        <ButtonLink href="/checkout?pkg=va-growth" variant="ghost" size="sm">
                            Pay
                        </ButtonLink>
                        <ButtonLink href="/hire" variant="dark" size="sm">
                            Hire Talent
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
