import "server-only";
import crypto from "crypto";
import { GoogleAuth } from "google-auth-library";
import { firebasePublicConfig } from "./firebase-public";

const SESSION_SECONDS = 5 * 24 * 60 * 60;

export type IdentityUser = { uid: string; email: string; name: string; phone: string };

export async function lookupIdToken(idToken: string): Promise<IdentityUser | null> {
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebasePublicConfig.apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  if (!response.ok) return null;
  const data = (await response.json()) as { users?: { localId?: string; email?: string; displayName?: string; phoneNumber?: string }[] };
  const user = data.users?.[0];
  if (!user?.localId) return null;
  return {
    uid: user.localId,
    email: (user.email || "").trim().toLowerCase(),
    name: user.displayName || "",
    phone: user.phoneNumber || "",
  };
}

async function accessToken() {
  const key = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!process.env.FIREBASE_CLIENT_EMAIL || !key || !process.env.FIREBASE_PROJECT_ID) return null;
  const auth = new GoogleAuth({
    credentials: { client_email: process.env.FIREBASE_CLIENT_EMAIL, private_key: key },
    scopes: ["https://www.googleapis.com/auth/identitytoolkit", "https://www.googleapis.com/auth/cloud-platform"],
  });
  const client = await auth.getClient();
  const token = await client.getAccessToken();
  return token.token || null;
}

export async function mintSessionCookie(idToken: string): Promise<string | null> {
  const token = await accessToken();
  if (!token) return null;
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/projects/${process.env.FIREBASE_PROJECT_ID}:createSessionCookie`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ idToken, validDuration: String(SESSION_SECONDS) }),
  });
  if (!response.ok) return null;
  const data = (await response.json()) as { sessionCookie?: string };
  return data.sessionCookie || null;
}

let certCache: { expires: number; keys: Record<string, string> } | null = null;

async function sessionCerts() {
  if (certCache && certCache.expires > Date.now()) return certCache.keys;
  const response = await fetch("https://www.googleapis.com/identitytoolkit/v3/relyingparty/publicKeys");
  if (!response.ok) return null;
  const keys = (await response.json()) as Record<string, string>;
  const maxAge = Number(response.headers.get("cache-control")?.match(/max-age=(\d+)/)?.[1] || 3600);
  certCache = { expires: Date.now() + maxAge * 1000, keys };
  return keys;
}

export async function readSessionCookie(token: string): Promise<{ uid: string; email: string } | null> {
  const [header, payload, signature] = token.split(".");
  if (!header || !payload || !signature) return null;
  let decoded: { alg?: string; kid?: string };
  let body: { aud?: string; iss?: string; sub?: string; exp?: number; email?: string };
  try {
    decoded = JSON.parse(Buffer.from(header, "base64url").toString()) as { alg?: string; kid?: string };
    body = JSON.parse(Buffer.from(payload, "base64url").toString()) as { aud?: string; iss?: string; sub?: string; exp?: number; email?: string };
  } catch {
    return null;
  }
  if (decoded.alg !== "RS256" || !decoded.kid) return null;
  const keys = await sessionCerts();
  const cert = keys?.[decoded.kid];
  if (!cert) return null;
  const valid = crypto.verify("RSA-SHA256", Buffer.from(`${header}.${payload}`), cert, Buffer.from(signature, "base64url"));
  if (!valid) return null;
  const project = firebasePublicConfig.projectId;
  if (body.aud !== project || body.iss !== `https://session.firebase.google.com/${project}`) return null;
  if (!body.sub || !body.exp || body.exp * 1000 < Date.now()) return null;
  return { uid: body.sub, email: (body.email || "").toLowerCase() };
}
