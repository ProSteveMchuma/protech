"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Search, PenTool, Code2, Rocket } from "lucide-react";

const steps = [
    {
        title: "Audit & Discovery",
        description: "We deep-dive into your business model to find gaps and opportunities.",
        icon: <Search />,
        stats: "Found 15+ Leaks",
    },
    {
        title: "Strategy & Design",
        description: "We architect a custom solution (Web, Mobile, or Brand) that fits your goals.",
        icon: <PenTool />,
        stats: "Blueprint Ready",
    },
    {
        title: "Development",
        description: "Our engineers build with clean code, focusing on speed and scalability.",
        icon: <Code2 />,
        stats: "99.9% Uptime",
    },
    {
        title: "Launch & Scale",
        description: "We deploy, monitor, and iterate to ensure you dominate the market.",
        icon: <Rocket />,
        stats: "3x Growth",
    },
];

export function ProcessWorkflow() {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end end"],
    });

    const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    return (
        <section ref={ref} className="py-32 bg-background relative overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl mb-6">
                        The Growth Engine.
                    </h2>
                    <p className="text-xl text-muted-foreground font-medium">
                        A proved 4-step framework to turn your digital presence into a revenue machine.
                    </p>
                </div>

                <div className="relative max-w-4xl mx-auto">
                    {/* Central Line - Base (Gray) */}
                    <div className="absolute left-[50%] top-0 bottom-0 w-0.5 bg-border -translate-x-1/2 hidden md:block" />

                    {/* Central Line - Active (Blue Scrollytelling) */}
                    <motion.div
                        style={{ height: lineHeight }}
                        className="absolute left-[50%] top-0 w-0.5 bg-blue-600 -translate-x-1/2 hidden md:block origin-top z-10"
                    />

                    <div className="space-y-24 md:space-y-32 relative z-20">
                        {steps.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: i * 0.1 }}
                                viewport={{ once: true, margin: "-100px" }}
                                className={`flex flex-col md:flex-row items-center gap-8 ${i % 2 === 0 ? "md:flex-row-reverse" : ""
                                    }`}
                            >
                                {/* Content Side */}
                                <div className={`flex-1 text-center ${i % 2 === 0 ? "md:text-left" : "md:text-right"}`}>
                                    <h3 className="text-2xl font-bold text-foreground mb-3 tracking-tight">{step.title}</h3>
                                    <p className="text-muted-foreground font-medium leading-relaxed max-w-sm mx-auto md:mx-0 inline-block">
                                        {step.description}
                                    </p>
                                </div>

                                {/* Icon Center */}
                                <div className="relative flex-shrink-0">
                                    <motion.div
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        className="size-20 rounded-2xl bg-white border border-border shadow-lg flex items-center justify-center relative z-20 group transition-all duration-300"
                                    >
                                        {React.cloneElement(step.icon as React.ReactElement<any>, { className: "size-8 text-foreground/70 group-hover:text-blue-600 transition-colors" })}

                                        {/* Number Badge */}
                                        <div className="absolute -top-3 -right-3 size-8 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center shadow-md">
                                            {i + 1}
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Stats Side */}
                                <div className={`flex-1 text-center ${i % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                                    <div className="inline-block py-2 px-4 rounded-full bg-blue-50 text-blue-700 text-sm font-bold border border-blue-100/50 shadow-sm">
                                        {step.stats}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
