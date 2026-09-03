"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const schema = z.object({
    fullName: z.string().trim().min(2, "Enter your name").max(100),
    email: z.string().trim().email("Enter a valid email").max(200),
    companyName: z.string().trim().min(2, "Enter your print business name").max(150),
    primaryNeed: z.enum(["numbering", "quoting", "both"]),
    website: z.string().max(0).optional(),
});

type Values = z.infer<typeof schema>;
const fieldClass = "mt-2 w-full rounded-lg border border-white/15 bg-[#071019] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/15";

export function BetaSignupForm({ defaultNeed = "both" }: { defaultNeed?: Values["primaryNeed"] }) {
    const [submitted, setSubmitted] = useState(false);
    const [serverError, setServerError] = useState("");
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { primaryNeed: defaultNeed, website: "" } });

    async function submit(values: Values) {
        setServerError("");
        try {
            const response = await fetch("/api/notify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...values, type: "Founding Beta Application", source: "beta-page" }) });
            if (!response.ok) throw new Error("Submission failed");
            setSubmitted(true);
        } catch {
            setServerError("We could not submit your application. Please try again or email support.");
        }
    }

    if (submitted) return <div className="rounded-2xl border border-emerald-400/25 bg-emerald-400/10 p-8 text-center"><CheckCircle2 className="mx-auto size-10 text-emerald-400" /><h2 className="mt-5 text-2xl font-black">Application received.</h2><p className="mt-3 text-sm leading-6 text-slate-300">We will review your print workflow and contact you with the next beta onboarding slot.</p></div>;

    return <form onSubmit={handleSubmit(submit)} className="rounded-2xl border border-white/10 bg-[#0c1822] p-6 shadow-2xl sm:p-8" noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Your name" error={errors.fullName?.message}><input {...register("fullName")} autoComplete="name" className={fieldClass} placeholder="Jane Mwangi" /></Field>
            <Field label="Work email" error={errors.email?.message}><input {...register("email")} type="email" autoComplete="email" className={fieldClass} placeholder="jane@printshop.co.ke" /></Field>
        </div>
        <Field label="Print business" error={errors.companyName?.message}><input {...register("companyName")} autoComplete="organization" className={fieldClass} placeholder="Your company name" /></Field>
        <fieldset className="mt-5"><legend className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">What do you need first?</legend><div className="mt-3 grid gap-2 sm:grid-cols-3">{[["numbering","Numbering"],["quoting","Quotations"],["both","Both tools"]].map(([value,label]) => <label key={value} className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 p-3 text-sm text-slate-300 has-[:checked]:border-cyan-300 has-[:checked]:bg-cyan-300/10 has-[:checked]:text-white"><input {...register("primaryNeed")} type="radio" value={value} className="accent-cyan-300" />{label}</label>)}</div></fieldset>
        <input {...register("website")} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        {serverError && <p role="alert" className="mt-4 text-sm text-rose-300">{serverError}</p>}
        <button disabled={isSubmitting} className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-cyan-300 px-5 py-3 font-black text-slate-950 hover:bg-cyan-200 disabled:cursor-wait disabled:opacity-60">{isSubmitting ? "Submitting…" : "Apply for founding access"}<ArrowRight className="size-4" /></button>
        <p className="mt-4 text-center text-xs leading-5 text-slate-500">No payment required. We will contact you before activating a beta workspace.</p>
    </form>;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) { return <label className="mt-5 block first:mt-0"><span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">{label}</span>{children}{error && <span className="mt-1 block text-xs text-rose-300">{error}</span>}</label>; }
