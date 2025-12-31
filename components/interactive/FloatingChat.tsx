"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send } from "lucide-react";

export const FloatingChat = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="absolute bottom-16 right-0 w-80 bg-card border border-border shadow-2xl rounded-2xl overflow-hidden mb-4"
                    >
                        <div className="bg-primary p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="size-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                                    AI
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-sm">ProBot Agent</h4>
                                    <p className="text-xs text-white/80">Online</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
                                <X className="size-5" />
                            </button>
                        </div>

                        <div className="p-4 h-64 overflow-y-auto bg-muted/30 space-y-4">
                            <div className="flex gap-3">
                                <div className="size-8 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center text-xs font-bold text-primary">AI</div>
                                <div className="bg-card border border-border p-3 rounded-r-xl rounded-bl-xl text-sm shadow-sm">
                                    Hi there! 👋 I can help you find the right service. What are you looking for today?
                                </div>
                            </div>

                            <div className="flex gap-2 flex-wrap">
                                {["Get a Quote", "Tender Services", "Web Design", "Talk to Human"].map((opt) => (
                                    <button key={opt} className="text-xs py-2 px-3 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-full transition-colors border border-primary/20">
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-3 border-t bg-card flex gap-2">
                            <input type="text" placeholder="Type a message..." className="flex-1 bg-muted px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                            <button className="p-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                                <Send className="size-4" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="size-14 rounded-full bg-primary text-white shadow-xl hover:scale-110 transition-transform flex items-center justify-center"
            >
                {isOpen ? <X className="size-6" /> : <MessageSquare className="size-6" />}
            </button>
        </div>
    );
};
