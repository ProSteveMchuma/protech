"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const hireSchema = z.object({
    fullName: z.string().min(2, "Name is required"),
    companyName: z.string().optional(),
    email: z.string().email("Invalid email"),
    serviceType: z.enum(["va", "social", "content", "other"]),
    packageTier: z.string().optional(),
    projectDetails: z.string().min(20, "Please describe your needs in more detail"),
    budget: z.string().optional(),
});

type HireData = z.infer<typeof hireSchema>;

export function HireForm() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const searchParams = useSearchParams();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<HireData>({
        resolver: zodResolver(hireSchema),
        defaultValues: {
            serviceType: "va",
        }
    });

    useEffect(() => {
        const service = searchParams.get("service");
        const tier = searchParams.get("tier");

        if (service) setValue("serviceType", service as any);
        if (tier) setValue("packageTier", tier);
    }, [searchParams, setValue]);

    const onSubmit = async (data: HireData) => {
        try {
            const response = await fetch("/api/notify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data, type: "Client Hire Lead" }),
            });
            if (response.ok) {
                setIsSubmitted(true);
            }
        } catch (error) {
            console.error("Submission error:", error);
        }
    };

    if (isSubmitted) {
        return (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 text-center animate-in fade-in zoom-in duration-300">
                <div className="flex justify-center mb-4">
                    <CheckCircle2 className="size-16 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-blue-900 mb-2">Request Received!</h3>
                <p className="text-blue-800 mb-6">
                    Thank you for choosing RemotePro. We are reviewing your requirements and will send you a curated list of candidates/proposal within 24 hours.
                </p>
                <button className="text-sm font-semibold text-blue-600 hover:text-blue-800 underline">
                    Download Service Brochure
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                    <input
                        {...register("fullName")}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Jane Smith"
                    />
                    {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Company Name (Optional)</label>
                    <input
                        {...register("companyName")}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Acme Corp"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Work Email</label>
                <input
                    {...register("email")}
                    type="email"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="jane@company.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Service Required</label>
                    <select
                        {...register("serviceType")}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    >
                        <option value="va">Virtual Assistant</option>
                        <option value="social">Social Media Management</option>
                        <option value="content">Content Writing</option>
                        <option value="other">Other / Custom</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Target Package (Optional)</label>
                    <input
                        {...register("packageTier")}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50"
                        placeholder="e.g. Growth VA"
                        readOnly
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Project Details / Requirements</label>
                <textarea
                    {...register("projectDetails")}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Describe your needs. E.g., 'I need someone to manage my inbox and schedule 5 meetings a week...'"
                />
                {errors.projectDetails && <p className="text-red-500 text-sm mt-1">{errors.projectDetails.message}</p>}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-50 flex justify-center items-center gap-2"
            >
                {isSubmitting ? <Loader2 className="animate-spin" /> : <>Request Proposal <ArrowRight className="size-5" /></>}
            </button>

            <p className="text-center text-xs text-slate-500">
                No credit card required. You'll receive a quote first.
            </p>
        </form>
    );
}
