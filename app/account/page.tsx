import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AccountProfile } from "@/components/store/AccountProfile";
import { lineFileState, statusLabels } from "@/lib/order-desk";
import { listAccountOrders } from "@/lib/print-orders";
import { formatKes } from "@/lib/printshop/pricing";

export const metadata: Metadata = {
  title: "Account",
  description: "Your ProPrint orders and profile.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  let user = null;
  try {
    const { currentShopUser } = await import("@/lib/shop-session");
    user = await currentShopUser();
  } catch (err) {
    console.error("[account]", err instanceof Error ? err.message : err);
  }
  if (!user) redirect("/auth/login?callbackUrl=/account");
  const orders = await listAccountOrders(user);
  const greeting = user.name && user.name !== "User" ? user.name.split(" ")[0] : "there";

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-[.16em] text-[#ff0030]">Account</p>
      <h1 className="mt-2 text-4xl font-black tracking-tight">Hello, {greeting}</h1>
      <p className="mt-3 text-sm text-neutral-600">{user.email}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        {user.role === "admin" ? (
          <Link href="/admin" className="inline-flex min-h-11 items-center rounded-2xl bg-neutral-950 px-4 text-sm font-semibold text-white">Open the desk</Link>
        ) : null}
        <Link href="/auth/sign-out" className="inline-flex min-h-11 items-center rounded-2xl border border-neutral-200 px-4 text-sm font-semibold">Sign out</Link>
      </div>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-medium">Orders</h2>
        {orders.length === 0 ? (
          <p className="mt-3 text-sm leading-6 text-neutral-600">No print jobs are attached yet. Place an order with this email, or save the phone number you used at checkout.</p>
        ) : (
          <ul className="mt-4 divide-y divide-neutral-200 border-y border-neutral-200">
            {orders.map((order) => (
              <li key={order.id} className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link href={`/orders/${order.id}`} className="font-bold">{statusLabels[order.status]}</Link>
                    <p className="mt-1 text-sm text-neutral-500">{new Date(order.createdAt).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })} · {order.lines.map((line) => line.title).join(", ")}</p>
                    <p className="mt-1 text-sm text-neutral-500">{order.lines.map((line) => lineFileState(line)).every((state) => state === "accepted") ? "Artwork accepted." : "Artwork still needs a file or a check."}</p>
                  </div>
                  <p className="font-mono font-bold tabular-nums">{formatKes(order.totalKes)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
        <Link href="/shop" className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-[#ff0030]">Back to the shop</Link>
      </section>

      <AccountProfile name={user.name} phone={user.phone} />
    </div>
  );
}
