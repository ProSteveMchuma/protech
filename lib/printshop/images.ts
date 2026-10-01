import type { ShopGroupSlug } from "./catalog";

const bucket = "tenderpro-480721.firebasestorage.app";

function productPhoto(file: string) {
  return `https://storage.googleapis.com/${bucket}/products/${file}`;
}

export const groupImage: Record<ShopGroupSlug, string> = {
  "business-cards": productPhoto("business-cards.jpg"),
  "flyers-posters": productPhoto("flyers.jpg"),
  banners: productPhoto("rollup.jpg"),
  events: productPhoto("x-banner.jpg"),
  apparel: productPhoto("tshirt.jpg"),
  "mugs-promo": productPhoto("mug.jpg"),
  "stickers-signage": productPhoto("stickers.jpg"),
  stationery: productPhoto("letterhead.jpg"),
  "packaging-photo": productPhoto("kraft-bag.jpg"),
};

const rules: [RegExp, string][] = [
  [/hoodie/, productPhoto("hoodie.jpg")],
  [/apron/, productPhoto("apron.jpg")],
  [/cap/, productPhoto("cap.jpg")],
  [/t-shirt|tshirt|jersey/, productPhoto("tshirt.jpg")],
  [/bottle|flask/, productPhoto("bottle.jpg")],
  [/mug/, productPhoto("mug.jpg")],
  [/tote/, productPhoto("tote.jpg")],
  [/kraft|jute|bag/, productPhoto("kraft-bag.jpg")],
  [/notebook|journal|diary/, productPhoto("notebook.jpg")],
  [/receipt/, productPhoto("receipt-book.jpg")],
  [/letterhead|envelope/, productPhoto("letterhead.jpg")],
  [/brochure/, productPhoto("brochure.jpg")],
  [/flyer/, productPhoto("flyers.jpg")],
  [/poster|blueprint/, productPhoto("poster.jpg")],
  [/roll-?up|rollup/, productPhoto("rollup.jpg")],
  [/x-banner|x banner/, productPhoto("x-banner.jpg")],
  [/banner|flag|backdrop|media wall/, productPhoto("banner.jpg")],
  [/sticker|label|decal|magnet/, productPhoto("stickers.jpg")],
  [/card|bookmark|voucher/, productPhoto("business-cards.jpg")],
];

export function productImage(product: { slug: string; title: string; group: ShopGroupSlug }) {
  const haystack = `${product.slug} ${product.title}`.toLowerCase();
  const match = rules.find(([pattern]) => pattern.test(haystack));
  return match?.[1] ?? groupImage[product.group];
}
