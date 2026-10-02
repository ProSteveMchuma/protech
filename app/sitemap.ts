import type { MetadataRoute } from "next";
import { products, shopGroups } from "@/lib/printshop/catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.proinnovationtech.co.ke";
  const staticRoutes = ["", "/shop", "/packages", "/print-on-demand", "/about", "/contact", "/cart", "/order", "/terms"];
  return [
    ...staticRoutes.map((path, index) => ({
      url: `${base}${path}`,
      changeFrequency: "weekly" as const,
      priority: index === 0 ? 1 : 0.7,
    })),
    ...shopGroups.map((group) => ({ url: `${base}/category/${group.slug}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...products.map((product) => ({ url: `${base}/product/${product.slug}`, changeFrequency: "weekly" as const, priority: 0.6 })),
  ];
}
