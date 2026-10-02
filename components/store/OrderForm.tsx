"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { business, pickup } from "@/lib/config";
import { counties } from "@/lib/printshop/content";
import { formatKes, shippingFee } from "@/lib/printshop/pricing";
import { useCart } from "./CartProvider";

const schema = z.object({
  name: z.string().trim().min(2, "Enter the name on the M-Pesa account").max(80),
  email: z.string().trim().email("Enter a valid email").max(200),
  phone: z.string().trim().min(9, "Enter a phone number").max(20),
  address: z.string().trim().max(240).optional(),
  artwork: z.string().trim().max(400).optional(),
  notes: z.string().trim().max(2000).optional(),
  mpesaCode: z.string().trim().max(20).optional(),
  website: z.string().max(200).optional(),
});

type Values = z.infer<typeof schema>;
type Method = "delivery" | "pickup";

function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("254") && digits.length === 12) return digits;
  if (digits.startsWith("0") && digits.length === 10) return `254${digits.slice(1)}`;
  if (digits.length === 9) return `254${digits}`;
  return digits;
}

const steps = ["Delivery", "Payment", "Review"] as const;

export function OrderForm() {
  const cart = useCart();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [method, setMethod] = useState<Method>("delivery");
  const [county, setCounty] = useState("Nairobi");
  const [done, setDone] = useState("");
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [files, setFiles] = useState<Record<string, File>>({});
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", phone: "", address: "", artwork: "", notes: "", mpesaCode: "", website: "" },
  });
  const fee = shippingFee(cart.subtotal, method === "pickup" ? pickup.county : county, method);
  const total = cart.subtotal + fee;
  const name = form.watch("name");
  const phone = form.watch("phone");
  const email = form.watch("email");
  const address = form.watch("address");
  const mpesaCode = form.watch("mpesaCode");

  function phoneError() {
    if (!/^254\d{9}$/.test(normalizePhone(form.getValues("phone")))) {
      form.setError("phone", { message: "Use a Kenyan mobile, for example 0712 345 678" });
      return true;
    }
    return false;
  }

  async function continueFromDelivery() {
    const valid = await form.trigger(["name", "email", "phone"]);
    if (phoneError() || !valid) return;
    if (method === "delivery" && (form.getValues("address") ?? "").trim().length < 6) {
      form.setError("address", { message: "Enter the town, building or landmark" });
      return;
    }
    setStep(2);
  }

  function continueFromPayment() {
    const code = (form.getValues("mpesaCode") ?? "").trim();
    if (code.length < 6) {
      form.setError("mpesaCode", { message: "Enter the M-Pesa confirmation code" });
      return;
    }
    form.clearErrors("mpesaCode");
    setStep(3);
  }

  async function onSubmit(values: Values) {
    setError("");
    const normalized = normalizePhone(values.phone);
    if (!/^254\d{9}$/.test(normalized)) {
      form.setError("phone", { message: "Use a Kenyan mobile, for example 0712 345 678" });
      setStep(1);
      return;
    }
    const code = (values.mpesaCode ?? "").trim();
    if (code.length < 6) {
      form.setError("mpesaCode", { message: "Enter the M-Pesa confirmation code" });
      setStep(2);
      return;
    }
    const destination = method === "pickup" ? pickup.address : (values.address ?? "").trim();
    if (destination.length < 6) {
      form.setError("address", { message: "Enter the town, building or landmark" });
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
        phone: normalized,
        county: method === "pickup" ? pickup.county : county,
        address: destination,
        fulfillment: method,
        artwork: values.artwork,
        notes: values.notes,
        mpesaCode: code.toUpperCase(),
        lines: cart.lines.map((line) => ({
          lineId: line.lineId,
          slug: line.slug,
          quantity: line.quantity,
          spec: line.spec ?? { slug: line.slug, quantity: line.quantity, turnaround: "standard" },
        })),
      }),
    });
    const payload = (await response.json()) as { orderId?: string; artworkToken?: string; totalKes?: number; error?: string };
    if (!response.ok || !payload.orderId) {
      setError(payload.error || "The order did not save. Keep your M-Pesa code and send it on WhatsApp.");
      return;
    }
    if (payload.artworkToken) {
      for (const line of cart.lines) {
        const file = files[line.lineId];
        if (!file) continue;
        const body = new FormData();
        body.set("orderId", payload.orderId);
        body.set("token", payload.artworkToken);
        body.set("lineId", line.lineId);
        body.set("file", file);
        const uploaded = await fetch("/api/print/artwork", { method: "POST", body });
        if (!uploaded.ok) setWarning("The order is saved. One artwork file did not upload — send it on WhatsApp with your M-Pesa code.");
      }
    }
    if (typeof payload.totalKes === "number" && Math.abs(payload.totalKes - total) > 1) {
      setWarning(`The confirmed total is ${formatKes(payload.totalKes)}. We will match the M-Pesa amount against it.`);
    }
    cart.clear();
    setDone(payload.orderId);
  }

  if (!cart.ready) return <p className="text-sm text-neutral-500">Loading your cart…</p>;
  if (done) {
    return (
      <div className="mt-8 max-w-xl border border-neutral-200 p-6">
        <h2 className="font-display text-3xl font-medium">Order received</h2>
        <p className="mt-3 text-sm leading-6 text-neutral-700">We match Paybill {business.paybill} to this order, then check the artwork before printing.</p>
        <p className="mt-2 text-sm leading-6 text-neutral-700">
          {method === "pickup"
            ? `Collect at ${pickup.address} once the job is printed. We will message you when it is ready.`
            : `We deliver to ${address}, ${county}.`}
        </p>
        {warning && <p className="mt-3 text-sm text-[#ff0030]">{warning}</p>}
        <Link href={`/orders/${done}`} className="mt-6 inline-flex h-12 items-center rounded-full bg-[#ff0030] px-5 text-sm font-medium text-white">Track this order</Link>
      </div>
    );
  }
  if (cart.lines.length === 0) {
    return <p className="mt-8 text-sm">Your cart is empty. <Link href="/shop" className="font-medium text-neutral-950 underline">Start shopping</Link></p>;
  }

  return (
    <form className="mt-8 lg:grid lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-12" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <input type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" {...form.register("website")} />
      <div>
        <ol className="grid grid-cols-3 gap-2 text-sm">
          {steps.map((label, index) => {
            const number = (index + 1) as 1 | 2 | 3;
            const current = step === number;
            return (
              <li key={label}>
                <button
                  type="button"
                  disabled={number > step}
                  onClick={() => { if (number < step) setStep(number); }}
                  className={`flex h-11 w-full items-center justify-center gap-2 border ${current ? "border-neutral-950 text-neutral-950" : "border-neutral-200 text-neutral-500"}`}
                >
                  <span className="font-mono text-xs tabular-nums">{number}</span>
                  {label}
                </button>
              </li>
            );
          })}
        </ol>

        {step === 1 && (
          <section className="mt-8">
            <h2 className="font-display text-2xl font-medium">How should we get this to you?</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-600">Choose delivery or collection first. We only ask for the details that apply.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={() => setMethod("delivery")} className={`border p-4 text-left ${method === "delivery" ? "border-neutral-950" : "border-neutral-200"}`}>
                <p className="font-medium">Deliver to me</p>
                <p className="mt-1 text-sm leading-6 text-neutral-600">Nairobi {formatKes(400)}. Other counties {formatKes(850)}. Free over {formatKes(10000)}.</p>
              </button>
              <button type="button" onClick={() => setMethod("pickup")} className={`border p-4 text-left ${method === "pickup" ? "border-neutral-950" : "border-neutral-200"}`}>
                <p className="font-medium">Collect / Pickup</p>
                <p className="mt-1 text-sm leading-6 text-neutral-600">{pickup.address}. Ready after we confirm payment and the job is printed.</p>
                <p className="mt-2 font-mono text-sm tabular-nums">FREE</p>
              </button>
            </div>
            <div className="mt-8 grid gap-4">
              <h3 className="text-sm font-medium">Contact details</h3>
              <Field label="Full name" error={form.formState.errors.name?.message}>
                <input className={inputClass} autoComplete="name" placeholder="Name on the M-Pesa account" {...form.register("name")} />
              </Field>
              <Field label="Phone number" error={form.formState.errors.phone?.message}>
                <input className={inputClass} autoComplete="tel" inputMode="tel" placeholder="0712 345 678" {...form.register("phone")} />
              </Field>
              <Field label="Email" error={form.formState.errors.email?.message}>
                <input className={inputClass} autoComplete="email" placeholder="Where we send the confirmation" {...form.register("email")} />
              </Field>
              {method === "delivery" && (
                <>
                  <h3 className="pt-2 text-sm font-medium">Delivery address</h3>
                  <label className="grid gap-1 text-sm font-medium">
                    County
                    <select className={inputClass} value={county} onChange={(event) => setCounty(event.target.value)}>
                      {counties.map((item) => <option key={item}>{item}</option>)}
                    </select>
                  </label>
                  <Field label="Town, building or landmark" error={form.formState.errors.address?.message}>
                    <input className={inputClass} autoComplete="street-address" placeholder="Estate, street, building" {...form.register("address")} />
                  </Field>
                  <p className="text-sm text-neutral-600">Delivery to {county} is {fee === 0 ? "free" : formatKes(fee)}.</p>
                </>
              )}
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="mt-8">
            <h2 className="font-display text-2xl font-medium">Pay with M-Pesa Paybill</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-600">This is a manual payment. We do not send a prompt to your phone. Pay the amount below, then paste the confirmation code.</p>
            <ol className="mt-6 grid gap-3 text-sm leading-6">
              <li>1. Open M-Pesa on your phone.</li>
              <li>2. Choose Lipa na M-Pesa.</li>
              <li>3. Choose Pay Bill.</li>
              <li>4. Business number <span className="font-mono tabular-nums text-neutral-950">{business.paybill}</span>.</li>
              <li>5. Account number <span className="font-medium text-neutral-950">{name.trim() || "the full name on this order"}</span>.</li>
              <li>6. Amount <span className="font-mono tabular-nums text-neutral-950">{formatKes(total)}</span>.</li>
              <li>7. Enter your M-Pesa PIN. Do not send the PIN to us.</li>
              <li>8. Copy the confirmation code from the M-Pesa message and paste it below.</li>
            </ol>
            <div className="mt-6">
              <Field label="M-Pesa confirmation code" error={form.formState.errors.mpesaCode?.message}>
                <input className={`${inputClass} font-mono uppercase`} autoCapitalize="characters" placeholder="SL12AB34CD" {...form.register("mpesaCode")} />
              </Field>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="mt-8">
            <h2 className="font-display text-2xl font-medium">Review your order</h2>
            <dl className="mt-6 grid gap-4 text-sm">
              <div>
                <dt className="text-neutral-500">{method === "pickup" ? "Collection" : "Delivery"}</dt>
                <dd className="mt-1">{method === "pickup" ? pickup.address : `${address}, ${county}`}</dd>
              </div>
              <div>
                <dt className="text-neutral-500">Contact</dt>
                <dd className="mt-1">{name}<br />{phone}<br />{email}</dd>
              </div>
              <div>
                <dt className="text-neutral-500">Payment</dt>
                <dd className="mt-1">Paybill <span className="font-mono tabular-nums">{business.paybill}</span>, account {name}. Code <span className="font-mono uppercase">{mpesaCode}</span>.</dd>
              </div>
            </dl>
            <div className="mt-6 grid gap-3">
              {cart.lines.map((line) => (
                <label key={line.lineId} className="grid gap-1 text-sm font-medium">
                  Artwork for {line.title}
                  <span className="text-xs font-normal text-neutral-500">{line.summary}</span>
                  <input type="file" accept="application/pdf,image/png,image/jpeg,image/webp" className="text-sm" onChange={(event) => {
                    const file = event.target.files?.[0];
                    setFiles((current) => {
                      const next = { ...current };
                      if (file) next[line.lineId] = file;
                      else delete next[line.lineId];
                      return next;
                    });
                  }} />
                </label>
              ))}
              <Field label="Artwork link, if the files are already online">
                <input className={inputClass} placeholder="Drive, Dropbox or WeTransfer" {...form.register("artwork")} />
              </Field>
              <Field label="Notes for the printer">
                <textarea rows={3} className="rounded-xl border border-neutral-200 px-3 py-3 text-base" placeholder="Deadline, finish, or anything we should know" {...form.register("notes")} />
              </Field>
            </div>
            {error && <p className="mt-4 text-sm text-[#ff0030]">{error}</p>}
            <p className="mt-4 text-xs leading-5 text-neutral-500">
              We print after the payment matches and the artwork for each item is accepted. By submitting you agree to the <Link href="/terms" className="text-neutral-950 underline">print terms</Link>.
            </p>
          </section>
        )}

        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:static md:mt-8 md:border-0 md:bg-transparent md:p-0">
          <div className="mx-auto flex max-w-3xl gap-2">
            {step > 1 && (
              <button type="button" className="h-12 rounded-full border border-neutral-200 px-4 text-sm" onClick={() => setStep((current) => (current === 3 ? 2 : 1))}>Back</button>
            )}
            {step === 1 && (
              <button type="button" className="h-12 flex-1 rounded-full bg-[#ff0030] text-sm font-medium text-white" onClick={continueFromDelivery}>Continue · {formatKes(total)}</button>
            )}
            {step === 2 && (
              <button type="button" className="h-12 flex-1 rounded-full bg-[#ff0030] text-sm font-medium text-white" onClick={continueFromPayment}>Review · {formatKes(total)}</button>
            )}
            {step === 3 && (
              <button type="submit" disabled={form.formState.isSubmitting} className="h-12 flex-1 rounded-full bg-[#ff0030] text-sm font-medium text-white disabled:opacity-60">
                {form.formState.isSubmitting ? "Submitting…" : "Submit payment for verification"}
              </button>
            )}
          </div>
        </div>
      </div>

      <aside className="mt-8 border border-neutral-200 p-5 lg:sticky lg:top-24 lg:mt-0">
        <h2 className="text-sm font-medium">Order summary</h2>
        <ul className="mt-4 grid gap-3 text-sm">
          {cart.lines.map((line) => (
            <li key={line.lineId} className="flex justify-between gap-3">
              <span>{line.quantity.toLocaleString("en-KE")} × {line.title}</span>
              <span className="shrink-0 font-mono tabular-nums">{formatKes(line.totalKes)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 grid gap-2 border-t border-neutral-200 pt-4 text-sm">
          <div className="flex justify-between"><dt className="text-neutral-600">Subtotal</dt><dd className="font-mono tabular-nums">{formatKes(cart.subtotal)}</dd></div>
          <div className="flex justify-between"><dt className="text-neutral-600">{method === "pickup" ? "Collection" : `Delivery · ${county}`}</dt><dd className="font-mono tabular-nums">{fee === 0 ? "Free" : formatKes(fee)}</dd></div>
          <div className="flex justify-between pt-2 text-base"><dt>Total</dt><dd className="font-mono tabular-nums">{formatKes(total)}</dd></div>
        </dl>
      </aside>
    </form>
  );
}

const inputClass = "h-12 rounded-xl border border-neutral-200 px-3 text-base font-normal";

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="grid gap-1 text-sm font-medium">
      {label}
      {children}
      {error && <span className="font-normal text-[#ff0030]">{error}</span>}
    </label>
  );
}
