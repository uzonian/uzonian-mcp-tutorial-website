/**
 * Hub module registry — the central source of truth for every tutorial module
 * stitched into uzoniandev.com.
 *
 * This mirrors the per-module manifest contract defined in each module repo
 * (see the MCP module's `src/lib/module.ts`: id, title, shortTitle, summary,
 * href, basePath) and extends it with hub-only presentation fields (`status`,
 * `tags`) used to render the landing grid.
 *
 * Cross-zone routing model: each module is its own static site mounted under a
 * path prefix (e.g. `/mcp-server/`). The hub serves the domain root and links to
 * modules with their ABSOLUTE mounted path. Those links are cross-zone — always
 * full document loads — so module cards use plain <a> anchors, never next/link.
 *
 * To add a module: append an entry here with its mounted `href` (matching the
 * module's NEXT_PUBLIC_BASE_PATH), then wire the path prefix in Front Door.
 */

export type ModuleStatus = "published" | "coming-soon";

export interface HubModule {
  /** Stable identifier; matches the module's own `moduleId`. */
  id: string;
  /** Full title, shown on the module card. */
  title: string;
  /** Compact label for dense surfaces (nav, breadcrumbs). */
  shortTitle: string;
  /** One-line description shown on the card. */
  summary: string;
  /**
   * Absolute path the module is mounted at within the hub, e.g. "/mcp-server/".
   * Cross-zone — rendered as a plain anchor so navigation is a full reload.
   * Empty/undefined for modules that are not yet published.
   */
  href?: string;
  /** Publication state. "coming-soon" entries render disabled. */
  status: ModuleStatus;
  /** Topic chips shown on the card. */
  tags: string[];
}

/** Every tutorial module known to the hub, in display order. */
export const modules: HubModule[] = [
  {
    id: "mcp-server",
    title: "Build an MCP Server for Copilot Studio",
    shortTitle: "MCP Server",
    summary:
      "Design, build, secure, test, deploy, and operate a production-ready MCP server in Python.",
    href: "/mcp-server/",
    status: "published",
    tags: ["MCP", "Copilot Studio", "Azure", "Python"],
  },
  {
    id: "rag-azure-ai-search",
    title: "Build a RAG Pipeline with Azure AI Search",
    shortTitle: "RAG on Azure",
    summary:
      "Ground an LLM in your own documents with chunking, embeddings, hybrid retrieval, and citations.",
    status: "coming-soon",
    tags: ["RAG", "Azure AI Search", "Embeddings", "Python"],
  },
  {
    id: "teams-ai-agent",
    title: "Ship a Teams AI Agent",
    shortTitle: "Teams Agent",
    summary:
      "Package, deploy, and govern a Copilot Studio agent for Microsoft Teams from dev to production.",
    status: "coming-soon",
    tags: ["Copilot Studio", "Microsoft Teams", "Agents"],
  },
];

/** Published modules — those users can actually open today. */
export const publishedModules = modules.filter((m) => m.status === "published");

/** Modules announced but not yet available. */
export const comingSoonModules = modules.filter(
  (m) => m.status === "coming-soon",
);
