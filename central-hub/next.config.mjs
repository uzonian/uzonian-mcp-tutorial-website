import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
// The hub serves the domain root (https://uzoniandev.com/). Individual tutorial
// modules mount under their own path prefixes (e.g. /mcp-server/) and are stitched
// in by the front-door router — so the hub itself never needs a basePath.
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  // This app is self-contained and extractable. Pin the tracing root to this
  // folder so Next doesn't infer the parent repo as the workspace root just
  // because a sibling module also has a lockfile.
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
