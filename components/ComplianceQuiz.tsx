"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "./ui/Button";
import { ButtonLink } from "./ui/Button";

const QUESTIONS = [
    {
        id: "tcc",
        question: "Is your KRA Tax Compliance Certificate currently valid?",
        desc: "Expired TCCs are the #1 reason for automatic disqualification.",
    },
    {
        id: "agpo",
        question: "Do you have a valid AGPO certificate?",
        desc: "Required to bid on the 30% reserved government tenders for youth, women, and PWDs.",
    },
    {
        id: "cr12",
        question: "Is your CR12 updated within the last 12 months?",
        desc: "Procuring entities use this to verify company directors and shareholding.",
    }
];

export function ComplianceQuiz() {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, boolean>>({});
    const [showResult, setShowResult] = useState(false);

    const handleAnswer = (answer: boolean) => {
        setAnswers(prev => ({ ...prev, [QUESTIONS[currentStep].id]: answer }));
        
        if (currentStep < QUESTIONS.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            setShowResult(true);
        }
    };

    const resetQuiz = () => {
        setCurrentStep(0);
        setAnswers({});
        setShowResult(false);
    };

    const isReady = Object.values(answers).every(a => a === true);

    return (
        <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 premium-shadow overflow-hidden">
            <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-display font-bold text-slate-900">Compliance Check</h3>
                {!showResult && (
                    <span className="font-mono text-xs font-semibold text-slate-500 uppercase tracking-widest">
                        Step {currentStep + 1} of {QUESTIONS.length}
                    </span>
                )}
            </div>
            
            <div className="p-8 md:p-12 min-h-[300px] flex flex-col justify-center relative">
                <AnimatePresence mode="wait">
                    {!showResult ? (
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="w-full"
                        >
                            <h4 className="font-display text-2xl md:text-3xl font-bold text-brand-950 mb-3 leading-snug">
                                {QUESTIONS[currentStep].question}
                            </h4>
                            <p className="text-slate-600 mb-8 text-sm md:text-base">
                                {QUESTIONS[currentStep].desc}
                            </p>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <Button 
                                    variant="outline" 
                                    className="border-slate-200 text-slate-700 hover:bg-slate-50 py-6 text-lg" 
                                    onClick={() => handleAnswer(true)}
                                >
                                    Yes
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="border-slate-200 text-slate-700 hover:bg-slate-50 py-6 text-lg" 
                                    onClick={() => handleAnswer(false)}
                                >
                                    No
                                </Button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center w-full"
                        >
                            <div className="mb-6 flex justify-center">
                                {isReady ? (
                                    <div className="size-16 rounded-full bg-success-100 flex items-center justify-center text-success-600">
                                        <CheckCircle2 className="size-8" />
                                    </div>
                                ) : (
                                    <div className="size-16 rounded-full bg-sun-500/10 flex items-center justify-center text-sun-600">
                                        <AlertCircle className="size-8" />
                                    </div>
                                )}
                            </div>
                            
                            <h4 className="font-display text-3xl font-bold text-brand-950 mb-4">
                                {isReady ? "You're ready to bid." : "You have compliance gaps."}
                            </h4>
                            <p className="text-slate-600 mb-8 text-pretty max-w-md mx-auto">
                                {isReady 
                                    ? "Your core documents are in order. Let's find you the right tenders and win them." 
                                    : "Don't waste time preparing bids that will be disqualified. We can help you fix your documents and start winning."}
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <ButtonLink href="/services/tender#pricing" variant="primary" size="lg">
                                    {isReady ? "See Tender Packages" : "Get Compliance Help"}
                                    <ArrowRight className="size-4 ml-2" />
                                </ButtonLink>
                                <button onClick={resetQuiz} className="text-sm font-medium text-slate-500 hover:text-brand-600 transition-colors">
                                    Start over
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            
            {/* Progress Bar */}
            {!showResult && (
                <div className="w-full bg-slate-100 h-1.5">
                    <motion.div 
                        className="bg-brand-500 h-full"
                        initial={{ width: `${(currentStep / QUESTIONS.length) * 100}%` }}
                        animate={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            )}
        </div>
    );
}
