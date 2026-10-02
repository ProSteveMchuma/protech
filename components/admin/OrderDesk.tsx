"use client";

import { useState } from "react";
import Link from "next/link";
import { statusLabels } from "@/lib/order-desk";
import type { PrintOrder, PrintOrderStatus } from "@/lib/print-orders";
import { formatKes } from "@/lib/printshop/pricing";
import { whatsappHrefFor } from "@/lib/whatsapp";

const statuses: PrintOrderStatus[] = ["received", "confirmed", "printing", "ready", "dispatched", "cancelled"];
const fileLabels = { missing: "No file yet", received: "Received, not accepted", accepted: "Accepted", rejected: "Sent back" };

export function OrderDesk({ initialOrder }: { initialOrder: PrintOrder }) {
  const [order, setOrder] = useState(initialOrder);
  const [note, setNote] = useState(initialOrder.internalNote ?? "");
  const [paymentNote, setPaymentNote] = useState(initialOrder.payment?.note ?? "");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function patch(body: Record<string, unknown>) {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: order.id, ...body }),
      });
      const payload = (await response.json()) as { order?: PrintOrder; error?: string };
      if (!response.ok || !payload.order) {
        setMessage(payload.error || "The order did not update.");
        return;
      }
      setOrder(payload.order);
      setMessage("Saved.");
    } finally {
      setBusy(false);
    }
  }

  async function upload(lineId: string, file: File) {
    setBusy(true);
    setMessage("");
    try {
      const body = new FormData();
      body.set("file", file);
      body.set("lineId", lineId);
      const response = await fetch(`/api/admin/orders/${order.id}/artwork`, { method: "POST", body });
      const payload = (await response.json()) as { order?: PrintOrder; error?: string };
      if (!response.ok || !payload.order) {
        setMessage(payload.error || "The file did not save.");
        return;
      }
      setOrder(payload.order);
      setMessage("Artwork saved.");
    } finally {
      setBusy(false);
    }
  }

  const track = `https://www.proinnovationtech.co.ke/orders/${order.id}`;
  const whatsapp = whatsappHrefFor(order.customer.phone, `Hello ${order.customer.name}, your ProPrint order is ${order.status}. ${statusLabels[order.status]} Track it here: ${track}`);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link href="/admin" className="text-sm font-semibold">All orders</Link>
      <p className="mt-4 text-xs font-bold uppercase tracking-[.16em] text-[#ff0030]">{order.status}</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight">{order.customer.name}</h1>
      <p className="mt-2 text-sm text-neutral-600">{order.customer.phone} · {order.customer.email}<br />{order.customer.address}, {order.customer.county}</p>
      <p className="mt-2 font-mono text-xs text-neutral-500">{order.id}</p>

      <ul className="mt-6 divide-y divide-neutral-200 border-y border-neutral-200">
        {order.lines.map((line) => (
          <li key={line.lineId || `${line.slug}-${line.summary}`} className="grid gap-3 py-4 sm:grid-cols-[minmax(0,1fr)_auto]">
            <div>
              <p className="font-bold">{line.title}</p>
              <p className="text-sm text-neutral-500">{line.quantity.toLocaleString("en-KE")} · {line.summary}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">{fileLabels[line.fileState ?? "missing"]}</p>
              {line.artworkFile ? (
                <a className="text-sm font-semibold" href={`/api/admin/orders/${order.id}/artwork?line=${line.lineId}`}>{line.artworkFile.name}</a>
              ) : null}
              {line.lineId ? (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <input type="file" accept="application/pdf,image/png,image/jpeg,image/webp" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(line.lineId, file); }} />
                  <button type="button" disabled={busy} className="h-9 rounded-full bg-neutral-950 px-3 text-xs font-semibold text-white" onClick={() => patch({ lineId: line.lineId, fileState: "accepted" })}>Accept file</button>
                  <button type="button" disabled={busy} className="h-9 rounded-full border border-neutral-300 px-3 text-xs font-semibold" onClick={() => patch({ lineId: line.lineId, fileState: "rejected" })}>Send back</button>
                </div>
              ) : null}
            </div>
            <p className="font-mono font-bold tabular-nums">{formatKes(line.totalKes)}</p>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-right text-sm text-neutral-500">{order.fulfillment === "pickup" ? "Collection" : "Delivery"} {formatKes(order.deliveryKes)}</p>
      <p className="text-right font-mono text-2xl font-black tabular-nums">{formatKes(order.totalKes)}</p>

      <section className="mt-8 grid gap-3 rounded-2xl border border-neutral-200 p-4">
        <h2 className="font-bold">M-Pesa {order.mpesaCode}</h2>
        <p className="text-sm text-neutral-600">Payment is {order.payment?.state ?? "unreviewed"}.</p>
        <textarea value={paymentNote} onChange={(event) => setPaymentNote(event.target.value)} rows={2} maxLength={500} placeholder="What you saw on the Paybill statement" className="rounded-xl border border-neutral-200 px-3 py-2 text-sm" />
        <div className="flex flex-wrap gap-2">
          <button type="button" disabled={busy} onClick={() => patch({ payment: { state: "confirmed", note: paymentNote } })} className="h-11 rounded-full bg-neutral-950 px-4 text-sm font-semibold text-white">Confirm payment</button>
          <button type="button" disabled={busy} onClick={() => patch({ payment: { state: "rejected", note: paymentNote } })} className="h-11 rounded-full border border-neutral-300 px-4 text-sm font-semibold">Reject code</button>
        </div>
      </section>

      <section className="mt-4 grid gap-3 rounded-2xl border border-neutral-200 p-4">
        <h2 className="font-bold">Status</h2>
        <select className="h-11 rounded-xl border border-neutral-200 px-3 text-sm font-semibold" value={order.status} disabled={busy} onChange={(event) => patch({ status: event.target.value })}>
          {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
        </select>
        <a href={whatsapp} className="text-sm font-semibold text-[#128C7E]" target="_blank" rel="noopener noreferrer">Send this status on WhatsApp</a>
        <ol className="grid gap-1 text-sm text-neutral-500">
          {order.statusHistory.map((entry) => <li key={`${entry.status}-${entry.at}`}>{entry.at.slice(0, 16).replace("T", " ")} · {entry.status}</li>)}
        </ol>
      </section>

      <section className="mt-4 grid gap-3 rounded-2xl border border-neutral-200 p-4">
        <h2 className="font-bold">Artwork</h2>
        {order.artwork && <p className="text-sm break-all">Link: {order.artwork}</p>}
        {order.artworkFile ? (
          <a className="text-sm font-semibold" href={`/api/admin/orders/${order.id}/artwork`}>{order.artworkFile.name} · {Math.ceil(order.artworkFile.size / 1024)} KB</a>
        ) : (
          <p className="text-sm text-neutral-500">Files are attached to each line. Accept a file before the job can be marked printing.</p>
        )}
        {order.notes && <p className="text-sm text-neutral-600">Customer note: {order.notes}</p>}
      </section>

      <section className="mt-4 grid gap-3 rounded-2xl border border-neutral-200 p-4">
        <h2 className="font-bold">Desk note</h2>
        <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={3} maxLength={2000} placeholder="Only the desk sees this" className="rounded-xl border border-neutral-200 px-3 py-2 text-sm" />
        <button type="button" disabled={busy} onClick={() => patch({ internalNote: note })} className="h-11 justify-self-start rounded-full border border-neutral-300 px-4 text-sm font-semibold">Save note</button>
      </section>
      {message && <p className="mt-4 text-sm font-semibold">{message}</p>}
    </div>
  );
}
