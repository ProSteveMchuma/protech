"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Send } from "lucide-react";

const schema = z.object({ email: z.string().trim().email("Enter a valid email"), product: z.enum(["SerialPro", "QuotePro"]), experience: z.enum(["blocked", "difficult", "good"]), message: z.string().trim().min(10, "Tell us a little more").max(2000), website: z.string().max(0).optional() });
type Values = z.infer<typeof schema>;

export function ProductFeedbackForm({ product }: { product: Values["product"] }) {
    const [sent, setSent] = useState(false), [failed, setFailed] = useState(false);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { product, experience: "good", website: "" } });
    async function submit(values: Values) { setFailed(false); try { const response = await fetch("/api/notify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...values, type: "Product Feedback", source: `${product.toLowerCase()}-feedback` }) }); if (!response.ok) throw new Error(); setSent(true); } catch { setFailed(true); } }
    if (sent) return <div className="rounded-xl border border-emerald-400/25 bg-emerald-400/10 p-6 text-center"><CheckCircle2 className="mx-auto size-8 text-emerald-400" /><h2 className="mt-3 font-black">Feedback received.</h2><p className="mt-2 text-sm text-slate-400">Thank you for helping us improve {product}.</p></div>;
    const field = "mt-2 w-full rounded-lg border border-white/15 bg-[#071019] px-4 py-3 text-sm text-white outline-none focus:border-cyan-300";
    return <form onSubmit={handleSubmit(submit)} className="space-y-5" noValidate>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Email<input {...register("email")} type="email" className={field} placeholder="you@printshop.co.ke" />{errors.email && <span className="mt-1 block normal-case text-rose-300">{errors.email.message}</span>}</label>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Product<select {...register("product")} className={field}><option>SerialPro</option><option>QuotePro</option></select></label>
        <fieldset><legend className="text-xs font-bold uppercase tracking-wider text-slate-400">Your experience</legend><div className="mt-2 grid grid-cols-3 gap-2">{[["blocked","Blocked"],["difficult","Difficult"],["good","Good"]].map(([value,label]) => <label key={value} className="cursor-pointer rounded-lg border border-white/10 p-3 text-center text-xs text-slate-400 has-[:checked]:border-cyan-300 has-[:checked]:text-white"><input {...register("experience")} type="radio" value={value} className="sr-only" />{label}</label>)}</div></fieldset>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">What happened?<textarea {...register("message")} rows={5} className={field} placeholder="What were you trying to do, and what should we improve?" />{errors.message && <span className="mt-1 block normal-case text-rose-300">{errors.message.message}</span>}</label>
        <input {...register("website")} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        {failed && <p role="alert" className="text-sm text-rose-300">Could not send feedback. Please try again.</p>}
        <button disabled={isSubmitting} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-cyan-300 px-5 font-black text-slate-950 disabled:opacity-60"><Send className="size-4" />{isSubmitting ? "Sending…" : "Send feedback"}</button>
    </form>;
}
