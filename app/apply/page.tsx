import { ApplicationForm } from "@/components/ApplicationForm";
import { CheckCircle2 } from "lucide-react";

export const metadata = {
    title: "Join the Talent Pool | RemotePro",
    description: "Apply to join our vetted network of remote professionals.",
};

export default function ApplyPage() {
    return (
        <div className="bg-slate-50 min-h-screen py-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-12">
                    <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                        Join the Top 1% of Kenyan Talent.
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        We connect skilled professionals with high-paying international and local clients. No bidding wars. Just consistent work.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    {[
                        { title: "Vetted Opportunities", desc: "Access clients who value quality over cheap rates." },
                        { title: "Guaranteed Payment", desc: "We handle billing. You get paid on time, every time." },
                        { title: "Career Growth", desc: "Get feedback and training to increase your rates." },
                    ].map((item, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
                            <div className="mb-4 flex justify-center">
                                <CheckCircle2 className="size-8 text-blue-500" />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                            <p className="text-sm text-slate-500">{item.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12">
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center border-b pb-4">
                            Talent Application
                        </h2>
                        <ApplicationForm />
                    </div>
                </div>
            </div>
        </div>
    );
}
