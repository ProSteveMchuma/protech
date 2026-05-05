import { NextResponse } from "next/server";
import { saveLead } from "@/lib/leads";
import { sendNotification, leadToHtml } from "@/lib/email";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { type = "Inquiry", email, ...rest } = body ?? {};

        if (!email || typeof email !== "string") {
            return NextResponse.json(
                { success: false, error: "Email is required" },
                { status: 400 }
            );
        }

        const data = { email, ...rest };
        const lead = await saveLead(type, data);

        const result = await sendNotification({
            subject: `[PRT] New ${type}`,
            html: leadToHtml(type, data),
            replyTo: email,
        });

        return NextResponse.json({
            success: true,
            leadId: lead?.id ?? null,
            emailSent: result.sent,
        });
    } catch (err) {
        console.error("[notify] Error:", err);
        return NextResponse.json(
            { success: false, error: "Failed to process request" },
            { status: 500 }
        );
    }
}
