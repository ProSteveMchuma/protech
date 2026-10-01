import type { CatalogProduct } from "./catalog";

export type PriceModel = "unit" | "item" | "quote";
export type Turnaround = "standard" | "express" | "rush";

export const UNIT_QUANTITIES = [50, 100, 200, 500, 1000, 2000] as const;
export const ITEM_QUANTITIES = [1, 2, 5, 10, 25, 50] as const;

export const NAIROBI_DELIVERY_KES = 400;
export const OUTSIDE_NAIROBI_DELIVERY_KES = 850;
export const FREE_DELIVERY_FROM_KES = 10_000;

export function priceModel(product: Pick<CatalogProduct, "fromKes" | "group" | "category" | "title">): PriceModel {
  if (product.fromKes <= 0) return "quote";
  if (product.group === "business-cards" || product.group === "flyers-posters") return "unit";
  if (product.category === "Stickers" && product.fromKes <= 450) return "unit";
  if (
    product.category === "Stationery" &&
    product.fromKes <= 200 &&
    !/receipt|book printing|diary|journal/i.test(product.title)
  ) {
    return "unit";
  }
  if (product.category === "Digital printing" && product.fromKes <= 80) return "unit";
  if (
    product.fromKes <= 130 &&
    (product.category === "Promotional Items" ||
      product.category === "Election Printing" ||
      product.category === "Events Display")
  ) {
    return "unit";
  }
  return "item";
}

export function quantitiesFor(model: PriceModel): readonly number[] {
  if (model === "unit") return UNIT_QUANTITIES;
  if (model === "item") return ITEM_QUANTITIES;
  return [];
}

export function allowsSides(product: Pick<CatalogProduct, "title" | "fromKes" | "group" | "category">) {
  return priceModel(product) === "unit" && !/sticker|label|binding/i.test(product.title);
}

/** Volume curve anchored to published card runs: short runs hold the floor price, thousands drop toward ~60%. */
export function unitRate(fromKes: number, quantity: number) {
  const factor = quantity >= 2000 ? 0.58 : quantity >= 1000 ? 0.65 : quantity >= 500 ? 0.78 : quantity >= 200 ? 0.92 : 1;
  return Math.max(1, Math.round(fromKes * factor));
}

export function itemRate(fromKes: number, quantity: number) {
  const factor = quantity >= 50 ? 0.8 : quantity >= 25 ? 0.85 : quantity >= 10 ? 0.9 : quantity >= 5 ? 0.94 : quantity >= 2 ? 0.97 : 1;
  return Math.max(1, Math.round(fromKes * factor));
}

export const turnaroundFactor: Record<Turnaround, number> = {
  standard: 1,
  express: 1.15,
  rush: 1.3,
};

export const turnaroundLabel: Record<Turnaround, string> = {
  standard: "Standard · 3 business days",
  express: "Express · 2 business days",
  rush: "Rush · 24 hours in Nairobi",
};

export function lineTotal(input: {
  fromKes: number;
  model: PriceModel;
  quantity: number;
  sides: 1 | 2;
  turnaround: Turnaround;
}) {
  const base = input.model === "unit" ? unitRate(input.fromKes, input.quantity) : itemRate(input.fromKes, input.quantity);
  const sided = input.sides === 2 ? Math.round(base * 1.55) : base;
  const unitKes = Math.max(1, Math.round(sided * turnaroundFactor[input.turnaround]));
  return { unitKes, totalKes: unitKes * input.quantity };
}

export function deliveryFee(subtotalKes: number, county: string) {
  if (subtotalKes <= 0) return 0;
  if (subtotalKes >= FREE_DELIVERY_FROM_KES) return 0;
  return county.trim().toLowerCase() === "nairobi" ? NAIROBI_DELIVERY_KES : OUTSIDE_NAIROBI_DELIVERY_KES;
}

export function formatKes(amount: number) {
  return `KES ${new Intl.NumberFormat("en-KE").format(amount)}`;
}
