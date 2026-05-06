# CLAUDE.md

Shared project context for Claude Code and all agents working on this repo.

## What this is

**Pro Remote Tasks (PRT)** — a Kenyan B2B services company.

- **Flagship service**: **Tender / bid management for Kenyan companies**. Help SMEs find, prepare, submit, and win government and corporate tenders.
- **Supporting service**: managed virtual assistants — kept because tender ops needs admin support and it cross-sells well.

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

## Design philosophy: Stripe-clean × Apple-storytelling

The site is being redesigned (2026-05-06) around two tensions held in balance:

**Stripe / Linear utility-clean — the baseline 90% of the time:**
- One primary action per screen. Secondary actions are quieter or hidden behind progressive disclosure.
- Generous whitespace. Air around headlines. Sections that breathe.
- Typography-first: let the words and numbers do the work. No decorative chrome.
- Mobile-first means a 5-inch viewport feels intentional, not crowded.
- Conversion path is unmistakable: a stranger should know what to click within 3 seconds.

**Apple-style scroll storytelling — the 10% where it earns the screen:**
- One or two scroll moments per page that demonstrate the product, not decorate it.
- Big numbers, kinetic typography, scroll-pinned reveals — used sparingly so they land.
- Each theatrical moment must answer a buyer question ("how big is the problem?", "how does this work?").
- If you can remove a motion moment without weakening the message, remove it.
- Respect `prefers-reduced-motion` — every theatrical moment must degrade gracefully.

**Anti-patterns to avoid:**
- Multiple CTAs competing in the same hero or section.
- Decorative motion ("hover lift on every card", "fade-up on every section header").
- Long forms — use multi-step or progressive disclosure.
- Stat-card grids that say nothing (e.g. floating KPIs as visual chrome).
- Three-tier pricing matrices when one anchor price + "see all tiers" works.
- Density mistaken for richness. Confidence is quieter than chrome.

**Practical rules:**
- Hero: one headline (display font, huge), one sub-line, one primary CTA, optional one tertiary text link. Nothing else above the fold.
- Pricing: lead with the floor price + outcome. Detailed tier matrix lives behind a "Compare tiers" disclosure or on `/services/*` pages.
- Forms: ≤4 visible fields per step. Conditional reveals smoothly animated.
- Service pages: each page tells one story start to finish. Reading top-to-bottom should feel like a Keynote, not a brochure.

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
| `/` | Landing — leads on tender |
| `/services/tender` | Flagship service page |
| `/services/va` | Supporting VA service page |
| `/hire?service=&tier=&industry=&agpoCategory=` | Lead form |
| `/checkout?pkg=…` | Manual M-Pesa Paybill checkout |
| `/apply` | Talent application |
| `/guides/tender-disqualifications` | Email-gated lead magnet |
| `/admin` | Auth-gated lead + payment manager |
| `/api/notify` | POST — captures and emails leads |
| `/api/payment/submit` | POST — customer submits M-Pesa code |
| `/api/lead-magnet/unlock` | POST — captures email, sets unlock cookie |
| `/api/admin/{login,logout,leads,payments}` | Admin auth + management |

## Verification gates (before declaring work done)

1. `npm run build` passes (0 type errors, 0 warnings)
2. Touched routes return 200 (curl or browser)
3. If touching forms: try valid + invalid submit
4. If touching auth/payments: regression-test the smoke flow in [README.md](README.md)
5. `Grep "RemotePro"` returns zero matches (legacy brand check)
6. Mobile sweep at 375px viewport — every page readable and tappable with one thumb

## Agent team

Specialized agents live in `.claude/agents/`. Pick the one that matches your task:

- **tender-strategist** — Kenyan procurement expert. Use for any tender-domain copy, feature design, or compliance question.
- **product-designer** — UI/UX, motion, accessibility. Use for visual decisions and component design. Owns the Stripe-clean × Apple-storytelling philosophy above.
- **fullstack-engineer** — End-to-end implementation. Use for features spanning page + API + storage, refactors, integrations.
- **growth-marketer** — Conversion, copy, funnel. Use for landing-page copy, CTAs, ads, lead magnets.

For multi-discipline features, the typical chain is: tender-strategist (specs the value prop) → growth-marketer (drafts the copy) → product-designer (lays out the page) → fullstack-engineer (implements + ships).

## What to never do

- Never commit `/data/*.json` (PII).
- Never commit `.env.local`.
- Never invent regulatory facts (PPRA, KRA, AGPO) — defer to tender-strategist + WebSearch.
- Never guarantee tender wins in marketing copy.
- Never ship the hardcoded `admin123` pattern again.
- Never add a service back to the homepage that we don't actively sell. Only Tender (flagship) and VA (supporting) right now.
