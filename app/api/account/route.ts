import { NextResponse } from "next/server";
import { z } from "zod";
import { normalizeShopPhone } from "@/lib/shop-account";
import { updateShopProfile } from "@/lib/shop-session";

const profileSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().max(20).optional(),
});

export async function POST(request: Request) {
  const parsed = profileSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ success: false, error: "Enter your name." }, { status: 400 });
  if (parsed.data.phone && !normalizeShopPhone(parsed.data.phone)) {
    return NextResponse.json({ success: false, error: "Use a Kenyan mobile, for example 0712 345 678." }, { status: 400 });
  }
  const user = await updateShopProfile(parsed.data);
  if (!user) return NextResponse.json({ success: false, error: "Sign in again." }, { status: 401 });
  return NextResponse.json({ success: true, user: { name: user.name, email: user.email, phone: user.phone, role: user.role } });
}
