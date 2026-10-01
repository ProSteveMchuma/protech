import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { statusLabels } from "@/lib/order-desk";
import { getPrintOrder } from "@/lib/print-orders";
import { formatKes } from "@/lib/printshop/pricing";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order status",
  robots: { index: false },
};

export default async function OrderStatusPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getPrintOrder(id);
  if (!order) notFound();
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-[.16em] text-[#ff0030]">Order</p>
      <h1 className="mt-2 text-4xl font-black tracking-tight">{statusLabels[order.status]}</h1>
      <p className="mt-3 font-mono text-sm text-neutral-500">{order.id}</p>
      <ul className="mt-8 divide-y divide-neutral-200 border-y border-neutral-200">
        {order.lines.map((line) => (
          <li key={`${line.slug}-${line.summary}`} className="flex items-start justify-between gap-4 py-4">
            <div>
              <p className="font-bold">{line.title}</p>
              <p className="text-sm text-neutral-500">{line.quantity.toLocaleString("en-KE")} · {line.summary}</p>
            </div>
            <p className="font-mono font-bold tabular-nums">{formatKes(line.totalKes)}</p>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-right font-mono text-2xl font-black tabular-nums">{formatKes(order.totalKes)}</p>
      <p className="mt-2 text-sm text-neutral-500">Delivery to {order.customer.address}, {order.customer.county}. {order.artworkFile ? "Artwork is on the order." : "Artwork is checked before we print."}</p>
      <Link href="/shop" className="mt-8 inline-flex h-11 items-center rounded-2xl bg-[#ff0030] px-4 text-sm font-semibold text-white">Back to the shop</Link>
    </div>
  );
}
