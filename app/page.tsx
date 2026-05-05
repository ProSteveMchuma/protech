"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Users,
  Zap,
  Briefcase,
  Star,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { StatsBand } from "@/components/StatsBand";
import { Testimonials } from "@/components/Testimonials";
import { TrustBar } from "@/components/TrustBar";
import { FloatingKpiCards } from "@/components/FloatingKpiCards";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Section } from "@/components/ui/Section";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";
import { FaqSection } from "@/components/FaqSection";

const services = [
  {
    title: "Virtual Assistants",
    description: "Email, scheduling, admin, customer support — handled by a vetted pro.",
    price: "From KES 25,000/mo",
    features: ["Up to 40 hrs/week", "Dedicated VA", "Account manager"],
    link: "/services/va",
    icon: <Users className="size-6 text-brand-600" />,
    accent: "bg-brand-50",
  },
  {
    title: "Social Media",
    description: "Strategy, content, daily engagement, growth — done for you.",
    price: "From KES 35,000/mo",
    features: ["Posts + reels", "Community mgmt", "Monthly reports"],
    link: "/services/social",
    icon: <Zap className="size-6 text-amber-500" />,
    accent: "bg-amber-50",
  },
  {
    title: "Content & SEO",
    description: "Articles that rank on Google and copy that converts cold traffic.",
    price: "From KES 20,000/mo",
    features: ["SEO optimized", "Human writers", "Topic clusters"],
    link: "/services/content",
    icon: <Briefcase className="size-6 text-success-500" />,
    accent: "bg-emerald-50",
  },
];

const whyPoints = [
  {
    icon: <Wallet className="size-5 text-success-500" />,
    title: "Pay 67% less than hiring locally",
    desc: "A full-time VA in Nairobi costs you ~KES 120k once you add NSSF, NHIF, leave, training and admin. Ours starts at KES 25k flat.",
  },
  {
    icon: <ShieldCheck className="size-5 text-brand-500" />,
    title: "Vetted, not freelance roulette",
    desc: "Every pro passes our 4-stage screen — written, video, paid trial, reference check. No bidding wars, no surprises.",
  },
  {
    icon: <TrendingUp className="size-5 text-accent-500" />,
    title: "Replace, don't fire",
    desc: "If a match doesn't click in week 1 we swap them at no charge. You stay productive, we handle the people side.",
  },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative bg-aurora overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32 lg:pb-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger(0, 0.1)}
              className="text-center lg:text-left"
            >
              <motion.div variants={fadeUp} className="mb-6 inline-flex">
                <Badge tone="brand" pulse>
                  Vetted Kenyan Talent · Onboarded in 24h
                </Badge>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-brand-950 leading-[1.05] mb-6 text-balance"
              >
                Stop hiring. <br />
                Start <span className="text-gradient">scaling.</span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-lg md:text-xl text-slate-600 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed text-pretty"
              >
                Pro Remote Tasks gives you a managed virtual assistant, social media manager,
                or content writer — vetted, ready to start, and billed at one flat monthly rate.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <ButtonLink href="#services" variant="primary" size="xl">
                  See packages <ArrowRight className="size-5" />
                </ButtonLink>
                <ButtonLink href="/hire" variant="secondary" size="xl">
                  Book a free call
                </ButtonLink>
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="mt-10 flex flex-wrap gap-x-6 gap-y-3 justify-center lg:justify-start text-sm font-medium text-slate-600"
              >
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="size-4 text-success-500" /> 100% vetted talent
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-success-500" /> Money-back week 1
                </span>
                <span className="inline-flex items-center gap-2">
                  <Star className="size-4 text-amber-500 fill-amber-500" /> 4.9/5 client rating
                </span>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <FloatingKpiCards />
            </motion.div>
          </div>
        </div>
      </section>

      <TrustBar />
      <StatsBand />

      {/* SERVICES */}
      <Section id="services" tone="light" spacing="lg" size="wide">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={stagger()}
          className="text-center mb-16"
        >
          <motion.div variants={fadeUp} className="mb-4 inline-flex">
            <Badge tone="brand">Productized services</Badge>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="font-display text-4xl md:text-5xl font-bold text-slate-900 mb-4 text-balance"
          >
            One flat fee. Zero negotiation.
          </motion.h2>
          <motion.p variants={fadeUp} className="text-slate-600 max-w-2xl mx-auto text-lg">
            Pick a package, pay via M-Pesa, and your new team member starts within 48 hours.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={stagger(0, 0.1)}
          className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto"
        >
          {services.map((service, i) => (
            <motion.div key={i} variants={fadeUp}>
              <Link
                href={service.link}
                className="group block h-full p-8 rounded-3xl bg-white border border-slate-200/70 premium-shadow-hover transition-all"
              >
                <div className={`w-14 h-14 rounded-2xl ${service.accent} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                  {service.icon}
                </div>
                <h3 className="font-display text-2xl font-bold text-slate-900 mb-2">{service.title}</h3>
                <p className="text-slate-600 mb-5 min-h-[3rem]">{service.description}</p>
                <div className="text-base font-bold text-brand-600 font-mono mb-5">{service.price}</div>
                <ul className="space-y-2.5 mb-7">
                  {service.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 className="size-4 text-success-500" /> {feature}
                    </li>
                  ))}
                </ul>
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 group-hover:gap-3 transition-all">
                  See details <ArrowRight className="size-4" />
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* WHY */}
      <Section tone="soft" spacing="lg">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={stagger()}
          >
            <motion.div variants={fadeUp} className="mb-4 inline-flex">
              <Badge tone="success">Why Pro Remote Tasks</Badge>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="font-display text-4xl md:text-5xl font-bold text-slate-900 mb-6 text-balance"
            >
              The economics just work.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-600 mb-10 text-lg">
              You get senior-level Kenyan talent at a fraction of the cost of hiring locally — without payroll, NSSF, NHIF, or HR headaches.
            </motion.p>

            <motion.div variants={stagger(0, 0.08)} className="space-y-5">
              {whyPoints.map((p, i) => (
                <motion.div key={i} variants={fadeUp} className="flex gap-4">
                  <div className="size-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
                    {p.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">{p.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{p.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Cost-comparison visual */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-3xl p-8 md:p-10 premium-shadow border border-slate-200"
          >
            <div className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">
              Monthly cost comparison
            </div>
            <div className="font-display text-2xl font-bold text-slate-900 mb-8">
              Hire locally vs. <span className="text-gradient">Pro Remote Tasks</span>
            </div>

            <div className="space-y-6">
              <CostBar
                label="In-house junior VA, Nairobi"
                amount="KES 120,000"
                width="100%"
                tone="local"
                breakdown={[
                  { k: "Salary", v: "75,000" },
                  { k: "NSSF + NHIF + leave", v: "18,000" },
                  { k: "Training + onboarding", v: "12,000" },
                  { k: "Office + admin", v: "15,000" },
                ]}
              />
              <CostBar
                label="Pro Remote Tasks — Growth VA"
                amount="KES 40,000"
                width="33%"
                tone="prt"
                breakdown={[
                  { k: "All-in monthly fee", v: "40,000" },
                  { k: "Replacement guarantee", v: "Free" },
                  { k: "Account management", v: "Included" },
                ]}
              />
            </div>
            <div className="mt-8 pt-6 border-t border-slate-200 flex items-baseline gap-3">
              <span className="font-display text-3xl font-bold text-success-500">67%</span>
              <span className="text-sm text-slate-600">saved every month, every year.</span>
            </div>
          </motion.div>
        </div>
      </Section>

      <Testimonials />

      {/* HOW IT WORKS */}
      <Section tone="light" spacing="lg" size="wide">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={stagger()}
          className="text-center mb-16"
        >
          <motion.div variants={fadeUp} className="mb-4 inline-flex">
            <Badge tone="accent">How it works</Badge>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="font-display text-4xl md:text-5xl font-bold text-slate-900 mb-4 text-balance"
          >
            Four simple steps. One flat invoice.
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={stagger(0, 0.1)}
          className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto"
        >
          {[
            { step: "01", title: "Pick a package", desc: "Three tiers per service. Choose what fits your needs today." },
            { step: "02", title: "Free intake call", desc: "30 minutes to map your workflow, tools, and quick wins." },
            { step: "03", title: "We match talent", desc: "Within 24h we introduce a vetted pro from our managed pool." },
            { step: "04", title: "Start scaling", desc: "Onboarding, training, and management handled. You give the work." },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="relative p-7 rounded-3xl bg-white border border-slate-200/70 premium-shadow-hover"
            >
              <div className="font-mono text-xs font-bold text-accent-500 mb-3">{item.step}</div>
              <h3 className="font-display text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* FAQ */}
      <FaqSection
        items={[
          { question: "How are your pros vetted?", answer: "Four stages: written assessment, recorded video, paid trial week, and reference checks. We accept under 3% of applicants." },
          { question: "Do I sign a long contract?", answer: "No. All packages are month-to-month. Cancel anytime with 15 days notice." },
          { question: "How do I pay?", answer: `Lipa Na M-Pesa Paybill 767363, account number = your full name. After paying, drop the M-Pesa code on /checkout. We verify and onboard within 4 business hours.` },
          { question: "What if my pro isn't a fit?", answer: "Tell us within week 1 — we replace them for free, no questions asked." },
          { question: "Are your prices in KES?", answer: "Yes. Quoted in Kenyan Shillings, paid via M-Pesa or bank transfer. Foreign clients can pay via wire." },
        ]}
      />

      {/* FINAL CTA */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="relative rounded-[2rem] overflow-hidden conic-border z-0">
            <div className="relative bg-gradient-to-br from-brand-950 via-brand-900 to-slate-950 rounded-[calc(2rem-2px)] p-12 md:p-16 text-center text-white bg-grid">
              <Badge tone="dark" className="mb-6">Get started today</Badge>
              <h2 className="font-display text-4xl md:text-6xl font-bold mb-5 text-balance">
                Ready to <span className="text-gradient">reclaim your time?</span>
              </h2>
              <p className="text-slate-300 max-w-xl mx-auto mb-10 text-lg">
                Tell us what you need. We'll match you with a vetted Kenyan pro within 24 hours. Risk-free in week 1.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <ButtonLink href="/hire" variant="primary" size="xl">
                  Get a free proposal <ArrowRight className="size-5" />
                </ButtonLink>
                <ButtonLink href="/checkout?pkg=va-growth" variant="outline" size="xl">
                  Pay & onboard now
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function CostBar({
  label,
  amount,
  width,
  tone,
  breakdown,
}: {
  label: string;
  amount: string;
  width: string;
  tone: "local" | "prt";
  breakdown: { k: string; v: string }[];
}) {
  const barColor =
    tone === "local"
      ? "from-slate-300 to-slate-400"
      : "from-success-500 to-accent-500";
  return (
    <div>
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-sm font-semibold text-slate-700">{label}</span>
        <span className="font-mono font-bold text-slate-900">{amount}</span>
      </div>
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className={`h-full bg-gradient-to-r ${barColor} rounded-full`}
        />
      </div>
      <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-500">
        {breakdown.map((b) => (
          <div key={b.k} className="flex justify-between">
            <span>{b.k}</span>
            <span className="font-mono">{b.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
