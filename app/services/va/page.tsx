import { PricingV2 } from "@/components/PricingV2";
import { FaqSection } from "@/components/FaqSection";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import {
    CheckCircle2,
    Inbox,
    Calendar,
    Plane,
    Database,
    Sparkles,
    ArrowRight,
} from "lucide-react";

export const metadata = {
    title: "Hire a Managed Virtual Assistant in Kenya",
    description:
        "Reclaim your time with a vetted Kenyan VA managed by Pro Remote Tasks. Inbox, calendar, admin, customer support — done.",
};

const tiers = [
    {
        name: "Starter VA",
        price: "KES 25,000/mo",
        description: "Solopreneurs and small founders who need basic admin support.",
        pkgKey: "va-starter",
        features: [
            "10 hrs/week dedicated time",
            "Email & inbox triage",
            "Calendar scheduling",
            "Basic data entry",
            "Weekly progress reports",
        ],
    },
    {
        name: "Growth VA",
        price: "KES 40,000/mo",
        description: "Scaling teams that need a real second set of hands.",
        pkgKey: "va-growth",
        features: [
            "20 hrs/week dedicated time",
            "Email + calendar mastery",
            "Social media scheduling",
            "Customer support (email)",
            "Travel & logistics planning",
            "Dedicated account manager",
        ],
        recommended: true,
    },
    {
        name: "Executive VA",
        price: "KES 75,000/mo",
        description: "Busy executives who need full-time leverage.",
        pkgKey: "va-executive",
        features: [
            "40 hrs/week (full-time)",
            "Full inbox management",
            "Project management",
            "Lifestyle & errands",
            "Research & briefings",
            "24/7 priority support",
        ],
    },
];

const skills = [
    { icon: <Inbox className="size-5 text-brand-600" />, title: "Inbox zero", desc: "Triage, label, draft replies, archive ruthlessly." },
    { icon: <Calendar className="size-5 text-amber-500" />, title: "Calendar mastery", desc: "Block time, defend focus, avoid double bookings." },
    { icon: <Plane className="size-5 text-success-500" />, title: "Travel & logistics", desc: "Flights, hotels, expensing, itineraries." },
    { icon: <Database className="size-5 text-accent-500" />, title: "CRM & data", desc: "HubSpot, Notion, Airtable. Clean data, on time." },
];

export default function VAServicePage() {
    return (
        <>
            {/* Hero */}
            <section className="bg-brand-950 bg-grid text-white pt-20 pb-24 md:pt-28 md:pb-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-aurora-dark opacity-50 pointer-events-none" />
                <div className="container mx-auto px-4 relative z-10 max-w-4xl text-center">
                    <Badge tone="dark" pulse className="mb-6">
                        Virtual Assistants
                    </Badge>
                    <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6 text-balance">
                        Reclaim your time. <br />
                        Hire a <span className="text-gradient">dedicated VA.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 text-pretty">
                        Stop drowning in admin. Our vetted Kenyan VAs handle the busy work — you focus on the work that actually grows your business.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <ButtonLink href="#pricing" variant="primary" size="xl">
                            See packages <ArrowRight className="size-5" />
                        </ButtonLink>
                        <ButtonLink href="/hire?service=va" variant="outline" size="xl">
                            Free intake call
                        </ButtonLink>
                    </div>
                </div>
            </section>

            {/* What we do */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="text-center mb-12">
                        <Badge tone="brand" className="mb-3">What you get</Badge>
                        <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900">
                            Delegate to accelerate.
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {skills.map((s, i) => (
                            <div
                                key={i}
                                className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-brand-300 transition group"
                            >
                                <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    {s.icon}
                                </div>
                                <h3 className="font-bold text-slate-900 mb-1.5">{s.title}</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h3 className="font-display text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                                More than a VA — a managed service.
                            </h3>
                            <ul className="space-y-3">
                                {[
                                    "Account manager double-checks quality every week",
                                    "Replacement guarantee in week 1, no questions",
                                    "Onboarding playbook so you don't reinvent SOPs",
                                    "All-in monthly rate — no surprise overages",
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-slate-700">
                                        <CheckCircle2 className="size-5 text-success-500 shrink-0 mt-0.5" /> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/20 to-accent-500/20 blur-2xl rounded-3xl" />
                            <div className="relative bg-white border border-slate-200 rounded-3xl p-8 premium-shadow">
                                <div className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-3">
                                    Sample week
                                </div>
                                <ul className="space-y-3 text-sm">
                                    <li className="flex justify-between"><span className="text-slate-600">Mon</span><span className="font-semibold">Inbox triage + 8 replies drafted</span></li>
                                    <li className="flex justify-between"><span className="text-slate-600">Tue</span><span className="font-semibold">5 client meetings scheduled</span></li>
                                    <li className="flex justify-between"><span className="text-slate-600">Wed</span><span className="font-semibold">Q3 travel itinerary booked</span></li>
                                    <li className="flex justify-between"><span className="text-slate-600">Thu</span><span className="font-semibold">CRM cleaned (220 records)</span></li>
                                    <li className="flex justify-between"><span className="text-slate-600">Fri</span><span className="font-semibold">Weekly report + next-week plan</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="py-24 bg-slate-50 scroll-mt-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-14">
                        <Badge tone="success" className="mb-3">Simple monthly pricing</Badge>
                        <h2 className="font-display text-3xl md:text-5xl font-bold text-slate-900 mb-4 text-balance">
                            Pick a tier. Cancel anytime.
                        </h2>
                        <p className="text-slate-600">No hourly negotiations. No HR headaches. No long contracts.</p>
                    </div>
                    <PricingV2 tiers={tiers} serviceName="va" />
                </div>
            </section>

            <FaqSection
                items={[
                    { question: "How quickly can I start?", answer: "Typically 24-48 hours from your intake call." },
                    { question: "Are your VAs based in Kenya?", answer: "Yes — all our talent is in Kenya. That's how we deliver senior-level work at junior-level rates." },
                    { question: "Can I scale my plan up or down?", answer: "Yes, with 15 days notice. Most clients start at Growth and move up." },
                    { question: "What if my VA isn't a fit?", answer: "100% replacement guarantee in week 1, free of charge." },
                ]}
            />
        </>
    );
}
