import { NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/auth";

export async function POST() {
    const res = NextResponse.json({ success: true });
    res.cookies.delete(ADMIN_COOKIE);
    try {
        const { SHOP_COOKIE } = await import("@/lib/shop-session");
        res.cookies.delete(SHOP_COOKIE);
    } catch {
        res.cookies.delete("proprint_session");
    }
    return res;
}
