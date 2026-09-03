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
            from: `"ProPrint by Pro Innovation" <${process.env.SMTP_USER}>`,
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

function escapeHtml(input: string) {
    return input.replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
    }[char] ?? char));
}

function row(key: string, value: unknown) {
    return `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#64748b;font-size:13px;text-transform:capitalize;">${escapeHtml(key)}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#0f172a;font-size:14px;">${escapeHtml(String(value ?? "—"))}</td></tr>`;
}

export function leadToHtml(type: string, data: Record<string, unknown>) {
    const rows = Object.entries(data).map(([k, v]) => row(k, v)).join("");
    const received = new Date().toLocaleString("en-KE", { timeZone: "Africa/Nairobi" });

    return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#fff;">
      <div style="background:#071019;color:#fff;padding:24px;border-bottom:3px solid #67e8f9;">
        <h1 style="margin:0;font-size:20px;">New ${escapeHtml(type)}</h1>
        <p style="margin:4px 0 0;color:#94a3b8;font-size:13px;">Received ${escapeHtml(received)}</p>
      </div>
      <table style="width:100%;border-collapse:collapse;">${rows}</table>
      <div style="padding:16px 24px;background:#f8fafc;color:#64748b;font-size:12px;">
        Reply directly to this email to contact the lead.
      </div>
    </div>
  `;
}
