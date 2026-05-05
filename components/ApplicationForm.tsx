"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/Button";

const applicationSchema = z.object({
    fullName: z.string().min(2, "Name is required"),
    email: z.string().email("Enter a valid email"),
    skills: z.string().min(10, "List your key skills"),
    portfolioUrl: z
        .string()
        .url("Must be a valid URL")
        .optional()
        .or(z.literal("")),
    experience: z.string().min(50, "Tell us about your experience (50+ chars)"),
    rate: z.string().min(1, "Expected hourly rate is required"),
});

type ApplicationData = z.infer<typeof applicationSchema>;

const fieldClass =
    "w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 outline-none transition";

export function ApplicationForm() {
    const [submitted, setSubmitted] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ApplicationData>({
        resolver: zodResolver(applicationSchema),
    });

    const onSubmit = async (data: ApplicationData) => {
        try {
            const res = await fetch("/api/notify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data, type: "Talent Application" }),
            });
            if (res.ok) setSubmitted(true);
        } catch (err) {
            console.error("Submission error:", err);
        }
    };

    if (submitted) {
        return (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
                <div className="flex justify-center mb-4">
                    <div className="size-16 rounded-full bg-success-500/10 flex items-center justify-center">
                        <CheckCircle2 className="size-9 text-success-600" />
                    </div>
                </div>
                <h3 className="font-display text-2xl font-bold text-emerald-900 mb-2">
                    Application received!
                </h3>
                <p className="text-emerald-800">
                    Our talent team will review your profile and reply within 48 hours.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
                <Field label="Full name" error={errors.fullName?.message}>
                    <input {...register("fullName")} className={fieldClass} placeholder="John Doe" />
                </Field>
                <Field label="Email" error={errors.email?.message}>
                    <input {...register("email")} className={fieldClass} placeholder="john@example.com" />
                </Field>
            </div>

            <Field label="Portfolio / LinkedIn URL" error={errors.portfolioUrl?.message}>
                <input
                    {...register("portfolioUrl")}
                    className={fieldClass}
                    placeholder="https://linkedin.com/in/yourname"
                />
            </Field>

            <Field label="Key skills (comma separated)" error={errors.skills?.message}>
                <input
                    {...register("skills")}
                    className={fieldClass}
                    placeholder="e.g. Email management, SEO writing, graphic design"
                />
            </Field>

            <Field label="Experience summary" error={errors.experience?.message}>
                <textarea
                    {...register("experience")}
                    rows={4}
                    className={fieldClass}
                    placeholder="Briefly describe your remote work experience…"
                />
            </Field>

            <Field label="Expected hourly rate (KES)" error={errors.rate?.message}>
                <input
                    {...register("rate")}
                    className={`${fieldClass} font-mono`}
                    placeholder="e.g. 600"
                />
            </Field>

            <Button type="submit" loading={isSubmitting} variant="dark" size="xl" fullWidth>
                Submit application
            </Button>
        </form>
    );
}

function Field({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
            {children}
            {error && <p className="text-red-600 text-xs mt-1.5 font-medium">{error}</p>}
        </div>
    );
}
