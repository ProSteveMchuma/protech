import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { listPrintOrders, updatePrintOrderStatus, type PrintOrderStatus } from "@/lib/print-orders";

const statuses: PrintOrderStatus[] = ["received", "confirmed", "printing", "dispatched", "cancelled"];

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  const orders = await listPrintOrders();
  return NextResponse.json({ success: true, orders });
}

export async function PATCH(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id, status } = await req.json();
    if (typeof id !== "string" || !statuses.includes(status)) {
      return NextResponse.json({ success: false, error: "Bad payload" }, { status: 400 });
    }
    const ok = await updatePrintOrderStatus(id, status);
    return NextResponse.json({ success: ok });
  } catch {
    return NextResponse.json({ success: false, error: "Bad request" }, { status: 400 });
  }
}
