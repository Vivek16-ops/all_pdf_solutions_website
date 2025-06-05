import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Additional configurations to handle Windows permission issues
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

export default nextConfig;
