import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  pageExtensions: ["page.tsx", "page.ts", "route.ts", "route.tsx"],
};

export default nextConfig;