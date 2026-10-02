import { NextResponse } from "next/server";

function failure(err: unknown) {
  const message = err instanceof Error ? err.message : "Could not open the account.";
  console.error("[shop-session]", message);
  return NextResponse.json({ success: false, error: message.slice(0, 240) }, { status: 500 });
}

export async function GET() {
  try {
    const { currentShopUser } = await import("@/lib/shop-session");
    const user = await currentShopUser();
    if (!user) return NextResponse.json({ authenticated: false });
    return NextResponse.json({
      authenticated: true,
      user: { name: user.name, email: user.email, phone: user.phone, role: user.role },
    });
  } catch (err) {
    return failure(err);
  }
}

export async function POST(request: Request) {
  try {
    const { openShopSession, sessionCookieOptions, SHOP_COOKIE } = await import("@/lib/shop-session");
    const body = await request.json().catch(() => null);
    const idToken = body && typeof body.idToken === "string" ? body.idToken : "";
    if (!idToken) return NextResponse.json({ success: false, error: "Sign in again." }, { status: 400 });
    const opened = await openShopSession(idToken);
    if (!opened) return NextResponse.json({ success: false, error: "Could not sign in." }, { status: 401 });
    const response = NextResponse.json({
      success: true,
      role: opened.user.role,
      needsName: opened.user.name.trim().length < 2 || opened.user.name === "User",
    });
    response.cookies.set(SHOP_COOKIE, opened.cookie, sessionCookieOptions());
    return response;
  } catch (err) {
    return failure(err);
  }
}

export async function DELETE() {
  try {
    const { sessionCookieOptions, SHOP_COOKIE } = await import("@/lib/shop-session");
    const response = NextResponse.json({ success: true });
    response.cookies.set(SHOP_COOKIE, "", { ...sessionCookieOptions(), maxAge: 0 });
    return response;
  } catch (err) {
    return failure(err);
  }
}
