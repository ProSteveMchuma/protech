import type { CatalogProduct } from "./catalog";
import { priceBooks, type PriceEntry, type PriceGroup, type VariationPrice } from "./pricebook.ts";

export type PriceModel = "unit" | "item" | "quote";
export type Turnaround = "standard" | "express" | "rush";

export const NAIROBI_DELIVERY_KES = 400;
export const OUTSIDE_NAIROBI_DELIVERY_KES = 850;
export const FREE_DELIVERY_FROM_KES = 10_000;

export const turnaroundChoices: { id: Turnaround; label: string; addKes: number }[] = [
  { id: "standard", label: "Standard · 3 business days", addKes: 0 },
  { id: "express", label: "Express · 2 business days", addKes: 500 },
  { id: "rush", label: "Rush · 24 hours in Nairobi", addKes: 1_500 },
];

export type QuoteSpec = {
  slug: string;
  quantity: number;
  group?: string;
  options?: Record<string, string>;
  attrs?: Record<string, string>;
  turnaround: Turnaround;
  width?: number;
  height?: number;
  pages?: number;
  color?: "bw" | "color";
  size?: string;
  paper?: string;
  cover?: string;
  binding?: string;
};

export type QuoteResult = {
  totalKes: number;
  unitKes: number;
  quantity: number;
  summary: string;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function roundQty(quantity: number, entry: PriceEntry) {
  const step = entry.step || 1;
  const snapped = Math.round(quantity / step) * step;
  return clamp(snapped || entry.minQty, entry.minQty, entry.maxQty);
}

function tierTotal(tiers: { qty: number; total: number }[], quantity: number) {
  const sorted = [...tiers].sort((a, b) => a.qty - b.qty);
  const qty = clamp(Math.round(quantity), sorted[0].qty, sorted[sorted.length - 1].qty);
  const exact = sorted.find((tier) => tier.qty === qty);
  if (exact) return exact.total;
  for (let index = 0; index < sorted.length - 1; index += 1) {
    const left = sorted[index];
    const right = sorted[index + 1];
    if (qty >= left.qty && qty <= right.qty) {
      const span = (qty - left.qty) / (right.qty - left.qty);
      return Math.round(left.total + span * (right.total - left.total));
    }
  }
  const last = sorted[sorted.length - 1];
  return Math.round((last.total * qty) / last.qty);
}

function optionExtra(entry: PriceEntry, options: Record<string, string> | undefined, quantity: number) {
  let add = 0;
  const parts: string[] = [];
  for (const option of entry.options ?? []) {
    const label = options?.[option.name];
    const choice = option.choices.find((item) => item.label === label);
    if (!choice || choice.add === 0) continue;
    add += choice.add <= 40 ? choice.add * quantity : choice.add;
    parts.push(choice.label);
  }
  return { add, parts };
}

function matchVariation(variations: VariationPrice[], attrs: Record<string, string>) {
  const ranked = variations
    .map((variation) => {
      const keys = Object.keys(variation.attrs);
      const conflicts = keys.filter((key) => attrs[key] && attrs[key] !== variation.attrs[key]).length;
      const matched = keys.filter((key) => attrs[key] === variation.attrs[key]).length;
      return { variation, conflicts, matched };
    })
    .filter((item) => item.conflicts === 0)
    .sort((a, b) => b.matched - a.matched || a.variation.price - b.variation.price);
  return ranked[0]?.variation ?? variations.slice().sort((a, b) => a.price - b.price)[0];
}

export function priceEntry(slug: string) {
  return priceBooks[slug];
}

export function priceModel(product: Pick<CatalogProduct, "slug" | "fromKes">): PriceModel {
  const entry = priceBooks[product.slug];
  if (!entry || entry.quote) return "quote";
  if (entry.groups || entry.size || entry.book || entry.variations) return "unit";
  if (product.fromKes <= 0) return "quote";
  return product.fromKes < 500 ? "unit" : "item";
}

export function defaultSpec(product: Pick<CatalogProduct, "slug" | "fromKes">): QuoteSpec | null {
  const entry = priceBooks[product.slug];
  if (!entry || entry.quote) return null;
  const spec: QuoteSpec = { slug: product.slug, quantity: entry.minQty, turnaround: "standard", options: {}, attrs: {} };
  if (entry.groups?.length) {
    const group = entry.groups[0];
    spec.group = group.label;
    spec.quantity = group.tiers[0]?.qty ?? entry.minQty;
  }
  if (entry.variations?.length) {
    const preferred = entry.variations.find((item) => item.price === product.fromKes) ?? entry.variations.slice().sort((a, b) => a.price - b.price)[0];
    spec.attrs = { ...preferred.attrs };
  }
  if (entry.size) {
    spec.width = entry.size.minW;
    spec.height = entry.size.minH;
  }
  if (entry.book) {
    spec.size = entry.book.sizes[0]?.name;
    spec.color = "color";
    spec.paper = entry.book.papers[0]?.name;
    spec.cover = entry.book.covers[0]?.name;
    spec.binding = entry.book.bindings[0]?.name;
    if (entry.book.perPage) spec.pages = 32;
  }
  for (const option of entry.options ?? []) {
    const free = option.choices.find((choice) => choice.add === 0);
    if (free) spec.options![option.name] = free.label;
  }
  return spec;
}

export function applySearchHint(spec: QuoteSpec, hint?: string, quantity?: number): QuoteSpec {
  const next: QuoteSpec = { ...spec, options: { ...spec.options }, attrs: { ...spec.attrs } };
  const entry = priceBooks[spec.slug];
  const needle = hint?.trim().toLowerCase();
  if (entry && needle) {
    const group = entry.groups?.find((item) => item.label.toLowerCase().includes(needle));
    if (group) next.group = group.label;
    for (const variation of entry.variations ?? []) {
      for (const [key, value] of Object.entries(variation.attrs)) {
        if (value.toLowerCase().includes(needle)) next.attrs![key] = value;
      }
    }
    const size = entry.book?.sizes.find((item) => item.name.toLowerCase().includes(needle));
    if (size) next.size = size.name;
    if (needle.includes("double")) {
      const sided = entry.groups?.find((item) => /double/i.test(item.label));
      if (sided) next.group = sided.label;
    }
    if (needle.includes("single")) {
      const sided = entry.groups?.find((item) => /single/i.test(item.label));
      if (sided) next.group = sided.label;
    }
  }
  if (quantity && quantity > 0) next.quantity = quantity;
  return next;
}

export function quoteProduct(product: Pick<CatalogProduct, "slug" | "fromKes">, spec: QuoteSpec): QuoteResult | null {
  const entry = priceBooks[product.slug];
  if (!entry || entry.quote) return null;
  const parts: string[] = [];
  let quantity = Math.round(spec.quantity);
  let total = 0;

  if (entry.groups?.length) {
    const group = entry.groups.find((item) => item.label === spec.group) ?? entry.groups[0];
    const tiers = [...group.tiers].sort((a, b) => a.qty - b.qty);
    quantity = clamp(quantity, tiers[0].qty, tiers[tiers.length - 1].qty);
    total = tierTotal(tiers, quantity);
    parts.push(group.label);
  } else if (entry.size) {
    const width = clamp(spec.width ?? entry.size.minW, entry.size.minW, entry.size.maxW);
    const height = clamp(spec.height ?? entry.size.minH, entry.size.minH, entry.size.maxH);
    quantity = roundQty(quantity, entry);
    total = Math.round(width * height * entry.size.rate * quantity);
    parts.push(`${trimNumber(width)} × ${trimNumber(height)} ${entry.size.unit}`);
  } else if (entry.book) {
    const book = entry.book;
    const size = book.sizes.find((item) => item.name === spec.size) ?? book.sizes[0];
    const color = spec.color === "bw" ? "bw" : "color";
    const paper = book.papers.find((item) => item.name === spec.paper) ?? book.papers[0];
    const cover = book.covers.find((item) => item.name === spec.cover) ?? book.covers[0];
    const binding = book.bindings.find((item) => item.name === spec.binding) ?? book.bindings[0];
    const pages = book.perPage ? clamp(Math.round(spec.pages ?? 32), 4, 400) : 0;
    const sizeRate = color === "bw" ? size.bw : size.color;
    const paperRate = paper ? (color === "bw" ? paper.bw : paper.color) : 0;
    const unit = book.base + (book.perPage ? pages * (sizeRate + paperRate) : sizeRate + paperRate) + (cover?.price ?? 0) + (binding?.price ?? 0);
    quantity = roundQty(Math.max(1, quantity), entry);
    const discount = book.discounts.find((band) => quantity >= band.min && quantity <= band.max) ?? [...book.discounts].reverse().find((band) => quantity >= band.min);
    total = Math.round(unit * quantity * (1 - (discount?.percent ?? 0) / 100));
    parts.push(size.name, color === "bw" ? "Black and white" : "Colour");
    if (book.perPage) parts.push(`${pages} pages`);
    if (paper && paperRate) parts.push(paper.name);
    if (cover) parts.push(cover.name);
    if (binding) parts.push(binding.name);
  } else if (entry.variations?.length) {
    quantity = roundQty(quantity, entry);
    const matched = matchVariation(entry.variations, spec.attrs ?? {});
    total = matched.price * quantity;
    parts.push(...Object.values(matched.attrs));
  } else {
    if (entry.unitKes <= 0) return null;
    quantity = roundQty(quantity, entry);
    total = entry.unitKes * quantity;
  }

  const extras = optionExtra(entry, spec.options, quantity);
  total += extras.add;
  parts.push(...extras.parts);
  const turnaround = turnaroundChoices.find((item) => item.id === spec.turnaround) ?? turnaroundChoices[0];
  total += turnaround.addKes;
  if (turnaround.addKes > 0) parts.push(turnaround.label);
  if (total <= 0 || quantity <= 0) return null;
  return { totalKes: total, unitKes: Math.max(1, Math.round(total / quantity)), quantity, summary: parts.filter(Boolean).join(" · ") };
}

export function groupFacetKeys(groups: PriceGroup[]) {
  const parsed = groups.map((group) => {
    const bits = group.label.split(",").map((part) => part.split(":"));
    if (bits.some((bit) => bit.length < 2)) return null;
    const record: Record<string, string> = {};
    for (const bit of bits) record[bit[0].trim()] = bit.slice(1).join(":").trim();
    return record;
  });
  if (parsed.some((item) => !item)) return null;
  const keys = Object.keys(parsed[0] ?? {});
  if (keys.length < 2) return null;
  return { keys, rows: parsed as Record<string, string>[] };
}

export function shelfKes(product: Pick<CatalogProduct, "slug" | "fromKes">) {
  const entry = priceBooks[product.slug];
  if (entry?.variations?.length) return Math.min(...entry.variations.map((item) => item.price));
  if (product.fromKes > 0) return product.fromKes;
  const spec = defaultSpec(product);
  if (!spec) return null;
  return quoteProduct(product, spec)?.totalKes ?? null;
}

export function deliveryFee(subtotalKes: number, county: string) {
  if (subtotalKes <= 0) return 0;
  if (subtotalKes >= FREE_DELIVERY_FROM_KES) return 0;
  return county.trim().toLowerCase() === "nairobi" ? NAIROBI_DELIVERY_KES : OUTSIDE_NAIROBI_DELIVERY_KES;
}

export function shippingFee(subtotalKes: number, county: string, method: "delivery" | "pickup") {
  if (method === "pickup") return 0;
  return deliveryFee(subtotalKes, county);
}

export function formatKes(amount: number) {
  return `KES ${new Intl.NumberFormat("en-KE").format(amount)}`;
}

function trimNumber(value: number) {
  return Number.isInteger(value) ? String(value) : String(Math.round(value * 100) / 100);
}
