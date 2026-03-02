"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const links = [
        { name: "Services", href: "/#services" },
        { name: "VA", href: "/services/va" },
        { name: "Social", href: "/services/social" },
        { name: "Content", href: "/services/content" },
        { name: "Apply", href: "/apply" },
    ];

    return (
        <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-slate-900">
                    RemotePro<span className="text-blue-500">.</span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
                    {links.map((link) => (
                        <Link key={link.name} href={link.href} className="hover:text-blue-600 transition">
                            {link.name}
                        </Link>
                    ))}
                </div>

                <div className="hidden md:block">
                    <Link href="/hire" className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-slate-800 transition">
                        Hire Talent
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-b py-4 px-4 space-y-4">
                    {links.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="block text-slate-600 font-medium"
                            onClick={() => setIsOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link
                        href="/hire"
                        className="block bg-slate-900 text-white px-5 py-3 rounded-xl text-center font-semibold"
                        onClick={() => setIsOpen(false)}
                    >
                        Hire Talent
                    </Link>
                </div>
            )}
        </nav>
    );
}
