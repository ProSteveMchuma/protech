import { NextResponse } from "next/server";
import { ADMIN_COOKIE, ADMIN_TTL_SECONDS, createSessionToken, getAdminPassword } from "@/lib/auth";
import { loginBlocked, recordLoginFailure } from "@/lib/order-desk";

const denied = NextResponse.json({ success: false, error: "Could not sign in" }, { status: 401 });

export async function POST(req: Request) {
    try {
        const address = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
        if (loginBlocked(address)) {
            return NextResponse.json({ success: false, error: "Could not sign in. Try again shortly." }, { status: 429 });
        }
        const { password } = await req.json();
        const expected = getAdminPassword();

        if (!expected || typeof password !== "string" || password !== expected) {
            if (!expected) console.error("[admin] ADMIN_PASSWORD is not set");
            recordLoginFailure(address);
            return denied;
        }

        const token = createSessionToken();
        const res = NextResponse.json({ success: true });
        res.cookies.set(ADMIN_COOKIE, token, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: ADMIN_TTL_SECONDS,
        });
        return res;
    } catch {
        return NextResponse.json({ success: false, error: "Bad request" }, { status: 400 });
    }
}
