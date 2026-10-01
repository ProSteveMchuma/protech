import { groupBySlug, productBySlug, type CatalogProduct, type ShopGroupSlug } from "./catalog";
import { priceModel } from "./pricing";

export const deliveryTowns = [
  "Nairobi",
  "Mombasa",
  "Nakuru",
  "Nanyuki",
  "Diani",
  "Malindi",
  "Watamu",
  "Eldoret",
  "Kisumu",
  "Nyeri",
  "Narok",
  "Lamu",
  "Machakos",
  "Thika",
  "Kiambu",
  "Meru",
];

export const counties = [
  "Nairobi",
  "Mombasa",
  "Kwale",
  "Kilifi",
  "Tana River",
  "Lamu",
  "Taita-Taveta",
  "Garissa",
  "Wajir",
  "Mandera",
  "Marsabit",
  "Isiolo",
  "Meru",
  "Tharaka-Nithi",
  "Embu",
  "Kitui",
  "Machakos",
  "Makueni",
  "Nyandarua",
  "Nyeri",
  "Kirinyaga",
  "Murang'a",
  "Kiambu",
  "Turkana",
  "West Pokot",
  "Samburu",
  "Trans Nzoia",
  "Uasin Gishu",
  "Elgeyo-Marakwet",
  "Nandi",
  "Baringo",
  "Laikipia",
  "Nakuru",
  "Narok",
  "Kajiado",
  "Kericho",
  "Bomet",
  "Kakamega",
  "Vihiga",
  "Bungoma",
  "Busia",
  "Siaya",
  "Kisumu",
  "Homa Bay",
  "Migori",
  "Kisii",
  "Nyamira",
] as const;

export const faqs = [
  {
    q: "What can I print?",
    a: "Business cards, flyers, brochures, banners, posters, t-shirts, hoodies, tote bags, mugs, stickers, receipt books, letterheads, packaging and large-format displays. Orders are made after you place them, so you do not have to hold stock.",
  },
  {
    q: "How fast is turnaround?",
    a: "Standard production is 3 business days. Express is 2 business days. Rush is 24 hours and is available in Nairobi. Same-day printing is open for selected digital jobs when artwork is approved before 10:00.",
  },
  {
    q: "Do you deliver outside Nairobi?",
    a: "Yes. We deliver to all 47 counties, including Mombasa, Kisumu, Nakuru, Eldoret, Diani and Watamu. Delivery is KES 400 inside Nairobi and KES 850 outside Nairobi. Orders above KES 10,000 ship free.",
  },
  {
    q: "How do I pay?",
    a: "Pay by M-Pesa Paybill, then send the transaction code with your order. Card and bank transfer can be arranged on the quote if your finance team needs an invoice.",
  },
  {
    q: "Can you help with the design?",
    a: "Send print-ready PDF, AI or PNG artwork at 300 DPI with bleed. If you only have a logo or a rough idea, ask for design support when you request a quote. Graphic design starts from the design-service price in the shop.",
  },
  {
    q: "What file should I send?",
    a: "PDF, AI or PSD at 300 DPI is the safest. High-resolution JPG and PNG are fine for smaller digital prints, photos and apparel. We check resolution, bleed and colour before the job goes to press.",
  },
  {
    q: "Do you print one piece, or only bulk?",
    a: "Print on demand means we print the quantity you order, including a single t-shirt, mug or banner. Unit prices fall as the quantity rises. There is no warehouse minimum.",
  },
  {
    q: "Can organisations and campaigns order in bulk?",
    a: "Yes. NGOs, companies and campaign teams can request a bundled quote, ETR-style invoicing and tiered pricing. Tell us the products, quantities and deadline on the contact form.",
  },
];

export const specBlocks: { group: ShopGroupSlug; title: string; body: string; links: string[] }[] = [
  {
    group: "business-cards",
    title: "Business cards and small cards",
    body: "Executive cards on 350gsm art card, with matte or gloss lamination, rounded corners and Spot UV when you want the logo to sit above the surface. The same desk also prints postcards, bookmarks and gift vouchers.",
    links: ["business-cards-printing", "spot-uv-business-cards", "postcards-printing"],
  },
  {
    group: "banners",
    title: "Roll-up banners and event displays",
    body: "Aluminium roll-up stands, portable X-banners, tear-drop flags and fabric media walls. Outdoor jobs use fade-resistant, anti-curl vinyl. Indoor backdrops can be seamless fabric.",
    links: ["roll-up-banner-printing", "x-banner-printing", "media-wall-banner"],
  },
  {
    group: "apparel",
    title: "Branded apparel and uniforms",
    body: "Direct-to-film and screen printing on combed-cotton t-shirts, fleece hoodies, hospitality aprons and club jerseys. Send vector logos when you can. We match brand colours as closely as the fabric allows.",
    links: ["branded-t-shirt", "branded-hoodies", "branded-aprons"],
  },
  {
    group: "flyers-posters",
    title: "Flyers, brochures and posters",
    body: "A6, A5, A4 and DL flyers on 130–170gsm gloss or silk, plus bi-fold and tri-fold brochures and indoor or outdoor posters. Short runs stay digital. Larger runs are priced on the quantity you select.",
    links: ["flyers-printing", "brochure-printing", "posters-printing"],
  },
  {
    group: "stickers-signage",
    title: "Stickers, labels and vehicle decals",
    body: "Gloss and matte vinyl, adhesive labels, floor graphics, reflective stickers and car decals, plus rigid boards and door plates for entrances.",
    links: ["adhesive-label-stickers-printing", "vinyl-sticker-printing", "car-stickers-printing-in-kenya"],
  },
  {
    group: "mugs-promo",
    title: "Mugs, drinkware and gifts",
    body: "White and coloured ceramic mugs, enamel mugs, double-wall travel mugs and aluminium bottles for conferences and year-end gifts. Pens, caps, notebooks and keyholders sit in the same promo range.",
    links: ["branded-mugs", "thermal-travel-mugs", "branded-water-bottles"],
  },
  {
    group: "stationery",
    title: "Books, booklets and corporate stationery",
    body: "Letterheads, envelopes, carbonless receipt books, spiral binding, saddle-stitched programmes, menus and branded journals. Book printing is quoted from your page count.",
    links: ["letterheads-printing", "receipt-books-printing", "funeral-programs-printing"],
  },
  {
    group: "packaging-photo",
    title: "Packaging, photos and design",
    body: "Kraft bags, jute bags, cartons, mounted photos, frames and canvas. Document and photo prints are same-day candidates in Nairobi when the file is ready before 10:00. Design help is a separate line if you need artwork built.",
    links: ["branded-kraft-bags", "photo-printing-services", "graphic-design-service"],
  },
  {
    group: "events",
    title: "Events, weddings and campaigns",
    body: "Name badges, wristbands, tent cards, flags, selfie frames, calendars and programme covers. Campaign bundles can mix apparel, flyers and banners in one order.",
    links: ["nametags", "branded-wristbands", "button-badges-printing"],
  },
];

export const bundles: { slug: string; title: string; summary: string; slugs: string[] }[] = [
  {
    slug: "marketing-essentials",
    title: "Marketing Essentials",
    summary: "Promote the business with the pieces people actually hand out and put on a wall.",
    slugs: ["flyers-printing", "brochure-printing", "roll-up-banner-printing", "posters-printing"],
  },
  {
    slug: "corporate-stationery",
    title: "Corporate Stationery",
    summary: "A complete identity set for the front desk and the field team.",
    slugs: ["business-cards-printing", "letterheads-printing", "envelopes-printing", "receipt-books-printing", "presentation-folders-printing"],
  },
  {
    slug: "startup-kit",
    title: "Startup Kit",
    summary: "The first professional stationery run for a new company.",
    slugs: ["business-cards-printing", "letterheads-printing", "envelopes-printing"],
  },
  {
    slug: "branding-bundle",
    title: "Branding Bundle",
    summary: "Cards, shirts, a roll-up and mugs in one brand order.",
    slugs: ["business-cards-printing", "branded-t-shirt", "roll-up-banner-printing", "branded-mugs"],
  },
  {
    slug: "event-package",
    title: "Event Package",
    summary: "What a conference or exhibition stand usually needs on the day.",
    slugs: ["roll-up-banner-printing", "flyers-printing", "nametags", "brochure-printing"],
  },
];

export function bundleItems(slugs: string[]) {
  return slugs.map((slug) => productBySlug(slug)).filter((item): item is CatalogProduct => Boolean(item));
}

const groupCopy: Record<ShopGroupSlug, string> = {
  "business-cards": "Thick art card, clean type and a finish that survives a pocket.",
  "flyers-posters": "Short runs with solid colour, sized for handouts or a wall.",
  banners: "Hardware and print together, so the stand arrives ready to pull up.",
  events: "Made for a date on the calendar, then delivered before that date.",
  apparel: "Printed after you order, in the sizes and quantity you actually need.",
  "mugs-promo": "Useful gifts with your mark on them, from one piece upward.",
  "stickers-signage": "Cut for products, vehicles, floors or a front door.",
  stationery: "The paperwork a Kenyan office still hands across a desk.",
  "packaging-photo": "Bags, prints and files finished for customers to hold.",
};

export function describe(product: CatalogProduct) {
  const group = groupBySlug(product.group);
  const model = priceModel(product);
  const priceLine =
    model === "quote"
      ? "This job is quoted from your page count, size and binding."
      : model === "unit"
        ? `Listed from ${product.fromKes.toLocaleString("en-KE")} shillings per piece on a short run. The unit price drops as the quantity rises.`
        : `Listed from ${product.fromKes.toLocaleString("en-KE")} shillings per item. Ordering several pieces reduces the unit price.`;
  return `${product.title} for businesses, events and personal orders in Kenya. ${groupCopy[product.group]} ${priceLine} ${group?.summary ?? ""} Artwork can be ready-made or started from a logo. Nairobi jobs approved before 10:00 can print the same day when the product allows it. Everywhere else, standard delivery is 2–3 business days after production, across all 47 counties.`;
}
