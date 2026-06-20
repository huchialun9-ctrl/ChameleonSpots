import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.steamusercontent.com",
        pathname: "/ugc/**",
      },
      {
        protocol: "https",
        hostname: "steamuserimages-a.akamaihd.net",
        pathname: "/ugc/**",
      },
      {
        protocol: "https",
        hostname: "shared.akamai.steamstatic.com",
        pathname: "/store_item_assets/**",
      },
    ],
  },
};

export default nextConfig;
