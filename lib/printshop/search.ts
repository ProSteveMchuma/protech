import { products } from "./catalog.ts";

const aliases: { pattern: RegExp; slug: string; hint?: string }[] = [
  { pattern: /\bpolo\b/, slug: "branded-t-shirt", hint: "Polo" },
  { pattern: /\bhoodies?\b/, slug: "branded-hoodies" },
  { pattern: /\baprons?\b/, slug: "branded-aprons" },
  { pattern: /\b(t-?shirts?|tees?)\b/, slug: "branded-t-shirt" },
  { pattern: /\bmugs?\b/, slug: "branded-mugs" },
  { pattern: /\b(business cards?|calling cards?)\b/, slug: "business-cards-printing" },
  { pattern: /\bspot uv\b/, slug: "spot-uv-business-cards" },
  { pattern: /\broll-?ups?\b/, slug: "roll-up-banner-printing" },
  { pattern: /\bx-?banners?\b/, slug: "x-banner-printing" },
  { pattern: /\bletterheads?\b/, slug: "letterheads-printing" },
  { pattern: /\benvelopes?\b/, slug: "envelopes-printing" },
  { pattern: /\breceipts?\b/, slug: "receipt-books-printing" },
  { pattern: /\b(a[0-6])\b.*\bflyers?\b|\bflyers?\b.*\b(a[0-6])\b/, slug: "flyers-printing" },
  { pattern: /\bflyers?\b/, slug: "flyers-printing" },
  { pattern: /\bposters?\b/, slug: "posters-printing" },
  { pattern: /\bfloor stickers?\b/, slug: "floor-stickers-printing" },
  { pattern: /\blabels?\b/, slug: "adhesive-label-stickers-printing" },
  { pattern: /\bstickers?\b/, slug: "vinyl-sticker-printing" },
  { pattern: /\bbooks?\b/, slug: "book-printing" },
];

export function interpretSearch(query: string) {
  const cleaned = query.trim().toLowerCase();
  if (cleaned.length < 3) return null;
  const quantityMatch = cleaned.replace(/\ba[0-6]\b/g, " ").match(/(\d{1,5})\b/);
  const quantity = quantityMatch ? Number(quantityMatch[1]) : undefined;
  const alias = aliases.find((item) => item.pattern.test(cleaned));
  const sizeHint = cleaned.match(/\b(a[0-6])\b/i)?.[1]?.toUpperCase();
  const sideHint = /\bdouble\b/.test(cleaned) ? "double" : /\bsingle\b/.test(cleaned) ? "single" : undefined;
  if (alias && products.some((product) => product.slug === alias.slug)) {
    return { slug: alias.slug, quantity, hint: [alias.hint, sizeHint, sideHint].filter(Boolean).join(" ") };
  }

  const tokens = cleaned
    .replace(/\d+/g, " ")
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 2 && !["printing", "print", "kenya", "branded", "the", "for", "and", "custom"].includes(token));
  if (!tokens.length) return null;
  let best: { slug: string; score: number } | null = null;
  let second = 0;
  for (const product of products) {
    const title = product.title.toLowerCase();
    const score = tokens.reduce((sum, token) => sum + (title.includes(token) ? 2 : 0), 0);
    if (!best || score > best.score) {
      second = best?.score ?? 0;
      best = { slug: product.slug, score };
    } else if (score > second) second = score;
  }
  if (!best || best.score < 2 || best.score === second) return null;
  return { slug: best.slug, quantity, hint: [sizeHint, sideHint].filter(Boolean).join(" ") };
}
