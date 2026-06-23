/**
 * Hub module registry — the hub's own source of truth for every tutorial module
 * it stitches together under one domain.
 *
 * This mirrors the shape of each module's own manifest (see a module's
 * `src/lib/module.ts`: id, title, shortTitle, summary, href) and adds the two
 * fields the hub cares about: `status` (drives published vs. coming-soon
 * rendering) and `tags` (topic chips on the card).
 *
 * Modules are independent static sites mounted at a path prefix (e.g.
 * `/mcp-server/`). Links into them are therefore **cross-zone**: always absolute
 * paths rendered as plain anchors so the browser does a full document load.
 *
 * Adding a module:
 *   1. Add an entry below with `status: "published"` and its mounted `href`.
 *   2. Point the front-door router's `<href>/*` rule at that module's origin
 *      (see README "Front Door routing").
 *   3. The module sets its own NEXT_PUBLIC_BASE_PATH and runs `build:module`.
 */

export type ModuleStatus = "published" | "coming-soon";

export interface HubModule {
  /** Stable id, also used as the path segment (e.g. "mcp-server"). */
  id: string;
  /** Full title, shown on the card. */
  title: string;
  /** Compact label for tight spaces. */
  shortTitle: string;
  /** One-line description shown on the card. */
  summary: string;
  /**
   * Absolute path where the module is mounted in the hub, e.g. "/mcp-server/".
   * Cross-zone — always navigated via a plain anchor (full reload).
   */
  href: string;
  /** Published modules link out; coming-soon ones render disabled. */
  status: ModuleStatus;
  /** Topic chips shown on the card. */
  tags: string[];
}

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
    id: "rag-azure-openai",
    title: "Build a RAG App with Azure OpenAI",
    shortTitle: "RAG on Azure",
    summary:
      "Ground an LLM in your own data with retrieval-augmented generation, vector search, and evaluation.",
    href: "/rag-azure-openai/",
    status: "coming-soon",
    tags: ["RAG", "Azure OpenAI", "Vector Search", "Python"],
  },
  {
    id: "github-actions-azure",
    title: "Ship to Azure with GitHub Actions",
    shortTitle: "CI/CD to Azure",
    summary:
      "Automate build, test, and deploy pipelines to Azure with GitHub Actions and infrastructure as code.",
    href: "/github-actions-azure/",
    status: "coming-soon",
    tags: ["CI/CD", "GitHub Actions", "Azure", "IaC"],
  },
];

/** Modules ready for visitors today. */
export const publishedModules = modules.filter((m) => m.status === "published");

/** Announced modules that aren't live yet. */
export const comingSoonModules = modules.filter(
  (m) => m.status === "coming-soon",
);
