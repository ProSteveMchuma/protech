import type { Metadata } from "next";
import { Check, Clock3, MessageSquareText, ShieldCheck } from "lucide-react";
import { BetaSignupForm } from "@/components/BetaSignupForm";

export const metadata: Metadata = { title: "Founding Beta", description: "Apply for founding access to ProPrint's SerialPro and QuotePro production tools." };
const benefits = [{ icon: ShieldCheck, title: "Local processing", copy: "Artwork stays in your browser." }, { icon: Clock3, title: "Direct onboarding", copy: "We learn your current workflow." }, { icon: MessageSquareText, title: "Founder access", copy: "Feedback reaches the product team." }];

export default function BetaPage() {
    return <div className="min-h-screen bg-press pb-24 pt-32 text-white"><div className="mx-auto grid max-w-6xl gap-14 px-4 sm:px-6 lg:grid-cols-[1fr_.9fr] lg:items-start"><section className="pt-6"><p className="kicker text-cyan-300">Founding print shops / limited beta</p><h1 className="mt-6 text-5xl font-black leading-[.95] tracking-[-.055em] sm:text-7xl">Help shape the tools your shop will use every day.</h1><p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">Use SerialPro and QuotePro on real jobs, tell us where they save time—or get in your way—and influence what ships next.</p><div className="mt-10 grid gap-5 border-y border-white/10 py-7 sm:grid-cols-3">{benefits.map(({ icon: Icon, title, copy }) => <div key={title}><Icon className="size-5 text-cyan-300" /><h2 className="mt-4 text-sm font-black">{title}</h2><p className="mt-2 text-xs leading-5 text-slate-500">{copy}</p></div>)}</div><div className="mt-8 space-y-3 text-sm text-slate-400">{["No payment during application", "Real-job testing with clear beta limits", "Priority access to new production modules"].map(item => <p key={item} className="flex items-center gap-3"><Check className="size-4 text-emerald-400" />{item}</p>)}</div></section><aside><BetaSignupForm /></aside></div></div>;
}
