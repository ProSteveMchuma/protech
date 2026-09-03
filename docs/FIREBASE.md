# Firebase setup — ProPrint (`tenderpro-480721`)

ProPrint uses Firebase in two layers:

1. **Admin SDK (server)** — Cloud Firestore for beta leads, feedback, and payment claims
2. **Web SDK (browser)** — Email/password Auth and shop-owned SerialPro/QuotePro settings

Never commit `serviceAccountKey.json` or `.env.local`.

## Step 1 — Enable Firestore

1. Open [Firebase Console](https://console.firebase.google.com/) → project **tenderpro-480721**
2. Build → **Firestore Database** → Create database → **Native mode**
3. Start in production mode (or test mode only for a short local trial)
4. Collections used by the app:
   - `leads` — beta applications and product feedback (Admin SDK only)
   - `payments` — M-Pesa payment claims when billing is live (Admin SDK only)
   - `shops/{uid}` — shop profile for a signed-in operator
   - `shops/{uid}/saves/{id}` — named SerialPro / QuotePro settings (no artwork)

## Step 2 — Create a service account (Admin)

1. Project settings → **Service accounts**
2. **Generate new private key** → download JSON
3. Keep the file off git (already covered by `.gitignore`)

## Step 3 — Fill `.env.local`

```bash
cp .env.example .env.local
```

From the service-account JSON, set:

| JSON field | Env var |
| --- | --- |
| `project_id` | `FIREBASE_PROJECT_ID` (already `tenderpro-480721`) |
| `client_email` | `FIREBASE_CLIENT_EMAIL` |
| `private_key` | `FIREBASE_PRIVATE_KEY` (quoted, keep `\n`) |

Web app values are already in `.env.example` as `NEXT_PUBLIC_FIREBASE_*`.

Optional instead of the three Admin vars:

```bash
GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/serviceAccountKey.json
```

Also set `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` so `/admin` works.

## Step 4 — Enable Email/Password Auth

1. Firebase Console → Build → **Authentication** → Get started
2. Sign-in method → **Email/Password** → Enable (password sign-in; no email-link required)
3. Authorized domains should include `localhost` and `proinnovationtech.co.ke`

`/admin` stays on the HMAC cookie in [lib/auth.ts](lib/auth.ts). Do not mix founder admin login with shop Firebase Auth.

## Step 5 — Deploy Firestore rules

The repo rules file is [firestore.rules](../firestore.rules):

- Client **cannot** read or write `leads` or `payments`
- A signed-in user can only read/write `shops/{theirUid}` and `shops/{theirUid}/saves/*`
- Saves must be `serialpro` or `quotepro` settings documents

Deploy from a machine with Firebase CLI access:

```bash
firebase deploy --only firestore:rules --project tenderpro-480721
```

Until those rules are live, shop accounts can still sign in, and tools fall back to this-browser `localStorage`.

Also:

1. Google Cloud → APIs & Services → Credentials → restrict the **Browser key** by HTTP referrer (`localhost:3000`, `proinnovationtech.co.ke`)
2. Confirm Authentication → Settings → Authorized domains

## Step 6 — Verify

```bash
npm run dev
curl -s http://localhost:3000/api/firebase/status
```

Expected when Admin + web env are filled:

```json
{
  "success": true,
  "projectId": "tenderpro-480721",
  "admin": { "configured": true, "purpose": "Server Firestore for leads and payments" },
  "web": { "configured": true, "purpose": "Browser SDK for Auth and shop workspaces" }
}
```

Then:

1. Submit a beta application on `/beta` and confirm a doc appears under Firestore `leads`. Open `/admin` to manage it.
2. Open `/account`, create a shop account, then save a SerialPro or QuotePro setup. Confirm a doc under `shops/{uid}/saves`.
3. Confirm no artwork PDF is written to Firestore.

## What is wired today

| Piece | File | Status |
| --- | --- | --- |
| Admin init | [lib/firebase-admin.ts](../lib/firebase-admin.ts) | Live for leads/payments |
| Web init | [lib/firebase-client.ts](../lib/firebase-client.ts) | Live |
| Auth / Firestore browser helpers | [lib/firebase-browser.ts](../lib/firebase-browser.ts) | Live |
| Shop Auth UI | [app/account/page.tsx](../app/account/page.tsx) | Live |
| Cloud saves | [lib/proprint/cloud-saves.ts](../lib/proprint/cloud-saves.ts) | Live; localStorage fallback when signed out |
| Status route | [app/api/firebase/status/route.ts](../app/api/firebase/status/route.ts) | Live |
| Lead write | [lib/leads.ts](../lib/leads.ts) | Uses Admin Firestore when configured |
| Payment write | [lib/payments.ts](../lib/payments.ts) | Uses Admin Firestore when configured |
| Rules | [firestore.rules](../firestore.rules) | Deploy from this repo |

Artwork PDFs stay in the browser. Cloud documents store numbering/quote **settings** only.
