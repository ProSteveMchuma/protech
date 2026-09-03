import Link from "next/link";
import { ArrowRight, Calculator, Check, ClipboardCheck, FileCheck2, Layers3, ScanLine, Workflow, Clock, Grid2x2, Wallet } from "lucide-react";
import { PACKAGES } from "@/lib/config";
import { Reveal } from "@/components/Reveal";

const liveTools = [
  {
    name: "SerialPro",
    status: "Production beta",
    icon: ScanLine,
    copy: "Number receipts, tickets and books, then impose them onto the press sheet — with a live layout preview and cut-and-stack order.",
    href: "/tools/serialpro",
    points: ["Auto best-fit orientation", "Live press-sheet preview", "Cut-and-stack + book manifest"],
  },
  {
    name: "QuotePro",
    status: "Production beta",
    icon: Calculator,
    copy: "Cost a job and protect your margin in seconds. Job presets, VAT-aware totals and a clear cost breakdown you can send with confidence.",
    href: "/tools/quotepro",
    points: ["Job-type presets", "Margin guardrail", "Compare quantities instantly"],
  },
];

const roadmap = [
  { name: "ImposePro Advanced", status: "Building", icon: Layers3, copy: "Gang runs and signatures." },
  { name: "ProofPro", status: "Planned", icon: ClipboardCheck, copy: "Reliable artwork approval." },
  { name: "JobTrack", status: "Planned", icon: Workflow, copy: "Every job, artwork to dispatch." },
  { name: "PreflightPro", status: "Planned", icon: FileCheck2, copy: "Catch artwork risks early." },
];

const pain = [
  ["Typing receipt numbers one by one", "2 hours on a 500-book run"],
  ["Rebuilding quotations in Excel", "10 minutes per quote, every time"],
  ["Calculating pieces per sheet by hand", "Guesswork that wastes paper"],
  ["Checking for skipped receipt numbers", "One miss means a reprint"],
  ["Working out cut-and-stack order", "Easy to get out of sequence"],
  ["Creating book ranges manually", "Slow and error-prone"],
  ["Re-quoting at 500 / 1,000 / 2,000", "Three passes in a spreadsheet"],
  ["Losing margin on mispriced jobs", "Silent profit leak"],
];

const proofStats = [
  { icon: Clock, value: "~5 min", label: "A 500-book numbering job, start to press-ready PDF" },
  { icon: Grid2x2, value: "Live", label: "Press-sheet imposition preview before you generate" },
  { icon: Wallet, value: "KES 999", label: "Less than one short-run job — when billing begins" },
];

const tiers = [
  { name: "Beta", price: "KES 0", copy: "SerialPro + QuotePro · guided onboarding · direct feedback", cta: "Apply for beta", featured: true },
  { name: PACKAGES["serialpro-monthly"].tier, price: `KES ${PACKAGES["serialpro-monthly"].amount.toLocaleString()} / month`, copy: "One production tool · saved presets and jobs when billing launches", cta: "Join the waitlist", featured: false },
  { name: PACKAGES["prepress-monthly"].tier, price: `KES ${PACKAGES["prepress-monthly"].amount.toLocaleString()} / month`, copy: "SerialPro + QuotePro together · saved jobs · early access to new modules", cta: "Join the waitlist", featured: false },
  { name: PACKAGES["shop-monthly"].tier, price: `KES ${PACKAGES["shop-monthly"].amount.toLocaleString()} / month`, copy: "Every production module as it ships · founding price locked in", cta: "Join the waitlist", featured: false },
];

export default function Home() {
  return (
    <div className="bg-press text-white">
      <section className="relative overflow-hidden border-b border-white/10 pb-24 pt-36">
        <div className="imposition-grid absolute inset-0 opacity-30" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <p className="kicker text-cyan-300">Built in Nairobi · Runs in your browser</p>
            <h1 className="mt-7 max-w-4xl text-5xl font-black leading-[.94] tracking-[-.06em] sm:text-7xl">
              Stop doing print work <span className="text-cyan-300">by hand.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">
              SerialPro numbers and imposes serialized jobs. QuotePro costs them and protects your margin. Both run in your browser — no install, and your artwork never leaves the machine.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Link className="cta-primary" href="/beta">Join the founding beta</Link>
              <Link className="inline-flex items-center gap-1.5 text-sm font-bold text-cyan-300 hover:text-cyan-200" href="/tools/serialpro">
                Try SerialPro free <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-4 text-xs text-slate-300">
              {["No account needed", "Artwork stays local", "M-Pesa ready"].map((x) => (
                <span key={x} className="flex items-center gap-2">
                  <Check className="size-3.5 text-emerald-400" aria-hidden="true" />
                  {x}
                </span>
              ))}
            </div>
          </div>
          <div className="press-window">
            <div className="press-bar">
              <span>SerialPro / Job 00418</span>
              <span className="text-emerald-400">Ready</span>
            </div>
            <div className="grid grid-cols-3 gap-2 p-4">
              {Array.from({ length: 12 }, (_, i) => (
                <div key={i} className="aspect-[1.4] rounded border border-slate-700 bg-slate-900 p-2">
                  <div className="h-1 w-1/2 bg-slate-700" />
                  <p className="mt-7 text-right font-mono text-[9px] text-cyan-300">RCT-{String(i + 1).padStart(6, "0")}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 border-t border-white/10 text-center font-mono text-xs">
              <div className="p-4"><b className="block text-xl">3 × 4</b><span className="text-slate-400">layout</span></div>
              <div className="border-x border-white/10 p-4"><b className="block text-xl">12-up</b><span className="text-slate-400">SRA3</span></div>
              <div className="p-4"><b className="block text-xl">417</b><span className="text-slate-400">sheets</span></div>
            </div>
          </div>
        </div>
        <div className="relative mx-auto mt-16 max-w-7xl px-4 sm:px-6">
          <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3">
            {proofStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="flex items-start gap-4 bg-press-panel p-6">
                  <Icon className="mt-1 size-5 shrink-0 text-cyan-300" aria-hidden="true" />
                  <div>
                    <p className="font-mono text-2xl font-black tabular-nums">{stat.value}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-300">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-center text-xs text-slate-400">Time figures are typical estimates from real numbering jobs and vary by artwork and press.</p>
        </div>
      </section>

      <section className="bg-white py-24 text-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <p className="kicker text-cyan-700">Operator friction</p>
            <h2 className="mt-4 max-w-3xl text-4xl font-black tracking-[-.04em] sm:text-5xl">These jobs should take seconds, not hours.</h2>
            <p className="mt-5 text-lg text-slate-600">Every one of these is manual, repetitive, and quietly expensive.</p>
          </Reveal>
          <Reveal className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-4" stagger>
            {pain.map(([item, cost], i) => (
              <div key={item} className="h-full bg-white p-6">
                <span className="font-mono text-xs text-cyan-700">0{i + 1}</span>
                <p className="mt-8 font-bold leading-6">{item}</p>
                <p className="mt-2 text-sm text-slate-500">{cost}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section id="products" className="border-y border-white/10 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <p className="kicker text-cyan-300">Live tools</p>
            <h2 className="mt-4 max-w-4xl text-4xl font-black tracking-[-.04em] sm:text-5xl">Two production tools you can use today.</h2>
          </Reveal>
          <Reveal className="mt-12 grid gap-4 lg:grid-cols-2" stagger>
            {liveTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <article key={tool.name} className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[.03] p-8 transition hover:border-cyan-300/40">
                  <div className="flex items-start justify-between">
                    <Icon className="size-7 text-cyan-300" aria-hidden="true" />
                    <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">{tool.status}</span>
                  </div>
                  <h3 className="mt-8 text-2xl font-black">{tool.name}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{tool.copy}</p>
                  <ul className="mt-5 space-y-2">
                    {tool.points.map((point) => (
                      <li key={point} className="flex items-center gap-2 text-sm text-slate-200">
                        <Check className="size-4 text-cyan-300" aria-hidden="true" />
                        {point}
                      </li>
                    ))}
                  </ul>
                  <Link href={tool.href} className="mt-8 inline-flex items-center gap-2 text-sm font-black text-cyan-300 hover:text-cyan-200">
                    Open {tool.name} <ArrowRight className="size-4" />
                  </Link>
                </article>
              );
            })}
          </Reveal>
          <div className="mt-10">
            <p className="kicker text-slate-400">On the roadmap</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {roadmap.map((module) => {
                const Icon = module.icon;
                return (
                  <div key={module.name} className="rounded-xl border border-white/10 bg-white/[.02] p-5">
                    <div className="flex items-center justify-between">
                      <Icon className="size-5 text-slate-400" aria-hidden="true" />
                      <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500">{module.status}</span>
                    </div>
                    <h3 className="mt-5 text-base font-bold">{module.name}</h3>
                    <p className="mt-1 text-xs leading-5 text-slate-400">{module.copy}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="why" className="bg-slate-50 py-24 text-slate-950">
        <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="kicker text-cyan-700">Modular adoption</p>
            <h2 className="mt-4 text-4xl font-black tracking-[-.04em] sm:text-5xl">Do not replace the print shop. Remove the repetitive work inside it.</h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">Start with the job in front of you. Add the next module only when it saves measurable operator time.</p>
          </div>
          <ol id="roadmap" className="divide-y divide-slate-200 border-y border-slate-200">
            {[["01", "SerialPro", "Numbering + imposition"], ["02", "QuotePro", "Estimating + costing"], ["03", "ImposePro Advanced", "Advanced prepress"], ["04", "ProofPro + JobTrack", "Approval + production"], ["05", "ProPrint OS", "Connected print operations"]].map((row) => (
              <li key={row[0]} className="grid grid-cols-[45px_1fr] gap-4 py-5">
                <span className="font-mono text-xs text-cyan-700">{row[0]}</span>
                <div>
                  <b>{row[1]}</b>
                  <p className="mt-1 text-sm text-slate-500">{row[2]}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="pricing" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="kicker text-cyan-300">Founding access</p>
          <h2 className="mt-4 text-4xl font-black tracking-[-.04em] sm:text-5xl">Start in the beta. Pay only once it earns its place.</h2>
          <p className="mt-5 max-w-2xl text-lg text-slate-300">One 500-book numbering job costs about 90 minutes by hand. At KES 999/month, ProPrint pays for itself on the first run.</p>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {tiers.map((tier) => (
              <div key={tier.name} className={`flex flex-col rounded-2xl border p-7 ${tier.featured ? "border-cyan-300 bg-cyan-300 text-slate-950" : "border-white/10"}`}>
                <p className="font-mono text-xs uppercase tracking-wider">{tier.name}</p>
                <p className="mt-6 text-3xl font-black tabular-nums">{tier.price}</p>
                <p className={`mt-5 flex-1 text-sm leading-6 ${tier.featured ? "text-slate-800" : "text-slate-400"}`}>{tier.copy}</p>
                <Link href="/beta" className={`mt-7 inline-flex items-center gap-2 text-sm font-black ${tier.featured ? "text-slate-950" : "text-cyan-300"}`}>
                  {tier.cta}<ArrowRight className="size-4" />
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-slate-400">Paid plans are not charged during the founding beta. We will confirm pricing and terms before billing begins.</p>
        </div>
      </section>

      <section className="border-t border-white/10 bg-press-panel py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-black tracking-[-.04em] sm:text-4xl">Ready to take the manual work out of your shop?</h2>
          <p className="mt-4 text-lg text-slate-300">Try SerialPro on a real job right now, or apply for the founding beta and we will onboard you personally.</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link className="cta-primary" href="/beta">Join the founding beta</Link>
            <Link className="inline-flex items-center gap-1.5 text-sm font-bold text-cyan-300 hover:text-cyan-200" href="/tools/serialpro">
              Open SerialPro <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
