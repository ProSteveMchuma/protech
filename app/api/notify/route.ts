import { NextResponse } from "next/server";
import { saveLead } from "@/lib/leads";
import { sendNotification, leadToHtml } from "@/lib/email";
import { z } from "zod";

const submissionSchema = z.object({
    type: z.string().trim().min(1).max(80).default("Inquiry"),
    email: z.string().trim().email().max(200),
    website: z.string().max(200).optional(),
}).passthrough();

export async function POST(req: Request) {
    try {
        const raw = await req.json();
        if (JSON.stringify(raw).length > 20_000) {
            return NextResponse.json({ success: false, error: "Submission is too large" }, { status: 413 });
        }
        const parsed = submissionSchema.safeParse(raw);
        if (!parsed.success) {
            return NextResponse.json(
                { success: false, error: "Enter a valid submission" },
                { status: 400 }
            );
        }
        const { type, email, website, ...rest } = parsed.data;
        if (website) return NextResponse.json({ success: true });

        const data: Record<string, unknown> = { email, ...rest };
        const lead = await saveLead(type, data);

        const result = await sendNotification({
            subject: `[ProPrint] New ${type}`,
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
