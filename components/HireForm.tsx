"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/Button";
import { slideX } from "@/lib/motion";

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

const baseFields = {
    fullName: z.string().min(2, "Your name is required"),
    email: z.string().email("Enter a valid work email"),
    packageTier: z.string().optional(),
    projectDetails: z.string().min(20, "A few sentences on what you need (20+ chars)"),
};

const nonTenderSchema = z.object({
    ...baseFields,
    serviceType: z.enum(["va", "other"]),
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
    targetTenderSize: z.coerce
        .number()
        .int("Whole number, please")
        .min(1, "Enter a target tender size in KES"),
    egpRegistered: z.enum(EGP_VALUES, { message: "Pick one" }),
});

const hireSchema = z.discriminatedUnion("serviceType", [nonTenderSchema, tenderSchema]);

type HireInput = z.input<typeof hireSchema>;
type HireData = z.output<typeof hireSchema>;
type ServiceType = HireData["serviceType"];

const fieldClass =
    "w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 outline-none transition";

const SERVICE_OPTIONS: { value: ServiceType; label: string }[] = [
    { value: "tender", label: "Tender Management" },
    { value: "va", label: "Virtual Assistant" },
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

type Step = 1 | 2;

export function HireForm() {
    const [submitted, setSubmitted] = useState(false);
    const [step, setStep] = useState<Step>(1);
    const [direction, setDirection] = useState<1 | -1>(1);
    const params = useSearchParams();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        trigger,
        formState: { errors, isSubmitting },
    } = useForm<HireInput, unknown, HireData>({
        resolver: zodResolver(hireSchema),
        defaultValues: { serviceType: "tender" } as HireInput,
        mode: "onTouched",
    });

    const serviceType = watch("serviceType");
    const isTender = serviceType === "tender";
    const tenderErrors = errors as Partial<
        Record<keyof z.infer<typeof tenderSchema>, { message?: string }>
    >;

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

    async function goToStep2() {
        const baseValid = await trigger(["serviceType", "fullName", "email"]);
        const companyOk = isTender
            ? await trigger("companyName" as never)
            : true;
        if (baseValid && companyOk) {
            setDirection(1);
            setStep(2);
        }
    }

    function goToStep1() {
        setDirection(-1);
        setStep(1);
    }

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
            <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 md:p-10 text-center"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.5, type: "spring", bounce: 0.4 }}
                    className="size-16 rounded-full bg-success-500/10 flex items-center justify-center mx-auto mb-5"
                >
                    <CheckCircle2 className="size-9 text-success-600" />
                </motion.div>
                <h3 className="font-display text-3xl font-bold text-emerald-900 mb-2">
                    We've got it.
                </h3>
                <p className="text-emerald-800 leading-relaxed">
                    A tailored proposal will land in your inbox within 24 hours. Check spam if you don't see it.
                </p>
            </motion.div>
        );
    }

    return (
        <div className="bg-white rounded-3xl premium-shadow border border-slate-200/70 p-6 md:p-10 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 size-40 bg-gradient-to-br from-brand-500/15 to-accent-500/15 rounded-full blur-2xl pointer-events-none" />
            <div className="relative">
                <Stepper step={step} />

                <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
                    <AnimatePresence mode="wait" custom={direction} initial={false}>
                        {step === 1 && (
                            <motion.div
                                key="step-1"
                                custom={direction}
                                variants={slideX}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                className="space-y-5"
                            >
                                <div>
                                    <p className="text-[11px] uppercase tracking-widest text-brand-700 font-bold mb-1">
                                        Step 1 of 2
                                    </p>
                                    <h2 className="font-display text-2xl md:text-3xl font-bold text-slate-900">
                                        Who are you?
                                    </h2>
                                </div>

                                <Field label="What do you need?" error={errors.serviceType?.message}>
                                    <select
                                        {...register("serviceType")}
                                        className={`${fieldClass} bg-white`}
                                    >
                                        {SERVICE_OPTIONS.map((o) => (
                                            <option key={o.value} value={o.value}>
                                                {o.label}
                                            </option>
                                        ))}
                                    </select>
                                </Field>

                                <Field label="Full name" error={errors.fullName?.message}>
                                    <input
                                        {...register("fullName")}
                                        className={fieldClass}
                                        placeholder="Jane Mwangi"
                                        autoComplete="name"
                                    />
                                </Field>

                                <Field label="Work email" error={errors.email?.message}>
                                    <input
                                        {...register("email")}
                                        type="email"
                                        className={fieldClass}
                                        placeholder="jane@company.co.ke"
                                        autoComplete="email"
                                    />
                                </Field>

                                <Field
                                    label={isTender ? "Company name" : "Company (optional)"}
                                    error={errors.companyName?.message}
                                >
                                    <input
                                        {...register("companyName")}
                                        className={fieldClass}
                                        placeholder="Acme Co. Ltd"
                                        autoComplete="organization"
                                    />
                                </Field>

                                <Button
                                    type="button"
                                    onClick={goToStep2}
                                    variant="primary"
                                    size="xl"
                                    fullWidth
                                >
                                    Continue <ArrowRight className="size-5" />
                                </Button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step-2"
                                custom={direction}
                                variants={slideX}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                className="space-y-5"
                            >
                                <div>
                                    <p className="text-[11px] uppercase tracking-widest text-brand-700 font-bold mb-1">
                                        Step 2 of 2
                                    </p>
                                    <h2 className="font-display text-2xl md:text-3xl font-bold text-slate-900">
                                        {isTender ? "A few specifics" : "Tell us about your project"}
                                    </h2>
                                    <p className="text-sm text-slate-500 mt-1">
                                        {isTender
                                            ? "So we can match you to the right tier."
                                            : "Anything that helps us scope the work."}
                                    </p>
                                </div>

                                {isTender && (
                                    <div className="space-y-5">
                                        <Field
                                            label="KRA PIN"
                                            hint="Required for any tender bid."
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
                                                    setValue(
                                                        "kraPin" as never,
                                                        e.target.value as never,
                                                        { shouldValidate: false }
                                                    );
                                                }}
                                            />
                                        </Field>

                                        <Field
                                            label="AGPO category"
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
                                            label="Industry"
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

                                        <Field
                                            label="Annual revenue band"
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
                                                placeholder="4500000"
                                            />
                                        </Field>

                                        <Field
                                            label="Registered on eGP?"
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
                                    </div>
                                )}

                                {!isTender && watch("packageTier") && (
                                    <Field label="Target package">
                                        <input
                                            {...register("packageTier")}
                                            className={`${fieldClass} bg-slate-50`}
                                            readOnly
                                        />
                                    </Field>
                                )}

                                <Field
                                    label={
                                        isTender
                                            ? "Anything else we should know?"
                                            : "What do you need?"
                                    }
                                    error={errors.projectDetails?.message}
                                >
                                    <textarea
                                        {...register("projectDetails")}
                                        rows={4}
                                        className={fieldClass}
                                        placeholder={
                                            isTender
                                                ? "E.g. Chasing the County of Nakuru general-supplies framework. Last bid lost on a missing CR12."
                                                : "E.g. Manage my inbox, schedule 5 meetings/week, plus light social media."
                                        }
                                    />
                                </Field>

                                <Button
                                    type="submit"
                                    loading={isSubmitting}
                                    variant="primary"
                                    size="xl"
                                    fullWidth
                                >
                                    Send <ArrowRight className="size-5" />
                                </Button>

                                <button
                                    type="button"
                                    onClick={goToStep1}
                                    className="block w-full text-sm text-slate-500 hover:text-slate-800 transition inline-flex items-center justify-center gap-1.5"
                                >
                                    <ArrowLeft className="size-4" /> Back
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </form>
            </div>
        </div>
    );
}

type AnyRegister = (name: string) => Record<string, unknown>;

function Stepper({ step }: { step: Step }) {
    const items = [
        { key: 1, label: "You" },
        { key: 2, label: "Project" },
    ] as const;
    return (
        <ol className="flex items-center gap-3 text-xs font-medium">
            {items.map((it, i) => {
                const active = it.key === step;
                const done = it.key < step;
                return (
                    <li key={it.key} className="flex items-center gap-3 flex-1">
                        <span
                            className={`size-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors ${
                                done
                                    ? "bg-success-500 text-white"
                                    : active
                                      ? "bg-brand-950 text-white"
                                      : "bg-slate-200 text-slate-500"
                            }`}
                        >
                            {done ? <Check className="size-3.5" /> : i + 1}
                        </span>
                        <span className={active ? "text-slate-900" : "text-slate-500"}>
                            {it.label}
                        </span>
                        {i < items.length - 1 && (
                            <span className="flex-1 h-px bg-slate-200" />
                        )}
                    </li>
                );
            })}
        </ol>
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
            {hint && !error && <p className="text-xs text-slate-500 mt-1.5">{hint}</p>}
            <AnimatePresence>
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2 }}
                        className="text-red-600 text-xs mt-1.5 font-medium"
                    >
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>
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
