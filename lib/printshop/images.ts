import type { ShopGroupSlug } from "./catalog";

export const groupImage: Record<ShopGroupSlug, string> = {
  "business-cards": "/images/products/business-cards.jpg",
  "flyers-posters": "/images/products/flyers.jpg",
  banners: "/images/products/rollup.jpg",
  events: "/images/products/x-banner.jpg",
  apparel: "/images/products/tshirt.jpg",
  "mugs-promo": "/images/products/mug.jpg",
  "stickers-signage": "/images/products/stickers.jpg",
  stationery: "/images/products/letterhead.jpg",
  "packaging-photo": "/images/products/kraft-bag.jpg",
};

const rules: [RegExp, string][] = [
  [/hoodie/, "/images/products/hoodie.jpg"],
  [/apron/, "/images/products/apron.jpg"],
  [/cap/, "/images/products/cap.jpg"],
  [/t-shirt|tshirt|jersey/, "/images/products/tshirt.jpg"],
  [/bottle|flask/, "/images/products/bottle.jpg"],
  [/mug/, "/images/products/mug.jpg"],
  [/tote/, "/images/products/tote.jpg"],
  [/kraft|jute|bag/, "/images/products/kraft-bag.jpg"],
  [/notebook|journal|diary/, "/images/products/notebook.jpg"],
  [/receipt/, "/images/products/receipt-book.jpg"],
  [/letterhead|envelope/, "/images/products/letterhead.jpg"],
  [/brochure/, "/images/products/brochure.jpg"],
  [/flyer/, "/images/products/flyers.jpg"],
  [/poster|blueprint/, "/images/products/poster.jpg"],
  [/roll-?up|rollup/, "/images/products/rollup.jpg"],
  [/x-banner|x banner/, "/images/products/x-banner.jpg"],
  [/banner|flag|backdrop|media wall/, "/images/products/banner.jpg"],
  [/sticker|label|decal|magnet/, "/images/products/stickers.jpg"],
  [/card|bookmark|voucher/, "/images/products/business-cards.jpg"],
];

export function productImage(product: { slug: string; title: string; group: ShopGroupSlug }) {
  const haystack = `${product.slug} ${product.title}`.toLowerCase();
  const match = rules.find(([pattern]) => pattern.test(haystack));
  return match?.[1] ?? groupImage[product.group];
}
