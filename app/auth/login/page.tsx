"use client";

import { FormEvent, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { sendSignInLinkToEmail } from "firebase/auth";
import { shopAuth } from "@/lib/firebase-client";
import { safeCallback } from "@/lib/shop-account";

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = safeCallback(searchParams.get("callbackUrl"));
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const address = email.trim().toLowerCase();
    if (!address.includes("@")) {
      setError("Enter the email on your order.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      window.localStorage.setItem("emailForSignIn", address);
      window.localStorage.setItem("postLoginRedirect", callbackUrl);
      await sendSignInLinkToEmail(shopAuth(), address, {
        url: `${window.location.origin}/auth/verify`,
        handleCodeInApp: true,
      });
      setSent(true);
    } catch {
      setError("The sign-in link did not send. Try again in a moment.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-[.16em] text-[#ff0030]">Account</p>
      <h1 className="mt-2 text-4xl font-black tracking-tight">Sign in</h1>
      <p className="mt-3 text-sm leading-6 text-neutral-600">We email you a link. The same address collects the print jobs you have already placed. No password.</p>
      {sent ? (
        <p className="mt-8 rounded-2xl bg-neutral-50 p-5 text-sm leading-6 text-neutral-800">Check {email.trim().toLowerCase()} for the sign-in link, then open it on this device.</p>
      ) : (
        <form className="mt-8 grid gap-3" onSubmit={onSubmit}>
          <label className="grid gap-1 text-sm font-semibold">
            Email
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@company.co.ke"
              className="h-12 rounded-xl border border-neutral-200 px-3 font-normal"
            />
          </label>
          {error ? <p className="text-sm text-[#ff0030]">{error}</p> : null}
          <button type="submit" disabled={busy} className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-[#ff0030] px-4 font-semibold text-white disabled:opacity-60">
            {busy ? "Sending…" : "Email me a sign-in link"}
          </button>
        </form>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
