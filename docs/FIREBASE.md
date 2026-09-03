# Firebase setup — ProPrint (`tenderpro-480721`)

ProPrint uses Firebase in two layers:

1. **Admin SDK (server)** — Cloud Firestore for beta leads, feedback, and payment claims
2. **Web SDK (browser)** — ready for shop Auth / cloud saves (not required for beta forms today)

Never commit `serviceAccountKey.json` or `.env.local`.

## Step 1 — Enable Firestore

1. Open [Firebase Console](https://console.firebase.google.com/) → project **tenderpro-480721**
2. Build → **Firestore Database** → Create database → **Native mode**
3. Start in production mode (or test mode only for a short local trial)
4. Collections used by the app:
   - `leads` — beta applications and product feedback
   - `payments` — M-Pesa payment claims (when billing is live)

## Step 2 — Create a service account (Admin)

1. Project settings → **Service accounts**
2. **Generate new private key** → download JSON
3. Keep the file off git (already covered by `.gitignore` patterns below)

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

## Step 4 — Secure the project

1. Firestore rules: deny public client writes to `leads` / `payments` (only Admin SDK should write those)
2. Google Cloud → APIs & Services → Credentials → restrict the **Browser key** by HTTP referrer (`localhost:3000`, `proinnovationtech.co.ke`)
3. Do not enable open Auth providers until shop workspaces ship

Example lock-down rules while only Admin writes:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

Admin SDK bypasses these rules. Client Auth will need new rules later.

## Step 5 — Verify

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
  "web": { "configured": true, "purpose": "Browser SDK for future Auth / shop workspaces" }
}
```

Then submit a beta application on `/beta` and confirm a doc appears under Firestore `leads`. Open `/admin` to manage it.

## What is wired today

| Piece | File | Status |
| --- | --- | --- |
| Admin init | [lib/firebase-admin.ts](lib/firebase-admin.ts) | Live for leads/payments |
| Web init | [lib/firebase-client.ts](lib/firebase-client.ts) | Ready; Auth UI not built yet |
| Status route | [app/api/firebase/status/route.ts](app/api/firebase/status/route.ts) | Live |
| Lead write | [lib/leads.ts](lib/leads.ts) | Uses Admin Firestore when configured |
| Payment write | [lib/payments.ts](lib/payments.ts) | Uses Admin Firestore when configured |

## What comes next

Firebase Authentication and customer workspaces (shop accounts, cloud SerialPro/QuotePro saves). Local `localStorage` saves remain until then.
