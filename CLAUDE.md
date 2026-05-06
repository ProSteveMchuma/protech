# CLAUDE.md

Shared project context for Claude Code and all agents working on this repo.

## What this is

**Pro Remote Tasks (PRT)** — a Kenyan B2B services company.

- **Flagship service** (where we want the brand to lead): **Tender / bid management for Kenyan companies**. Help SMEs find, prepare, submit, and win government and corporate tenders.
- **Supporting services** (existing, kept for cash flow + cross-sell): managed virtual assistants, social media management, SEO content writing.

The site is the front door: it generates leads, takes M-Pesa payments, and lets the founder manage both from `/admin`. There is no separate CRM yet.

## Tech stack

- Next.js 16 App Router, React 19, TypeScript strict
- Tailwind CSS v4 — tokens defined as `@theme` in [app/globals.css](app/globals.css), no `tailwind.config.ts`
- `framer-motion` for animation. Shared variants in [lib/motion.ts](lib/motion.ts).
- `react-hook-form` + `zod` for forms
- `nodemailer` for SMTP (graceful no-op without env)
- File-based JSON storage in `/data/` ([lib/leads.ts](lib/leads.ts), [lib/payments.ts](lib/payments.ts)) — gitignored
- Manual M-Pesa Paybill flow (Paybill `767363`, account = customer name). Customer submits M-Pesa code; admin verifies in `/admin`. No Daraja STK Push.

## Brand & design system

- Name: **Pro Remote Tasks** · Short: **PRT** · Tagline: *"World-class talent. Kenyan rates. Zero hassle."*
- Logo: [components/Logo.tsx](components/Logo.tsx) — `mark` and `lockup` variants
- Fonts: Inter (body), Fraunces (display), JetBrains Mono (numbers/codes)
- Color tokens: `brand-{50..950}`, `accent-{50..900}`, `success-500`, `sun-500`
- Background utilities: `bg-aurora`, `bg-aurora-dark`, `bg-grid`
- UI primitives: [components/ui/](components/ui/) — `Button`, `ButtonLink`, `Card`, `Badge`, `Section`, `Container`. Always reuse; don't recreate.
- Always: `font-mono tabular-nums` for KES amounts, M-Pesa codes, paybills, percentages

## Repo conventions

- Server Components by default. `"use client"` only when needed.
- Validate at the API boundary with zod; trust within.
- Email subjects start with `[PRT]`.
- Phone numbers normalized to `254XXXXXXXXX` at the boundary.
- Money is integer KES (no floats).
- Use `@/` import alias.
- No comments that restate code. Comments are reserved for *why*.
- No emojis in production copy.

## Routes

| Path | Purpose |
| --- | --- |
| `/` | Landing |
| `/services/{va,social,content}` | Service detail + pricing |
| `/services/tender` | **(planned)** flagship tender management service page |
| `/hire?service=&tier=` | Lead form |
| `/checkout?pkg=…` | Manual M-Pesa Paybill checkout |
| `/apply` | Talent application |
| `/admin` | Auth-gated lead + payment manager |
| `/api/notify` | POST — captures and emails leads |
| `/api/payment/submit` | POST — customer submits M-Pesa code |
| `/api/admin/{login,logout,leads,payments}` | Admin auth + management |

## Verification gates (before declaring work done)

1. `npm run build` passes (0 type errors, 0 warnings)
2. Touched routes return 200 (curl or browser)
3. If touching forms: try valid + invalid submit
4. If touching auth/payments: regression-test the smoke flow in [README.md](README.md)
5. `Grep "RemotePro"` returns zero matches (legacy brand check)

## Agent team

Specialized agents live in `.claude/agents/`. Pick the one that matches your task:

- **tender-strategist** — Kenyan procurement expert. Use for any tender-domain copy, feature design, or compliance question.
- **product-designer** — UI/UX, motion, accessibility. Use for visual decisions and component design.
- **fullstack-engineer** — End-to-end implementation. Use for features spanning page + API + storage, refactors, integrations.
- **growth-marketer** — Conversion, copy, funnel. Use for landing-page copy, CTAs, ads, lead magnets.

For multi-discipline features (e.g. "build a /services/tender page"), the typical chain is: tender-strategist (specs the value prop and tiers) → growth-marketer (drafts the copy) → product-designer (lays out the page) → fullstack-engineer (implements + ships).

## What to never do

- Never commit `/data/*.json` (PII).
- Never commit `.env.local`.
- Never invent regulatory facts (PPRA, KRA, AGPO) — defer to tender-strategist + WebSearch.
- Never guarantee tender wins in marketing copy.
- Never ship the hardcoded `admin123` pattern again.
