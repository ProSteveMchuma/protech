import { PricingV2 } from "@/components/PricingV2";
import { FaqSection } from "@/components/FaqSection";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRight, Search, PenTool, FileText, LineChart } from "lucide-react";

export const metadata = {
    title: "SEO Content Writing Services in Kenya",
    description:
        "Data-driven SEO articles and content strategies that rank on Google and convert visitors. Run by Pro Remote Tasks.",
};

const tiers = [
    {
        name: "SEO Blog Pack",
        price: "KES 20,000/mo",
        description: "Drive consistent organic traffic.",
        pkgKey: "content-blog",
        features: [
            "4 SEO articles (1,000 words)",
            "Keyword research",
            "Meta descriptions",
            "Internal linking",
            "SurferSEO optimization",
        ],
    },
    {
        name: "Authority Builder",
        price: "KES 45,000/mo",
        description: "Establish industry leadership.",
        pkgKey: "content-authority",
        features: [
            "8 SEO articles (1,500 words)",
            "2 industry case studies",
            "Topic cluster planning",
            "CMS upload + formatting",
            "Quarterly content audit",
        ],
        recommended: true,
    },
    {
        name: "Content Engine",
        price: "KES 90,000/mo",
        description: "Dominate your niche.",
        pkgKey: "content-engine",
        features: [
            "12 SEO articles",
            "4 newsletter issues",
            "Whitepaper / e-book",
            "Competitor gap analysis",
            "Quarterly content audit",
        ],
    },
];

const features = [
    { icon: <Search className="size-5 text-brand-600" />, title: "Real keyword research", desc: "We use SurferSEO + Ahrefs to find the keywords that bring buyers, not browsers." },
    { icon: <PenTool className="size-5 text-amber-500" />, title: "Human writers", desc: "No AI spam. Industry-experienced Kenyan writers who interview, research, and edit." },
    { icon: <FileText className="size-5 text-success-500" />, title: "CMS-ready", desc: "We upload, format, and add internal links directly in WordPress, Webflow, or Ghost." },
    { icon: <LineChart className="size-5 text-accent-500" />, title: "Tracked outcomes", desc: "Monthly traffic + ranking reports. We show you the URL, the keyword, the position." },
];

export default function ContentServicePage() {
    return (
        <>
            {/* Hero */}
            <section className="bg-brand-950 bg-grid text-white pt-20 pb-24 md:pt-28 md:pb-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-aurora-dark opacity-50 pointer-events-none" />
                <div className="container mx-auto px-4 relative z-10 max-w-4xl text-center">
                    <Badge tone="dark" pulse className="mb-6">
                        Content & SEO
                    </Badge>
                    <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6 text-balance">
                        Content that ranks. <br />
                        Copy that <span className="text-gradient">sells.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 text-pretty">
                        Stop guessing what to write. We create data-driven content strategies that bring ready-to-buy customers to your website.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <ButtonLink href="#pricing" variant="primary" size="xl">
                            See packages <ArrowRight className="size-5" />
                        </ButtonLink>
                        <ButtonLink href="/hire?service=content" variant="outline" size="xl">
                            Free SEO audit
                        </ButtonLink>
                    </div>
                </div>
            </section>

            {/* Why human */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="bg-slate-50 rounded-3xl border border-slate-200 p-8 md:p-12 mb-16">
                        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                            <div className="size-14 shrink-0 rounded-2xl bg-emerald-100 flex items-center justify-center">
                                <PenTool className="size-7 text-success-600" />
                            </div>
                            <div>
                                <h2 className="font-display text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                                    Why "cheap" content costs you money.
                                </h2>
                                <p className="text-slate-600 leading-relaxed">
                                    AI-generated spam and 5-shilling-per-word articles hurt your brand and can get you penalized by Google. Our writers are <strong>human experts</strong>. We research, interview, and write deep, valuable content that positions you as the authority in your field.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {features.map((f, i) => (
                            <div
                                key={i}
                                className="p-6 bg-white rounded-2xl border border-slate-200 premium-shadow-hover transition"
                            >
                                <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center mb-4">
                                    {f.icon}
                                </div>
                                <h3 className="font-bold text-slate-900 mb-1.5">{f.title}</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="py-24 bg-slate-50 scroll-mt-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-14">
                        <Badge tone="success" className="mb-3">Content packages</Badge>
                        <h2 className="font-display text-3xl md:text-5xl font-bold text-slate-900 mb-4 text-balance">
                            Consistent publishing = compound growth.
                        </h2>
                    </div>
                    <PricingV2 tiers={tiers} serviceName="content" />
                </div>
            </section>

            <FaqSection
                items={[
                    { question: "Are your writers experts?", answer: "Yes — we assign writers with industry-specific knowledge so your content is authoritative and accurate." },
                    { question: "Is the content SEO optimized?", answer: "Every article is optimized using SurferSEO or Clearscope to rank for target keywords." },
                    { question: "Do you handle the posting?", answer: "In Authority Builder and Content Engine packages, we upload and format directly in your CMS (WordPress, Webflow, Ghost)." },
                ]}
            />
        </>
    );
}
