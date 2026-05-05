"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "./ui/Button";

const hireSchema = z.object({
    fullName: z.string().min(2, "Your name is required"),
    companyName: z.string().optional(),
    email: z.string().email("Enter a valid work email"),
    serviceType: z.enum(["va", "social", "content", "other"]),
    packageTier: z.string().optional(),
    projectDetails: z.string().min(20, "A few sentences on what you need (20+ chars)"),
});

type HireData = z.infer<typeof hireSchema>;

const fieldClass =
    "w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 outline-none transition";

export function HireForm() {
    const [submitted, setSubmitted] = useState(false);
    const params = useSearchParams();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<HireData>({
        resolver: zodResolver(hireSchema),
        defaultValues: { serviceType: "va" },
    });

    useEffect(() => {
        const service = params.get("service");
        const tier = params.get("tier");
        if (service) setValue("serviceType", service as HireData["serviceType"]);
        if (tier) setValue("packageTier", tier);
    }, [params, setValue]);

    const onSubmit = async (data: HireData) => {
        try {
            const res = await fetch("/api/notify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data, type: "Client Hire Lead" }),
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
                    Request received!
                </h3>
                <p className="text-emerald-800">
                    We'll review your needs and send a tailored proposal within 24 hours. Check your inbox.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
                <Field label="Full name" error={errors.fullName?.message}>
                    <input {...register("fullName")} className={fieldClass} placeholder="Jane Mwangi" />
                </Field>
                <Field label="Company (optional)">
                    <input {...register("companyName")} className={fieldClass} placeholder="Acme Co." />
                </Field>
            </div>

            <Field label="Work email" error={errors.email?.message}>
                <input
                    {...register("email")}
                    type="email"
                    className={fieldClass}
                    placeholder="jane@company.co.ke"
                />
            </Field>

            <div className="grid md:grid-cols-2 gap-4">
                <Field label="Service required">
                    <select {...register("serviceType")} className={`${fieldClass} bg-white`}>
                        <option value="va">Virtual Assistant</option>
                        <option value="social">Social Media Management</option>
                        <option value="content">Content & SEO</option>
                        <option value="other">Other / custom</option>
                    </select>
                </Field>
                <Field label="Target package (auto-filled)">
                    <input
                        {...register("packageTier")}
                        className={`${fieldClass} bg-slate-50`}
                        placeholder="e.g. Growth VA"
                        readOnly
                    />
                </Field>
            </div>

            <Field label="What do you need?" error={errors.projectDetails?.message}>
                <textarea
                    {...register("projectDetails")}
                    rows={4}
                    className={fieldClass}
                    placeholder="E.g. I need someone to manage my inbox and schedule 5 meetings a week, plus light social media…"
                />
            </Field>

            <Button type="submit" loading={isSubmitting} variant="primary" size="xl" fullWidth>
                Request proposal <ArrowRight className="size-5" />
            </Button>

            <p className="text-center text-xs text-slate-500">
                No credit card required. You'll receive a quote first.
            </p>
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
            {error && (
                <p className="text-red-600 text-xs mt-1.5 font-medium">{error}</p>
            )}
        </div>
    );
}
