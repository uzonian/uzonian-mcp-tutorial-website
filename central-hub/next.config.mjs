/**
 * The central hub serves the domain root (https://uzoniandev.com/), so unlike a
 * tutorial module it never mounts under a path prefix — there is no basePath.
 * Individual modules are deployed as separate static sites and stitched in at
 * their own path prefixes by Azure Front Door (see README.md).
 *
 * @type {import('next').NextConfig}
 */
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  output: "export",
  trailingSlash: true,
  // Pin file tracing to this app so the build ignores the sibling module's
  // lockfile at the repo root and stays self-contained / extractable.
  outputFileTracingRoot: projectRoot,
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
};

export default nextConfig;
