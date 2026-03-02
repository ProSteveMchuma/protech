import { PricingTable } from "@/components/PricingTable";
import { FaqSection } from "@/components/FaqSection";
import { Search, PenTool } from "lucide-react";

export const metadata = {
    title: "SEO Content Writing Services Kenya | RemotePro",
    description: "Data-driven SEO articles and content strategies that rank on Google and convert visitors into customers.",
};

const tiers = [
    {
        name: "SEO Blog Pack",
        price: "KES 20,000/mo",
        description: "Drive consistent organic traffic.",
        features: [
            "4 SEO Articles (1000 words)",
            "Keyword Research",
            "Meta Descriptions",
            "Internal Linking",
            "SurferSEO Optimization"
        ]
    },
    {
        name: "Authority Builder",
        price: "KES 45,000/mo",
        description: "Establish industry leadership.",
        features: [
            "8 SEO Articles (1500 words)",
            "2 Industry Case Studies",
            "Keyword Research & Strategy",
            "Topic Cluster Planning",
            "CMS Upload & Formatting"
        ],
        recommended: true
    },
    {
        name: "Content Engine",
        price: "KES 90,000/mo",
        description: "Dominate your niche completely.",
        features: [
            "12 SEO Articles",
            "4 Newsletter Issues",
            "Whitepaper / E-book",
            "Competitor Content Gap Analysis",
            "Quarterly Content Audit"
        ]
    }
];

export default function ContentServicePage() {
    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* Hero */}
            <section className="bg-slate-900 text-white py-20 lg:py-32">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold uppercase tracking-wide mb-6">
                        <Search className="size-4" /> Rank #1 on Google
                    </div>
                    <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6">
                        Content that Ranks. <br />
                        <span className="text-emerald-500">Copy that Sells.</span>
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
                        Stop guessing what to write. We create data-driven content strategies that bring ready-to-buy customers to your website.
                    </p>
                </div>
            </section>

            {/* Value Prop */}
            <section className="py-20 container mx-auto px-4">
                <div className="max-w-4xl mx-auto mb-20 bg-white rounded-3xl p-8 lg:p-12 shadow-xl border border-slate-100">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="bg-emerald-100 p-6 rounded-full">
                            <PenTool className="size-10 text-emerald-600" />
                        </div>
                        <div>
                            <h2 className="font-serif text-2xl font-bold text-slate-900 mb-4">
                                Why "Cheap" Content Costs You Money
                            </h2>
                            <p className="text-slate-600 mb-4">
                                AI-generated spam and low-quality articles hurt your brand and can get you penalized by Google.
                            </p>
                            <p className="text-slate-600">
                                Our writers are <strong>human experts</strong>. We research, interview, and write deep, valuable content that positions you as the authority in your field.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Pricing */}
                <div className="text-center mb-12">
                    <h2 className="font-serif text-3xl font-bold text-slate-900 mb-4">Content Packages</h2>
                    <p className="text-slate-600">Consistent publishing = Compound growth.</p>
                </div>
                <PricingTable tiers={tiers} serviceName="content" />

                <FaqSection
                    items={[
                        { question: "Are your writers experts?", answer: "Yes, we assign writers with industry-specific knowledge to ensure your content is authoritative and valuable." },
                        { question: "Is the content SEO optimized?", answer: "Every article is optimized using tools like SurferSEO or Clearscope to ensure it ranks for target keywords." },
                        { question: "Do you handle the posting?", answer: "In our Growth and Engine packages, we can upload and format the content directly in your CMS (WordPress, Webflow, etc.)." },
                    ]}
                />
            </section>
        </div>
    );
}
