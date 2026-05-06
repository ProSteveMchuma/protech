"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, ArrowRight, Target } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/Button";

const KRA_PIN = /^[A-Z]\d{9}[A-Z]$/;

const AGPO_VALUES = ["none", "women", "youth-18-35", "pwd"] as const;
const INDUSTRY_VALUES = [
    "construction-civil",
    "general-supplies",
    "ict",
    "consultancy",
    "agriculture",
    "medical-supplies",
    "transport-logistics",
    "cleaning-fumigation",
    "security",
    "other",
] as const;
const REVENUE_VALUES = ["under-5m", "5m-20m", "20m-50m", "50m-200m", "over-200m"] as const;
const EGP_VALUES = ["yes", "no", "not-sure"] as const;
const AGPO_CERT_VALUES = ["yes", "no", "expired", "not-applicable"] as const;

const baseFields = {
    fullName: z.string().min(2, "Your name is required"),
    email: z.string().email("Enter a valid work email"),
    packageTier: z.string().optional(),
    projectDetails: z.string().min(20, "A few sentences on what you need (20+ chars)"),
};

const nonTenderSchema = z.object({
    ...baseFields,
    serviceType: z.enum(["va", "social", "content", "other"]),
    companyName: z.string().optional(),
});

const tenderSchema = z.object({
    ...baseFields,
    serviceType: z.literal("tender"),
    companyName: z.string().min(2, "Company name is required for tender clients"),
    kraPin: z
        .string()
        .trim()
        .toUpperCase()
        .regex(KRA_PIN, "KRA PIN format: one letter, 9 digits, one letter (e.g. A012345678B)"),
    agpoCategory: z.enum(AGPO_VALUES),
    industry: z.enum(INDUSTRY_VALUES, { message: "Pick the closest industry" }),
    revenueBand: z.enum(REVENUE_VALUES, { message: "Pick a revenue band" }),
    bidsLast12Months: z.coerce
        .number()
        .int("Whole number, please")
        .min(0, "Cannot be negative")
        .max(500, "500 max — round down if you bid more"),
    targetTenderSize: z.coerce
        .number()
        .int("Whole number, please")
        .min(1, "Enter a target tender size in KES"),
    egpRegistered: z.enum(EGP_VALUES, { message: "Pick one" }),
    agpoCertificate: z.enum(AGPO_CERT_VALUES, { message: "Pick one" }),
});

const hireSchema = z.discriminatedUnion("serviceType", [nonTenderSchema, tenderSchema]);

type HireInput = z.input<typeof hireSchema>;
type HireData = z.output<typeof hireSchema>;
type ServiceType = HireData["serviceType"];

type AnyRegister = (name: string) => Record<string, unknown>;

const fieldClass =
    "w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 outline-none transition";

const SERVICE_OPTIONS: { value: ServiceType; label: string }[] = [
    { value: "va", label: "Virtual Assistant" },
    { value: "social", label: "Social Media Management" },
    { value: "content", label: "Content & SEO" },
    { value: "tender", label: "Tender Management" },
    { value: "other", label: "Other / custom" },
];

const INDUSTRY_LABELS: Record<(typeof INDUSTRY_VALUES)[number], string> = {
    "construction-civil": "Construction & Civil Works",
    "general-supplies": "General Supplies",
    ict: "ICT / Technology",
    consultancy: "Consultancy",
    agriculture: "Agriculture",
    "medical-supplies": "Medical Supplies",
    "transport-logistics": "Transport & Logistics",
    "cleaning-fumigation": "Cleaning & Fumigation",
    security: "Security Services",
    other: "Other",
};

const REVENUE_LABELS: Record<(typeof REVENUE_VALUES)[number], string> = {
    "under-5m": "Under KES 5M",
    "5m-20m": "KES 5M – 20M",
    "20m-50m": "KES 20M – 50M",
    "50m-200m": "KES 50M – 200M",
    "over-200m": "Over KES 200M",
};

const AGPO_LABELS: Record<(typeof AGPO_VALUES)[number], string> = {
    none: "None / not registered",
    women: "Women",
    "youth-18-35": "Youth (18–35)",
    pwd: "Persons with disabilities",
};

export function HireForm() {
    const [submitted, setSubmitted] = useState(false);
    const params = useSearchParams();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<HireInput, unknown, HireData>({
        resolver: zodResolver(hireSchema),
        defaultValues: { serviceType: "va" } as HireInput,
    });

    const serviceType = watch("serviceType");
    const isTender = serviceType === "tender";
    const tenderErrors = errors as Partial<Record<keyof z.infer<typeof tenderSchema>, { message?: string }>>;

    useEffect(() => {
        const service = params.get("service");
        const tier = params.get("tier");
        const industry = params.get("industry");
        const agpoCategory = params.get("agpoCategory");

        if (service && SERVICE_OPTIONS.some((o) => o.value === service)) {
            setValue("serviceType", service as ServiceType);
        }
        if (tier) setValue("packageTier", tier);
        if (industry && (INDUSTRY_VALUES as readonly string[]).includes(industry)) {
            setValue(
                "industry" as never,
                industry as (typeof INDUSTRY_VALUES)[number] as never
            );
        }
        if (agpoCategory && (AGPO_VALUES as readonly string[]).includes(agpoCategory)) {
            setValue(
                "agpoCategory" as never,
                agpoCategory as (typeof AGPO_VALUES)[number] as never
            );
        }
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
                <Field
                    label={isTender ? "Company name" : "Company (optional)"}
                    error={errors.companyName?.message}
                >
                    <input
                        {...register("companyName")}
                        className={fieldClass}
                        placeholder="Acme Co. Ltd"
                    />
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
                        {SERVICE_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>
                                {o.label}
                            </option>
                        ))}
                    </select>
                </Field>
                <Field label="Target package (auto-filled)">
                    <input
                        {...register("packageTier")}
                        className={`${fieldClass} bg-slate-50`}
                        placeholder="e.g. Tender Pro"
                        readOnly
                    />
                </Field>
            </div>

            <AnimatePresence initial={false}>
                {isTender && (
                    <motion.div
                        key="tender-block"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="rounded-2xl border border-brand-200/70 bg-brand-50/40 p-5 md:p-6 space-y-5">
                            <div className="flex items-start gap-3">
                                <div className="size-9 rounded-xl bg-brand-500/10 flex items-center justify-center shrink-0">
                                    <Target className="size-5 text-brand-700" />
                                </div>
                                <div>
                                    <h3 className="font-display font-bold text-brand-950">
                                        Tender qualifying details
                                    </h3>
                                    <p className="text-sm text-slate-600">
                                        Helps us recommend the right tier and surface compliance gaps before the call.
                                    </p>
                                </div>
                            </div>

                            <Field
                                label="KRA PIN"
                                hint="Your company's KRA PIN — required for any tender bid."
                                error={tenderErrors.kraPin?.message}
                            >
                                <input
                                    {...register("kraPin" as never)}
                                    className={`${fieldClass} font-mono tabular-nums uppercase tracking-wide`}
                                    placeholder="A012345678B"
                                    maxLength={11}
                                    autoCapitalize="characters"
                                    onChange={(e) => {
                                        e.target.value = e.target.value.toUpperCase();
                                        setValue("kraPin" as never, e.target.value as never, {
                                            shouldValidate: false,
                                        });
                                    }}
                                />
                            </Field>

                            <div className="grid md:grid-cols-2 gap-4">
                                <Field
                                    label="AGPO category"
                                    hint="AGPO entitles you to the 30% reservation; required for AGPO-only tenders."
                                    error={tenderErrors.agpoCategory?.message}
                                >
                                    <select
                                        {...register("agpoCategory" as never)}
                                        className={`${fieldClass} bg-white`}
                                        defaultValue="none"
                                    >
                                        {AGPO_VALUES.map((v) => (
                                            <option key={v} value={v}>
                                                {AGPO_LABELS[v]}
                                            </option>
                                        ))}
                                    </select>
                                </Field>
                                <Field
                                    label="Industry / sector"
                                    error={tenderErrors.industry?.message}
                                >
                                    <select
                                        {...register("industry" as never)}
                                        className={`${fieldClass} bg-white`}
                                        defaultValue=""
                                    >
                                        <option value="" disabled>
                                            Select industry…
                                        </option>
                                        {INDUSTRY_VALUES.map((v) => (
                                            <option key={v} value={v}>
                                                {INDUSTRY_LABELS[v]}
                                            </option>
                                        ))}
                                    </select>
                                </Field>
                            </div>

                            <Field
                                label="Annual revenue band"
                                hint="We use this to suggest the right tier — Watch, Pro, or Strategist."
                                error={tenderErrors.revenueBand?.message}
                            >
                                <select
                                    {...register("revenueBand" as never)}
                                    className={`${fieldClass} bg-white`}
                                    defaultValue=""
                                >
                                    <option value="" disabled>
                                        Select revenue band…
                                    </option>
                                    {REVENUE_VALUES.map((v) => (
                                        <option key={v} value={v}>
                                            {REVENUE_LABELS[v]}
                                        </option>
                                    ))}
                                </select>
                            </Field>

                            <div className="grid md:grid-cols-2 gap-4">
                                <Field
                                    label="Tenders bid in last 12 months"
                                    error={tenderErrors.bidsLast12Months?.message}
                                >
                                    <input
                                        {...register("bidsLast12Months" as never)}
                                        type="number"
                                        inputMode="numeric"
                                        min={0}
                                        max={500}
                                        step={1}
                                        className={`${fieldClass} font-mono tabular-nums`}
                                        placeholder="e.g. 8"
                                    />
                                </Field>
                                <Field
                                    label="Target tender size (KES)"
                                    hint="Recent or upcoming bid value."
                                    error={tenderErrors.targetTenderSize?.message}
                                >
                                    <input
                                        {...register("targetTenderSize" as never)}
                                        type="number"
                                        inputMode="numeric"
                                        min={1}
                                        step={1}
                                        className={`${fieldClass} font-mono tabular-nums`}
                                        placeholder="e.g. 4500000"
                                    />
                                </Field>
                            </div>

                            <Field
                                label="Currently registered on eGP?"
                                error={tenderErrors.egpRegistered?.message}
                            >
                                <RadioRow
                                    name="egpRegistered"
                                    options={[
                                        { value: "yes", label: "Yes" },
                                        { value: "no", label: "No" },
                                        { value: "not-sure", label: "Not sure" },
                                    ]}
                                    register={register as unknown as AnyRegister}
                                />
                            </Field>

                            <Field
                                label="Have a current AGPO certificate?"
                                error={tenderErrors.agpoCertificate?.message}
                            >
                                <RadioRow
                                    name="agpoCertificate"
                                    options={[
                                        { value: "yes", label: "Yes" },
                                        { value: "no", label: "No" },
                                        { value: "expired", label: "Expired" },
                                        { value: "not-applicable", label: "Not applicable" },
                                    ]}
                                    register={register as unknown as AnyRegister}
                                />
                            </Field>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Field
                label={isTender ? "Anything else we should know?" : "What do you need?"}
                error={errors.projectDetails?.message}
            >
                <textarea
                    {...register("projectDetails")}
                    rows={4}
                    className={fieldClass}
                    placeholder={
                        isTender
                            ? "E.g. We're chasing the County of Nakuru general-supplies framework. AGPO-women, last bid lost on a missing CR12. Need help submitting on eGP."
                            : "E.g. I need someone to manage my inbox and schedule 5 meetings a week, plus light social media…"
                    }
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
    hint,
    error,
    children,
}: {
    label: string;
    hint?: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
            {children}
            {hint && !error && (
                <p className="text-xs text-slate-500 mt-1.5">{hint}</p>
            )}
            {error && (
                <p className="text-red-600 text-xs mt-1.5 font-medium">{error}</p>
            )}
        </div>
    );
}

function RadioRow({
    name,
    options,
    register,
}: {
    name: string;
    options: { value: string; label: string }[];
    register: AnyRegister;
}) {
    return (
        <div className="flex flex-wrap gap-2">
            {options.map((o) => (
                <label
                    key={o.value}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-white cursor-pointer hover:border-brand-400 has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50 has-[:checked]:text-brand-800 transition text-sm font-medium"
                >
                    <input
                        {...register(name)}
                        type="radio"
                        value={o.value}
                        className="size-4 accent-brand-600"
                    />
                    {o.label}
                </label>
            ))}
        </div>
    );
}
