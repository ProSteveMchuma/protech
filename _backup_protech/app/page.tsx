"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Zap, CheckCircle2, Star, Layout, Cpu, FileText, Printer, ChevronRight } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import React from "react";
import { BackgroundBeams } from "@/components/ui/background-beams"
import { SpotlightCard } from "@/components/ui/spotlight-card"
import { QuoteCalculator } from "@/components/interactive/QuoteCalculator"
import { FloatingChat } from "@/components/interactive/FloatingChat"
import { BookingModal } from "@/components/interactive/BookingModal"
import { PortfolioBento } from "@/components/ui/bento-grid"
import { ProcessWorkflow } from "@/components/ui/process-workflow"

const benefits = [
  "Increase Online Sales",
  "Win More Tenders",
  "Automate Repetitive Tasks",
  "Professional Brand Image",
]

const services = [
  {
    id: "web",
    link: "/services/web-design", // Added direct link
    icon: <Layout className="size-10 text-cyan-400" />,
    title: "Web & Graphic Design",
    description: "High-performance websites and stunning graphics. We build your digital face to look premium and convert visitors.",
  },
  {
    id: "automation",
    link: "/services/automation",
    icon: <Cpu className="size-10 text-amber-400" />,
    title: "Automation & AI",
    description: "Work smarter, not harder. We implement AI tools to automate your workflow and customer service.",
  },
  {
    id: "tender",
    link: "/services/tenders",
    icon: <FileText className="size-10 text-purple-400" />,
    title: "Bid & Tender Writing",
    description: "Get compliant, winning proposals written by experts. We help you secure government and private contracts.",
  },
  {
    id: "branding",
    link: "/services/branding",
    icon: <Printer className="size-10 text-emerald-400" />,
    title: "Branding & Printing",
    description: "From business cards to large banners. High-quality physical branding that leaves a lasting impression.",
  },
]

const testimonials = [
  {
    quote: "Their tender writing service is a game changer. We won our first major government contract thanks to their professional proposal.",
    author: "James Mwangi",
    role: "Director, BuildCon Kenya",
  },
  {
    quote: "Pro Innovation branded our entire fleet and office. The quality of printing is unmatched in Machakos.",
    author: "Sarah Kamau",
    role: "Marketing Mgr, FreshFarms",
  },
]

const faqs = [
  {
    question: "Do you help with tender compliance documents?",
    answer: "Yes, our tender writing service includes a full compliance check to ensure you meet all mandatory requirements (tax compliance, CR12, etc.) before submission.",
  },
  {
    question: "Can you automate my WhatsApp customer support?",
    answer: "Absolutely. We build AI-powered WhatsApp chatbots that can handle inquiries, bookings, and sales 24/7.",
  },
  {
    question: "What is your turnaround time for printing?",
    answer: "For most branding items like business cards and flyers, we offer same-day or next-day delivery within Machakos and Nairobi.",
  },
  {
    question: "Do you offer web hosting?",
    answer: "Yes, all our web design packages come with reliable, high-speed hosting and free SSL certificates.",
  },
]

export default function Home() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <div className="flex flex-col relative overflow-hidden">
      <FloatingChat />
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />

      {/* Hero Section - Apple Style Minimalist */}
      <section className="relative flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden bg-background">

        {/* Soft centered glow instead of beams */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left Content */}
            <div className="text-left space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-black/[0.02] px-4 py-1.5 text-sm font-semibold text-foreground/70 backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  The Future of Business Tech
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-6xl sm:text-7xl lg:text-8xl font-semibold tracking-tight text-foreground leading-[0.95]"
              >
                Scale with <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                  Precision.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="text-xl text-muted-foreground max-w-lg leading-relaxed font-medium"
              >
                We build digital ecosystems. From high-conversion websites to automated AI workflows.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-wrap gap-4"
              >
                <button
                  onClick={() => setIsBookingOpen(true)}
                  className="h-12 px-8 rounded-full bg-foreground text-background font-semibold hover:bg-foreground/90 transition-transform hover:scale-105 shadow-xl shadow-black/5"
                >
                  Start Project
                </button>
                <Link
                  href="/services"
                  className="h-12 px-8 rounded-full border border-black/10 bg-white/50 backdrop-blur-xl font-semibold text-foreground hover:bg-white/80 transition-all"
                >
                  View Ecosystem
                </Link>
              </motion.div>

              <div className="pt-4 flex flex-wrap gap-4 text-sm font-medium text-foreground/60">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-blue-500" /> <span>Trusted by 50+ Brands</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-blue-500" /> <span>Machakos Based</span>
                </div>
              </div>
            </div>

            {/* Right Visual - 3D Glass Dashboard */}
            <motion.div
              initial={{ opacity: 0, x: 50, rotateY: 10 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.2, type: "spring" }}
              className="relative perspective-1000"
            >
              <div className="relative z-10 animate-float">
                <Image
                  src="/hero/glass_dashboard.png"
                  alt="ProTech Dashboard"
                  width={1000}
                  height={1000}
                  className="w-full h-auto drop-shadow-2xl hover:scale-[1.02] transition-transform duration-700"
                  priority
                />
              </div>
              {/* Decorative Blobs */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-400/10 blur-[100px] rounded-full -z-10" />
            </motion.div>

          </div>
        </div>
      </section>

      {/* Services Preview Section (Apple Cards) */}
      <section className="py-32 relative z-10 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl mb-6">
              The Ecosystem
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
              Everything works together. Design, Data, and Automation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, i) => (
              <SpotlightCard key={i} className="bg-white border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-shadow duration-500 rounded-3xl overflow-hidden group">
                <Link href={(service as any).link || `/services`} className="block h-full p-8 flex flex-col">
                  <div className="mb-6 inline-flex p-3 rounded-2xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform duration-500">
                    {React.cloneElement(service.icon as React.ReactElement<any>, { className: "size-8" })}
                  </div>
                  <h3 className="mb-3 text-2xl font-semibold text-foreground tracking-tight">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed flex-grow font-medium">
                    {service.description}
                  </p>
                  <div className="mt-8 flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
                    Learn more <ArrowRight className="size-4 ml-2" />
                  </div>
                </Link>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* Process Workflow - How We Work */}
      <ProcessWorkflow />

      {/* Interactive Quote Calculator Section */}
      <section className="py-24 bg-muted/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] [mask-image:linear-gradient(to_bottom,transparent,black)] pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-black tracking-tight mb-6">Plan Your Budget with Ease</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Curious about costs? Use our interactive calculator to get a rough estimate for your next project. No hidden fees, just transparency.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                    <CheckCircle2 className="size-5" />
                  </div>
                  <span className="font-medium">Instant estimations</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <CheckCircle2 className="size-5" />
                  </div>
                  <span className="font-medium">Customize your package</span>
                </li>
              </ul>
            </div>
            <QuoteCalculator />
          </div>
        </div>
      </section>

      {/* Visual Showcase Section - Parallax/Glass */}
      {/* Visual Showcase / Portfolio Section (Bento Grid) */}
      <PortfolioBento />

      {/* Social Proof Section (Apple Style) */}
      <section className="py-32 bg-background border-t border-border/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          {/* Trusted By Logos (Monochromatic) */}
          <div className="mb-24 text-center">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-8">Trusted by leading companies</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              {/* Placeholders for logos - mimicking clean typographic logos */}
              <div className="flex items-center justify-center font-bold text-xl text-foreground/80">Nairobi Ventures</div>
              <div className="flex items-center justify-center font-bold text-xl text-foreground/80">BuildCon</div>
              <div className="flex items-center justify-center font-bold text-xl text-foreground/80">AgriTech KE</div>
              <div className="flex items-center justify-center font-bold text-xl text-foreground/80">Safari Logistics</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Clean Image Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-video lg:aspect-square h-full min-h-[400px] bg-muted">
                <Image
                  src="/client-meeting.png"
                  alt="Meeting with clients"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl mb-8">
                Results that speak.
              </h2>
              <div className="space-y-8">
                {testimonials.map((t, i) => (
                  <div key={i} className="bg-background p-0">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="size-4 text-foreground/80 fill-foreground/80" />
                      ))}
                    </div>
                    <p className="text-xl text-foreground font-medium mb-4 leading-relaxed tracking-tight">"{t.quote}"</p>
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-full bg-muted flex items-center justify-center font-bold text-foreground text-sm">
                        {t.author[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">{t.author}</p>
                        <p className="text-sm text-muted-foreground">{t.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* FAQ / Objection Handling */}
      <section className="py-32 bg-background">
        <div className="container max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Common Questions
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Everything you need to know before starting your project.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="bg-muted/30 px-6 rounded-xl border border-border/50">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 pt-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative isolate overflow-hidden bg-foreground px-6 py-24 shadow-2xl skew-y-0 rounded-[3rem] sm:px-24 xl:py-32 text-center">

            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>

            <h2 className="relative mx-auto max-w-2xl text-4xl font-black tracking-tight text-background sm:text-5xl">
              Ready to Win?
            </h2>
            <p className="relative mx-auto mt-6 max-w-xl text-lg leading-8 text-background/80">
              Whether you need a new website, a winning tender, or automated workflows, we are ready to deliver.
            </p>
            <div className="relative mt-12 flex flex-col sm:flex-row justify-center gap-6">
              <button
                onClick={() => setIsBookingOpen(true)}
                className="rounded-full bg-primary px-10 py-5 text-lg font-bold text-primary-foreground shadow-2xl hover:bg-white hover:text-black transition-all hover:scale-105"
              >
                Get Started Now
              </button>
            </div>

            <div className="absolute -top-24 right-0 -z-10 transform-gpu blur-3xl" aria-hidden="true">
              <div
                className="aspect-[1404/767] w-[87.75rem] bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-25"
                style={{
                  clipPath:
                    'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
