"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { CheckCircle2, Target, Lightbulb, Users } from "lucide-react"

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero */}
            <section className="bg-primary/5 py-20 px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">About Us</h1>
                    <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
                        We are innovators building the digital future from Machakos to the world.
                    </p>
                </motion.div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-bold text-foreground mb-6">Our Story</h2>
                        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                            Founded on the belief that technology should be a bridge, not a barrier, Pro Innovation & Technologies started with a simple mission: to empower businesses with tools that work as hard as they do.
                        </p>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            From our base in Machakos, Kenya, we have grown into a team of passionate developers, designers, and strategists dedicated to delivering world-class digital solutions.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 gap-6">
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            viewport={{ once: true }}
                            className="bg-card p-8 rounded-2xl border border-border shadow-sm"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <Target className="size-8 text-primary" />
                                <h3 className="text-xl font-bold">Our Mission</h3>
                            </div>
                            <p className="text-muted-foreground">To provide innovative, scalable, and accessible technology solutions that drive business growth and operational efficiency.</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            viewport={{ once: true }}
                            className="bg-card p-8 rounded-2xl border border-border shadow-sm"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <Lightbulb className="size-8 text-secondary" />
                                <h3 className="text-xl font-bold">Our Vision</h3>
                            </div>
                            <p className="text-muted-foreground">To be the leading technology partner for businesses in Africa and beyond, recognized for excellence and innovation.</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-foreground mb-12">Core Values</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {["Innovation", "Integrity", "Excellence", "Collaboration"].map((value, i) => (
                            <motion.div
                                key={value}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                viewport={{ once: true }}
                                className="flex flex-col items-center text-center bg-background p-6 rounded-xl border border-border"
                            >
                                <div className="bg-primary/10 p-3 rounded-full mb-4">
                                    <CheckCircle2 className="size-6 text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold">{value}</h3>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
