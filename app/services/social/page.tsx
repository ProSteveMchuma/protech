import { PricingTable } from "@/components/PricingTable";
import { FaqSection } from "@/components/FaqSection";
import { CheckCircle2, TrendingUp } from "lucide-react";

export const metadata = {
    title: "Social Media Management Packages Kenya | RemotePro",
    description: "Grow your online presence with professional social media management. We handle strategy, content, and engagement.",
};

export const tiers = [
    {
        name: "Starter Social",
        price: "KES 35,000/mo",
        description: "Consistent presence for small businesses.",
        features: [
            "2 Platforms (IG, FB)",
            "12 Posts / Month",
            "Basic Graphic Design",
            "Caption Copywriting",
            "Monthly Performance Report"
        ]
    },
    {
        name: "Growth Social",
        price: "KES 60,000/mo",
        description: "Aggressive growth strategy for ambitious brands.",
        features: [
            "3 Platforms (IG, FB, LinkedIn/TikTok)",
            "20 Posts / Month",
            "4 Reels / Month",
            "Community Management (Reply to comments)",
            "Hashtag Strategy",
            "Bi-Weekly Strategy Calls"
        ],
        recommended: true
    },
    {
        name: "Viral Authority",
        price: "KES 120,000/mo",
        description: "Full-scale content production and management.",
        features: [
            "4 Platforms",
            "Daily Posting (30/mo)",
            "8 Reels / Month",
            "Script & Video Editing",
            "Influencer Outreach",
            "24/7 Community Management"
        ]
    }
];

export default function SocialServicePage() {
    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* Hero */}
            <section className="bg-slate-900 text-white py-20 lg:py-32">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold uppercase tracking-wide mb-6">
                        <TrendingUp className="size-4" /> Grow Your Audience
                    </div>
                    <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6">
                        Turn Followers into <br />
                        <span className="text-amber-500">Paying Customers.</span>
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
                        Social media is a full-time job. Let our expert social media managers handle the strategy, content, and engagement while you run your business.
                    </p>
                </div>
            </section>

            {/* Value Prop */}
            <section className="py-20 container mx-auto px-4">
                <div className="max-w-4xl mx-auto mb-20">
                    <h2 className="font-serif text-3xl font-bold text-slate-900 mb-8 text-center">
                        More Than Just "Posting"
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: "Strategy First", desc: "We analyze your competitors and target audience before creating a single post." },
                            { title: "Engagement", desc: "We don't just post and ghost. We reply to comments and DMs to build community." },
                            { title: "Data Driven", desc: "Monthly reports show you exactly what's working and how much you're growing." },
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                <CheckCircle2 className="size-8 text-amber-500 mb-4" />
                                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                                <p className="text-slate-600 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pricing */}
                <div className="text-center mb-12">
                    <h2 className="font-serif text-3xl font-bold text-slate-900 mb-4">Transparent Monthly Packages</h2>
                    <p className="text-slate-600">Cancel anytime. No long-term engagement contracts.</p>
                </div>
                <PricingTable tiers={tiers} serviceName="social" />

                <FaqSection
                    items={[
                        { question: "Do you create the content or do I?", answer: "Our team handles everything from content ideas to graphic design and scheduling. You just need to approve the calendar." },
                        { question: "Which platforms do you manage?", answer: "We specialize in Instagram, Facebook, LinkedIn, TikTok, and Twitter (X)." },
                        { question: "How do you track success?", answer: "We provide monthly reports tracking reach, engagement, follower growth, and click-through rates." },
                    ]}
                />
            </section>
        </div>
    );
}
