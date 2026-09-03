# ProPrint

> Software that makes printing faster.

ProPrint is a browser-based production toolkit for print businesses. SerialPro handles PDF numbering and imposition; QuotePro calculates production costs and selling prices.

## Stack

- Next.js 16, React 19, and TypeScript
- Tailwind CSS v4
- Firebase Admin SDK and Cloud Firestore
- `pdf-lib` for local PDF processing
- React Hook Form and Zod
- Nodemailer for operational email

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. Without Firebase Admin credentials, local development stores leads and payment claims in `/data/*.json`. Without SMTP credentials, submissions persist but notification emails are skipped.

## Firebase setup

Project id: **tenderpro-480721**. Full walkthrough: [docs/FIREBASE.md](docs/FIREBASE.md).

Short version:

1. Enable **Cloud Firestore** (Native mode) in the Firebase console.
2. Create a service account and copy `project_id`, `client_email`, and `private_key` into `.env.local` as `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY`.
3. Keep the `NEXT_PUBLIC_FIREBASE_*` web config from `.env.example` (browser Auth and shop saves).
4. Enable **Email/Password** in Authentication, then deploy [firestore.rules](firestore.rules).
5. Check wiring: `curl -s http://localhost:3000/api/firebase/status`
6. Never commit `serviceAccountKey.json` or `.env.local`.

The Admin SDK is server-only. Leads go to the `leads` collection; payment claims go to `payments`. Shop operators sign in at `/account`; their job settings go to `shops/{uid}/saves`. Artwork PDFs stay in the browser.

## Operational setup

Set `ADMIN_PASSWORD` and a random 32+ character `ADMIN_SESSION_SECRET` before opening `/admin`. Configure the SMTP variables to receive beta, feedback, and payment notifications. Optional business configuration includes `MPESA_PAYBILL`, `WHATSAPP_NUMBER`, and `SUPPORT_EMAIL`.

## Primary routes

| Route | Purpose |
| --- | --- |
| `/` | Product landing page |
| `/tools/serialpro` | PDF numbering and imposition |
| `/tools/quotepro` | Print quotation calculator |
| `/beta` | Founding-beta applications |
| `/feedback` | Product feedback |
| `/about` | Company / product story |
| `/account` | Optional shop login |
| `/legal/privacy` | Privacy note |
| `/admin` | Lead and payment operations |

Legacy service, hire, apply, guide, and checkout URLs redirect to the ProPrint landing page.

## Validation

```bash
npm run lint
npm test
npm run build
```

## Shipped recently

- Local saved jobs — SerialPro and QuotePro named setups in browser `localStorage` (settings only; artwork never stored)
- Shop accounts — optional Firebase Auth at `/account`, with cloud settings and localStorage fallback

## Next milestones

1. ImposePro Advanced — gang runs / signatures
2. Paid-plan enforcement — wire checkout to `PACKAGES`, admin-verified M-Pesa, feature gates
3. Product analytics and error monitoring
4. Branded invoices and receipts from QuotePro
