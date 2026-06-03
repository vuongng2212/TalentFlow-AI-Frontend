import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: [/node_modules/, /TalentFlow-AI-Backend/],
    };
    return config;
  },
};

export default nextConfig;
