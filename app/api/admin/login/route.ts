import { NextResponse } from "next/server";
import { ADMIN_COOKIE, ADMIN_TTL_SECONDS, createSessionToken, getAdminPassword } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const { password } = await req.json();
        const expected = getAdminPassword();

        if (!expected) {
            return NextResponse.json(
                { success: false, error: "Server is missing ADMIN_PASSWORD env" },
                { status: 500 }
            );
        }
        if (typeof password !== "string" || password !== expected) {
            return NextResponse.json(
                { success: false, error: "Invalid password" },
                { status: 401 }
            );
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
