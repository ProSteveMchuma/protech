# CLAUDE.md

Shared project context for Claude Code and all agents working on this repo.

## What this is

**ProPrint** — print automation software by **Pro Innovation & Technologies** (`proinnovationtech.co.ke`). Built in Nairobi for Kenyan print shops, usable worldwide.

- **Flagship tools (production beta):** **SerialPro** (PDF numbering + imposition) and **QuotePro** (print costing and selling price).
- **Roadmap modules (not built):** ImposePro Advanced, ProofPro, JobTrack, PreflightPro.
- **Conversion today:** founding-beta applications at `/beta`. Paid plans are listed but not charged.

The site is the front door: it explains the product, lets operators try the tools in the browser, captures beta and feedback leads, and lets the founder manage submissions from `/admin`. There is no customer login yet.

## Tech stack

- Next.js 16 App Router, React 19, TypeScript strict
- Tailwind CSS v4 — tokens defined as `@theme` in [app/globals.css](app/globals.css), no `tailwind.config.ts`
- `framer-motion` for route/page motion. Shared variants in [lib/motion.ts](lib/motion.ts).
- `react-hook-form` + `zod` for forms
- `pdf-lib` for **client-side** PDF numbering and imposition (artwork stays in the browser)
- `nodemailer` for SMTP (graceful no-op without env)
- Cloud Firestore in production via Admin SDK ([lib/firebase-admin.ts](lib/firebase-admin.ts)); JSON under `/data/` in local dev ([lib/leads.ts](lib/leads.ts), [lib/payments.ts](lib/payments.ts)) — gitignored. Browser Firebase web config lives in [lib/firebase-client.ts](lib/firebase-client.ts) for future Auth. Setup: [docs/FIREBASE.md](docs/FIREBASE.md).
- Manual M-Pesa Paybill flow (Paybill `767363`, account = customer name). Admin verifies codes in `/admin`. No Daraja STK Push. Checkout UI is parked until billing launches.

## Brand & design system

- Name: **ProPrint** · Company: **Pro Innovation & Technologies** · Tagline: *"Software that makes printing faster."*
- Logo: [components/Logo.tsx](components/Logo.tsx) — `mark` and `lockup` variants
- Fonts: Inter (body and headlines), JetBrains Mono (labels, numbers, codes). Fraunces is loaded as `--font-display` but live pages use Inter `font-black`.
- Color tokens: `press` (`#071019`), `press-panel` (`#0c1822`), `press-deep` (`#050b11`), `accent-{50..900}` cyan, `success-500`, `sun-500`. Prefer these over hardcoded hex.
- Studio utilities in [app/globals.css](app/globals.css): `bg-press`, `imposition-grid`, `press-window`, `kicker`, plus SerialPro/QuotePro panel classes.
- UI primitive in active use: [components/ui/Button.tsx](components/ui/Button.tsx) (`Button`, `ButtonLink`). Reuse it for admin and form actions; marketing pages may use raw Tailwind CTAs that already match the press shell.
- Always: `font-mono tabular-nums` for KES amounts, M-Pesa codes, paybills, sheet counts, serials, percentages

## Design philosophy

**Press-dark utility, not brochure chrome.**

- One primary action per screen. On marketing pages that action is **Join the founding beta**.
- Generous whitespace. Typography and production numbers do the work.
- Mobile-first: a 375px viewport must feel intentional.
- Conversion path is unmistakable within 3 seconds.
- One or two product demonstrations per page (press-window mock, live tool). If you can remove a motion moment without weakening the message, remove it.
- Respect `prefers-reduced-motion`.

**Anti-patterns to avoid:**
- Multiple CTAs competing in the same hero
- Decorative motion on every card or header
- Long forms — ≤4 visible fields per step
- Inventing a third visual language for a new page
- Density mistaken for richness

**Practical rules:**
- Hero: one headline (huge, black weight), one sub-line, one primary CTA, optional one tertiary text link
- Pricing: beta is free and is the only charged-now CTA; paid tiers are waitlist until billing launches
- Forms: dark press panels, cyan focus rings, mono field labels
- Tool pages: console/preview panels, not marketing cards

## Repo conventions

- Server Components by default. `"use client"` only when needed.
- Validate at the API boundary with zod; trust within.
- Email subjects start with `[ProPrint]`.
- Phone numbers normalized to `254XXXXXXXXX` at the boundary.
- Money is integer KES (no floats).
- Use `@/` import alias.
- No comments that restate code. Comments are reserved for *why*.
- No emojis in production copy.

## Routes

| Path | Purpose |
| --- | --- |
| `/` | Product landing |
| `/tools/serialpro` | PDF numbering and imposition |
| `/tools/quotepro` | Print quotation calculator |
| `/beta` | Founding-beta applications |
| `/feedback` | Product feedback |
| `/about` | Company / product story |
| `/legal/privacy` | Privacy note (local PDF processing) |
| `/admin` | Auth-gated lead + payment manager |
| `/api/notify` | POST — captures and emails leads |
| `/api/payment/submit` | POST — customer submits M-Pesa code (billing not live) |
| `/api/admin/{login,logout,leads,payments}` | Admin auth + management |

Legacy PRT URLs (`/services/*`, `/hire`, `/apply`, `/guides/*`, `/checkout`) stay redirected in [next.config.ts](next.config.ts). Do not revive them.

## Env vars

See [.env.example](.env.example) and [docs/FIREBASE.md](docs/FIREBASE.md): `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` (≥16, docs say 32+), SMTP (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `NOTIFY_EMAIL`), `MPESA_PAYBILL`, `WHATSAPP_NUMBER`, `SUPPORT_EMAIL`, Admin Firestore (`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`) or ADC, and web SDK (`NEXT_PUBLIC_FIREBASE_*`).

## Verification gates (before declaring work done)

1. `npm run build` passes (0 type errors, 0 warnings)
2. `npm test` and `npm run lint` pass
3. Touched routes return 200 (curl or browser)
4. If touching forms: try valid + invalid submit
5. If touching auth/payments: exercise `/admin` login and lead/payment list
6. `Grep` in live source returns zero matches for `RemotePro`, `Pro Remote Tasks`, `tender-watch`, `va-growth`, `AGPO`, `PPADA`
7. Mobile sweep at 375px — home, one tool, beta form readable and tappable with one thumb

## Agent team

Specialized agents live in `.claude/agents/`. Pick the one that matches your task:

- **print-ops** — Kenyan print-shop / prepress expert. Use for numbering, imposition, quoting, sheet sizes, and whether a feature solves a real operator pain.
- **product-designer** — UI/UX, motion, accessibility. Owns the press-dark shell.
- **fullstack-engineer** — End-to-end implementation (page + API + storage, pdf-lib, Firestore, M-Pesa).
- **growth-marketer** — Conversion, copy, funnel. Owns landing copy, CTAs, and the beta funnel.

For multi-discipline features, the typical chain is: print-ops (specs the operator value) → growth-marketer (drafts the copy) → product-designer (lays out the page) → fullstack-engineer (implements + ships).

## Shipped recently

- **Local saved jobs** — SerialPro and QuotePro persist named setups in browser `localStorage` (settings only; artwork PDFs are never stored). See [lib/proprint/local-saves.ts](lib/proprint/local-saves.ts).

## Next milestones (do not implement unless asked)

Sequenced by operator value:

1. **Firebase Auth workspaces** — shop accounts, cloud save, presets
2. **ImposePro Advanced** — gang runs / signatures
3. **Paid enforcement** — wire checkout to `PACKAGES` in [lib/config.ts](lib/config.ts), admin-verified M-Pesa, feature gates
4. **Analytics + error monitoring**
5. **Branded invoices** from QuotePro

## What to never do

- Never commit `/data/*.json` (PII) or `.env.local`.
- Never upload artwork to the server without an explicit product decision. SerialPro processes PDFs in the browser.
- Never guarantee print-job accuracy, color match, or press output as legal/print advice.
- Never ship the hardcoded `admin123` pattern again.
- Never add a service back to the homepage that we do not actively sell. Only SerialPro and QuotePro are live tools.
- Never revive tender / VA / hire / apply / lead-magnet pages.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
