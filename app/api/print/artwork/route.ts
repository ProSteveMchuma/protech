import { NextResponse } from "next/server";
import { artworkContentType, customerMayReplaceArtwork } from "@/lib/order-desk";
import { saveArtworkFile } from "@/lib/order-files";
import { attachLineArtwork, attachOrderArtwork, getPrintOrder, orderMatchingArtworkToken } from "@/lib/print-orders";

export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  const orderId = form?.get("orderId");
  const token = form?.get("token");
  const lineId = form?.get("lineId");
  const file = form?.get("file");
  if (typeof orderId !== "string" || !(file instanceof File)) {
    return NextResponse.json({ success: false, error: "Attach the artwork file again." }, { status: 400 });
  }

  const order = typeof token === "string" && token
    ? await orderMatchingArtworkToken(orderId, token)
    : await getPrintOrder(orderId);

  if (typeof token === "string" && token) {
    if (!order) return NextResponse.json({ success: false, error: "This upload link has already been used." }, { status: 403 });
  } else if (!order) {
    return NextResponse.json({ success: false, error: "That order was not found." }, { status: 404 });
  }

  const target = typeof lineId === "string" && lineId ? lineId : order.lines.length === 1 ? order.lines[0].lineId : "";
  if (!(typeof token === "string" && token)) {
    if (order.lines.length > 1 && !target) {
      return NextResponse.json({ success: false, error: "Say which line this file is for." }, { status: 400 });
    }
    const line = target ? order.lines.find((item) => item.lineId === target) : undefined;
    if (!line) return NextResponse.json({ success: false, error: "That line is not on the order." }, { status: 404 });
    if (!customerMayReplaceArtwork(line.fileState, order.status)) {
      return NextResponse.json({ success: false, error: "That file cannot be replaced." }, { status: 409 });
    }
  } else if (target && order.lines.find((line) => line.lineId === target)?.fileState === "accepted") {
    return NextResponse.json({ success: false, error: "That artwork is already accepted." }, { status: 409 });
  }

  try {
    const stored = await saveArtworkFile(orderId, {
      bytes: Buffer.from(await file.arrayBuffer()),
      contentType: artworkContentType(file.name, file.type),
      originalName: file.name,
    }, target || undefined);
    const saved = target ? await attachLineArtwork(orderId, target, stored) : await attachOrderArtwork(orderId, stored, false);
    if (!saved) return NextResponse.json({ success: false, error: "That line is not on the order." }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "The file did not save." }, { status: 400 });
  }
}
