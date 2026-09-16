import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Placeholder path imagery (public/images/paths/*.svg) is served through
    // next/image, which blocks local SVGs by default. Revisit once real
    // photography (research.md §7) replaces these placeholders.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
