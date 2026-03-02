import { HireForm } from "@/components/HireForm";
import { ShieldCheck } from "lucide-react";
import { Suspense } from "react";

export const metadata = {
    title: "Hire Remote Talent | RemotePro",
    description: "Start your project with pre-vetted Kenyan professionals.",
};

export default function HirePage() {
    return (
        <div className="bg-slate-50 min-h-screen py-20">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="grid lg:grid-cols-2 gap-16 items-start">

                    {/* Left Column: Copy */}
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wide mb-6">
                            Start in 24 Hours
                        </div>
                        <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                            Scale Your Business with <br />
                            <span className="text-blue-600">World-Class Talent.</span>
                        </h1>
                        <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                            Tell us what you need. We'll match you with a vetted expert from our pool. No HR headaches, no payroll compliance—just results.
                        </p>

                        <div className="space-y-8">
                            {[
                                { title: "Risk-Free Trial", desc: "If you're not happy in the first week, we replace them for free." },
                                { title: "Managed Service", desc: "Our account managers oversee quality, so you don't have to micromanage." },
                                { title: "Simple Billing", desc: "One monthly invoice. Pay via M-Pesa, Card, or Bank Transfer." },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="mt-1">
                                        <ShieldCheck className="size-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">{item.title}</h3>
                                        <p className="text-slate-500 text-sm">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Form */}
                    <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200 border border-slate-100 p-8 md:p-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[100px] -z-0"></div>

                        <h2 className="text-2xl font-bold text-slate-900 mb-8 relative z-10">
                            Project Request
                        </h2>

                        <Suspense fallback={<div>Loading form...</div>}>
                            <HireForm />
                        </Suspense>
                    </div>

                </div>
            </div>
        </div>
    );
}
