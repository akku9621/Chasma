import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "static.vecteezy.com",
      "images.pexels.com",
      "via.placeholder.com",
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://chashma-backend.vercel.app/api/:path*", // ✅ backend
      },
    ];
  },
};

export default nextConfig;
