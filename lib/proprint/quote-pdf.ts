"use client";

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export interface QuotePdfLine {
    label: string;
    amount: string;
}

export interface QuotePdfData {
    shopName: string;
    jobName: string;
    clientName?: string;
    reference: string;
    quantity: string;
    lines: QuotePdfLine[];
    total: string;
    unit: string;
    contact?: string;
}

const A4 = { width: 595.28, height: 841.89 };

export async function buildQuotePdf(data: QuotePdfData): Promise<Uint8Array> {
    const doc = await PDFDocument.create();
    const page = doc.addPage([A4.width, A4.height]);
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const bold = await doc.embedFont(StandardFonts.HelveticaBold);
    const ink = rgb(0.06, 0.09, 0.16);
    const muted = rgb(0.42, 0.45, 0.5);
    const accent = rgb(0.03, 0.57, 0.66);
    const margin = 48;
    let y = A4.height - margin;

    page.drawRectangle({ x: 0, y: A4.height - 6, width: A4.width, height: 6, color: accent });

    page.drawText(data.shopName || "ProPrint", { x: margin, y: y - 18, size: 20, font: bold, color: ink });
    page.drawText("QUOTATION", { x: A4.width - margin - 110, y: y - 14, size: 14, font: bold, color: accent });
    y -= 48;
    page.drawText(`Prepared with ProPrint QuotePro`, { x: margin, y, size: 9, font, color: muted });
    y -= 30;

    const meta = [
        ["Job", data.jobName || "Untitled job"],
        ["Client", data.clientName || "-"],
        ["Reference", data.reference],
        ["Quantity", data.quantity],
    ];
    for (const [k, v] of meta) {
        page.drawText(k, { x: margin, y, size: 10, font, color: muted });
        page.drawText(v, { x: margin + 90, y, size: 10, font: bold, color: ink });
        y -= 18;
    }

    y -= 12;
    page.drawLine({ start: { x: margin, y }, end: { x: A4.width - margin, y }, thickness: 1, color: rgb(0.85, 0.88, 0.92) });
    y -= 24;

    for (const line of data.lines) {
        page.drawText(line.label, { x: margin, y, size: 11, font, color: ink });
        const w = bold.widthOfTextAtSize(line.amount, 11);
        page.drawText(line.amount, { x: A4.width - margin - w, y, size: 11, font: bold, color: ink });
        y -= 22;
    }

    y -= 6;
    page.drawRectangle({ x: margin, y: y - 40, width: A4.width - margin * 2, height: 48, color: rgb(0.03, 0.07, 0.12) });
    page.drawText("TOTAL", { x: margin + 16, y: y - 18, size: 11, font: bold, color: rgb(0.4, 0.9, 0.98) });
    const totalW = bold.widthOfTextAtSize(data.total, 18);
    page.drawText(data.total, { x: A4.width - margin - 16 - totalW, y: y - 22, size: 18, font: bold, color: rgb(1, 1, 1) });
    page.drawText(`${data.unit} per finished piece`, { x: margin + 16, y: y - 34, size: 8, font, color: rgb(0.6, 0.7, 0.8) });
    y -= 70;

    page.drawText("This quotation is an estimate. Confirm stock, production method and applicable tax before final invoicing.", {
        x: margin,
        y,
        size: 8,
        font,
        color: muted,
    });
    if (data.contact) {
        page.drawText(data.contact, { x: margin, y: margin, size: 9, font, color: muted });
    }

    return doc.save();
}
