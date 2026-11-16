import type { NextConfig } from "next";

const PHOTO_BUCKET = process.env.FIREBASE_STORAGE_BUCKET || "tenderpro-480721.firebasestorage.app";

const nextConfig: NextConfig = {
  images: {
    // This Vercel project returns 402 from /_next/image, so optimized src URLs render as broken images.
    unoptimized: true,
  },
  async rewrites() {
    return [{ source: "/media/:path*", destination: `https://storage.googleapis.com/${PHOTO_BUCKET}/:path*` }];
  },
  async headers() {
    return [{ source: "/media/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400" }] }];
  },
  async redirects() {
    return [
      { source: "/services", destination: "/#products", permanent: true },
      { source: "/services/:path*", destination: "/#products", permanent: true },
      { source: "/guides/:path*", destination: "/", permanent: true },
      { source: "/apply", destination: "/", permanent: true },
      { source: "/hire", destination: "/#products", permanent: true },
      { source: "/checkout", destination: "/#pricing", permanent: false },
    ];
  },
};

export default nextConfig;
