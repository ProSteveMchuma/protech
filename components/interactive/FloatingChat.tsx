"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send } from "lucide-react";

export const FloatingChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [hasOpened, setHasOpened] = useState(false);

    // Auto-open after 7 seconds to simulate "Live Agent"
    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (!hasOpened) {
                setIsOpen(true);
                setHasOpened(true);
            }
        }, 7000);
        return () => clearTimeout(timer);
    }, [hasOpened]);

    const WhatsAppLink = ({ text, label }: { text: string; label: string }) => {
        const message = encodeURIComponent(text);
        return (
            <a
                href={`https://wa.me/254715947213?text=${message}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs py-2 px-3 bg-green-50 text-green-700 hover:bg-green-600 hover:text-white rounded-full transition-colors border border-green-200 font-medium"
            >
                {label}
            </a>
        );
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="absolute bottom-20 right-0 w-80 bg-white border border-black/5 shadow-2xl rounded-2xl overflow-hidden mb-2"
                    >
                        {/* Header */}
                        <div className="bg-[#128C7E] p-4 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="size-10 rounded-full bg-white flex items-center justify-center text-[#128C7E] font-bold shadow-inner">
                                        <div className="absolute bottom-0 right-0 size-3 border-2 border-[#128C7E] rounded-full bg-green-400"></div>
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WA" className="w-6 h-6" />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-base">ProTech Support</h4>
                                    <p className="text-xs text-white/90 font-medium">Typically replies instantly</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
                                <X className="size-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-4 bg-[#E5DDD5]/30 h-auto max-h-80 overflow-y-auto space-y-4">
                            <div className="flex gap-3">
                                <div className="size-8 rounded-full bg-[#128C7E] flex-shrink-0 flex items-center justify-center text-xs font-bold text-white">PT</div>
                                <div className="bg-white border border-black/5 p-3 rounded-r-xl rounded-bl-xl text-sm shadow-sm text-gray-800 leading-relaxed">
                                    <span className="font-bold block mb-1 text-[#128C7E]">Online Now</span>
                                    👋 Hi! I'm ready to help you grow your business. Pick an option below to chat on WhatsApp!
                                </div>
                            </div>

                            {/* Options */}
                            <div className="flex gap-2 flex-wrap pl-11">
                                <WhatsAppLink label="💰 Get a Quote" text="Hi, I'm interested in getting a quote for your services." />
                                <WhatsAppLink label="🌐 Web Design" text="Hi, I'd like to discuss a Web Design project." />
                                <WhatsAppLink label="📝 Tender Help" text="Hi, I need assistance with Tender Writing." />
                                <WhatsAppLink label="🤖 Automation" text="Hi, tell me more about AI Automation." />
                                <WhatsAppLink label="📞 Speak to Agent" text="Hi, I have a general inquiry and would like to speak to someone." />
                            </div>

                            <div className="text-center text-[10px] text-gray-400 mt-2">
                                Powered by ProTech Live
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="group relative size-16 rounded-full bg-[#25D366] text-white shadow-[0_4px_14px_0_rgba(37,211,102,0.39)] hover:scale-110 hover:shadow-[0_6px_20px_rgba(37,211,102,0.23)] transition-all duration-300 flex items-center justify-center"
            >
                {isOpen ? <X className="size-7" /> : <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" className="w-8 h-8 filter brightness-0 invert" alt="Chat" />}

                {/* Notification Badge */}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white animate-bounce-slow">
                        1
                    </span>
                )}
            </button>
        </div>
    );
};
