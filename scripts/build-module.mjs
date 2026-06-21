/**
 * Builds this site as a hub module: a static export mounted under a path prefix
 * (NEXT_PUBLIC_BASE_PATH, e.g. "/mcp-server") and nested so the files line up at
 * that prefix on the host.
 *
 *   out/concepts/index.html      ->  dist/mcp-server/concepts/index.html
 *   asset URLs in the HTML        ->  /mcp-server/_next/...   (already match)
 *
 * Deploy the resulting `dist/` folder. Behind the hub (Azure Front Door or a
 * single Static Web App), route "<basePath>/*" to this content with the path
 * preserved and the URLs resolve correctly.
 *
 * Usage:
 *   npm run build:module                       (defaults to /mcp-server)
 *   $env:NEXT_PUBLIC_BASE_PATH="/foo"; npm run build:module
 */
import { execSync } from "node:child_process";
import {
  cpSync,
  rmSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  existsSync,
} from "node:fs";
import { join } from "node:path";

function normalizeBasePath(value) {
  if (!value) return "";
  const trimmed = value.replace(/^\/+|\/+$/g, "");
  return trimmed ? `/${trimmed}` : "";
}

const basePath = normalizeBasePath(
  process.env.NEXT_PUBLIC_BASE_PATH || "/mcp-server",
);

if (!basePath) {
  console.error(
    "build:module needs a non-empty NEXT_PUBLIC_BASE_PATH (e.g. /mcp-server).",
  );
  process.exit(1);
}

const env = { ...process.env, NEXT_PUBLIC_BASE_PATH: basePath };
console.log(`\n> Building module mounted at "${basePath}"\n`);
execSync("next build", { stdio: "inherit", env });

const dist = "dist";
const moduleDir = join(dist, basePath.replace(/^\//, ""));
rmSync(dist, { recursive: true, force: true });
mkdirSync(moduleDir, { recursive: true });
cpSync("out", moduleDir, { recursive: true });

// The nested copy of the static-export config is redundant; the deploy-root
// config below is the one Azure Static Web Apps reads.
const nestedConfig = join(moduleDir, "staticwebapp.config.json");
if (existsSync(nestedConfig)) rmSync(nestedConfig);

// Deploy-root SWA config: keep the source headers, rewrite routing for basePath.
const srcConfig = join("public", "staticwebapp.config.json");
const config = existsSync(srcConfig)
  ? JSON.parse(readFileSync(srcConfig, "utf8"))
  : {};

config.navigationFallback = {
  rewrite: `${basePath}/404.html`,
  exclude: [
    `${basePath}/_next/*`,
    `${basePath}/*.{css,js,svg,png,jpg,ico,json,woff,woff2}`,
  ],
};

writeFileSync(
  join(dist, "staticwebapp.config.json"),
  `${JSON.stringify(config, null, 2)}\n`,
);

console.log(`\n> Module ready at ${moduleDir}`);
console.log(
  `> Deploy the "${dist}" folder; it serves this site at "${basePath}/".\n`,
);
