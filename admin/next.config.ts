import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
    ],
  },
  outputFileTracingRoot: path.join(__dirname, "../../"),
  turbopack: {
    root: path.join(__dirname, "../../"),
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:52732/api/:path*",
      },
    ];
  },
};

export default nextConfig;