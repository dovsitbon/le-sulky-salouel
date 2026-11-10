import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // CSS inliné dans le HTML : pas de requête bloquante avant le premier rendu
  experimental: { inlineCss: true },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [70, 80],
    deviceSizes: [480, 640, 828, 1080, 1280, 1600, 2048],
    minimumCacheTTL: 2678400,
  },
};

export default nextConfig;
