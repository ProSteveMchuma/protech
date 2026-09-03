import "server-only";

/**
 * M-Pesa Daraja (Lipa Na M-Pesa Online / STK Push) helper.
 *
 * STK Push is customer-initiated: it pushes a PIN prompt to the payer's phone.
 * It is NOT a card-style auto-debit, so recurring billing is a monthly prompt
 * (or an M-Pesa Ratiba standing order, handled out of band). This module is a
 * thin, env-gated client that no-ops cleanly when Daraja credentials are absent
 * so local dev and the manual Paybill flow keep working.
 */

export interface DarajaConfig {
    consumerKey: string;
    consumerSecret: string;
    shortcode: string;
    passkey: string;
    env: "sandbox" | "production";
    callbackUrl: string;
}

export function getDarajaConfig(): DarajaConfig | null {
    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    const shortcode = process.env.MPESA_SHORTCODE;
    const passkey = process.env.MPESA_PASSKEY;
    if (!consumerKey || !consumerSecret || !shortcode || !passkey) return null;
    return {
        consumerKey,
        consumerSecret,
        shortcode,
        passkey,
        env: process.env.MPESA_ENV === "production" ? "production" : "sandbox",
        callbackUrl: process.env.MPESA_CALLBACK_URL || "",
    };
}

export function isDarajaConfigured() {
    return getDarajaConfig() !== null;
}

function baseUrl(env: DarajaConfig["env"]) {
    return env === "production" ? "https://api.safaricom.co.ke" : "https://sandbox.safaricom.co.ke";
}

async function getAccessToken(config: DarajaConfig): Promise<string> {
    const auth = Buffer.from(`${config.consumerKey}:${config.consumerSecret}`).toString("base64");
    const res = await fetch(`${baseUrl(config.env)}/oauth/v1/generate?grant_type=client_credentials`, {
        headers: { Authorization: `Basic ${auth}` },
    });
    if (!res.ok) throw new Error(`Daraja auth failed (${res.status})`);
    const data = (await res.json()) as { access_token: string };
    return data.access_token;
}

function timestamp(): string {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

export interface StkPushResult {
    ok: boolean;
    configured: boolean;
    checkoutRequestId?: string;
    customerMessage?: string;
    error?: string;
}

/** Normalise a Kenyan phone to 2547XXXXXXXX / 2541XXXXXXXX. */
export function normalizePhone(input: string): string {
    const digits = input.replace(/\D/g, "");
    if (digits.startsWith("254")) return digits;
    if (digits.startsWith("0")) return `254${digits.slice(1)}`;
    if (digits.length === 9) return `254${digits}`;
    return digits;
}

export async function initiateStkPush(params: { phone: string; amount: number; accountRef: string; description: string }): Promise<StkPushResult> {
    const config = getDarajaConfig();
    if (!config) return { ok: false, configured: false, error: "M-Pesa STK Push is not configured on this deployment." };

    try {
        const token = await getAccessToken(config);
        const ts = timestamp();
        const password = Buffer.from(`${config.shortcode}${config.passkey}${ts}`).toString("base64");
        const res = await fetch(`${baseUrl(config.env)}/mpesa/stkpush/v1/processrequest`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                BusinessShortCode: config.shortcode,
                Password: password,
                Timestamp: ts,
                TransactionType: "CustomerPayBillOnline",
                Amount: Math.max(1, Math.round(params.amount)),
                PartyA: normalizePhone(params.phone),
                PartyB: config.shortcode,
                PhoneNumber: normalizePhone(params.phone),
                CallBackURL: config.callbackUrl,
                AccountReference: params.accountRef.slice(0, 12),
                TransactionDesc: params.description.slice(0, 20),
            }),
        });
        const data = (await res.json()) as { CheckoutRequestID?: string; CustomerMessage?: string; errorMessage?: string };
        if (!res.ok || data.errorMessage) {
            return { ok: false, configured: true, error: data.errorMessage || `STK Push failed (${res.status})` };
        }
        return { ok: true, configured: true, checkoutRequestId: data.CheckoutRequestID, customerMessage: data.CustomerMessage };
    } catch (err) {
        return { ok: false, configured: true, error: (err as Error).message };
    }
}
