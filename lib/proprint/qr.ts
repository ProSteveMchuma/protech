import QRCode from "qrcode";

export interface QrMatrix {
    size: number;
    /** Row-major array of 0/1, length size*size. 1 = dark module. */
    data: number[];
}

/** Build the QR module matrix for a value. Vector-drawn into the PDF (no raster). */
export function qrMatrix(text: string, errorCorrectionLevel: "L" | "M" | "Q" | "H" = "M"): QrMatrix {
    const qr = QRCode.create(text || " ", { errorCorrectionLevel });
    const size = qr.modules.size;
    const raw = qr.modules.data as unknown as ArrayLike<number>;
    const data = Array.from({ length: size * size }, (_, i) => (raw[i] ? 1 : 0));
    return { size, data };
}

/**
 * Interpolate a serial into a QR content template. `{serial}` is replaced with
 * the formatted serial; a template with no placeholder is treated as a prefix.
 */
export function qrContent(template: string, serial: string): string {
    const t = template.trim();
    if (!t) return serial;
    if (t.includes("{serial}")) return t.replaceAll("{serial}", serial);
    return `${t}${serial}`;
}
