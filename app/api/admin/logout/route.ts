import { NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/auth";
import { SHOP_COOKIE } from "@/lib/shop-session";

export async function POST() {
    const res = NextResponse.json({ success: true });
    res.cookies.delete(ADMIN_COOKIE);
    res.cookies.delete(SHOP_COOKIE);
    return res;
}
