import { execSync } from "child_process";
import type { NextConfig } from "next";
import { webpack } from "next/dist/compiled/webpack/webpack";
import packageJson from "./package.json" with { type: "json" };

const commitHash = execSync('git log --pretty=format:"%h" -n1')
  .toString()
  .trim();

const nextConfig: NextConfig = {
  images: {
    unoptimized: true
  },
  basePath: "",
  env: { commitHash, version: packageJson.version },
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
