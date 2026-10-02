import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/dashboard/", "/account", "/auth/", "/services/", "/hire", "/apply", "/guides/", "/beta", "/tools/"],
    },
    sitemap: "https://www.proinnovationtech.co.ke/sitemap.xml",
  };
}
