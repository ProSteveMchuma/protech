import { NextResponse } from "next/server";
import { z } from "zod";
import { isAuthenticated } from "@/lib/auth";
import { notifyOrderStatus } from "@/lib/order-notify";
import {
  deskOrder,
  getPrintOrder,
  listPrintOrders,
  reviewOrderPayment,
  setOrderInternalNote,
  updatePrintOrderStatus,
  type PrintOrderStatus,
} from "@/lib/print-orders";

const statuses = ["received", "confirmed", "printing", "dispatched", "cancelled"] as const;

const patchSchema = z.union([
  z.object({ id: z.string().min(1), status: z.enum(statuses) }),
  z.object({
    id: z.string().min(1),
    payment: z.object({ state: z.enum(["confirmed", "rejected"]), note: z.string().max(500).optional() }),
  }),
  z.object({ id: z.string().min(1), internalNote: z.string().max(2000) }),
]);

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  const orders = (await listPrintOrders()).map(deskOrder);
  return NextResponse.json({ success: true, orders });
}

export async function PATCH(req: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  const parsed = patchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ success: false, error: "Bad payload" }, { status: 400 });
  const before = await getPrintOrder(parsed.data.id);
  if (!before) return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });

  const order = "status" in parsed.data
    ? await updatePrintOrderStatus(parsed.data.id, parsed.data.status as PrintOrderStatus)
    : "payment" in parsed.data
      ? await reviewOrderPayment(parsed.data.id, parsed.data.payment.state, parsed.data.payment.note)
      : await setOrderInternalNote(parsed.data.id, parsed.data.internalNote);
  if (!order) return NextResponse.json({ success: false }, { status: 404 });
  if (order.status !== before.status) await notifyOrderStatus(order);
  return NextResponse.json({ success: true, order: deskOrder(order) });
}
