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

Open `http://localhost:3000`. Without Firebase credentials, local development stores leads and payment claims in `/data/*.json`. Without SMTP credentials, submissions persist but notification emails are skipped.

## Firestore setup

Production requires Cloud Firestore so submissions are never written to an ephemeral deployment filesystem.

1. Create a Firebase project and enable Cloud Firestore in Native mode.
2. On Firebase App Hosting or Cloud Run, use the platform-provided Application Default Credentials.
3. On another host, create a server service account and set `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY` in the deployment environment.
4. Never commit a service-account JSON file or private key.

The Firebase Admin SDK is server-only. The browser never receives administrator credentials. Leads are stored in the `leads` collection and payment claims in `payments`.

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
| `/admin` | Lead and payment operations |

## Validation

```bash
npm run lint
npm test
npm run build
```

## Next milestones

1. Firebase Authentication and customer workspaces
2. Saved SerialPro jobs, QuotePro quotes, and shop presets
3. Paid-plan enforcement and M-Pesa verification
4. Product analytics and error monitoring
5. Branded invoices and receipts
