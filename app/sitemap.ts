import type { MetadataRoute } from "next";
import { products, shopGroups } from "@/lib/printshop/catalog";
import { absoluteImage, productImage } from "@/lib/printshop/images";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.proinnovationtech.co.ke";
  const staticRoutes = ["", "/shop", "/packages", "/print-on-demand", "/about", "/contact", "/terms", "/legal/privacy"];
  const lastModified = new Date();
  return [
    ...staticRoutes.map((path, index) => ({
      url: `${base}${path}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: index === 0 ? 1 : 0.7,
    })),
    ...shopGroups.map((group) => ({ url: `${base}/category/${group.slug}`, lastModified, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...products.map((product) => ({ url: `${base}/product/${product.slug}`, lastModified, images: [absoluteImage(productImage(product))], changeFrequency: "weekly" as const, priority: 0.6 })),
  ];
}
