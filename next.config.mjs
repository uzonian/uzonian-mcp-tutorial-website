// Mount point within the central hub, e.g. "/mcp-server". Empty = domain root.
// Keep this in sync with src/lib/module.ts (both read NEXT_PUBLIC_BASE_PATH).
const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const trimmed = rawBasePath.replace(/^\/+|\/+$/g, "");
const basePath = trimmed ? `/${trimmed}` : "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  // When set, every page and asset is served under this prefix so the site
  // slots into the hub at <hub>/<basePath>/ without rewriting links by hand.
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
};

export default nextConfig;
