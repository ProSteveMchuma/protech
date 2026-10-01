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

Production requires Cloud Firestore. Vercel’s filesystem is ephemeral, so an order saved only to `/data` disappears. The live site returns an error on `/api/print/orders` until these credentials are set.

1. Create a Firebase project for ProPrint and enable Cloud Firestore in Native mode.
2. Deploy the rules in this repo: `npx firebase-tools deploy --only firestore`. The rules deny all browser access. The server uses the Admin SDK, which bypasses them.
3. In Firebase, open Project settings → Service accounts → Generate new private key.
4. On Vercel, set `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY` for Production. Keep the private key quoted, with newlines escaped as `\n`. Redeploy.
5. Confirm with `npm run firestore:check`.

Never commit a service-account JSON file or private key. The browser never receives administrator credentials.

| Collection | Contents |
| --- | --- |
| `printOrders` | Print shop orders, M-Pesa code, line totals, and status history |
| `leads` | Contact, quote, and other form submissions |
| `payments` | Older manual payment claims, keyed by M-Pesa code |
| `_meta/proprint` | Written by `npm run firestore:check` |

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
