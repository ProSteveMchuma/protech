"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, MapPin, Phone, Send, MessageCircle } from "lucide-react"
import { sendEmail } from "@/actions/send-email"

export default function ContactPage() {
    const [formState, setFormState] = useState({ loading: false, success: false, error: "" });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormState({ loading: true, success: false, error: "" });

        const formData = new FormData(e.currentTarget);
        const data = {
            firstName: formData.get("firstName") as string,
            lastName: formData.get("lastName") as string,
            email: formData.get("email") as string,
            message: formData.get("message") as string,
        };

        const result = await sendEmail({
            to: "info@proinnovationtech.co.ke", // Configurable
            replyTo: data.email,
            subject: `New Inquiry from ${data.firstName} ${data.lastName}`,
            html: `
                <h2>New Website Inquiry</h2>
                <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Message:</strong></p>
                <p>${data.message}</p>
            `,
        });

        if (result.success) {
            setFormState({ loading: false, success: true, error: "" });
            (e.target as HTMLFormElement).reset();
        } else {
            setFormState({ loading: false, success: false, error: "Failed to send message. Please try again." });
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <section className="bg-primary/5 py-20 px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">Get in Touch</h1>
                    <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
                        Ready to start your project? We'd love to hear from you.
                    </p>
                </motion.div>
            </section>

            <section className="py-24 px-4 sm:px-6 lg:px-8 container mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-8"
                    >
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                            <p className="text-muted-foreground mb-8">
                                Reach out to us for quotes, consultations, or just to say hello.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-primary/10 p-3 rounded-lg">
                                        <MapPin className="size-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">Our Location</h3>
                                        <p className="text-muted-foreground">Machakos, Kenya</p>
                                        <p className="text-sm text-muted-foreground">(Online/Remote Services Available Globally)</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-primary/10 p-3 rounded-lg">
                                        <Mail className="size-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">Email Us</h3>
                                        <p className="text-muted-foreground">info@proinnovationtech.co.ke</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-primary/10 p-3 rounded-lg">
                                        <Phone className="size-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">Call Us</h3>
                                        <p className="text-muted-foreground">0715 947 213 / 0719 584 549</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-green-500/10 p-3 rounded-lg">
                                        <MessageCircle className="size-6 text-green-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">WhatsApp</h3>
                                        <a href="https://wa.me/254715947213" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-green-500 transition-colors">
                                            Chat with us (0715 947 213)
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-card border border-border rounded-2xl p-8 shadow-lg relative overflow-hidden"
                    >
                        {formState.success ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-card z-10 p-8 text-center animate-in fade-in">
                                <div className="size-16 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mb-4">
                                    <Send className="size-8" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                                <p className="text-muted-foreground">Thanks for reaching out. We'll get back to you within 24 hours.</p>
                                <button onClick={() => setFormState({ ...formState, success: false })} className="mt-6 text-primary font-medium hover:underline">
                                    Send another message
                                </button>
                            </div>
                        ) : null}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="firstName" className="text-sm font-medium">First name</label>
                                    <input name="firstName" required type="text" id="firstName" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="John" />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="lastName" className="text-sm font-medium">Last name</label>
                                    <input name="lastName" required type="text" id="lastName" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="Doe" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium">Email</label>
                                <input name="email" required type="email" id="email" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="john@example.com" />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-medium">Message</label>
                                <textarea name="message" required id="message" rows={4} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="Tell us about your project..." />
                            </div>

                            {formState.error && (
                                <p className="text-red-500 text-sm">{formState.error}</p>
                            )}

                            <button disabled={formState.loading} type="submit" className="w-full flex items-center justify-center gap-2 rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">
                                {formState.loading ? "Sending..." : "Send Message"} {!formState.loading && <Send className="size-4" />}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}
