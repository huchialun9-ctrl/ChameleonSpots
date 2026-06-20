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
    ],
  },
};

export default nextConfig;
