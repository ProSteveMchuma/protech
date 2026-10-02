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

export type JobKind = "run" | "area" | "book" | "variation" | "fixed";

export type PrintJob = {
  kind: JobKind;
  quantity: number;
  sides?: 1 | 2;
  pages?: number;
  colour?: "bw" | "color";
  size?: string;
  stock?: string;
  finishing: { name: string; label: string; per: "piece" | "job"; addKes: number }[];
  turnaround: Turnaround;
  rushApplied: boolean;
};

export type QuoteResult = {
  totalKes: number;
  unitKes: number;
  quantity: number;
  summary: string;
  job: PrintJob;
};

const rushSlugs = new Set([
  "business-cards-printing",
  "flyers-printing",
  "letterheads-printing",
  "envelopes-printing",
  "certificates-printing",
  "bookmarks-printing",
  "postcards-printing",
  "brochure-printing",
  "document-printing",
  "photo-printing-services",
  "new-baby-cards",
  "wedding-cards-printing",
  "tent-cards-printing",
  "gift-voucher-printing",
  "presentation-folders-printing",
  "funeral-programs-printing",
  "menu-printing",
]);

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function roundQty(quantity: number, entry: PriceEntry) {
  const step = entry.step || 1;
  const snapped = Math.round(quantity / step) * step;
  return clamp(snapped || entry.minQty, entry.minQty, entry.maxQty);
}

export function snapRunQuantity(runs: number[], quantity: number) {
  const sorted = [...runs].sort((a, b) => a - b);
  const qty = Math.round(quantity);
  if (sorted.includes(qty)) return qty;
  return sorted.find((run) => run >= qty) ?? sorted[sorted.length - 1];
}

export function stepRunQuantity(runs: number[], quantity: number, direction: 1 | -1) {
  const sorted = [...runs].sort((a, b) => a - b);
  const current = snapRunQuantity(sorted, quantity);
  const index = sorted.indexOf(current);
  const next = index + direction;
  if (next < 0 || next >= sorted.length) return current;
  return sorted[next];
}

export function publishedRunQuantities(slug: string, group?: string) {
  const entry = priceBooks[slug];
  if (!entry?.groups?.length) return null;
  const chosen = entry.groups.find((item) => item.label === group) ?? entry.groups[0];
  return chosen.tiers.map((tier) => tier.qty).sort((a, b) => a - b);
}

function tierTotal(tiers: { qty: number; total: number }[], quantity: number) {
  const exact = tiers.find((tier) => tier.qty === quantity);
  return exact ? exact.total : null;
}

function optionExtra(entry: PriceEntry, options: Record<string, string> | undefined, quantity: number) {
  let add = 0;
  const parts: string[] = [];
  const finishing: PrintJob["finishing"] = [];
  for (const option of entry.options ?? []) {
    const label = options?.[option.name];
    const choice = option.choices.find((item) => item.label === label);
    if (!choice || choice.add === 0) continue;
    const addKes = choice.per === "piece" ? choice.add * quantity : choice.add;
    add += addKes;
    parts.push(choice.label);
    finishing.push({ name: option.name, label: choice.label, per: choice.per, addKes });
  }
  return { add, parts, finishing };
}

function labelField(label: string, name: string) {
  const row = label.split(",").map((part) => part.split(":"));
  const match = row.find((part) => part[0]?.trim().toLowerCase() === name.toLowerCase());
  return match ? match.slice(1).join(":").trim() : undefined;
}

function sidesFrom(label: string): 1 | 2 | undefined {
  if (/double|two-sided|2-sided|both sides/i.test(label)) return 2;
  if (/single/i.test(label)) return 1;
  return undefined;
}

export function allowsRush(slug: string, spec: Pick<QuoteSpec, "group" | "attrs">) {
  if (!rushSlugs.has(slug)) return false;
  const material = `${spec.group ?? ""} ${Object.values(spec.attrs ?? {}).join(" ")}`.toLowerCase();
  return !/pvc|vinyl|satin|banner|fabric/.test(material);
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
  let kind: JobKind = "fixed";
  let sides: 1 | 2 | undefined;
  let pages: number | undefined;
  let colour: "bw" | "color" | undefined;
  let sizeLabel: string | undefined;
  let stock: string | undefined;

  if (entry.groups?.length) {
    const group = entry.groups.find((item) => item.label === spec.group) ?? entry.groups[0];
    const tiers = [...group.tiers].sort((a, b) => a.qty - b.qty);
    quantity = snapRunQuantity(tiers.map((tier) => tier.qty), quantity);
    const runTotal = tierTotal(tiers, quantity);
    if (runTotal == null) return null;
    total = runTotal;
    kind = "run";
    sides = sidesFrom(group.label);
    sizeLabel = labelField(group.label, "Size") ?? labelField(group.label, "Poster size");
    stock = labelField(group.label, "Material");
    parts.push(group.label);
  } else if (entry.size) {
    const width = clamp(spec.width ?? entry.size.minW, entry.size.minW, entry.size.maxW);
    const height = clamp(spec.height ?? entry.size.minH, entry.size.minH, entry.size.maxH);
    quantity = roundQty(quantity, entry);
    total = Math.round(width * height * entry.size.rate * quantity);
    kind = "area";
    sizeLabel = `${trimNumber(width)} × ${trimNumber(height)} ${entry.size.unit}`;
    parts.push(sizeLabel);
  } else if (entry.book) {
    const book = entry.book;
    const size = book.sizes.find((item) => item.name === spec.size) ?? book.sizes[0];
    const color = spec.color === "bw" ? "bw" : "color";
    const paper = book.papers.find((item) => item.name === spec.paper) ?? book.papers[0];
    const cover = book.covers.find((item) => item.name === spec.cover) ?? book.covers[0];
    const binding = book.bindings.find((item) => item.name === spec.binding) ?? book.bindings[0];
    const pageCount = book.perPage ? clamp(Math.round(spec.pages ?? 32), 4, 400) : 0;
    const sizeRate = color === "bw" ? size.bw : size.color;
    const paperRate = paper ? (color === "bw" ? paper.bw : paper.color) : 0;
    const unit = book.base + (book.perPage ? pageCount * (sizeRate + paperRate) : sizeRate + paperRate) + (cover?.price ?? 0) + (binding?.price ?? 0);
    quantity = roundQty(Math.max(1, quantity), entry);
    const discount = book.discounts.find((band) => quantity >= band.min && quantity <= band.max) ?? [...book.discounts].reverse().find((band) => quantity >= band.min);
    total = Math.round(unit * quantity * (1 - (discount?.percent ?? 0) / 100));
    kind = "book";
    pages = book.perPage ? pageCount : undefined;
    colour = color;
    sizeLabel = size.name;
    stock = paper?.name;
    parts.push(size.name, color === "bw" ? "Black and white" : "Colour");
    if (book.perPage) parts.push(`${pageCount} pages`);
    if (paper && paperRate) parts.push(paper.name);
    if (cover) parts.push(cover.name);
    if (binding) parts.push(binding.name);
  } else if (entry.variations?.length) {
    quantity = roundQty(quantity, entry);
    const matched = matchVariation(entry.variations, spec.attrs ?? {});
    total = matched.price * quantity;
    kind = "variation";
    sizeLabel = matched.attrs.Size;
    stock = matched.attrs.Material;
    parts.push(...Object.values(matched.attrs));
  } else {
    if (entry.unitKes <= 0) return null;
    quantity = roundQty(quantity, entry);
    total = entry.unitKes * quantity;
  }

  const extras = optionExtra(entry, spec.options, quantity);
  total += extras.add;
  parts.push(...extras.parts);
  const turnaroundId: Turnaround = spec.turnaround === "rush" && !allowsRush(product.slug, spec) ? "standard" : spec.turnaround;
  const turnaround = turnaroundChoices.find((item) => item.id === turnaroundId) ?? turnaroundChoices[0];
  total += turnaround.addKes;
  if (turnaround.addKes > 0) parts.push(turnaround.label);
  if (total <= 0 || quantity <= 0) return null;
  return {
    totalKes: total,
    unitKes: Math.max(1, Math.round(total / quantity)),
    quantity,
    summary: parts.filter(Boolean).join(" · "),
    job: {
      kind,
      quantity,
      sides,
      pages,
      colour,
      size: sizeLabel,
      stock,
      finishing: extras.finishing,
      turnaround: turnaround.id,
      rushApplied: turnaround.id === "rush",
    },
  };
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

export function shelfOffer(product: Pick<CatalogProduct, "slug" | "fromKes">) {
  const entry = priceBooks[product.slug];
  if (entry?.quote) return null;
  if (entry?.groups?.length) {
    let best: { quantity: number; totalKes: number } | null = null;
    for (const group of entry.groups) {
      const tier = [...group.tiers].sort((a, b) => a.qty - b.qty)[0];
      if (!tier) continue;
      if (!best || tier.total < best.totalKes) best = { quantity: tier.qty, totalKes: tier.total };
    }
    return best;
  }
  if (entry?.variations?.length) {
    const unit = Math.min(...entry.variations.map((item) => item.price));
    return { quantity: entry.minQty, totalKes: unit * entry.minQty };
  }
  const spec = defaultSpec(product);
  const quoted = spec ? quoteProduct(product, spec) : null;
  if (quoted) return { quantity: quoted.quantity, totalKes: quoted.totalKes };
  return product.fromKes > 0 ? { quantity: 1, totalKes: product.fromKes } : null;
}

export function shelfKes(product: Pick<CatalogProduct, "slug" | "fromKes">) {
  return shelfOffer(product)?.totalKes ?? null;
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
