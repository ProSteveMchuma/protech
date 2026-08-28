import { NextResponse } from "next/server";
import { submitPayment } from "@/lib/payments";
import { sendNotification } from "@/lib/email";
import { PACKAGES, business } from "@/lib/config";

const MPESA_CODE_RE = /^[A-Z0-9]{8,12}$/;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            customerName,
            customerEmail,
            customerPhone,
            mpesaCode,
            pkgKey,
        } = body ?? {};

        if (
            typeof customerName !== "string" ||
            customerName.trim().length < 2
        ) {
            return NextResponse.json(
                { success: false, error: "Full name is required" },
                { status: 400 }
            );
        }
        if (
            typeof customerEmail !== "string" ||
            !customerEmail.includes("@")
        ) {
            return NextResponse.json(
                { success: false, error: "Valid email is required" },
                { status: 400 }
            );
        }
        if (
            typeof customerPhone !== "string" ||
            customerPhone.replace(/\D/g, "").length < 9
        ) {
            return NextResponse.json(
                { success: false, error: "Valid phone number is required" },
                { status: 400 }
            );
        }
        const code = (mpesaCode || "").toString().trim().toUpperCase();
        if (!MPESA_CODE_RE.test(code)) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "Enter the M-Pesa confirmation code from the SMS (e.g. QGH1A2B3C4).",
                },
                { status: 400 }
            );
        }
        const pkg = PACKAGES[pkgKey];
        if (!pkg) {
            return NextResponse.json(
                { success: false, error: "Unknown package" },
                { status: 400 }
            );
        }

        const accountRef = customerName.trim();
        const { payment, duplicate } = await submitPayment({
            amount: pkg.amount,
            mpesaCode: code,
            accountRef,
            customerName: accountRef,
            customerEmail: customerEmail.trim(),
            customerPhone: customerPhone.trim(),
            service: pkg.service,
            tier: pkg.tier,
            pkgKey,
        });

        if (duplicate) {
            return NextResponse.json({
                success: true,
                duplicate: true,
                status: payment.status,
                message:
                    "We already received this M-Pesa code. Our team will contact you shortly.",
            });
        }

        await sendNotification({
            subject: `[ProPrint] Payment claim — ${pkg.tier} — KES ${pkg.amount.toLocaleString()}`,
            html: `
        <div style="font-family:sans-serif;padding:24px;">
          <h2 style="margin:0 0 12px;color:#0f172a;">New payment to verify</h2>
          <p style="margin:0 0 16px;color:#475569;">
            Verify against Paybill <strong>${business.paybill}</strong> (M-Pesa statement).
          </p>
          <table style="border-collapse:collapse;font-size:14px;">
            <tr><td style="padding:6px 12px;color:#64748b;">M-Pesa code</td><td style="padding:6px 12px;font-family:monospace;font-weight:700;font-size:16px;">${code}</td></tr>
            <tr><td style="padding:6px 12px;color:#64748b;">Account ref used</td><td style="padding:6px 12px;font-weight:600;">${accountRef}</td></tr>
            <tr><td style="padding:6px 12px;color:#64748b;">Amount expected</td><td style="padding:6px 12px;font-weight:700;">KES ${pkg.amount.toLocaleString()}</td></tr>
            <tr><td style="padding:6px 12px;color:#64748b;">Package</td><td style="padding:6px 12px;">${pkg.tier} — ${pkg.service}</td></tr>
            <tr><td style="padding:6px 12px;color:#64748b;">Customer</td><td style="padding:6px 12px;">${customerName} (${customerEmail})</td></tr>
            <tr><td style="padding:6px 12px;color:#64748b;">Phone</td><td style="padding:6px 12px;">${customerPhone}</td></tr>
          </table>
          <p style="margin-top:20px;font-size:13px;color:#64748b;">
            Open <a href="/admin">/admin</a> to verify or reject.
          </p>
        </div>`,
            replyTo: customerEmail,
        });

        return NextResponse.json({
            success: true,
            duplicate: false,
            status: payment.status,
            paymentId: payment.id,
        });
    } catch (err) {
        console.error("[payment/submit]", err);
        return NextResponse.json(
            { success: false, error: "Failed to submit payment" },
            { status: 500 }
        );
    }
}
