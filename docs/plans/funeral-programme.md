# Plan: Funeral Programme Designer (ProPrint)

Status: **M1 foundation shipping — name locked as ProgrammePro**  
Product home: ProPrint by Pro Innovation (`proinnovationtech.co.ke`)  
**Product name: ProgrammePro**

Reference sample: Emma Koki Wambua A3 print-ready programme (4 full-bleed landscape sheets).

---

## 1. Product decision (locked)

**Primary format: A3 landscape bi-fold (this style).**

| Spec | Value |
| --- | --- |
| Sheet | A3 landscape **420 × 297 mm** |
| Fold | Once down the centre → finished **A4 portrait** panels (210 × 297 mm each) |
| Panels per sheet | 2 (left + right) |
| Programme depth | **1–4 sheets** (4–16 panels). Emma sample = 4 sheets / 8 panels |
| Output | Print-ready PDF, full bleed, shop-safe margins, duplex flip-on-short-edge guidance |
| Colour | Full colour cover + inners (Kenyan shop default for premium programmes) |

This matches how Nairobi shops already quote and print premium programmes (design → PDF → digital press → fold). A5 booklet and A4 single-fold remain **later** formats.

---

## 2. Why this tool (Kenya-first)

Funeral programmes are high-frequency, overnight work for Kenyan print shops. Families bring photos + Word notes; shops currently rebuild in **Canva, Corel, Photoshop, Publisher, or Word**. Layout breaks when hymns or tributes grow. Diaspora families expect photo-heavy keepsakes.

ProPrint already serves those shops (SerialPro, QuotePro). A funeral programme builder that speaks **shop language** (A3 fold, bleed, duplex, local photos) and **Kenyan content** (order of service with times, clan tributes, Kikamba/Swahili hymn blocks, structured eulogy) can own this niche.

**Positioning line:** *The funeral programme builder built for Kenyan print shops — A3 fold, photo-heavy, overnight-ready.*

---

## 3. Competitive research (what exists today)

### A. General design tools (what shops use now)

| Tool | How it’s used | Strengths | Gaps vs our goal |
| --- | --- | --- | --- |
| **Canva** | #1 DIY + many shops; buy funeral templates (Godserv, RIP Templates, Funeral Templates) | Fast, templates, mobile | Not print-shop native; bleed/CMYK mistakes; US/A4-centric; no Kenya order-of-service structure; freeform layout breaks under late edits |
| **Word / Publisher / Google Docs** | Cheap templates from Funeral Program Site (~$70 Kenya-named packs) | Familiar | Photos destroy layout; no true A3 fold preview; weak typography |
| **Photoshop / InDesign / Illustrator** | Premium designers; PSD/INDD packs on Creative Market, Inspiks | Print control, beauty | Slow; skill barrier; every job reinvented; overkill for overnight edits |
| **CorelDRAW** | Common in Kenyan print shops | Local skill base | Same: manual, not structured content |

### B. Dedicated funeral programme makers (mostly US/global, family-facing)

| Product | Format focus | Model | Notes |
| --- | --- | --- | --- |
| **FuneralFolio** | Letter 4-fold, 5×7 card | Browser editor + PDF | Guided, memorial page/QR extras; not A3 Kenya |
| **MyCreativeShop** | Letter + **tabloid 17×11 bi-fold** (+ A3/A4 claim) | Templates + print fulfillment | Closest format cousin; US funeral-home tone; not Kenya content |
| **Funeral Program Maker / EZdoc / Farewelling** | Letter bifold | AI draft → pay for PDF (~$5–20) | Fast for families; thin photo collages; not shop workflow |
| **Eulogize** | Templates + drag editor | PDF home + pro print | Collaboration; still Western formats |
| **print.ke / Quill / Nairobi printers** | Design+print service | Human designers, 1-day turnaround | Our *customers*, not competitors — they need a tool |

### C. What nobody owns yet (our opening)

1. **A3 fold as first-class**, with printer duplex/fold guidance for Nairobi digital presses  
2. **Kenya-shaped content model** — timed service table, nested tribute speakers (children, clans, church, politicians), structured eulogy (birth → education → career → marriage/family → demise), multi-hymn lyrics including local language titles  
3. **Shop-first workflow** — operator builds while family WhatsApps photos; late name/photo swap without exploding layout  
4. **Photo-heavy premium packs** like the Emma sample (cover collage + tribute photos + 6–12 memory slots + cutout eulogy portrait) without requiring Photoshop  
5. **Local-first privacy** — photos never uploaded unless the shop opts into cloud later  
6. **Template library that looks Kenyan** — floral matriarch, classic Christian, modern celebration, clergy/elder, soft memorial — not only US “dove on blue sky”

---

## 4. How we become the best (winning principles)

1. **Format truth** — WYSIWYG fold preview (left/right panels, crease gutter, bleed). Shops see the sheet they will print.  
2. **Content schema > free canvas** — forms fill locked template slots; optional advanced “nudge” later. Canva-flexibility is a trap for overnight jobs.  
3. **Templates are the product** — beauty lives in template packs; the editor is the reliable engine.  
4. **Kenya defaults** — sunrise/sunset wording, “Celebrating the Life”, Rest in Peace Mum/Dad, acknowledgement block, clan tribute lists.  
5. **Overnight speed** — empty → PDF in under 20 minutes for a trained operator on a known template.  
6. **Print craft** — 300 DPI photo checks, max downscale, safe area warnings, duplex flip-short-edge sheet.  
7. **Respect** — calm UI, no gimmicks, no religious authority claims, photo-permission reminder.  
8. **Shop economics** — free-to-try in beta; later Tool Pro / shop plan gates premium template packs — still no artwork upload required.

---

## 5. Anatomy from the Emma sample (canonical A3 programme)

Four A3 landscape sheets = eight A4 panels:

| Sheet | Left panel | Right panel |
| --- | --- | --- |
| 1 | Acknowledgement + photo | **Front cover** (hero) |
| 2 | Funeral program (timed + tributes list) | Tribute letter + 2 captioned photos |
| 3 | Memories collage (6) | Hymns / songs (full lyrics) |
| 4 | Memories collage | Eulogy (structured) + cutout portrait |

**Visual system to template:** cream parchment, dusty pink/burgundy florals, script display + serif body, heart dividers, wavy footer bar with dedication.

---

## 6. User inputs (builder fields)

### Global / identity
- Full legal name + display first name  
- Cover title (“Celebrating the Life” / “In Loving Memory” / custom)  
- Role line (“Beloved Matriarch of the Kitau Family”)  
- Sunrise date, sunset date  
- Attribute words (chip list)  
- Dedication footer (“Rest in Peace, Mum”)  
- Motto / side quotes  
- Service venue, date, time (optional on cover)

### Photos
- Cover portrait (required)  
- Cover background collage (0–3)  
- Acknowledgement photo  
- Tribute photos (0–4) + captions  
- Memory gallery slots (template-defined, typically 6–12)  
- Eulogy portrait (optional cutout later)

### Order of service
- Rows: time + activity (reorderable)  
- Roles: MC, pastor, choir, others  
- Nested tribute speakers list under a “Tributes / Flowers” row

### Written sections
- Acknowledgement body  
- Tribute blocks: title, body, sign-off (1–N)  
- Eulogy structured: Birth, Education, Career, Marriage & family, Demise (toggle sections)  
- Family lists (spouse, children, grandchildren, in-laws — line or bullet)

### Hymns
- N songs: title + lyrics (plain text; stanza-friendly)  
- No copyrighted hymnal scrape in v1 — user pastes what they have rights to print

### Shop controls
- Template pack + colour variant  
- Sheet count (1–4) / which panels enabled  
- Export: PDF print (bleed) + screen proof PDF

---

## 7. Template strategy (create to win)

Templates are not decoration — they are the moat.

### Launch pack (v1) — 5 A3-fold templates

| ID | Name | Mood | Best for |
| --- | --- | --- | --- |
| `floral-matriarch` | Floral Matriarch | Cream, rose, burgundy (Emma-class) | Mothers, grandmothers |
| `classic-cross` | Classic Christian | Ivory, navy/gold, subtle cross | Church elders, formal service |
| `soft-sky` | Soft Memorial | Pale blue, clouds, calm serif | General / celebration of life |
| `portrait-modern` | Portrait Modern | Minimal, large photo, clean type | Younger adults, modern families |
| `green-garden` | Garden Rest | Sage, leaf motifs | Outdoor / nature-leaning |

Each template defines:
- Panel map (which sections live on which A3 face)  
- Photo slot geometry + min resolution hints  
- Font pairing (we embed or subset licensed/web-safe print fonts)  
- Ornament assets (florals, waves, hearts) as SVG/PNG  
- Colour tokens (primary, accent, text, paper)

### How templates are authored (internal)

1. Designer builds master artboards in Figma/Illustrator at A3 landscape  
2. Export ornament assets + a **slot manifest JSON** (coordinates in mm)  
3. Engineer registers template in `lib/proprint/programme/templates/`  
4. Renderer fills slots from programme schema → HTML preview + `pdf-lib` production PDF  

### Growth packs (post-v1)
- Clergy / bishop  
- Child / angel (extra care in copy)  
- Military / police / teacher professional  
- Muslim janazah notice (simpler single/double sheet — separate format)  
- Thanksgiving / memorial anniversary  
- Vernacular hymn-friendly denser lyric pages  

**Quality bar:** every launch template must pass a real A3 digital-press test at a Nairobi shop (bleed, fold crease, photo sharpness).

---

## 8. MVP scope (v1) — revised

### In scope
- `/tools/programme` studio (press-dark, shop console)  
- A3 landscape fold preview (left | crease | right)  
- 5 launch templates above  
- Full Emma-shaped schema (cover, acknowledgement, service, tributes, memories, hymns, eulogy)  
- Photo upload local-only + crop-in-slot + DPI warning  
- Timed order-of-service editor + nested tribute list  
- Multi-sheet programmes (up to 4 A3 sheets)  
- PDF export with 3 mm bleed + trim marks option  
- Local save (IndexedDB for photos + content)  
- Print guidance sheet (duplex, flip short edge, fold)  
- Feedback `?product=programme`  
- Roadmap listing until deliberately launched live  

### Out of scope v1
- Freeform Canva canvas  
- Background auto-removal (cutout) — milestone 2  
- AI obituary writer — optional later; do not depend on it for quality  
- Family magic proof links / cloud — reuse shop Auth later  
- Hymn copyright library  
- Print.ke-style fulfillment (we generate PDF; shop prints)  
- A5 booklet / graduated fold  

---

## 9. UX shape

```
[ 01 Content ]          [ 02 A3 fold preview ]        [ 03 Template & export ]
  identity & photos       sheet tabs (1–4)              template gallery
  service table           left | crease | right         colour variant
  tributes / eulogy       zoom / page turn              download PDF
  hymns                   DPI warnings                  save programme
```

Family can sit with the shop; primary user remains the **print operator**.

---

## 10. Technical approach

| Layer | Path |
| --- | --- |
| Route | `app/tools/programme/page.tsx` |
| Studio | `components/proprint/ProgrammeStudio.tsx` |
| Schema | `lib/proprint/programme/schema.ts` (zod) |
| Templates | `lib/proprint/programme/templates/*` + assets under `public/programme/` |
| Layout | `lib/proprint/programme/layout.ts` (mm → PDF points) |
| PDF | `lib/proprint/programme/pdf.ts` via **pdf-lib** (controlled print output) |
| Preview | HTML/CSS A3 stage approximating slots |
| Saves | IndexedDB (`programme` kind) — photos too big for localStorage |
| Tests | pagination, fold panel order, schema, photo downscale |

**PDF strategy:** `pdf-lib` for production fidelity (recommendation stands). HTML preview is approximate; PDF is source of truth for press.

**Photos:** client-side decode, downscale (max edge ~2500–3000 px for A3), JPEG embed, warn if < 150 DPI at slot size.

---

## 11. Milestones

### M0 — Plan lock
Name, A3 fold (done), template list, go-build.

### M1 — Foundation
Schema + empty A3 fold studio + 1 template (`floral-matriarch`) + cover/acknowledgement panels + local save without photos.

### M2 — Content engines
Order of service, tributes, eulogy structure, hymns; multi-sheet tabs.

### M3 — Photos + PDF
All photo slots, crop, DPI checks, `pdf-lib` export with bleed, print guide.

### M4 — Template pack + shop pilot
All 5 launch templates; real A3 press test; roadmap/soft launch decision; feedback wiring.

### M5 — Differentiate
Cutout portrait assist, cloud save via shop Auth, family proof link, QuotePro estimate hook (“programme print quote”), premium packs.

---

## 12. Success criteria

1. Operator produces an Emma-class A3 programme PDF in ≤ 20 minutes on `floral-matriarch`.  
2. Late photo/name change does not break fold layout.  
3. Photos never leave the browser in v1.  
4. Printed A3 fold aligns (crease gutter respected; no clipped names).  
5. 5 templates visually distinct and culturally appropriate.  
6. Build/lint/tests pass; 375px usable for content entry (preview may scroll).

---

## 13. Open decisions (still need)

1. Soft-launch: early shop beta URL is live at `/tools/programme` with Building status — full Production beta after M4 press test.
2. Ornaments: in-house CSS/SVG first (Floral Matriarch wave + slots); commissioned art packs later.
3. Font licensing: Fraunces (display) + Inter (body) for preview; embeddable print fonts confirmed at PDF milestone.

---

## 14. Explicit non-goals

- Replacing Canva for arbitrary graphic design  
- Hosting public obituaries  
- Scraping hymnals  
- Guaranteeing liturgical or colour-managed press proofing  
- Competing with Nairobi print *fulfillment* — we make shops faster  

---

*Next after approval: lock name + font/ornament approach, then branch `cursor/funeral-programme-foundation-46b3` for M1.*
