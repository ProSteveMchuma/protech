import { PricingTable } from "@/components/PricingTable";
import { FaqSection } from "@/components/FaqSection";
import { CheckCircle2, Star } from "lucide-react";
import Image from "next/image";

export const metadata = {
    title: "Hire a Managed Virtual Assistant in Kenya | RemotePro",
    description: "Scale your business with an expert VA. We handle admin, inbox management, and scheduling so you don't have to.",
};

const tiers = [
    {
        name: "Starter VA",
        price: "KES 25,000/mo",
        description: "Perfect for solopreneurs needing basic admin support.",
        features: [
            "10 Hours/Week",
            "Email Management",
            "Calendar Scheduling",
            "Basic Data Entry",
            "Weekly Reports"
        ]
    },
    {
        name: "Growth VA",
        price: "KES 40,000/mo",
        description: "Comprehensive support for growing businesses.",
        features: [
            "20 Hours/Week",
            "Email & Calendar",
            "Social Media Scheduling",
            "Customer Support (Email)",
            "Travel Planning",
            "Dedicated Account Manager"
        ],
        recommended: true
    },
    {
        name: "Executive VA",
        price: "KES 75,000/mo",
        description: "Full-time assistance for busy executives.",
        features: [
            "40 Hours/Week",
            "Full Inbox Management",
            "Project Management",
            "Lifestyle Management",
            "Research & Reports",
            "Priority Support 24/7"
        ]
    }
];

export default function VAServicePage() {
    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* Hero */}
            <section className="bg-slate-900 text-white py-20 lg:py-32">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6">
                        Reclaim Your Time with a <br />
                        <span className="text-blue-500">Dedicated Virtual Assistant.</span>
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
                        Stop drowning in admin tasks. Our vetted Kenyan VAs handle the busy work so you can focus on growing your business.
                    </p>
                    <div className="flex justify-center gap-2 mb-8">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="size-5 text-amber-500 fill-amber-500" />
                        ))}
                        <span className="ml-2 text-slate-300 font-medium">Trusted by 50+ Executives</span>
                    </div>
                </div>
            </section>

            {/* What We Do */}
            <section className="py-20 container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
                    <div>
                        <h2 className="font-serif text-3xl font-bold text-slate-900 mb-6">Delegate to Accelerate.</h2>
                        <ul className="space-y-4">
                            {[
                                "Inbox Zero Management",
                                "Complex Calendar Scheduling",
                                "Travel & Logistics Booking",
                                "CRM Management & Data Entry",
                                "Personal Lifestyle Tasks"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-lg text-slate-700">
                                    <CheckCircle2 className="size-6 text-blue-600" /> {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-slate-200 rounded-3xl h-[400px] w-full flex items-center justify-center text-slate-400">
                        {/* Placeholder for VA image */}
                        [Image: Professional VA working]
                    </div>
                </div>

                {/* Pricing */}
                <div className="text-center mb-12">
                    <h2 className="font-serif text-3xl font-bold text-slate-900 mb-4">Simple, Monthly Pricing</h2>
                    <p className="text-slate-600">No hidden fees. Cancel anytime.</p>
                </div>
                <PricingTable tiers={tiers} serviceName="va" />

                <FaqSection
                    items={[
                        { question: "How quickly can I start?", answer: "We can typically match you with a VA and have them start within 24-48 hours of your intake call." },
                        { question: "Are your VAs based in Kenya?", answer: "Yes, all our talent is based in Kenya. This allows for excellent communication and competitive pricing." },
                        { question: "Can I upgrade my plan later?", answer: "Absolutely. You can scale your hours up or down at any time with a 15-day notice." },
                        { question: "What if I'm not happy with my VA?", answer: "We offer a 100% satisfaction guarantee. If the match isn't perfect, we'll find you a replacement immediately at no extra cost." },
                    ]}
                />
            </section>
        </div>
    );
}
