# ProPrint

> Print, made to order.

ProPrint is the online print shop of Pro Innovation & Technologies in Nairobi, live at https://www.proinnovationtech.co.ke. Customers pick a product, see the price, pay by M-Pesa Paybill, and collect at Karen Green or get delivery across Kenya. The admin order desk confirms payments and artwork before printing.

The same app hosts two print-production tools under `/tools`: SerialPro (PDF numbering and imposition) and QuotePro (production cost and selling price).

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
4. On Vercel, set `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`, and `FIRESTORE_DATABASE_ID=tenderpro` for Production. Keep the private key quoted, with newlines escaped as `\n`. Redeploy. The Firestore database in this project is named `tenderpro`, in `us-central1`.
5. Confirm with `npm run firestore:check`.

Never commit a service-account JSON file or private key. The browser never receives administrator credentials.

| Collection | Contents |
| --- | --- |
| `printOrders` | Print shop orders, M-Pesa code, line totals, and status history |
| `leads` | Contact, quote, and other form submissions |
| `payments` | Older manual payment claims, keyed by M-Pesa code |
| `_meta/proprint` | Written by `npm run firestore:check` |

Product photos are public objects in the Firebase Storage bucket `tenderpro-480721.firebasestorage.app`, under `products/v3/`. Pages request them as `/media/products/v3/...`; `next.config.ts` rewrites `/media/*` to the bucket, so the bucket name never appears in the site. Set `FIREBASE_STORAGE_BUCKET` to point at a different bucket. `npm run images:upload` publishes `public/images/products`. Image optimization stays off because this Vercel project returns 402 from `/_next/image`.

## Operational setup

Set `ADMIN_PASSWORD` and a random 32+ character `ADMIN_SESSION_SECRET` before opening `/admin`. Configure the SMTP variables to receive order, contact, beta and feedback notifications. Optional business configuration includes `MPESA_PAYBILL`, `WHATSAPP_NUMBER`, and `SUPPORT_EMAIL`.

## Primary routes

| Route | Purpose |
| --- | --- |
| `/` | Shop homepage |
| `/shop`, `/category/[slug]`, `/product/[slug]` | Catalogue |
| `/packages` | Business print bundles |
| `/cart`, `/order`, `/orders/[id]` | Cart, checkout and order status |
| `/account` | Customer account |
| `/contact`, `/about`, `/print-on-demand`, `/terms` | Info pages |
| `/tools/serialpro` | PDF numbering and imposition |
| `/tools/quotepro` | Print quotation calculator |
| `/beta` | Founding-beta applications |
| `/feedback` | Product feedback |
| `/admin` | Order desk, older payments, and leads |
| `/admin/orders/[id]` | Confirm M-Pesa, artwork, status, and the desk note |

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
