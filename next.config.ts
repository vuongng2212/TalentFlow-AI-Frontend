import type { NextConfig } from "next";

const apiBaseUrl = process.env.API_INTERNAL_URL || "http://localhost:8080/api/v1";

const nextConfig: NextConfig = {
  /** Proxy API requests to backend during development (avoids CORS) */
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${apiBaseUrl}/:path*`,
      },
    ];
  },

  /** Security & performance headers */
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },

  /** Optimize images from external domains */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
    ],
  },

  /** Enable React strict mode for dev */
  reactStrictMode: true,

  /** Suppress verbose logging in production */
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === "development",
    },
  },
};

export default nextConfig;
