import type { NextConfig } from "next";
import { fileURLToPath } from "url";

const nextConfig: NextConfig = {
  turbopack: {
    root: fileURLToPath(new URL(".", import.meta.url)),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },

      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
      },

      // ADD THIS
      {
        protocol: "https",
        hostname: "cdn.rareblocks.xyz",
      },
    ],
  },
};

export default nextConfig;