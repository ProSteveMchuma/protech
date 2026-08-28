import { NextResponse } from "next/server";
import { z } from "zod";
import { saveLead } from "@/lib/leads";
import { sendNotification, leadToHtml } from "@/lib/email";
import { GUIDE_COOKIE, GUIDE_TTL_SECONDS } from "@/lib/lead-magnet";

const unlockSchema = z.object({
    email: z.string().trim().toLowerCase().email("Enter a valid email"),
    name: z.string().trim().max(120).optional().or(z.literal("")),
    company: z.string().trim().max(160).optional().or(z.literal("")),
    utm_source: z.string().trim().max(80).optional(),
    utm_campaign: z.string().trim().max(120).optional(),
    ref: z.string().trim().max(120).optional(),
});

function setUnlockCookie(res: NextResponse) {
    res.cookies.set(GUIDE_COOKIE, "1", {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: GUIDE_TTL_SECONDS,
    });
}

export async function POST(req: Request) {
    let parsed: z.infer<typeof unlockSchema>;
    try {
        const body = await req.json();
        parsed = unlockSchema.parse(body);
    } catch (err) {
        if (err instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, error: err.issues[0]?.message ?? "Invalid input" },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { success: false, error: "Bad request" },
            { status: 400 }
        );
    }

    const referer = req.headers.get("referer") || "";
    const data = {
        email: parsed.email,
        name: parsed.name || null,
        company: parsed.company || null,
        source: parsed.utm_source || null,
        campaign: parsed.utm_campaign || null,
        ref: parsed.ref || null,
        referer: referer || null,
        guide: "tender-disqualifications",
    };

    // Don't reveal whether the email already exists (no enumeration);
    // saveLead failures (read-only FS, etc.) shouldn't block unlock either.
    await saveLead("Lead Magnet — Tender Disqualifications", data);

    sendNotification({
        subject: `[ProPrint] Legacy lead magnet unlock — ${parsed.email}`,
        html: leadToHtml("Lead Magnet — Tender Disqualifications", data),
        replyTo: parsed.email,
    }).catch((e) => console.warn("[lead-magnet] notify failed:", (e as Error).message));

    const res = NextResponse.json({ success: true });
    setUnlockCookie(res);
    return res;
}
