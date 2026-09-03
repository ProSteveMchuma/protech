import { PDFDocument, StandardFonts, degrees, rgb, type PDFPage } from "pdf-lib";
import { recordIndexForSlot } from "./imposition";
import { productionRecordSerial, formatSerial } from "./serial";
import { MM_TO_PT } from "./sheet-presets";
import { qrContent, qrMatrix } from "./qr";
import type { ImpositionLayout, OutputMode } from "./types";

export interface QrOptions {
  enabled: boolean;
  template: string;
  x: number;
  y: number;
  sizeMm: number;
  ecc: "L" | "M" | "Q" | "H";
}

export interface PdfJob {
  source: ArrayBuffer; templatePage: number; start: number; end: number; prefix: string; suffix: string; padding: number;
  copies: number; fontSize: number; bold: boolean; positions: { x: number; y: number }[]; mode: OutputMode;
  layout: ImpositionLayout; marginMm: number; horizontalGutterMm: number; verticalGutterMm: number; cropMarks: boolean;
  /** Rotate artwork 90° for best fit (imposition modes only). */
  rotate?: boolean;
  /** QR serialization options. */
  qr?: QrOptions;
  /** 1-based back-artwork page for duplex number-only jobs. */
  backPage?: number;
}

function crop(page: PDFPage, x: number, y: number, width: number, height: number) {
  const gap = 2 * MM_TO_PT, length = 4 * MM_TO_PT, color = rgb(0, 0, 0);
  const lines = [
    [[x-gap-length,y],[x-gap,y]], [[x,y-gap-length],[x,y-gap]], [[x+width+gap,y],[x+width+gap+length,y]], [[x+width,y-gap-length],[x+width,y-gap]],
    [[x-gap-length,y+height],[x-gap,y+height]], [[x,y+height+gap],[x,y+height+gap+length]], [[x+width+gap,y+height],[x+width+gap+length,y+height]], [[x+width,y+height+gap],[x+width,y+height+gap+length]],
  ];
  for (const [[x1,y1],[x2,y2]] of lines) page.drawLine({ start:{x:x1,y:y1}, end:{x:x2,y:y2}, thickness:0.35, color });
}

/** Draw a vector QR (no raster) with a white quiet-zone backing for scannability. */
function drawQr(page: PDFPage, text: string, x: number, y: number, sizePt: number, ecc: QrOptions["ecc"]) {
  const { size, data } = qrMatrix(text, ecc);
  const quiet = sizePt * 0.08;
  const inner = sizePt - quiet * 2;
  const dot = inner / size;
  page.drawRectangle({ x, y, width: sizePt, height: sizePt, color: rgb(1, 1, 1) });
  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      if (data[row * size + col]) {
        page.drawRectangle({
          x: x + quiet + col * dot,
          // QR rows run top-to-bottom; PDF y is bottom-up.
          y: y + quiet + (size - 1 - row) * dot,
          width: dot,
          height: dot,
          color: rgb(0, 0, 0),
        });
      }
    }
  }
}

export async function generateProductionPdf(job: PdfJob, onProgress: (progress: number) => void) {
  const source = await PDFDocument.load(job.source);
  const pageIndex = Math.min(source.getPageCount() - 1, Math.max(0, job.templatePage - 1));
  const output = await PDFDocument.create();
  const font = await output.embedFont(job.bold ? StandardFonts.HelveticaBold : StandardFonts.Helvetica);
  const sourceSize = source.getPage(pageIndex).getSize();
  const records = (job.end - job.start + 1) * job.copies;
  const qr = job.qr?.enabled ? job.qr : null;
  const qrSizePt = qr ? Math.max(8, qr.sizeMm * MM_TO_PT) : 0;

  const serialFor = (record: number) => formatSerial(job.start + productionRecordSerial(record, job.copies), job.prefix, job.suffix, job.padding);

  // Stamp serial text (+ optional QR) onto a cell whose bottom-left is (originX, originY).
  const stamp = (page: PDFPage, serial: string, originX: number, originY: number, rotate: boolean) => {
    for (const position of job.positions) {
      if (rotate) {
        const px = originX + sourceSize.height * (1 - position.y / 100);
        const py = originY + sourceSize.width * (position.x / 100);
        page.drawText(serial, { x: px, y: py, size: job.fontSize, font, color: rgb(0, 0, 0), rotate: degrees(90) });
      } else {
        page.drawText(serial, { x: originX + sourceSize.width * position.x / 100, y: originY + sourceSize.height * position.y / 100, size: job.fontSize, font, color: rgb(0, 0, 0) });
      }
    }
    if (qr) {
      const content = qrContent(qr.template, serial);
      const footW = rotate ? sourceSize.height : sourceSize.width;
      const footH = rotate ? sourceSize.width : sourceSize.height;
      const qx = originX + footW * (qr.x / 100) - qrSizePt / 2;
      const qy = originY + footH * (qr.y / 100) - qrSizePt / 2;
      drawQr(page, content, qx, qy, qrSizePt, qr.ecc);
    }
  };

  if (job.mode === "number-only") {
    const hasBack = job.backPage && job.backPage >= 1 && job.backPage <= source.getPageCount();
    const backIndex = hasBack ? job.backPage! - 1 : -1;
    for (let record = 0; record < records; record += 1) {
      const [page] = await output.copyPages(source, [pageIndex]);
      const serial = serialFor(record);
      stamp(page, serial, 0, 0, false);
      output.addPage(page);
      if (hasBack) {
        const [back] = await output.copyPages(source, [backIndex]);
        output.addPage(back);
      }
      if ((record + 1) % 100 === 0) { onProgress(Math.round((record + 1) / records * 90)); await new Promise(requestAnimationFrame); }
    }
  } else {
    const rotate = job.rotate === true;
    const footW = rotate ? sourceSize.height : sourceSize.width;
    const footH = rotate ? sourceSize.width : sourceSize.height;
    const [artwork] = await output.embedPdf(job.source, [pageIndex]);
    const margin = job.marginMm * MM_TO_PT, gx = job.horizontalGutterMm * MM_TO_PT, gy = job.verticalGutterMm * MM_TO_PT;
    for (let sheetIndex = 0; sheetIndex < job.layout.sheetsRequired; sheetIndex += 1) {
      const page = output.addPage([job.layout.sheetWidthPt, job.layout.sheetHeightPt]);
      for (let slot = 0; slot < job.layout.piecesPerSheet; slot += 1) {
        const record = recordIndexForSlot(job.mode, sheetIndex, slot, job.layout.sheetsRequired, job.layout.piecesPerSheet);
        if (record >= records) continue;
        const col = slot % job.layout.across, row = Math.floor(slot / job.layout.across);
        const x = margin + col * (footW + gx), y = job.layout.sheetHeightPt - margin - footH - row * (footH + gy);
        if (rotate) {
          page.drawPage(artwork, { x: x + footW, y, width: sourceSize.width, height: sourceSize.height, rotate: degrees(90) });
        } else {
          page.drawPage(artwork, { x, y, width: sourceSize.width, height: sourceSize.height });
        }
        stamp(page, serialFor(record), x, y, rotate);
        if (job.cropMarks) crop(page, x, y, footW, footH);
      }
      onProgress(Math.round((sheetIndex + 1) / job.layout.sheetsRequired * 90));
      if ((sheetIndex + 1) % 15 === 0) await new Promise(requestAnimationFrame);
    }
  }
  onProgress(96);
  return output.save();
}
