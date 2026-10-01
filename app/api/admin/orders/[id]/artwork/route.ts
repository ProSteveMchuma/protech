import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { artworkContentType } from "@/lib/order-desk";
import { readArtworkFile, saveArtworkFile } from "@/lib/order-files";
import { attachOrderArtwork, getPrintOrder } from "@/lib/print-orders";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ success: false }, { status: 401 });
  const { id } = await params;
  const order = await getPrintOrder(id);
  if (!order?.artworkFile) return NextResponse.json({ success: false }, { status: 404 });
  const bytes = await readArtworkFile(order.artworkFile);
  if (!bytes) return NextResponse.json({ success: false }, { status: 404 });
  return new NextResponse(new Uint8Array(bytes), {
    headers: {
      "Content-Type": order.artworkFile.contentType,
      "Content-Disposition": `attachment; filename="${order.artworkFile.name.replace(/"/g, "")}"`,
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
  if (!(file instanceof File)) return NextResponse.json({ success: false, error: "Choose a file." }, { status: 400 });
  try {
    const stored = await saveArtworkFile(id, {
      bytes: Buffer.from(await file.arrayBuffer()),
      contentType: artworkContentType(file.name, file.type),
      originalName: file.name,
    });
    const saved = await attachOrderArtwork(id, stored, false);
    return NextResponse.json({ success: true, artworkFile: saved?.artworkFile });
  } catch (err) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "The file did not save." }, { status: 400 });
  }
}
