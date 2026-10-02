"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function AccountProfile({ name, phone }: { name: string; phone: string }) {
  const router = useRouter();
  const [nextName, setNextName] = useState(name === "User" ? "" : name);
  const [nextPhone, setNextPhone] = useState(phone.startsWith("254") && phone.length === 12 ? `0${phone.slice(3)}` : phone);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setSaved(false);
    const response = await fetch("/api/account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: nextName, phone: nextPhone }),
    });
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    setBusy(false);
    if (!response.ok) {
      setError(payload?.error || "The profile did not save.");
      return;
    }
    setSaved(true);
    router.refresh();
  }

  return (
    <form className="mt-8 grid gap-3 rounded-2xl border border-neutral-200 p-5" onSubmit={onSubmit}>
      <h2 className="font-display text-2xl font-medium">Profile</h2>
      <label className="grid gap-1 text-sm font-semibold">
        Name
        <input value={nextName} onChange={(event) => setNextName(event.target.value)} required minLength={2} className="h-11 rounded-xl border border-neutral-200 px-3 font-normal" />
      </label>
      <label className="grid gap-1 text-sm font-semibold">
        Phone
        <input value={nextPhone} onChange={(event) => setNextPhone(event.target.value)} inputMode="tel" placeholder="0712 345 678" className="h-11 rounded-xl border border-neutral-200 px-3 font-normal" />
      </label>
      {error ? <p className="text-sm text-[#ff0030]">{error}</p> : null}
      {saved ? <p className="text-sm text-neutral-600">Saved. Orders with this phone or email are on this account.</p> : null}
      <button type="submit" disabled={busy} className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-[#ff0030] px-4 text-sm font-semibold text-white disabled:opacity-60">
        {busy ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}
