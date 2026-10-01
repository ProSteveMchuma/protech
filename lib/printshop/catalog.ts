export type ShopGroupSlug =
  | "business-cards"
  | "flyers-posters"
  | "banners"
  | "events"
  | "apparel"
  | "mugs-promo"
  | "stickers-signage"
  | "stationery"
  | "packaging-photo";

export type CatalogProduct = {
  slug: string;
  title: string;
  category: string;
  group: ShopGroupSlug;
  fromKes: number;
};

export const shopGroups: { slug: ShopGroupSlug; label: string; nav: string; summary: string }[] = [
  { slug: "business-cards", label: "Business Cards", nav: "Cards", summary: "Cards, postcards, bookmarks and gift vouchers on thick art card." },
  { slug: "flyers-posters", label: "Flyers & Posters", nav: "Flyers", summary: "Short-run flyers, brochures and posters with clean colour." },
  { slug: "banners", label: "Banners", nav: "Banners", summary: "Roll-ups, X-banners, media walls and large-format vinyl." },
  { slug: "events", label: "Events & Campaigns", nav: "Events", summary: "Conference, wedding and campaign displays, from name badges to backdrops." },
  { slug: "apparel", label: "Apparel & T-Shirts", nav: "Apparel", summary: "T-shirts, hoodies, aprons, jerseys and reflector jackets." },
  { slug: "mugs-promo", label: "Mugs & Promo", nav: "Promo", summary: "Mugs, bottles, pens, caps, notebooks and gift items." },
  { slug: "stickers-signage", label: "Stickers & Signage", nav: "Stickers", summary: "Labels, vehicle decals, floor stickers and rigid signs." },
  { slug: "stationery", label: "Stationery & Booklets", nav: "Stationery", summary: "Letterheads, receipt books, envelopes, menus and booklets." },
  { slug: "packaging-photo", label: "Packaging, Photo & Design", nav: "Photos", summary: "Bags, boxes, photo prints, documents and design support." },
];

export const products: CatalogProduct[] = [
  { slug: "business-cards-printing", title: "Business Cards Printing", category: "Business Cards", group: "business-cards", fromKes: 12 },
  { slug: "x-banner-printing", title: "X Banner Printing", category: "Events Display", group: "banners", fromKes: 4500 },
  { slug: "roll-up-banner-printing", title: "Roll up Banner printing", category: "Events Display", group: "banners", fromKes: 8500 },
  { slug: "envelopes-printing", title: "Envelopes printing", category: "Stationery", group: "stationery", fromKes: 25 },
  { slug: "mounted-photos-printing", title: "Mounted Photos printing", category: "Photo Printing and Framing", group: "packaging-photo", fromKes: 796 },
  { slug: "new-baby-cards", title: "New Baby Cards", category: "Stationery", group: "stationery", fromKes: 35 },
  { slug: "bookmarks-printing", title: "Bookmarks printing", category: "Business Cards", group: "business-cards", fromKes: 19 },
  { slug: "branded-t-shirt", title: "Branded T-shirt", category: "Branded Apparel", group: "apparel", fromKes: 1000 },
  { slug: "branded-enamel-mugs", title: "Branded Enamel Mugs", category: "Mug Printing & Branded Drinkware", group: "mugs-promo", fromKes: 850 },
  { slug: "branded-drawstring-bags", title: "Branded Drawstring Bags", category: "Promotional Items", group: "mugs-promo", fromKes: 250 },
  { slug: "certificates-printing", title: "Certificates  Printing", category: "Stationery", group: "stationery", fromKes: 80 },
  { slug: "menu-printing", title: "Menu Printing", category: "Booklet Magazines", group: "stationery", fromKes: 600 },
  { slug: "wheel-cover-printing", title: "Wheel Cover Printing", category: "Banners", group: "banners", fromKes: 5500 },
  { slug: "photo-framing", title: "Photo Framing", category: "Photo Printing and Framing", group: "packaging-photo", fromKes: 1600 },
  { slug: "banner-printing", title: "Banner printing", category: "Banners", group: "banners", fromKes: 1200 },
  { slug: "flyers-printing", title: "Flyers printing", category: "Flyers", group: "flyers-posters", fromKes: 20 },
  { slug: "posters-printing", title: "Posters printing", category: "Election Printing", group: "flyers-posters", fromKes: 300 },
  { slug: "vinyl-sticker-printing", title: "Vinyl Sticker printing", category: "Stickers", group: "stickers-signage", fromKes: 1200 },
  { slug: "reflective-sticker-printing", title: "Reflective Sticker printing", category: "Stickers", group: "stickers-signage", fromKes: 2500 },
  { slug: "adhesive-label-stickers-printing", title: "Adhesive Label stickers printing", category: "Stickers", group: "stickers-signage", fromKes: 4 },
  { slug: "booklet-magazines-printing", title: "Booklet Magazines printing", category: "Booklet Magazines", group: "stationery", fromKes: 200 },
  { slug: "letterheads-printing", title: "Letterheads printing", category: "Stationery", group: "stationery", fromKes: 45 },
  { slug: "brochure-printing", title: "Brochure Printing", category: "Flyers", group: "flyers-posters", fromKes: 60 },
  { slug: "receipt-books-printing", title: "Receipt books printing", category: "Stationery", group: "stationery", fromKes: 650 },
  { slug: "wedding-cards-printing", title: "Wedding Cards printing", category: "Stationery", group: "stationery", fromKes: 140 },
  { slug: "spiral-binding-services", title: "Spiral Binding Services", category: "Stationery", group: "stationery", fromKes: 200 },
  { slug: "door-frame-banner-printing", title: "Door Frame Banner printing", category: "Banners", group: "banners", fromKes: 8500 },
  { slug: "brochure-stand", title: "Brochure stand", category: "Events Display", group: "events", fromKes: 15500 },
  { slug: "2026-calendar-printing", title: "2026 Calendar printing", category: "Election Printing", group: "events", fromKes: 60 },
  { slug: "tear-drop-banner-printing", title: "Tear Drop Banner printing", category: "Election Printing", group: "banners", fromKes: 12500 },
  { slug: "adjustable-backdrop-banner-printing", title: "Adjustable Backdrop Banner Printing", category: "Events Display", group: "banners", fromKes: 27000 },
  { slug: "funeral-programs-printing", title: "Funeral Programs printing", category: "Booklet Magazines", group: "stationery", fromKes: 150 },
  { slug: "custom-flag-printing", title: "Custom flag printing", category: "Events Display", group: "events", fromKes: 3600 },
  { slug: "presentation-folders-printing", title: "Presentation Folders Printing", category: "Stationery", group: "stationery", fromKes: 180 },
  { slug: "postcards-printing", title: "Postcards printing", category: "Business Cards", group: "business-cards", fromKes: 25 },
  { slug: "telescopic-banners-printing", title: "Telescopic Banners printing", category: "Banners", group: "banners", fromKes: 15418 },
  { slug: "floor-stickers-printing", title: "Floor Stickers printing", category: "Stickers", group: "stickers-signage", fromKes: 450 },
  { slug: "car-stickers-printing-in-kenya", title: "Car Stickers Printing in Kenya", category: "Stickers", group: "stickers-signage", fromKes: 1260 },
  { slug: "branded-mugs", title: "Branded Mugs", category: "Mug Printing & Branded Drinkware", group: "mugs-promo", fromKes: 420 },
  { slug: "reflector-jackets-printing", title: "Reflector Jackets printing", category: "Branded Apparel", group: "apparel", fromKes: 380 },
  { slug: "nametags", title: "Nametags", category: "Events Display", group: "events", fromKes: 90 },
  { slug: "rigid-sign-boards-printing", title: "Rigid Sign Boards printing", category: "Stickers", group: "stickers-signage", fromKes: 1500 },
  { slug: "umbrella-printing", title: "Umbrella printing", category: "Election Printing", group: "events", fromKes: 1800 },
  { slug: "book-printing", title: "Book printing", category: "Stationery", group: "stationery", fromKes: 0 },
  { slug: "popup-banner-printing", title: "Popup banner printing", category: "Banners", group: "banners", fromKes: 25862 },
  { slug: "notebook-printing", title: "Notebook Printing", category: "Promotional Items", group: "mugs-promo", fromKes: 370 },
  { slug: "mouse-pads-printing", title: "Mouse Pads Printing", category: "Promotional Items", group: "mugs-promo", fromKes: 370 },
  { slug: "branded-jute-bags", title: "Branded Jute Bags", category: "Packaging", group: "packaging-photo", fromKes: 1250 },
  { slug: "branded-jerseys-for-clubs", title: "Branded Jerseys for clubs", category: "Branded Apparel", group: "apparel", fromKes: 1492 },
  { slug: "branded-2027-diary", title: "Branded 2027 Diary", category: "Stationery", group: "stationery", fromKes: 1450 },
  { slug: "graphic-design-service", title: "Graphic Design Service", category: "Graphic Design", group: "packaging-photo", fromKes: 500 },
  { slug: "branded-hoodies", title: "Branded Hoodies", category: "Branded Apparel", group: "apparel", fromKes: 2700 },
  { slug: "3d-signs", title: "3D Signs", category: "Signages", group: "stickers-signage", fromKes: 16500 },
  { slug: "canvas-printing", title: "Canvas printing", category: "Photo Printing and Framing", group: "packaging-photo", fromKes: 5500 },
  { slug: "architectural-blueprints", title: "Architectural Blueprints", category: "Posters", group: "flyers-posters", fromKes: 150 },
  { slug: "packaging-boxes", title: "Packaging Boxes", category: "Packaging", group: "packaging-photo", fromKes: 45 },
  { slug: "branded-aprons", title: "Branded Aprons", category: "Branded Apparel", group: "apparel", fromKes: 900 },
  { slug: "selfie-frames", title: "Selfie Frames", category: "Election Printing", group: "events", fromKes: 3500 },
  { slug: "document-printing", title: "Document Printing", category: "Digital printing", group: "packaging-photo", fromKes: 50 },
  { slug: "media-wall-banner", title: "Media Wall Banner", category: "Events Display", group: "banners", fromKes: 35000 },
  { slug: "round-neck-plain-t-shirt", title: "Round Neck Plain T-Shirt", category: "T-shirts", group: "apparel", fromKes: 480 },
  { slug: "branded-pens", title: "Branded Pens", category: "Promotional Items", group: "mugs-promo", fromKes: 80 },
  { slug: "s-banner-printing", title: "S-Banner Printing", category: "Banners", group: "banners", fromKes: 34500 },
  { slug: "branded-keyholders", title: "Branded Keyholders", category: "Promotional Items", group: "mugs-promo", fromKes: 450 },
  { slug: "branded-tote-bags", title: "Branded Tote Bags", category: "Promotional Items", group: "mugs-promo", fromKes: 950 },
  { slug: "kitenge-notebooks", title: "Kitenge Notebooks", category: "Events Display", group: "events", fromKes: 650 },
  { slug: "branded-kraft-bags", title: "Branded Kraft Bags", category: "Packaging", group: "packaging-photo", fromKes: 150 },
  { slug: "tent-cards-printing", title: "Tent Cards Printing", category: "Events Display", group: "events", fromKes: 85 },
  { slug: "photo-printing-services", title: "Photo Printing Services", category: "Digital printing", group: "packaging-photo", fromKes: 25 },
  { slug: "door-plates", title: "Door Plates", category: "Signages", group: "stickers-signage", fromKes: 1250 },
  { slug: "branded-long-mousepad", title: "Branded Long Mousepad", category: "Promotional Items", group: "mugs-promo", fromKes: 870 },
  { slug: "branded-caps", title: "Branded Caps", category: "Promotional Items", group: "mugs-promo", fromKes: 350 },
  { slug: "l-banner-stand", title: "L Banner Stand", category: "Banners", group: "banners", fromKes: 9500 },
  { slug: "spot-uv-business-cards", title: "Spot UV Business Cards", category: "Business Cards", group: "business-cards", fromKes: 65 },
  { slug: "car-magnets-printing", title: "Car Magnets Printing", category: "Promotional Items", group: "mugs-promo", fromKes: 1150 },
  { slug: "table-rollup-printing", title: "Table Rollup Printing", category: "Banners", group: "banners", fromKes: 3500 },
  { slug: "table-cloth-printing", title: "Table Cloth Printing", category: "Events Display", group: "events", fromKes: 3600 },
  { slug: "branded-wristbands", title: "Branded Wristbands", category: "Events Display", group: "events", fromKes: 55 },
  { slug: "gift-voucher-printing", title: "Gift Voucher Printing", category: "Business Cards", group: "business-cards", fromKes: 60 },
  { slug: "button-badges-printing", title: "Button Badges Printing", category: "Election Printing", group: "events", fromKes: 130 },
  { slug: "skin-feel-thermal-flask-printing", title: "Skin Feel Thermal Flask Printing", category: "Promotional Items", group: "mugs-promo", fromKes: 2050 },
  { slug: "thermal-travel-mugs", title: "Thermal Travel Mugs", category: "Mug Printing & Branded Drinkware", group: "mugs-promo", fromKes: 1300 },
  { slug: "branded-water-bottles", title: "Branded Water Bottles", category: "Mug Printing & Branded Drinkware", group: "mugs-promo", fromKes: 850 },
  { slug: "branded-journals-and-planners", title: "Branded Journals & Planners", category: "Stationery", group: "stationery", fromKes: 950 },
];

export function productBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function productsInGroup(slug: ShopGroupSlug) {
  return products.filter((product) => product.group === slug);
}

export function groupBySlug(slug: string) {
  return shopGroups.find((group) => group.slug === slug);
}

export function filterProducts(input: { q?: string; group?: string; band?: string }) {
  const query = input.q?.trim().toLowerCase() ?? "";
  return products.filter((product) => {
    if (input.group && input.group !== "all" && product.group !== input.group) return false;
    if (query && !`${product.title} ${product.category}`.toLowerCase().includes(query)) return false;
    if (input.band === "under-1000" && (product.fromKes <= 0 || product.fromKes >= 1000)) return false;
    if (input.band === "mid" && (product.fromKes < 1000 || product.fromKes > 10000)) return false;
    if (input.band === "premium" && product.fromKes <= 10000) return false;
    return true;
  });
}

