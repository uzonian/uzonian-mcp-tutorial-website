/**
 * Module manifest — the single source of truth that lets this tutorial site
 * behave as one module inside a central hub of tutorials.
 *
 * Everything here is environment-overridable so the same code can run two ways:
 *   1. Standalone at a domain root (default — backward compatible).
 *   2. Mounted under the hub at a path prefix, e.g. https://uzoniandev.com/mcp-server/.
 *
 * Env vars (set at build time):
 *   NEXT_PUBLIC_BASE_PATH  e.g. "/mcp-server"  (default "" = root)
 *   NEXT_PUBLIC_HUB_URL    e.g. "https://uzoniandev.com" (the central site)
 */

/** Normalize a path prefix to "" or "/segment" (no trailing slash). */
function normalizeBasePath(value: string | undefined): string {
  if (!value) return "";
  const trimmed = value.replace(/^\/+|\/+$/g, "");
  return trimmed ? `/${trimmed}` : "";
}

/** The path this module is mounted at within the hub (e.g. "/mcp-server"). */
export const basePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH);

/** Absolute origin of the central hub (no trailing slash). */
export const hubUrl = (
  process.env.NEXT_PUBLIC_HUB_URL ?? "https://uzoniandev.com"
).replace(/\/+$/, "");

/** Absolute home URL of this module within the hub. */
export const moduleHomeUrl = `${hubUrl}${basePath}/`;

export interface ModuleInfo {
  id: string;
  /** Full title, shown in the switcher list. */
  title: string;
  /** Compact label, shown in the top bar. */
  shortTitle: string;
  /** One-line description for the switcher. */
  summary: string;
  /** Absolute URL to the module home (cross-zone — always a full reload). */
  href: string;
  /** True while a module is announced but not yet published. */
  comingSoon?: boolean;
}

export const moduleId = "mcp-server";

/** Descriptor for the module in this repository. */
export const currentModule: ModuleInfo = {
  id: moduleId,
  title: "Build an MCP Server for Copilot Studio",
  shortTitle: "MCP Server",
  summary:
    "Design, build, secure, test, deploy, and operate a production-ready MCP server in Python.",
  href: moduleHomeUrl,
};

/**
 * Every tutorial module in the hub. Drives the module switcher in the top bar.
 * Add new modules here (or have the hub inject this list) as they ship.
 */
export const modules: ModuleInfo[] = [
  currentModule,
  {
    id: "coming-soon",
    title: "More tutorials coming soon",
    shortTitle: "More coming soon",
    summary: "Additional hands-on tutorial modules are on the way.",
    href: `${hubUrl}/`,
    comingSoon: true,
  },
];
