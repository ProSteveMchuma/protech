"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { business } from "@/lib/config";
import { counties } from "@/lib/printshop/content";
import { deliveryFee, formatKes } from "@/lib/printshop/pricing";
import { useCart } from "./CartProvider";

const schema = z.object({
  name: z.string().trim().min(2, "Enter the name to print on the M-Pesa account").max(120),
  email: z.string().trim().email("Enter a valid email").max(200),
  phone: z.string().trim().min(9, "Enter a phone number").max(20),
  town: z.string().trim().min(2, "Enter the town").max(80),
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
  const [done, setDone] = useState("");
  const [error, setError] = useState("");
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", phone: "", town: "", address: "", artwork: "", notes: "", mpesaCode: "", website: "" },
  });
  const [county, setCounty] = useState("Nairobi");
  const fee = deliveryFee(cart.subtotal, county);
  const total = cart.subtotal + fee;

  async function onSubmit(values: Values) {
    setError("");
    const phone = normalizePhone(values.phone);
    if (!/^254\d{9}$/.test(phone)) {
      form.setError("phone", { message: "Use a Kenyan mobile, for example 0712 345 678" });
      return;
    }
    const response = await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "Print Order",
        email: values.email,
        website: values.website,
        name: values.name,
        phone,
        county,
        town: values.town,
        address: values.address,
        artwork: values.artwork,
        notes: values.notes,
        mpesaCode: values.mpesaCode.toUpperCase(),
        subtotalKes: cart.subtotal,
        deliveryKes: fee,
        totalKes: total,
        lines: cart.lines.map((line) => `${line.quantity} × ${line.title} @ ${line.unitKes} (${line.summary})`),
      }),
    });
    if (!response.ok) {
      setError("The order did not save. Keep your M-Pesa code and email it to us.");
      return;
    }
    const payload = (await response.json()) as { leadId?: string | null };
    cart.clear();
    setDone(payload.leadId ?? "received");
  }

  if (!cart.ready) return <p className="text-sm text-neutral-500">Loading your cart…</p>;
  if (done) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
        <h2 className="text-2xl font-black">Order received</h2>
        <p className="mt-2 text-sm leading-6 text-emerald-900">We will confirm payment against Paybill {business.paybill}, then ask for artwork if it is not already linked. Reference {done}.</p>
        <Link href="/shop" className="mt-5 inline-flex h-11 items-center rounded-2xl bg-neutral-950 px-4 text-sm font-semibold text-white">Back to the shop</Link>
      </div>
    );
  }
  if (cart.lines.length === 0) {
    return <p className="text-sm">Your cart is empty. <Link href="/shop" className="font-semibold text-[#ff0030]">Browse products</Link></p>;
  }

  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <input type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" {...form.register("website")} />
      <div className="rounded-2xl bg-neutral-950 p-5 text-white">
        <p className="text-xs font-bold uppercase tracking-[.16em] text-white/60">Paybill</p>
        <p className="mt-2 font-mono text-3xl font-black tabular-nums">{business.paybill}</p>
        <p className="mt-2 text-sm text-white/80">Account name: the full name you enter below. Amount: <span className="font-mono tabular-nums">{formatKes(total)}</span></p>
      </div>
      {([
        ["name", "Full name", "Name on the M-Pesa account"],
        ["email", "Email", "Where we send the confirmation"],
        ["phone", "Phone", "0712 345 678"],
        ["town", "Town", "Westlands, Kisumu CBD, Diani…"],
        ["address", "Delivery address", "Building, street, or landmark"],
        ["artwork", "Artwork link", "Drive, Dropbox, or WeTransfer link (optional)"],
        ["mpesaCode", "M-Pesa code", "e.g. SL12AB34CD"],
      ] as const).map(([name, label, placeholder]) => (
        <label key={name} className="grid gap-1 text-sm font-semibold">
          {label}
          <input className="h-11 rounded-xl border border-neutral-200 px-3 font-normal" placeholder={placeholder} {...form.register(name)} />
          {form.formState.errors[name] && <span className="font-normal text-[#ff0030]">{form.formState.errors[name]?.message}</span>}
        </label>
      ))}
      <label className="grid gap-1 text-sm font-semibold">
        County
        <select className="h-11 rounded-xl border border-neutral-200 px-3 font-normal" value={county} onChange={(event) => setCounty(event.target.value)}>
          {counties.map((item) => <option key={item}>{item}</option>)}
        </select>
      </label>
      <label className="grid gap-1 text-sm font-semibold">
        Notes
        <textarea rows={3} className="rounded-xl border border-neutral-200 px-3 py-3 font-normal" placeholder="Sizes, colours, deadline" {...form.register("notes")} />
      </label>
      <dl className="grid gap-2 rounded-2xl border border-neutral-200 p-4 text-sm">
        <div className="flex justify-between"><dt>Print</dt><dd className="font-mono tabular-nums">{formatKes(cart.subtotal)}</dd></div>
        <div className="flex justify-between"><dt>Delivery</dt><dd className="font-mono tabular-nums">{fee === 0 ? "Free" : formatKes(fee)}</dd></div>
        <div className="flex justify-between border-t border-neutral-100 pt-2 font-bold"><dt>Total</dt><dd className="font-mono tabular-nums">{formatKes(total)}</dd></div>
      </dl>
      {error && <p className="text-sm text-[#ff0030]">{error}</p>}
      <button type="submit" disabled={form.formState.isSubmitting} className="h-12 rounded-2xl bg-[#ff0030] font-semibold text-white disabled:opacity-60">
        {form.formState.isSubmitting ? "Submitting…" : "Submit order"}
      </button>
    </form>
  );
}
