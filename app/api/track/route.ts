import { NextResponse } from "next/server";
import { z } from "zod";
import { recordContactClick } from "@/lib/contact-clicks";

const schema = z.object({
  channel: z.enum(["whatsapp", "call"]),
  path: z.string().startsWith("/").max(200),
  label: z.string().max(120).default(""),
});

// Fire-and-forget beacon from the browser; never let tracking break a click.
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = JSON.parse(await request.text());
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ success: false, error: "Invalid click" }, { status: 400 });
  try {
    await recordContactClick({ ...parsed.data, path: parsed.data.path.split("?")[0] });
  } catch (error) {
    console.warn("[track] click not stored:", (error as Error).message);
  }
  return NextResponse.json({ success: true });
}
