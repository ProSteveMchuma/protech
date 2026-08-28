import { PDFDocument, StandardFonts, rgb, type PDFPage } from "pdf-lib";
import { recordIndexForSlot } from "./imposition";
import { productionRecordSerial, formatSerial } from "./serial";
import { MM_TO_PT } from "./sheet-presets";
import type { ImpositionLayout, OutputMode } from "./types";

export interface PdfJob {
  source: ArrayBuffer; templatePage: number; start: number; end: number; prefix: string; suffix: string; padding: number;
  copies: number; fontSize: number; bold: boolean; positions: { x: number; y: number }[]; mode: OutputMode;
  layout: ImpositionLayout; marginMm: number; horizontalGutterMm: number; verticalGutterMm: number; cropMarks: boolean;
}

function crop(page: PDFPage, x: number, y: number, width: number, height: number) {
  const gap = 2 * MM_TO_PT, length = 4 * MM_TO_PT, color = rgb(0, 0, 0);
  const lines = [
    [[x-gap-length,y],[x-gap,y]], [[x,y-gap-length],[x,y-gap]], [[x+width+gap,y],[x+width+gap+length,y]], [[x+width,y-gap-length],[x+width,y-gap]],
    [[x-gap-length,y+height],[x-gap,y+height]], [[x,y+height+gap],[x,y+height+gap+length]], [[x+width+gap,y+height],[x+width+gap+length,y+height]], [[x+width,y+height+gap],[x+width,y+height+gap+length]],
  ];
  for (const [[x1,y1],[x2,y2]] of lines) page.drawLine({ start:{x:x1,y:y1}, end:{x:x2,y:y2}, thickness:0.35, color });
}

export async function generateProductionPdf(job: PdfJob, onProgress: (progress: number) => void) {
  const source = await PDFDocument.load(job.source);
  const pageIndex = Math.min(source.getPageCount() - 1, Math.max(0, job.templatePage - 1));
  const output = await PDFDocument.create();
  const font = await output.embedFont(job.bold ? StandardFonts.HelveticaBold : StandardFonts.Helvetica);
  const sourceSize = source.getPage(pageIndex).getSize();
  const records = (job.end - job.start + 1) * job.copies;
  const drawSerial = (page: PDFPage, serial: string, originX: number, originY: number) => {
    for (const position of job.positions) page.drawText(serial, { x: originX + sourceSize.width * position.x / 100, y: originY + sourceSize.height * position.y / 100, size: job.fontSize, font, color: rgb(0,0,0) });
  };
  if (job.mode === "number-only") {
    for (let record = 0; record < records; record += 1) {
      const [page] = await output.copyPages(source, [pageIndex]);
      const serial = formatSerial(job.start + productionRecordSerial(record, job.copies), job.prefix, job.suffix, job.padding);
      drawSerial(page, serial, 0, 0); output.addPage(page);
      if ((record + 1) % 100 === 0) { onProgress(Math.round((record + 1) / records * 90)); await new Promise(requestAnimationFrame); }
    }
  } else {
    const [artwork] = await output.embedPdf(job.source, [pageIndex]);
    const margin = job.marginMm * MM_TO_PT, gx = job.horizontalGutterMm * MM_TO_PT, gy = job.verticalGutterMm * MM_TO_PT;
    for (let sheetIndex = 0; sheetIndex < job.layout.sheetsRequired; sheetIndex += 1) {
      const page = output.addPage([job.layout.sheetWidthPt, job.layout.sheetHeightPt]);
      for (let slot = 0; slot < job.layout.piecesPerSheet; slot += 1) {
        const record = recordIndexForSlot(job.mode, sheetIndex, slot, job.layout.sheetsRequired, job.layout.piecesPerSheet);
        if (record >= records) continue;
        const col = slot % job.layout.across, row = Math.floor(slot / job.layout.across);
        const x = margin + col * (sourceSize.width + gx), y = job.layout.sheetHeightPt - margin - sourceSize.height - row * (sourceSize.height + gy);
        page.drawPage(artwork, { x, y, width: sourceSize.width, height: sourceSize.height });
        drawSerial(page, formatSerial(job.start + productionRecordSerial(record, job.copies), job.prefix, job.suffix, job.padding), x, y);
        if (job.cropMarks) crop(page, x, y, sourceSize.width, sourceSize.height);
      }
      onProgress(Math.round((sheetIndex + 1) / job.layout.sheetsRequired * 90));
      if ((sheetIndex + 1) % 15 === 0) await new Promise(requestAnimationFrame);
    }
  }
  onProgress(96);
  return output.save();
}
