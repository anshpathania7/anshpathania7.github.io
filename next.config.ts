import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export so the whole paper can be dropped on any host.
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
