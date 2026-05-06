import nodemailer from "nodemailer";

let cachedTransporter: nodemailer.Transporter | null = null;

function getTransporter() {
    if (cachedTransporter) return cachedTransporter;

    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;

    cachedTransporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT) || 587,
        secure: Number(SMTP_PORT) === 465,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
    return cachedTransporter;
}

export async function sendNotification(opts: {
    subject: string;
    html: string;
    replyTo?: string;
}) {
    const transporter = getTransporter();
    const to = process.env.NOTIFY_EMAIL || process.env.SMTP_USER;
    if (!transporter || !to) {
        console.warn("[email] SMTP not configured — skipping send. Subject:", opts.subject);
        return { sent: false, reason: "SMTP_NOT_CONFIGURED" };
    }

    try {
        await transporter.sendMail({
            from: `"Pro Remote Tasks" <${process.env.SMTP_USER}>`,
            to,
            subject: opts.subject,
            html: opts.html,
            replyTo: opts.replyTo,
        });
        return { sent: true };
    } catch (err) {
        console.error("[email] Send failed:", (err as Error).message);
        return { sent: false, reason: "SEND_FAILED" };
    }
}

const TENDER_FIELD_ORDER = [
    "companyName",
    "industry",
    "revenueBand",
    "targetTenderSize",
    "bidsLast12Months",
    "kraPin",
    "agpoCategory",
    "agpoCertificate",
    "egpRegistered",
] as const;

function row(key: string, value: unknown, highlight = false) {
    const bg = highlight ? "background:#fff7ed;" : "";
    const valFmt =
        key === "targetTenderSize" && typeof value === "number"
            ? `KES ${value.toLocaleString()}`
            : String(value ?? "—");
    return `<tr style="${bg}"><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#64748b;font-size:13px;text-transform:capitalize;">${key}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#0f172a;font-size:14px;">${valFmt}</td></tr>`;
}

export function leadToHtml(type: string, data: Record<string, unknown>) {
    const isTender = type === "Client Hire Lead" && data.serviceType === "tender";

    let rows = "";
    if (isTender) {
        const tenderRows = TENDER_FIELD_ORDER
            .filter((k) => k in data)
            .map((k) => row(k, data[k], true))
            .join("");
        const restRows = Object.entries(data)
            .filter(([k]) => !(TENDER_FIELD_ORDER as readonly string[]).includes(k))
            .map(([k, v]) => row(k, v))
            .join("");
        rows =
            `<tr><td colspan="2" style="padding:12px 14px;background:#fef3c7;color:#92400e;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;">Tender qualifying details</td></tr>` +
            tenderRows +
            (restRows
                ? `<tr><td colspan="2" style="padding:12px 14px;background:#f1f5f9;color:#475569;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;">Contact & context</td></tr>${restRows}`
                : "");
    } else {
        rows = Object.entries(data).map(([k, v]) => row(k, v)).join("");
    }

    const banner = isTender
        ? `<div style="background:#0f172a;color:#fff;padding:24px;border-bottom:3px solid #f59e0b;">
              <div style="display:inline-block;padding:4px 10px;border-radius:999px;background:#f59e0b;color:#0f172a;font-size:11px;font-weight:800;letter-spacing:0.05em;text-transform:uppercase;margin-bottom:8px;">Tender Lead</div>
              <h1 style="margin:0;font-size:20px;">New ${type}</h1>
              <p style="margin:4px 0 0;color:#cbd5e1;font-size:13px;">Received ${new Date().toLocaleString("en-KE", { timeZone: "Africa/Nairobi" })}</p>
           </div>`
        : `<div style="background:#0f172a;color:#fff;padding:24px;">
              <h1 style="margin:0;font-size:20px;">New ${type}</h1>
              <p style="margin:4px 0 0;color:#94a3b8;font-size:13px;">Received ${new Date().toLocaleString("en-KE", { timeZone: "Africa/Nairobi" })}</p>
           </div>`;

    return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#fff;">
      ${banner}
      <table style="width:100%;border-collapse:collapse;">${rows}</table>
      <div style="padding:16px 24px;background:#f8fafc;color:#64748b;font-size:12px;">
        Reply directly to this email to contact the lead.
      </div>
    </div>
  `;
}
