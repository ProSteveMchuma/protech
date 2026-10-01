"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(120),
  email: z.string().trim().email("Enter a valid email").max(200),
  phone: z.string().trim().max(30).optional(),
  subject: z.string().trim().min(2).max(160),
  message: z.string().trim().min(10, "Tell us the product, quantity and deadline").max(4000),
  website: z.string().max(200).optional(),
});

type Values = z.infer<typeof schema>;

export function ContactForm({ defaultSubject }: { defaultSubject: string }) {
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", phone: "", subject: defaultSubject, message: "", website: "" },
  });

  async function onSubmit(values: Values) {
    setError("");
    const response = await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "Print Quote", ...values }),
    });
    if (!response.ok) {
      setError("We could not send that message. Email us directly and we will pick it up.");
      return;
    }
    setDone(true);
  }

  if (done) {
    return <p className="rounded-2xl bg-emerald-50 p-5 text-sm leading-6 text-emerald-800">Message received. We reply with a quote, file check, or a question if the specification needs one detail.</p>;
  }

  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <input type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" {...form.register("website")} />
      <label className="grid gap-1 text-sm font-semibold">
        Full name
        <input className="h-11 rounded-xl border border-neutral-200 px-3 font-normal" placeholder="Your full name" {...form.register("name")} />
        {form.formState.errors.name && <span className="font-normal text-[#ff0030]">{form.formState.errors.name.message}</span>}
      </label>
      <label className="grid gap-1 text-sm font-semibold">
        Email
        <input type="email" className="h-11 rounded-xl border border-neutral-200 px-3 font-normal" placeholder="Your email address" {...form.register("email")} />
        {form.formState.errors.email && <span className="font-normal text-[#ff0030]">{form.formState.errors.email.message}</span>}
      </label>
      <label className="grid gap-1 text-sm font-semibold">
        Phone
        <input className="h-11 rounded-xl border border-neutral-200 px-3 font-normal" placeholder="Your phone number (optional)" {...form.register("phone")} />
      </label>
      <label className="grid gap-1 text-sm font-semibold">
        Subject
        <input className="h-11 rounded-xl border border-neutral-200 px-3 font-normal" {...form.register("subject")} />
      </label>
      <label className="grid gap-1 text-sm font-semibold">
        Message
        <textarea rows={5} className="rounded-xl border border-neutral-200 px-3 py-3 font-normal" placeholder="Product, quantity, size, finish and deadline" {...form.register("message")} />
        {form.formState.errors.message && <span className="font-normal text-[#ff0030]">{form.formState.errors.message.message}</span>}
      </label>
      {error && <p className="text-sm text-[#ff0030]">{error}</p>}
      <button type="submit" disabled={form.formState.isSubmitting} className="h-12 rounded-2xl bg-[#ff0030] font-semibold text-white disabled:opacity-60">
        {form.formState.isSubmitting ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
