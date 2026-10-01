import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // This Vercel project returns 402 from /_next/image, so optimized src URLs render as broken images.
    unoptimized: true,
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
