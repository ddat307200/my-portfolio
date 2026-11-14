import type { NextConfig } from "next";

// Optional sub-path, e.g. "/portfolio" when hosted at username.github.io/portfolio.
// Leave empty when served from the root of a custom domain.
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: basePath || undefined,
  images: { unoptimized: true },
  poweredByHeader: false,
  reactStrictMode: true,
  // Branded site-wide 404 (app/global-not-found.tsx); needed with multiple root layouts.
  // inlineCss: put the (small) CSS in the HTML instead of render-blocking <link> requests.
  experimental: { globalNotFound: true, inlineCss: true },
};

export default nextConfig;
