import { business, pickup } from "./config.ts";
import { groupBySlug, products, type CatalogProduct, type ShopGroupSlug } from "./printshop/catalog.ts";
import { faqs } from "./printshop/content.ts";
import { absoluteImage, groupImage, productImage } from "./printshop/images.ts";
import { FREE_DELIVERY_FROM_KES, formatKes, NAIROBI_DELIVERY_KES, OUTSIDE_NAIROBI_DELIVERY_KES, shelfOffer } from "./printshop/pricing.ts";
import { whatsappNumber } from "./whatsapp.ts";

export const SITE_URL = "https://www.proinnovationtech.co.ke";
const BUSINESS_ID = `${SITE_URL}/#business`;

const listedPrices = products.map((product) => product.fromKes).filter((kes) => kes > 0);
const priceRange = `${formatKes(Math.min(...listedPrices))} – ${formatKes(Math.max(...listedPrices))}`;

export function absoluteUrl(path: string) {
  return path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

// Product names often already end in "Printing"; "in Kenya" is added only when the name lacks it.
export function productSeoTitle(product: Pick<CatalogProduct, "title">) {
  return /kenya/i.test(product.title) ? product.title.replace(/\s+in\s+Kenya$/i, " in Nairobi, Kenya") : `${product.title} in Nairobi, Kenya`;
}

export function productSeoDescription(product: CatalogProduct) {
  const offer = shelfOffer(product);
  const price = offer
    ? `From ${formatKes(offer.totalKes)}${offer.quantity > 1 ? ` for ${offer.quantity.toLocaleString("en-KE")} pcs` : ""}.`
    : "Priced per specification.";
  return `${product.title} in Nairobi. ${price} Order online, pay by M-Pesa, collect in Karen or get delivery across Kenya.`;
}

export const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": BUSINESS_ID,
  name: "ProPrint",
  legalName: business.name,
  description: "Made-to-order printing in Nairobi: business cards, flyers, banners, branded apparel, mugs, stickers, stationery and packaging, with delivery across Kenya.",
  url: SITE_URL,
  logo: absoluteUrl("/icon.svg"),
  image: absoluteImage(groupImage["business-cards"]),
  email: business.supportEmail,
  telephone: `+${whatsappNumber()}`,
  priceRange,
  currenciesAccepted: "KES",
  paymentAccepted: "M-Pesa",
  address: {
    "@type": "PostalAddress",
    streetAddress: pickup.address,
    addressLocality: "Nairobi",
    addressRegion: "Nairobi",
    addressCountry: "KE",
  },
  areaServed: { "@type": "Country", name: "Kenya" },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "18:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "09:00", closes: "16:00" },
  ],
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "ProPrint",
  url: SITE_URL,
  inLanguage: "en-KE",
  publisher: { "@id": BUSINESS_ID },
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/shop?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
};

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: absoluteUrl(item.path) })),
  };
}

export function productJsonLd(product: CatalogProduct, description: string) {
  const offer = shelfOffer(product);
  const group = groupBySlug(product.group);
  const url = absoluteUrl(`/product/${product.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description,
    image: absoluteImage(productImage(product)),
    url,
    sku: product.slug,
    category: group?.label ?? product.category,
    brand: { "@type": "Brand", name: "ProPrint" },
    ...(offer
      ? {
          offers: {
            "@type": "Offer",
            url,
            price: offer.totalKes,
            priceCurrency: "KES",
            availability: "https://schema.org/InStock",
            itemCondition: "https://schema.org/NewCondition",
            seller: { "@id": BUSINESS_ID },
            // The shelf price is for the smallest published run, not one piece.
            eligibleQuantity: { "@type": "QuantitativeValue", value: offer.quantity, unitCode: "C62" },
            shippingDetails: {
              "@type": "OfferShippingDetails",
              shippingDestination: { "@type": "DefinedRegion", addressCountry: "KE" },
              shippingRate: { "@type": "MonetaryAmount", value: OUTSIDE_NAIROBI_DELIVERY_KES, currency: "KES" },
            },
          },
        }
      : {}),
  };
}

export function categoryItemListJsonLd(slug: ShopGroupSlug, items: CatalogProduct[]) {
  const group = groupBySlug(slug);
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: group?.label,
    numberOfItems: items.length,
    itemListElement: items.map((product, index) => ({ "@type": "ListItem", position: index + 1, url: absoluteUrl(`/product/${product.slug}`), name: product.title })),
  };
}

// The FAQ copy in content.ts quotes delivery fees; keep the numbers tied to the pricing constants.
export function shopFaqs() {
  return faqs.map((item) => ({
    q: item.q,
    a: item.a
      .replace("KES 400", formatKes(NAIROBI_DELIVERY_KES))
      .replace("KES 850", formatKes(OUTSIDE_NAIROBI_DELIVERY_KES))
      .replace("KES 10,000", formatKes(FREE_DELIVERY_FROM_KES)),
  }));
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })),
  };
}
