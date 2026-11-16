# CLAUDE.md

Shared project context for Claude Code and all agents working on this repo.

## What this is

**ProPrint** by **Pro Innovation & Technologies** — a made-to-order print shop in Nairobi, live at https://www.proinnovationtech.co.ke.

- **Main business: the online print shop.** Business cards, flyers, banners, apparel, promo items, stickers and signage, stationery, packaging and photo prints. Prices are on the product. Customers pay by M-Pesa Paybill `767363`, then collect at Karen Green, Langata Road, or get delivery across Kenya.
- **Side product: print software.** SerialPro (PDF numbering and imposition) and QuotePro (cost and price calculator) under `/tools`, with a founding beta at `/beta`. These pages use the separate dark "studio" chrome and are not indexed.

The tender-management and virtual-assistant services this repo once sold were retired. Their URLs redirect in [next.config.ts](next.config.ts); the admin screen and lead emails can still display old tender leads.

## Tech stack

- Next.js 16 App Router, React 19, TypeScript strict
- Tailwind CSS v4 — tokens in `@theme` in [app/globals.css](app/globals.css), no `tailwind.config.ts`
- Cloud Firestore through the Firebase Admin SDK for orders, leads and payment claims ([lib/print-orders.ts](lib/print-orders.ts), [lib/leads.ts](lib/leads.ts)); falls back to `/data/*.json` in local dev only
- Firebase Auth for customer accounts ([lib/shop-session.ts](lib/shop-session.ts))
- `react-hook-form` + `zod` for forms, `nodemailer` for email (no-op without SMTP env)
- Hosted on Vercel. Image optimization is off (`/_next/image` returns 402 on this project)

## Where things live

- Catalogue, groups and search: [lib/printshop/catalog.ts](lib/printshop/catalog.ts)
- Prices, delivery fees and turnaround: [lib/printshop/pricing.ts](lib/printshop/pricing.ts), [lib/printshop/pricebook.ts](lib/printshop/pricebook.ts)
- Product photos: [lib/printshop/images.ts](lib/printshop/images.ts). Files are in the Firebase Storage bucket under `products/v3/`; pages use `/media/...`, which [next.config.ts](next.config.ts) rewrites to the bucket. Use `absoluteImage()` where a full URL is required (JSON-LD).
- Business details (name, Paybill, WhatsApp, email, pickup address): [lib/config.ts](lib/config.ts). Never hardcode them in pages.
- Shop chrome: [components/store/](components/store/). `AppChrome` picks shop vs studio chrome by path.

## Brand and design

- Shop palette: white surfaces, near-black text, ProPrint red `#ff0030` for accents and the primary action
- Fonts: Plus Jakarta Sans (body), Fraunces (display), JetBrains Mono (numbers)
- Always `font-mono tabular-nums` for KES amounts, M-Pesa codes and the Paybill
- Price wording comes from `shelfPriceLabel()`: "From KES X" plus "for N pcs" or "each". Don't format prices by hand.
- Mobile first: every page must read and tap cleanly at 375px. One primary action per screen.

## Routes

| Path | Purpose |
| --- | --- |
| `/` | Shop homepage |
| `/shop`, `/category/[slug]`, `/product/[slug]` | Catalogue |
| `/packages` | Business print bundles |
| `/cart`, `/order`, `/orders/[id]` | Cart, checkout with M-Pesa code, order status |
| `/account`, `/auth/*` | Customer account and sign-in |
| `/contact`, `/about`, `/print-on-demand`, `/terms`, `/legal/privacy` | Info pages |
| `/tools/serialpro`, `/tools/quotepro`, `/beta`, `/feedback` | Print software (studio chrome) |
| `/admin`, `/admin/orders/[id]` | Order desk, payments and leads |
| `/api/print/orders`, `/api/print/artwork` | Place an order, upload artwork |
| `/api/notify` | Contact, beta and feedback submissions |

## Conventions

- Server Components by default; `"use client"` only when needed
- Validate at the API boundary with zod; trust within
- Email subjects start with `[ProPrint]`
- Phone numbers normalized to `254XXXXXXXXX` at the boundary
- Money is integer KES
- Use the `@/` import alias
- Comments explain why, not what. No emojis in production copy.

## Verification gates (before declaring work done)

1. `npm run lint` — 0 errors, 0 warnings
2. `npm test` passes
3. `npm run build` passes
4. Touched routes return 200
5. Forms: try one valid and one invalid submit
6. Mobile check at 375px

## What to never do

- Never commit `/data/*.json` (PII), `.env*` or a service-account key
- Never ship a hardcoded admin password
- Never hardcode prices, delivery fees, the Paybill or contact details outside `lib/`
- Never point product images straight at `storage.googleapis.com`; use `/media/...`

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
