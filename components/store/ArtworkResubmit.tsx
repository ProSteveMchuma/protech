"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ArtworkResubmit({
  orderId,
  lineId,
  kind,
}: {
  orderId: string;
  lineId: string;
  kind: "missing" | "rejected";
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const file = new FormData(event.currentTarget).get("file");
    if (!(file instanceof File) || !file.size) {
      setError("Choose a file first.");
      return;
    }
    setBusy(true);
    setError("");
    const body = new FormData();
    body.set("orderId", orderId);
    body.set("lineId", lineId);
    body.set("file", file);
    const response = await fetch("/api/print/artwork", { method: "POST", body });
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    setBusy(false);
    if (!response.ok) {
      setError(payload?.error || "The file did not save.");
      return;
    }
    router.refresh();
  }

  return (
    <form className="mt-3 grid max-w-md gap-2" onSubmit={onSubmit}>
      <p className="text-sm text-neutral-700">
        {kind === "rejected" ? "Artwork needs a new file." : "Send the print file for this line."}
      </p>
      <label className="grid gap-1 text-sm font-semibold">
        Print file
        <input
          name="file"
          type="file"
          required
          accept="application/pdf,image/png,image/jpeg,image/webp"
          className="min-h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-normal"
        />
      </label>
      {error ? <p className="text-sm text-[#ff0030]">{error}</p> : null}
      <button
        type="submit"
        disabled={busy}
        className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-[#ff0030] px-4 text-sm font-semibold text-white disabled:opacity-60"
      >
        {busy ? "Sending…" : "Send file"}
      </button>
    </form>
  );
}
