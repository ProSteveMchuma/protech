import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Gauge, Layers3, MapPin, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
    title: "About ProPrint",
    description: "ProPrint builds focused browser-based software that removes repetitive setup work from print production.",
};

const principles = [
    { icon: Gauge, title: "Seconds over spreadsheets", copy: "A production tool should shorten the job in front of you, not create another system to maintain." },
    { icon: Layers3, title: "One workflow at a time", copy: "Each ProPrint module solves a specific production bottleneck and works on its own from day one." },
    { icon: ShieldCheck, title: "Your artwork stays yours", copy: "Wherever possible, files are processed locally in the browser instead of being uploaded to a remote server." },
];

const timeline = [
    ["Now", "SerialPro", "Numbering, book ranges and production imposition."],
    ["Now", "QuotePro", "Faster print estimating and consistent quotations."],
    ["Next", "Production suite", "Proofing, job tracking and connected shop-floor tools."],
];

export default function AboutPage() {
    return (
        <div className="bg-[#071019] text-white">
            <section className="relative overflow-hidden border-b border-white/10 pb-24 pt-36 sm:pb-32 sm:pt-44">
                <div className="imposition-grid absolute inset-0 opacity-30" />
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
                    <div className="max-w-4xl">
                        <p className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[.22em] text-cyan-300"><MapPin className="size-3.5" /> Nairobi, Kenya · Built for print production</p>
                        <h1 className="mt-7 text-5xl font-black leading-[.94] tracking-[-.06em] sm:text-7xl lg:text-8xl">The print shop deserves better software.</h1>
                        <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">ProPrint turns repetitive prepress and production work into focused browser tools—starting with numbering and imposition.</p>
                    </div>
                </div>
            </section>

            <section className="bg-white py-24 text-slate-950 sm:py-32">
                <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[.8fr_1.2fr] lg:gap-24">
                    <div><p className="font-mono text-xs font-bold uppercase tracking-[.22em] text-cyan-700">Why we build</p><h2 className="mt-4 text-4xl font-black tracking-[-.04em] sm:text-5xl">Production is skilled work. Repetition is not.</h2></div>
                    <div className="space-y-6 text-lg leading-8 text-slate-600">
                        <p>Print operators make hundreds of small, exact decisions every day. Yet too much of their time is still spent typing serial numbers, rebuilding calculations and checking layouts by hand.</p>
                        <p>ProPrint is being built to remove that friction without forcing a shop to replace the tools and processes that already work. Start with one painful job. Save the time. Add another module only when it earns its place in production.</p>
                        <p className="border-l-2 border-cyan-500 pl-5 font-bold text-slate-900">Practical automation, measured in fewer setup hours and fewer avoidable mistakes.</p>
                    </div>
                </div>
            </section>

            <section className="border-y border-white/10 py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <p className="font-mono text-xs font-bold uppercase tracking-[.22em] text-cyan-300">Product principles</p>
                    <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 lg:grid-cols-3">
                        {principles.map(({ icon: Icon, title, copy }, index) => <article key={title} className="bg-[#071019] p-7 sm:p-9"><div className="flex items-start justify-between"><Icon className="size-6 text-cyan-300" /><span className="font-mono text-xs text-slate-600">0{index + 1}</span></div><h2 className="mt-12 text-2xl font-black">{title}</h2><p className="mt-4 text-sm leading-7 text-slate-400">{copy}</p></article>)}
                    </div>
                </div>
            </section>

            <section className="bg-slate-50 py-24 text-slate-950 sm:py-32">
                <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-24">
                    <div><p className="font-mono text-xs font-bold uppercase tracking-[.22em] text-cyan-700">The build sequence</p><h2 className="mt-4 text-4xl font-black tracking-[-.04em] sm:text-5xl">A production system, assembled module by module.</h2><p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">The roadmap follows the natural path of a print job: estimate it, prepare it, approve it and track it through production.</p></div>
                    <ol className="border-y border-slate-300">
                        {timeline.map(([phase, product, copy], index) => <li key={product} className="grid grid-cols-[64px_1fr] gap-4 border-b border-slate-200 py-7 last:border-0"><span className="font-mono text-xs font-bold uppercase text-cyan-700">{phase}</span><div><div className="flex items-center gap-3"><span className="grid size-6 place-items-center rounded-full bg-slate-950 font-mono text-[10px] text-white">{index + 1}</span><h3 className="text-lg font-black">{product}</h3></div><p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p></div></li>)}
                    </ol>
                </div>
            </section>

            <section className="py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <div className="press-window grid gap-10 p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-end lg:p-14">
                        <div><p className="font-mono text-xs font-bold uppercase tracking-[.22em] text-cyan-300">Start with the live module</p><h2 className="mt-4 max-w-2xl text-4xl font-black tracking-[-.04em] sm:text-5xl">Take a numbering job from artwork to press sheet.</h2><div className="mt-7 flex flex-wrap gap-4 text-xs text-slate-400">{["No account", "No upload", "Free production beta"].map((item) => <span key={item} className="flex items-center gap-2"><Check className="size-3.5 text-emerald-400" />{item}</span>)}</div></div>
                        <Link href="/tools/serialpro" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-cyan-300 px-6 py-3.5 font-black text-slate-950 transition-colors hover:bg-cyan-200">Try SerialPro free <ArrowRight className="size-4" /></Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
