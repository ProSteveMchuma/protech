# Pro Remote Tasks

> World-class talent. Kenyan rates. Zero hassle.

Productized agency that connects Kenyan SMEs and global founders with vetted Kenyan virtual assistants, social media managers, and content writers.

## Stack

- **Next.js 16** (App Router, React 19, TypeScript)
- **Tailwind CSS v4** with custom brand tokens (`@theme` in [app/globals.css](app/globals.css))
- **framer-motion** for motion
- **react-hook-form + zod** for forms
- **nodemailer** for SMTP notifications
- File-based JSON storage in `/data` (swap for Postgres/Supabase when you outgrow it)

## Quick start

```bash
npm install
cp .env.example .env.local        # fill in your values
npm run dev
```

Open http://localhost:3000.

The site degrades gracefully: with no SMTP set, leads/payments still save to disk — they just don't email you.

## How payments work (manual M-Pesa Paybill)

1. Customer picks a package on a service page → clicks **Pay with M-Pesa** → lands on `/checkout?pkg=…`.
2. Customer enters name, email, phone.
3. Site shows the Paybill, Account number (= customer's full name), and amount — all click-to-copy.
4. Customer pays from their phone. Safaricom SMS gives them a confirmation code (e.g. `QGH1A2B3C4`).
5. Customer pastes the code into the form. The submission is saved as a `pending` payment and you get an email.
6. You log into `/admin` → **Payments** tab → cross-check against your real M-Pesa statement → click **Verify** or **Reject**.

The default Paybill is `767363`; override with `MPESA_PAYBILL=…` in `.env.local`.

## Setup

### Email (Gmail SMTP — free)
1. Turn on 2-step verification on your Gmail account.
2. Create an [App Password](https://myaccount.google.com/apppasswords) for "Mail".
3. Put the 16-char password in `SMTP_PASS`. Set `SMTP_USER` to your Gmail address.
4. (Optional) Set `NOTIFY_EMAIL` to deliver alerts to a different inbox.

### Admin dashboard
1. Set `ADMIN_PASSWORD` to a strong password.
2. Generate a session secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Put it in `ADMIN_SESSION_SECRET`.
3. Visit `/admin`, log in.

## Brand

- **Name**: Pro Remote Tasks
- **Short**: PRT
- **Tagline**: World-class talent. Kenyan rates. Zero hassle.
- **Logo component**: [components/Logo.tsx](components/Logo.tsx) (`<Logo variant="mark" />` and `<Logo variant="lockup" />`)
- **Favicon**: [app/icon.svg](app/icon.svg)
- **Color tokens**: defined in [app/globals.css](app/globals.css) — `brand-{50..950}`, `accent-{50..900}`, `success-500`, `sun-500`.
- **Fonts**: Inter (body), Fraunces (display), JetBrains Mono (mono).

## Routes

| Path                            | Purpose                                  |
| ------------------------------- | ---------------------------------------- |
| `/`                             | Landing                                  |
| `/services/{va,social,content}` | Service detail + pricing                 |
| `/hire?service=&tier=`          | Lead form                                |
| `/checkout?pkg=va-growth`       | M-Pesa Paybill checkout                  |
| `/apply`                        | Talent application                       |
| `/admin`                        | Auth-gated lead + payment manager        |
| `/api/notify`                   | POST — captures and emails leads         |
| `/api/payment/submit`           | POST — customer submits M-Pesa code      |
| `/api/admin/{login,logout}`     | Admin auth                               |
| `/api/admin/leads`              | GET / PATCH — manage leads               |
| `/api/admin/payments`           | GET / PATCH — verify/reject payments     |

## Deploying

- **Render / Railway / Fly / a KE VPS**: Works out of the box — JSON file storage persists.
- **Vercel**: Filesystem is read-only at runtime, so leads and payments will not persist. Migrate `lib/leads.ts` and `lib/payments.ts` to Supabase or Neon Postgres before deploying there.

## Roadmap

1. Migrate JSON storage → Supabase/Postgres once you cross ~50 paying clients.
2. Auto-verify payments via Daraja webhooks (or M-Pesa email/SMS parsing).
3. Add a blog under `/blog` for SEO ("virtual assistant Kenya", "social media management Nairobi").
4. Google Analytics + Meta Pixel for ad-funnel tracking.
5. Issue branded PDF invoices automatically when admin verifies a payment.
