import Link from "next/link";
import { Mail, Smartphone, MessageCircle } from "lucide-react";
import { Logo } from "./Logo";
import { business } from "@/lib/config";

export function Footer() {
    const year = new Date().getFullYear();
    const wa = business.whatsapp;
    return (
        <footer className="bg-brand-950 text-slate-300 pt-20 pb-10 bg-grid">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-12 gap-12 mb-16">
                    <div className="md:col-span-5">
                        <Link href="/" className="text-white inline-block mb-5">
                            <Logo variant="lockup" size={36} />
                        </Link>
                        <p className="max-w-sm text-slate-400 leading-relaxed mb-6">
                            {business.tagline} We vet, manage, and scale Kenyan talent so you can focus on the work that grows your business.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <span className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold">
                                Built in Nairobi · Serving the world
                            </span>
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <h4 className="text-white font-bold mb-4 text-sm">Services</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/services/va" className="hover:text-white transition">Virtual Assistants</Link></li>
                            <li><Link href="/services/social" className="hover:text-white transition">Social Media</Link></li>
                            <li><Link href="/services/content" className="hover:text-white transition">Content & SEO</Link></li>
                            <li><Link href="/hire" className="hover:text-white transition">Custom Package</Link></li>
                        </ul>
                    </div>

                    <div className="md:col-span-2">
                        <h4 className="text-white font-bold mb-4 text-sm">Company</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/apply" className="hover:text-white transition">Join as Talent</Link></li>
                            <li><Link href="/legal/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
                            <li><Link href="/checkout?pkg=va-growth" className="hover:text-white transition">Pay with M-Pesa</Link></li>
                        </ul>
                    </div>

                    <div className="md:col-span-3">
                        <h4 className="text-white font-bold mb-4 text-sm">Get in touch</h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-3">
                                <Smartphone className="size-4 mt-0.5 text-success-500 shrink-0" />
                                <div>
                                    <div className="text-slate-400 text-[11px] uppercase tracking-wide font-semibold">M-Pesa Paybill</div>
                                    <div className="font-mono font-bold text-white">{business.paybill}</div>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <Mail className="size-4 mt-0.5 text-accent-400 shrink-0" />
                                <a href={`mailto:${business.supportEmail}`} className="hover:text-white transition break-all">
                                    {business.supportEmail}
                                </a>
                            </li>
                            {wa && (
                                <li className="flex items-start gap-3">
                                    <MessageCircle className="size-4 mt-0.5 text-success-500 shrink-0" />
                                    <a
                                        href={`https://wa.me/${wa}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="hover:text-white transition"
                                    >
                                        WhatsApp +{wa}
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 text-xs flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500">
                    <p>&copy; {year} {business.name}. All rights reserved.</p>
                    <p className="italic">World-class talent. Kenyan rates. Zero hassle.</p>
                </div>
            </div>
        </footer>
    );
}
