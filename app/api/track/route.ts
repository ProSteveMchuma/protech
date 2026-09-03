import { NextResponse } from "next/server";
import { z } from "zod";
import { recordEvent } from "@/lib/events";

const schema = z.object({
    event: z.string().trim().min(1).max(64),
    props: z.record(z.string(), z.unknown()).optional(),
    path: z.string().max(300).optional(),
});

export async function POST(req: Request) {
    try {
        // sendBeacon posts a Blob; req.json() handles both it and fetch bodies.
        const raw = await req.json().catch(() => null);
        const parsed = schema.safeParse(raw);
        if (!parsed.success) {
            return new NextResponse(null, { status: 204 });
        }
        await recordEvent(parsed.data);
        return new NextResponse(null, { status: 204 });
    } catch {
        // Analytics must never surface an error to the client.
        return new NextResponse(null, { status: 204 });
    }
}
