import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "headless.local",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;