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

export function leadToHtml(type: string, data: Record<string, unknown>) {
    const rows = Object.entries(data)
        .map(
            ([k, v]) =>
                `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#64748b;font-size:13px;text-transform:capitalize;">${k}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#0f172a;font-size:14px;">${String(v ?? "—")}</td></tr>`
        )
        .join("");

    return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#fff;">
      <div style="background:#0f172a;color:#fff;padding:24px;">
        <h1 style="margin:0;font-size:20px;">New ${type}</h1>
        <p style="margin:4px 0 0;color:#94a3b8;font-size:13px;">Received ${new Date().toLocaleString("en-KE", { timeZone: "Africa/Nairobi" })}</p>
      </div>
      <table style="width:100%;border-collapse:collapse;">${rows}</table>
      <div style="padding:16px 24px;background:#f8fafc;color:#64748b;font-size:12px;">
        Reply directly to this email to contact the lead.
      </div>
    </div>
  `;
}
