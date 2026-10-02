"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { shopAuth } from "@/lib/firebase-client";
import { safeCallback } from "@/lib/shop-account";

function VerifyForm() {
  const router = useRouter();
  const [status, setStatus] = useState("Checking the sign-in link…");
  const [needsName, setNeedsName] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function finish() {
      if (!isSignInWithEmailLink(shopAuth(), window.location.href)) {
        setStatus("This sign-in link is not valid. Request a new one.");
        return;
      }
      const stored = window.localStorage.getItem("emailForSignIn") || "";
      const email = stored || window.prompt("Enter the email that asked for this link") || "";
      if (!email) {
        setStatus("Enter the email address to finish signing in.");
        return;
      }
      try {
        const cred = await signInWithEmailLink(shopAuth(), email.trim().toLowerCase(), window.location.href);
        const idToken = await cred.user.getIdToken();
        const response = await fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        });
        const payload = (await response.json().catch(() => null)) as { needsName?: boolean; role?: string } | null;
        if (!response.ok) {
          setStatus("The link was accepted, but the account did not open. Request a new link.");
          return;
        }
        window.localStorage.removeItem("emailForSignIn");
        if (cancelled) return;
        if (payload?.needsName) {
          setNeedsName(true);
          setStatus("What should we call you?");
          return;
        }
        const next = safeCallback(window.localStorage.getItem("postLoginRedirect"));
        window.localStorage.removeItem("postLoginRedirect");
        router.replace(payload?.role === "admin" && next === "/account" ? "/admin" : next);
      } catch {
        setStatus("This sign-in link has expired. Request a new one.");
      }
    }
    void finish();
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function saveName(event: FormEvent) {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const payload = (await response.json().catch(() => null)) as { error?: string; user?: { role?: string } } | null;
    if (!response.ok) {
      setError(payload?.error || "The name did not save.");
      return;
    }
    const next = safeCallback(window.localStorage.getItem("postLoginRedirect"));
    window.localStorage.removeItem("postLoginRedirect");
    router.replace(payload?.user?.role === "admin" && next === "/account" ? "/admin" : next);
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <h1 className="text-4xl font-black tracking-tight">Sign in</h1>
      <p className="mt-4 text-sm leading-6 text-neutral-600">{status}</p>
      {needsName ? (
        <form className="mt-6 grid gap-3" onSubmit={saveName}>
          <label className="grid gap-1 text-sm font-semibold">
            Your name
            <input value={name} onChange={(event) => setName(event.target.value)} required minLength={2} className="h-12 rounded-xl border border-neutral-200 px-3 font-normal" />
          </label>
          {error ? <p className="text-sm text-[#ff0030]">{error}</p> : null}
          <button type="submit" className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-[#ff0030] px-4 font-semibold text-white">Continue</button>
        </form>
      ) : null}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyForm />
    </Suspense>
  );
}
