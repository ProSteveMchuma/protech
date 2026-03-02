"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";

const applicationSchema = z.object({
    fullName: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email"),
    skills: z.string().min(10, "Please list your key skills"),
    portfolioUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    experience: z.string().min(50, "Tell us about your experience"),
    rate: z.string().min(1, "Expected hourly rate is required"),
});

type ApplicationData = z.infer<typeof applicationSchema>;

export function ApplicationForm() {
    const [isSubmitted, setIsSubmitted] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ApplicationData>({
        resolver: zodResolver(applicationSchema),
    });

    const onSubmit = async (data: ApplicationData) => {
        try {
            const response = await fetch("/api/notify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data, type: "Talent Application" }),
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
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
                <div className="flex justify-center mb-4">
                    <CheckCircle2 className="size-12 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-bold text-emerald-800 mb-2">Application Received!</h3>
                <p className="text-emerald-700">
                    Thanks for applying. Our talent team will review your profile and get back to you within 48 hours.
                </p>
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
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder="John Doe"
                    />
                    {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                    <input
                        {...register("email")}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder="john@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Portfolio / LinkedIn URL</label>
                <input
                    {...register("portfolioUrl")}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="https://linkedin.com/in/..."
                />
                {errors.portfolioUrl && <p className="text-red-500 text-sm mt-1">{errors.portfolioUrl.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Key Skills (Comma separated)</label>
                <input
                    {...register("skills")}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="e.g. Email Management, SEO Writing, Graphic Design"
                />
                {errors.skills && <p className="text-red-500 text-sm mt-1">{errors.skills.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Experience Summary</label>
                <textarea
                    {...register("experience")}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Briefly describe your past remote work experience..."
                />
                {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Expected Hourly Rate (KES)</label>
                <input
                    {...register("rate")}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="e.g. 500"
                />
                {errors.rate && <p className="text-red-500 text-sm mt-1">{errors.rate.message}</p>}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-slate-900 text-white font-bold text-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="size-5 animate-spin" /> Submitting...
                    </>
                ) : (
                    "Submit Application"
                )}
            </button>
        </form>
    );
}
