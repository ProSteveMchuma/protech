"use client"

import { motion } from "framer-motion"
import { PenTool, Printer, FileText, Cpu, Layout, CheckCircle2 } from "lucide-react"
import { BackgroundBeams } from "@/components/ui/background-beams"
import { SpotlightCard } from "@/components/ui/spotlight-card"

const services = [
    {
        icon: <Layout className="size-12 text-cyan-400" />,
        title: "Web & Graphic Design",
        description: "A complete digital identity solution. We blend high-performance web development with stunning graphic design.",
        features: ["Custom Websites (Next.js/React)", "Logo & Brand Identity", "UI/UX Design", "Social Media Graphics"]
    },
    {
        icon: <Cpu className="size-12 text-amber-400" />,
        title: "Automation & AI Solutions",
        description: "Future-proof your business. We implement AI-driven tools and automation workflows to reduce manual tasks.",
        features: ["AI Chatbots & Assistants", "Workflow Automation", "Smart CRM Integrations", "Data Analysis"]
    },
    {
        icon: <FileText className="size-12 text-purple-400" />,
        title: "Bid & Tender Writing",
        description: "Win more contracts with expert help. Our professional tender writers ensure your proposals are compliant and persuasive.",
        features: ["Technical Proposal Writing", "Compliance Checking", "Bid Management", "Grant Writing"]
    },
    {
        icon: <Printer className="size-12 text-emerald-400" />,
        title: "Branding & Printing",
        description: "Tangible quality you can feel. We provide high-quality printing services for all your business needs.",
        features: ["Large Format Printing", "Merchandise (T-shirts, Mugs)", "Business Cards & Stationery", "Signage"]
    },
]

export default function ServicesPage() {
    return (
        <div className="flex flex-col min-h-screen relative overflow-hidden bg-background">
            <section className="relative py-32 px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center min-h-[50vh]">
                <BackgroundBeams />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10"
                >
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6 border border-primary/20 backdrop-blur-md">
                        <span>Machakos &bull; Nairobi &bull; Nationwide</span>
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter text-foreground sm:text-7xl mb-6">
                        Our Core <span className="text-gradient">Services</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        We provide the 4 essential pillars for modern business success in Kenya.
                    </p>
                </motion.div>
            </section>

            <section className="py-24 px-4 sm:px-6 lg:px-8 container mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {services.map((service, i) => (
                        <SpotlightCard key={i} className="bg-card/40 backdrop-blur-md border-white/5">
                            <div className="p-8 h-full flex flex-col">
                                <div className="flex items-start justify-between mb-8">
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 shadow-inner">
                                        {service.icon}
                                    </div>
                                    <span className="text-6xl font-black text-white/5 select-none">0{i + 1}</span>
                                </div>

                                <h3 className="text-3xl font-bold text-foreground mb-4">{service.title}</h3>
                                <p className="text-muted-foreground leading-relaxed mb-8 flex-grow">
                                    {service.description}
                                </p>

                                <ul className="mt-auto space-y-3">
                                    {service.features.map((feature, j) => (
                                        <li key={j} className="flex items-center gap-3 text-sm font-medium text-foreground/80">
                                            <CheckCircle2 className="size-5 text-primary/50" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </SpotlightCard>
                    ))}
                </div>
            </section>
        </div>
    )
}
