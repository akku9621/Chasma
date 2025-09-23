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
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/:path*`, // ✅ backend
      },
    ];
  },
};

export default nextConfig;
