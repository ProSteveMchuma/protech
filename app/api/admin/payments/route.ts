import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { listPayments, setPaymentStatus, type PaymentStatus } from "@/lib/payments";

export async function GET() {
    if (!(await isAuthenticated())) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ success: true, payments: await listPayments() });
}

export async function PATCH(req: Request) {
    if (!(await isAuthenticated())) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    try {
        const { id, status, note } = await req.json();
        const valid: PaymentStatus[] = ["pending", "verified", "rejected"];
        if (typeof id !== "string" || !valid.includes(status)) {
            return NextResponse.json({ success: false, error: "Bad payload" }, { status: 400 });
        }
        const updated = await setPaymentStatus(id, status, typeof note === "string" ? note : undefined);
        if (!updated) {
            return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, payment: updated });
    } catch {
        return NextResponse.json({ success: false, error: "Bad request" }, { status: 400 });
    }
}
