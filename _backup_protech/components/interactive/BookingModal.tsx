"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const BookingModal = ({ isOpen, onClose }: BookingModalProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 m-auto max-w-2xl h-fit max-h-[90vh] bg-card border border-white/10 rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col md:flex-row"
                    >
                        {/* Left Panel - Info */}
                        <div className="bg-primary/5 p-8 md:w-1/3 border-r border-white/5 flex flex-col justify-between">
                            <div>
                                <h3 className="text-2xl font-bold mb-2">Book a Call</h3>
                                <p className="text-muted-foreground text-sm mb-6">Schedule a free 15-min discovery strategy session.</p>

                                <ul className="space-y-4">
                                    {[
                                        "Clarify your requirements",
                                        "Get expert advice",
                                        "Receive a custom plan"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-foreground/80">
                                            <div className="size-5 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                                <Check className="size-3" />
                                            </div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/5">
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Our Availability</p>
                                <div className="flex items-center gap-2 text-sm">
                                    <Clock className="size-4 text-primary" />
                                    <span>Mon - Fri, 8am - 5pm</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Panel - Form/Calendar Mock */}
                        <div className="p-8 md:w-2/3 bg-card relative">
                            <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors">
                                <X className="size-5 text-muted-foreground" />
                            </button>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Select a Date</label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {[12, 13, 14, 15].map((day) => (
                                            <button key={day} className={cn(
                                                "p-3 rounded-xl border flex flex-col items-center justify-center hover:bg-primary/5 transition-colors",
                                                day === 13 ? "border-primary bg-primary/5 text-primary" : "border-border"
                                            )}>
                                                <span className="text-xs text-muted-foreground">Oct</span>
                                                <span className="text-lg font-bold">{day}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-2 block">Select Time</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {["09:00", "10:30", "14:00"].map((time, i) => (
                                            <button key={time} className={cn(
                                                "py-2 px-3 rounded-lg border text-sm hover:border-primary hover:text-primary transition-colors",
                                                i === 1 ? "border-primary text-primary bg-primary/5" : "border-border"
                                            )}>
                                                {time}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <input type="text" placeholder="Your Name" className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-primary focus:outline-none" />
                                    <input type="email" placeholder="Email Address" className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-primary focus:outline-none" />
                                </div>

                                <button className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:brightness-110 transition-all">
                                    Confirm Booking
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
