import { NextResponse } from "next/server";
import { z } from "zod";
import { productBySlug } from "@/lib/printshop/catalog";
import { deliveryFee, quoteProduct, type QuoteSpec, type Turnaround } from "@/lib/printshop/pricing";
import { savePrintOrder } from "@/lib/print-orders";
import { sendNotification } from "@/lib/email";

const turnaround = z.enum(["standard", "express", "rush"]);

const specSchema = z.object({
  slug: z.string().trim().min(1).max(120),
  quantity: z.number().int().positive().max(20000),
  group: z.string().max(180).optional(),
  options: z.record(z.string(), z.string().max(120)).optional(),
  attrs: z.record(z.string(), z.string().max(120)).optional(),
  turnaround,
  width: z.number().positive().max(100).optional(),
  height: z.number().positive().max(100).optional(),
  pages: z.number().int().positive().max(800).optional(),
  color: z.enum(["bw", "color"]).optional(),
  size: z.string().max(120).optional(),
  paper: z.string().max(120).optional(),
  cover: z.string().max(120).optional(),
  binding: z.string().max(120).optional(),
});

const orderSchema = z.object({
  email: z.string().trim().email().max(200),
  name: z.string().trim().min(2).max(120),
  phone: z.string().regex(/^254\d{9}$/),
  county: z.string().trim().min(2).max(80),
  address: z.string().trim().min(6).max(240),
  artwork: z.string().trim().max(400).optional(),
  notes: z.string().trim().max(2000).optional(),
  mpesaCode: z.string().trim().min(6).max(20),
  website: z.string().max(200).optional(),
  lines: z.array(z.object({ slug: z.string(), quantity: z.number().int().positive(), spec: specSchema })).min(1).max(30),
});

function escapeHtml(input: string) {
  return input.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] ?? char);
}

export async function POST(req: Request) {
  try {
    const raw = await req.json();
    if (JSON.stringify(raw).length > 40_000) {
      return NextResponse.json({ success: false, error: "Submission is too large" }, { status: 413 });
    }
    const parsed = orderSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Check the order details and try again" }, { status: 400 });
    }
    if (parsed.data.website) return NextResponse.json({ success: true, orderId: "received" });

    const lines = [];
    for (const line of parsed.data.lines) {
      const product = productBySlug(line.spec.slug);
      if (!product) return NextResponse.json({ success: false, error: "One product is no longer available" }, { status: 400 });
      const spec: QuoteSpec = { ...line.spec, slug: product.slug, quantity: line.quantity, turnaround: line.spec.turnaround as Turnaround };
      const quoted = quoteProduct(product, spec);
      if (!quoted) return NextResponse.json({ success: false, error: `${product.title} needs a custom quote` }, { status: 400 });
      lines.push({ slug: product.slug, title: product.title, quantity: quoted.quantity, totalKes: quoted.totalKes, summary: quoted.summary, spec });
    }

    const subtotalKes = lines.reduce((sum, line) => sum + line.totalKes, 0);
    const deliveryKes = deliveryFee(subtotalKes, parsed.data.county);
    const totalKes = subtotalKes + deliveryKes;
    const order = await savePrintOrder({
      customer: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        county: parsed.data.county,
        address: parsed.data.address,
      },
      artwork: parsed.data.artwork,
      notes: parsed.data.notes,
      mpesaCode: parsed.data.mpesaCode.toUpperCase(),
      lines,
      subtotalKes,
      deliveryKes,
      totalKes,
    });
    if (!order) return NextResponse.json({ success: false, error: "The order did not save" }, { status: 500 });

    const rows = lines
      .map((line) => `<tr><td style="padding:8px 0;">${escapeHtml(line.title)} × ${line.quantity}<br><span style="color:#64748b">${escapeHtml(line.summary)}</span></td><td style="padding:8px 0;text-align:right;">KES ${line.totalKes.toLocaleString("en-KE")}</td></tr>`)
      .join("");
    const html = `<p>Order <strong>${escapeHtml(order.id)}</strong> from ${escapeHtml(parsed.data.name)}.</p><p>${escapeHtml(parsed.data.phone)} · ${escapeHtml(parsed.data.email)}<br>${escapeHtml(parsed.data.address)}, ${escapeHtml(parsed.data.county)}</p><table style="width:100%">${rows}</table><p>Delivery KES ${deliveryKes.toLocaleString("en-KE")}<br><strong>Total KES ${totalKes.toLocaleString("en-KE")}</strong></p><p>M-Pesa ${escapeHtml(order.mpesaCode)}</p><p>Artwork: ${escapeHtml(parsed.data.artwork || "Not linked yet")}</p>`;
    await sendNotification({ subject: `[ProPrint] Order ${order.id.slice(0, 8)}`, html, replyTo: parsed.data.email });
    await sendNotification({
      to: parsed.data.email,
      subject: `[ProPrint] We received your print order`,
      html: `<p>Hello ${escapeHtml(parsed.data.name)},</p><p>We received your order and will confirm M-Pesa code <strong>${escapeHtml(order.mpesaCode)}</strong> before printing.</p><p>Total <strong>KES ${totalKes.toLocaleString("en-KE")}</strong>.</p><p>Track it here: https://www.proinnovationtech.co.ke/orders/${order.id}</p>`,
    });

    return NextResponse.json({ success: true, orderId: order.id, totalKes, deliveryKes, subtotalKes });
  } catch (err) {
    console.error("[print-orders] Error:", err);
    return NextResponse.json({ success: false, error: "Failed to process the order" }, { status: 500 });
  }
}
