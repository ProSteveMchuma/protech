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
import { BackgroundBeams } from "@/components/ui/background-beams"
import { SpotlightCard } from "@/components/ui/spotlight-card"
import { QuoteCalculator } from "@/components/interactive/QuoteCalculator"
import { FloatingChat } from "@/components/interactive/FloatingChat"
import { BookingModal } from "@/components/interactive/BookingModal"
import { CaseStudies } from "@/components/ui/case-studies"

const benefits = [
  "Increase Online Sales",
  "Win More Tenders",
  "Automate Repetitive Tasks",
  "Professional Brand Image",
]

const services = [
  {
    id: "web",
    icon: <Layout className="size-10 text-cyan-400" />,
    title: "Web & Graphic Design",
    description: "High-performance websites and stunning graphics. We build your digital face to look premium and convert visitors.",
  },
  {
    id: "automation",
    icon: <Cpu className="size-10 text-amber-400" />,
    title: "Automation & AI",
    description: "Work smarter, not harder. We implement AI tools to automate your workflow and customer service.",
  },
  {
    id: "tender",
    icon: <FileText className="size-10 text-purple-400" />,
    title: "Bid & Tender Writing",
    description: "Get compliant, winning proposals written by experts. We help you secure government and private contracts.",
  },
  {
    id: "branding",
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

      {/* Hero Section - Immersive & Dynamic */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background pt-20">
        <BackgroundBeams /> {/* Dynamic Background */}

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-6 py-2 text-sm font-medium text-primary backdrop-blur-md animate-pulse">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Leading Tech Agency in Kenya
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl font-black tracking-tighter text-foreground sm:text-7xl lg:text-8xl leading-[1.1]"
            >
              Scale Your Business With <span className="text-gradient">Smart Tech</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-xl text-muted-foreground max-w-2xl leading-relaxed"
            >
              The all-in-one partner for Kenyan businesses. We deliver high-impact <span className="text-foreground font-semibold">Web Design</span>, <span className="text-foreground font-semibold">Tender Writing</span>, <span className="text-foreground font-semibold">Automation</span>, and <span className="text-foreground font-semibold">Branding</span>.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-6 w-full justify-center"
            >
              <button
                onClick={() => setIsBookingOpen(true)}
                className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-primary px-8 font-bold text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-primary/90 hover:shadow-primary/40 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <span className="mr-2">Book Free Consultation</span>
                <ArrowRight className="transition-transform group-hover:translate-x-1" />
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite]" />
              </button>
              <Link
                href="/services"
                className="group inline-flex h-14 items-center justify-center rounded-full border border-border bg-background/50 backdrop-blur-sm px-8 font-bold text-foreground transition-all hover:bg-accent/50 hover:border-primary/50"
              >
                View Services
              </Link>
            </motion.div>

            <div className="pt-8 flex flex-wrap justify-center gap-6 text-sm text-foreground/60">
              {benefits.map((benefit, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-2 bg-card/30 border border-white/5 rounded-full px-4 py-2 backdrop-blur-sm"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + (i * 0.1) }}
                >
                  <CheckCircle2 className="size-4 text-secondary" />
                  <span>{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Abstract Background Elements */}
        {/* <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2 animate-float pointer-events-none" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] translate-x-1/3 animate-float pointer-events-none" style={{ animationDelay: '2s' }} /> */}

      </section>

      {/* Services Preview Section (Spotlight Cards) */}
      <section className="py-32 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl mb-6">
              Success on All Fronts
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We cover the digital, the physical, and the strategic.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, i) => (
              <SpotlightCard key={i} className="bg-card/50 backdrop-blur-sm border-white/5 group hover:border-primary/20 transition-colors">
                <Link href={`/services`} className="block h-full"> {/* TODO: Add anchors to services page for better deep linking */}
                  <div className="p-8 h-full flex flex-col relative z-20">
                    <div className="mb-6 inline-flex rounded-xl bg-background/50 p-4 ring-1 ring-inset ring-white/10 shadow-inner group-hover:scale-110 transition-transform duration-500">
                      {service.icon}
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-foreground">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed flex-grow">
                      {service.description}
                    </p>
                    <div className="mt-6 pt-6 border-t border-white/5 flex items-center text-primary font-semibold text-sm group-hover:text-primary/80 transition-colors cursor-pointer">
                      Learn more <ChevronRight className="size-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

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
      {/* Visual Showcase / Portfolio Section */}
      <CaseStudies />

      {/* Social Proof Section */}
      <section className="py-32 overflow-hidden bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary rounded-3xl blur-2xl opacity-20 transform -rotate-3" />
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-video lg:aspect-square h-full min-h-[400px] border border-white/10">
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
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-8">
                Trusted by Kenyan Businesses
              </h2>
              <div className="space-y-6">
                {testimonials.map((t, i) => (
                  <div key={i} className="glass-card p-8 rounded-2xl">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="size-4 text-amber-500 fill-amber-500" />
                      ))}
                    </div>
                    <p className="text-lg text-foreground italic mb-6 leading-relaxed">"{t.quote}"</p>
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-full bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center font-bold text-white shadow-lg">
                        {t.author[0]}
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{t.author}</p>
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
