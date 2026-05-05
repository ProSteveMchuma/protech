import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "rp_admin";
const SESSION_TTL_MS = 1000 * 60 * 60 * 8; // 8 hours

function getSecret(): string {
    const secret = process.env.ADMIN_SESSION_SECRET;
    if (!secret || secret.length < 16) {
        throw new Error(
            "ADMIN_SESSION_SECRET is missing or too short. Set a 32+ char random string in .env.local"
        );
    }
    return secret;
}

function sign(value: string): string {
    return crypto.createHmac("sha256", getSecret()).update(value).digest("hex");
}

export function getAdminPassword(): string | null {
    return process.env.ADMIN_PASSWORD || null;
}

export function createSessionToken(): string {
    const expiresAt = Date.now() + SESSION_TTL_MS;
    const payload = `admin.${expiresAt}`;
    const signature = sign(payload);
    return `${payload}.${signature}`;
}

export function verifySessionToken(token: string | undefined): boolean {
    if (!token) return false;
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const [role, expiresAt, signature] = parts;
    if (role !== "admin") return false;

    const expected = sign(`${role}.${expiresAt}`);
    if (
        signature.length !== expected.length ||
        !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
    ) {
        return false;
    }
    return Number(expiresAt) > Date.now();
}

export async function isAuthenticated(): Promise<boolean> {
    const store = await cookies();
    return verifySessionToken(store.get(COOKIE_NAME)?.value);
}

export const ADMIN_COOKIE = COOKIE_NAME;
export const ADMIN_TTL_SECONDS = SESSION_TTL_MS / 1000;
