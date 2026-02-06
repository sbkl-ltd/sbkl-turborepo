import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /* config options here */
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    "@sbkl-turborepo/api",
    "@sbkl-turborepo/ui",
    "@sbkl-turborepo/schemas",
  ],
};

export default nextConfig;
