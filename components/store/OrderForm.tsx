"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { business } from "@/lib/config";
import { counties } from "@/lib/printshop/content";
import { deliveryFee, formatKes } from "@/lib/printshop/pricing";
import { useCart } from "./CartProvider";

const schema = z.object({
  name: z.string().trim().min(2, "Enter the name on the M-Pesa account").max(120),
  email: z.string().trim().email("Enter a valid email").max(200),
  phone: z.string().trim().min(9, "Enter a phone number").max(20),
  address: z.string().trim().min(6, "Enter a delivery address").max(240),
  artwork: z.string().trim().max(400).optional(),
  notes: z.string().trim().max(2000).optional(),
  mpesaCode: z.string().trim().min(6, "Enter the M-Pesa code").max(20),
  website: z.string().max(200).optional(),
});

type Values = z.infer<typeof schema>;

function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("254") && digits.length === 12) return digits;
  if (digits.startsWith("0") && digits.length === 10) return `254${digits.slice(1)}`;
  if (digits.length === 9) return `254${digits}`;
  return digits;
}

export function OrderForm() {
  const cart = useCart();
  const [step, setStep] = useState<1 | 2>(1);
  const [done, setDone] = useState("");
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [artworkFile, setArtworkFile] = useState<File | null>(null);
  const [county, setCounty] = useState("Nairobi");
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", phone: "", address: "", artwork: "", notes: "", mpesaCode: "", website: "" },
  });
  const fee = deliveryFee(cart.subtotal, county);
  const total = cart.subtotal + fee;

  async function onSubmit(values: Values) {
    setError("");
    const phone = normalizePhone(values.phone);
    if (!/^254\d{9}$/.test(phone)) {
      form.setError("phone", { message: "Use a Kenyan mobile, for example 0712 345 678" });
      setStep(1);
      return;
    }
    const response = await fetch("/api/print/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: values.email,
        website: values.website,
        name: values.name,
        phone,
        county,
        address: values.address,
        artwork: values.artwork,
        notes: values.notes,
        mpesaCode: values.mpesaCode.toUpperCase(),
        lines: cart.lines.map((line) => ({
          slug: line.slug,
          quantity: line.quantity,
          spec: line.spec ?? { slug: line.slug, quantity: line.quantity, turnaround: "standard" },
        })),
      }),
    });
    const payload = (await response.json()) as { orderId?: string; artworkToken?: string; totalKes?: number; error?: string };
    if (!response.ok || !payload.orderId) {
      setError(payload.error || "The order did not save. Keep your M-Pesa code and email it to us.");
      return;
    }
    if (artworkFile && payload.artworkToken) {
      const body = new FormData();
      body.set("orderId", payload.orderId);
      body.set("token", payload.artworkToken);
      body.set("file", artworkFile);
      const uploaded = await fetch("/api/print/artwork", { method: "POST", body });
      if (!uploaded.ok) setWarning("The order is saved. The artwork file did not upload — send it on WhatsApp with your M-Pesa code.");
    }
    if (typeof payload.totalKes === "number" && Math.abs(payload.totalKes - total) > 1) {
      setWarning(`The confirmed total is ${formatKes(payload.totalKes)}. Your reference is saved; we will confirm the M-Pesa amount against it.`);
    }
    cart.clear();
    setDone(payload.orderId);
  }

  if (!cart.ready) return <p className="text-sm text-neutral-500">Loading your cart…</p>;
  if (done) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
        <h2 className="text-2xl font-black">Order received</h2>
        <p className="mt-2 text-sm leading-6 text-emerald-900">We match Paybill {business.paybill} to this order, then check the artwork before printing.</p>
        {warning && <p className="mt-3 text-sm text-[#ff0030]">{warning}</p>}
        <Link href={`/orders/${done}`} className="mt-5 inline-flex h-11 items-center rounded-2xl bg-neutral-950 px-4 text-sm font-semibold text-white">Track this order</Link>
      </div>
    );
  }
  if (cart.lines.length === 0) {
    return <p className="text-sm">Your cart is empty. <Link href="/shop" className="font-semibold text-[#ff0030]">Browse products</Link></p>;
  }

  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <input type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" {...form.register("website")} />
      <dl className="grid gap-2 rounded-2xl border border-neutral-200 p-4 text-sm">
        {cart.lines.map((line) => (
          <div key={line.lineId} className="flex justify-between gap-3">
            <dt>{line.quantity.toLocaleString("en-KE")} × {line.title}</dt>
            <dd className="font-mono tabular-nums">{formatKes(line.totalKes)}</dd>
          </div>
        ))}
        <div className="flex justify-between"><dt>Delivery · {county}</dt><dd className="font-mono tabular-nums">{fee === 0 ? "Free" : formatKes(fee)}</dd></div>
        <div className="flex justify-between border-t border-neutral-100 pt-2 font-bold"><dt>Total</dt><dd className="font-mono tabular-nums">{formatKes(total)}</dd></div>
      </dl>

      {step === 1 ? (
        <>
          <Field label="Full name" error={form.formState.errors.name?.message}>
            <input className={inputClass} placeholder="Name on the M-Pesa account" {...form.register("name")} />
          </Field>
          <Field label="Phone" error={form.formState.errors.phone?.message}>
            <input className={inputClass} placeholder="0712 345 678" {...form.register("phone")} />
          </Field>
          <Field label="Email" error={form.formState.errors.email?.message}>
            <input className={inputClass} placeholder="Where we send the confirmation" {...form.register("email")} />
          </Field>
          <label className="grid gap-1 text-sm font-semibold">
            County
            <select className={inputClass} value={county} onChange={(event) => setCounty(event.target.value)}>
              {counties.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <button
            type="button"
            className="h-12 rounded-2xl bg-[#ff0030] font-semibold text-white"
            onClick={async () => {
              const valid = await form.trigger(["name", "email", "phone"]);
              const phone = normalizePhone(form.getValues("phone"));
              if (!/^254\d{9}$/.test(phone)) {
                form.setError("phone", { message: "Use a Kenyan mobile, for example 0712 345 678" });
                return;
              }
              if (valid) setStep(2);
            }}
          >
            Continue to payment
          </button>
        </>
      ) : (
        <>
          <Field label="Delivery address" error={form.formState.errors.address?.message}>
            <input className={inputClass} placeholder="Town, building, street, or landmark" {...form.register("address")} />
          </Field>
          <div className="rounded-2xl bg-neutral-950 p-5 text-white">
            <p className="text-xs font-bold uppercase tracking-[.16em] text-white/60">Paybill {business.paybill}</p>
            <p className="mt-2 font-mono text-3xl font-black tabular-nums">{formatKes(total)}</p>
            <p className="mt-2 text-sm text-white/80">Account name: the full name from the step before.</p>
          </div>
          <Field label="M-Pesa code" error={form.formState.errors.mpesaCode?.message}>
            <input className={inputClass} placeholder="SL12AB34CD" {...form.register("mpesaCode")} />
          </Field>
          <details>
            <summary className="cursor-pointer text-sm font-semibold text-neutral-600">Artwork link, if you have one</summary>
            <div className="mt-3 grid gap-3">
              <input className={inputClass} placeholder="Drive, Dropbox, or WeTransfer" {...form.register("artwork")} />
              <input type="file" accept="application/pdf,image/png,image/jpeg,image/webp" className="text-sm" onChange={(event) => setArtworkFile(event.target.files?.[0] ?? null)} />
              <textarea rows={3} className="rounded-xl border border-neutral-200 px-3 py-3 text-sm" placeholder="Notes for the printer" {...form.register("notes")} />
            </div>
          </details>
          {error && <p className="text-sm text-[#ff0030]">{error}</p>}
          <p className="text-xs leading-5 text-neutral-500">
            We print after the payment matches. By submitting you agree to the <Link href="/terms" className="font-semibold text-neutral-950">print terms</Link>.
          </p>
          <div className="grid grid-cols-[auto_1fr] gap-2">
            <button type="button" className="h-12 rounded-2xl border border-neutral-200 px-4 text-sm font-semibold" onClick={() => setStep(1)}>Back</button>
            <button type="submit" disabled={form.formState.isSubmitting} className="h-12 rounded-2xl bg-[#ff0030] font-semibold text-white disabled:opacity-60">
              {form.formState.isSubmitting ? "Submitting…" : "Submit order"}
            </button>
          </div>
        </>
      )}
    </form>
  );
}

const inputClass = "h-11 rounded-xl border border-neutral-200 px-3 text-sm font-normal";

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="grid gap-1 text-sm font-semibold">
      {label}
      {children}
      {error && <span className="font-normal text-[#ff0030]">{error}</span>}
    </label>
  );
}
