import { NextResponse } from "next/server";
import { z } from "zod";
import { PACKAGES } from "@/lib/config";
import { initiateStkPush, isDarajaConfigured } from "@/lib/mpesa";

const schema = z.object({
    phone: z.string().trim().min(9).max(15),
    pkgKey: z.string().trim().min(1),
});

export async function POST(req: Request) {
    if (!isDarajaConfigured()) {
        return NextResponse.json(
            { success: false, configured: false, error: "Instant M-Pesa prompt is not enabled yet. Use the Paybill steps below." },
            { status: 200 }
        );
    }
    const parsed = schema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
        return NextResponse.json({ success: false, error: "Enter a valid phone number." }, { status: 400 });
    }
    const pkg = PACKAGES[parsed.data.pkgKey];
    if (!pkg) return NextResponse.json({ success: false, error: "Unknown package" }, { status: 400 });

    const result = await initiateStkPush({
        phone: parsed.data.phone,
        amount: pkg.amount,
        accountRef: pkg.tier,
        description: `ProPrint ${pkg.tier}`,
    });
    return NextResponse.json({
        success: result.ok,
        configured: result.configured,
        message: result.customerMessage,
        error: result.error,
    });
}
