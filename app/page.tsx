"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle2, ArrowRight, ShieldCheck, Users, Zap, Briefcase } from "lucide-react";

const services = [
  {
    title: "Virtual Assistants",
    description: "Email management, scheduling, and admin tasks handled by pros.",
    price: "From KES 25,000/mo",
    features: ["40 Hours/Month", "Dedicated VA", "Weekly Reports"],
    link: "/services/va",
    icon: <Users className="size-6 text-blue-500" />,
  },
  {
    title: "Social Media Mgmt",
    description: "Consistent posting, community engagement, and growth strategy.",
    price: "From KES 35,000/mo",
    features: ["12 Posts/Month", "Content Calendar", "Engagement"],
    link: "/services/social",
    icon: <Zap className="size-6 text-amber-500" />,
  },
  {
    title: "Content & SEO",
    description: "High-quality articles and blogs that rank on Google.",
    price: "From KES 5,000/article",
    features: ["SEO Optimized", "1500+ Words", "Plagiarism Free"],
    link: "/services/content",
    icon: <Briefcase className="size-6 text-emerald-500" />,
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <main className="flex-grow">
        <section className="relative py-20 lg:py-32 bg-slate-50 overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wide mb-6">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  Vetted Kenyan Talent
                </div>
                <h1 className="font-serif text-5xl md:text-7xl font-bold text-slate-900 leading-tight mb-8">
                  Stop Hiring. <br />
                  Start <span className="text-blue-600">Scaling.</span>
                </h1>
                <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
                  RemotePro connects you with top-tier, managed virtual assistants and digital experts in Kenya. We handle the vetting, you get the results.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="h-14 px-8 rounded-full bg-blue-600 text-white font-semibold text-lg shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all hover:-translate-y-1">
                    View Service Packages
                  </button>
                  <button className="h-14 px-8 rounded-full bg-white border border-slate-200 text-slate-700 font-semibold text-lg hover:bg-slate-50 transition-all">
                    Book a Consultation
                  </button>
                </div>
              </motion.div>

              <div className="mt-16 pt-8 border-t border-slate-200 flex flex-wrap justify-center gap-8 text-sm font-medium text-slate-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-5 text-emerald-500" /> 100% Vetted Talent
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-5 text-emerald-500" /> Money-Back Guarantee
                </div>
                <div className="flex items-center gap-2">
                  <Users className="size-5 text-emerald-500" /> Dedicated Account Manager
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section id="services" className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Productized Services. Simple Pricing.
              </h2>
              <p className="text-slate-600 max-w-xl mx-auto">
                No hourly negotiations. Choose a package that fits your needs and start in 24 hours.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {services.map((service, i) => (
                <div key={i} className="group p-8 rounded-3xl bg-white border border-slate-100 premium-shadow-hover transition-all duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {service.icon}
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-slate-900 mb-2">{service.title}</h3>
                  <p className="text-slate-600 mb-6 min-h-[3rem]">{service.description}</p>
                  <div className="text-lg font-semibold text-blue-600 mb-6">{service.price}</div>

                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-3 text-sm text-slate-700">
                        <CheckCircle2 className="size-4 text-emerald-500" /> {feature}
                      </li>
                    ))}
                  </ul>

                  <Link href={service.link} className="flex items-center justify-center w-full py-4 rounded-xl bg-slate-900 text-white font-semibold hover:bg-blue-600 transition-colors group-hover:shadow-lg">
                    See Details <ArrowRight className="ml-2 size-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                How It Works
              </h2>
              <p className="text-slate-600 max-w-xl mx-auto">
                Getting started is simple. We handle the complexity of talent management.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {[
                { step: "01", title: "Choose a Package", desc: "Select the service package that fits your current needs." },
                { step: "02", title: "Free Consultation", desc: "We meet to understand your specific workflow and requirements." },
                { step: "03", title: "Talent Matching", desc: "We match you with a vetted pro from our managed talent pool." },
                { step: "04", title: "Start Scaling", desc: "Your new team member starts within 24-48 hours." },
              ].map((item, i) => (
                <div key={i} className="relative p-8 rounded-3xl bg-white border border-slate-100 premium-shadow transition-all hover:-translate-y-1">
                  <div className="text-4xl font-serif font-black text-blue-600/10 absolute top-4 right-6 uppercase">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4 pr-10">{item.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
