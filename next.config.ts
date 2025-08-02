import type { NextConfig } from "next";
import { webpack } from "next/dist/compiled/webpack/webpack";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true
  },
  reactStrictMode: false,
  output: "export",
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      process: "process/browser",
      buffer: "buffer/",
    };
    config.plugins.push(
      new webpack.ProvidePlugin({
        process: "process/browser",
        Buffer: ["buffer", "Buffer"],
      })
    );
    return config;
  },
};

export default nextConfig;
