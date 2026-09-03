import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const base = "https://www.proinnovationtech.co.ke";
    return [
        { url: base, changeFrequency: "weekly", priority: 1 },
        { url: `${base}/tools/serialpro`, changeFrequency: "weekly", priority: 0.95 },
        { url: `${base}/tools/quotepro`, changeFrequency: "weekly", priority: 0.9 },
        { url: `${base}/beta`, changeFrequency: "weekly", priority: 0.85 },
        { url: `${base}/about`, changeFrequency: "monthly", priority: 0.7 },
        { url: `${base}/learn/receipt-numbering`, changeFrequency: "monthly", priority: 0.75 },
        { url: `${base}/learn/print-costing`, changeFrequency: "monthly", priority: 0.75 },
        { url: `${base}/checkout`, changeFrequency: "monthly", priority: 0.6 },
        { url: `${base}/feedback`, changeFrequency: "monthly", priority: 0.5 },
        { url: `${base}/legal/privacy`, changeFrequency: "yearly", priority: 0.3 },
    ];
}
