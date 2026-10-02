import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { artworkContentType } from "@/lib/order-desk";
import { readArtworkFile, saveArtworkFile } from "@/lib/order-files";
import { attachLineArtwork, attachOrderArtwork, deskOrder, getPrintOrder } from "@/lib/print-orders";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ success: false }, { status: 401 });
  const { id } = await params;
  const order = await getPrintOrder(id);
  const lineId = new URL(req.url).searchParams.get("line");
  const stored = lineId
    ? order?.lines.find((line) => line.lineId === lineId)?.artworkFile
    : order?.artworkFile ?? order?.lines.find((line) => line.artworkFile)?.artworkFile;
  if (!stored) return NextResponse.json({ success: false }, { status: 404 });
  const bytes = await readArtworkFile(stored);
  if (!bytes) return NextResponse.json({ success: false }, { status: 404 });
  return new NextResponse(new Uint8Array(bytes), {
    headers: {
      "Content-Type": stored.contentType,
      "Content-Disposition": `attachment; filename="${stored.name.replace(/"/g, "")}"`,
      "Cache-Control": "private, no-store",
    },
  });
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ success: false }, { status: 401 });
  const { id } = await params;
  const order = await getPrintOrder(id);
  if (!order) return NextResponse.json({ success: false }, { status: 404 });
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  const lineId = form?.get("lineId");
  if (!(file instanceof File)) return NextResponse.json({ success: false, error: "Choose a file." }, { status: 400 });
  try {
    const target = typeof lineId === "string" ? lineId : "";
    const stored = await saveArtworkFile(id, {
      bytes: Buffer.from(await file.arrayBuffer()),
      contentType: artworkContentType(file.name, file.type),
      originalName: file.name,
    }, target || undefined);
    const saved = target ? await attachLineArtwork(id, target, stored) : await attachOrderArtwork(id, stored, false);
    if (!saved) return NextResponse.json({ success: false, error: "That line is not on the order." }, { status: 404 });
    return NextResponse.json({ success: true, order: deskOrder(saved) });
  } catch (err) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "The file did not save." }, { status: 400 });
  }
}
