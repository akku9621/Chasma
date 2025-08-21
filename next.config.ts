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
};

export default nextConfig;
