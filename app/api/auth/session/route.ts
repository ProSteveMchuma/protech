import { NextResponse } from "next/server";
import { openShopSession, sessionCookieOptions, SHOP_COOKIE, currentShopUser } from "@/lib/shop-session";

export async function GET() {
  const user = await currentShopUser();
  if (!user) return NextResponse.json({ authenticated: false });
  return NextResponse.json({
    authenticated: true,
    user: { name: user.name, email: user.email, phone: user.phone, role: user.role },
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const idToken = body && typeof body.idToken === "string" ? body.idToken : "";
  if (!idToken) return NextResponse.json({ success: false, error: "Sign in again." }, { status: 400 });
  try {
    const opened = await openShopSession(idToken);
    if (!opened) return NextResponse.json({ success: false, error: "Could not sign in." }, { status: 401 });
    const response = NextResponse.json({
      success: true,
      role: opened.user.role,
      needsName: opened.user.name.trim().length < 2 || opened.user.name === "User",
    });
    response.cookies.set(SHOP_COOKIE, opened.cookie, sessionCookieOptions());
    return response;
  } catch {
    return NextResponse.json({ success: false, error: "Could not sign in." }, { status: 401 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(SHOP_COOKIE, "", { ...sessionCookieOptions(), maxAge: 0 });
  return response;
}
