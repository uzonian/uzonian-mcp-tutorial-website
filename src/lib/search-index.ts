import { chapters } from "./chapters";
import { glossary } from "./glossary";

export interface SearchEntry {
  title: string;
  /** Route path, e.g. "/concepts/". */
  href: string;
  /** Short context shown under the title. */
  snippet: string;
  /** Group label for filtering/sorting. */
  kind: "Chapter" | "Section" | "Glossary";
  /** Free-text haystack for matching. */
  haystack: string;
}

/** Extra fine-grained section anchors so search lands users in the right place. */
const sections: Omit<SearchEntry, "kind" | "haystack">[] = [
  {
    title: "What is MCP?",
    href: "/concepts/#mcp",
    snippet: "Model Context Protocol — a standard way to expose tools to AI clients.",
  },
  {
    title: "Native MCP vs REST fallback",
    href: "/concepts/#native-vs-rest",
    snippet: "Why native MCP is the primary design and REST is only a fallback.",
  },
  {
    title: "Delegated OAuth 2.0 3LO",
    href: "/concepts/#oauth-3lo",
    snippet: "The user signs in; the server forwards a short-lived delegated token to Jira.",
  },
  {
    title: "Streamable HTTP transport",
    href: "/concepts/#streamable-http",
    snippet: "stateless_http=True and json_response=True for gateway-friendly MCP.",
  },
  {
    title: "High-level architecture diagram",
    href: "/architecture/#high-level",
    snippet: "User → Copilot Studio → connector → APIM → FastMCP server → Jira Cloud.",
  },
  {
    title: "Request lifecycle sequence",
    href: "/architecture/#lifecycle",
    snippet: "Step-by-step trip of a request through every component and back.",
  },
  {
    title: "Create and activate a virtual environment",
    href: "/quickstart/#venv",
    snippet: "python -m venv .venv and Activate.ps1 on Windows PowerShell.",
  },
  {
    title: "Run the smoke test",
    href: "/quickstart/#smoke",
    snippet: "python scripts/smoke.py — what success looks like.",
  },
  {
    title: "Inspect the /mcp endpoint",
    href: "/quickstart/#mcp-endpoint",
    snippet: "Use MCP Inspector with Streamable HTTP at http://localhost:8080/mcp.",
  },
  {
    title: "Required software for Windows",
    href: "/environment/#software",
    snippet: "VS Code, Python 3.11+, Git, Azure CLI, Node.js LTS, PowerShell 7.",
  },
  {
    title: "Middleware security flow",
    href: "/implementation/#middleware",
    snippet: "Origin check, gateway token, bearer token, request-scoped binding.",
  },
  {
    title: "Request-scoped token storage (ContextVar)",
    href: "/implementation/#context",
    snippet: "Isolate the user token per async request; reset in finally.",
  },
  {
    title: "Payload trimming and byte budget",
    href: "/implementation/#trimming",
    snippet: "Field projection, text clipping, and MAX_RESPONSE_BYTES enforcement.",
  },
  {
    title: "Create the Atlassian OAuth app",
    href: "/copilot-studio/#atlassian-app",
    snippet: "Scopes read:jira-work, read:jira-user, write:jira-work, offline_access.",
  },
  {
    title: "Import the MCP connector",
    href: "/copilot-studio/#import-connector",
    snippet: "Replace the APIM host and keep x-ms-agentic-protocol.",
  },
  {
    title: "Primary deployment command",
    href: "/deployment/#deploy",
    snippet: "az login then .\\scripts\\deploy.ps1 with resource group and ACR.",
  },
  {
    title: "APIM policy and IP ranges",
    href: "/deployment/#apim-policy",
    snippet: "Replace placeholder IP ranges with connector egress / service tags.",
  },
  {
    title: "Security non-negotiable rules",
    href: "/security/#rules",
    snippet: "No service accounts, no PATs, no token logging, no wildcard CORS.",
  },
  {
    title: "Read-only deployment mode",
    href: "/security/#read-only",
    snippet: "Remove write scopes and write tools for a safe read-only server.",
  },
  {
    title: "Deploy-time smoke sequence",
    href: "/testing/#smoke-sequence",
    snippet: "Flowchart: health, 401 without bearer, initialize, tools/list, calls.",
  },
  {
    title: "AsyncResponsePayloadTooLarge fix",
    href: "/troubleshooting/#payload",
    snippet: "Lower MAX_RESPONSE_BYTES and MAX_RESULTS_CAP; trim fields harder.",
  },
];

export const searchIndex: SearchEntry[] = [
  ...chapters
    .filter((c) => c.slug !== "search")
    .map<SearchEntry>((c) => ({
      title: c.title,
      href: `/${c.slug}${c.slug ? "/" : ""}`,
      snippet: c.summary,
      kind: "Chapter",
      haystack:
        `${c.title} ${c.navTitle} ${c.summary} ${c.keywords.join(" ")}`.toLowerCase(),
    })),
  ...sections.map<SearchEntry>((s) => ({
    ...s,
    kind: "Section",
    haystack: `${s.title} ${s.snippet}`.toLowerCase(),
  })),
  ...glossary.map<SearchEntry>((g) => ({
    title: g.term,
    href: `/glossary/#${g.term.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    snippet: g.short,
    kind: "Glossary",
    haystack: `${g.term} ${g.short} ${g.detail ?? ""}`.toLowerCase(),
  })),
];

/** Tiny, dependency-free ranked search over the static index. */
export function searchEntries(query: string, limit = 30): SearchEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/).filter(Boolean);
  const scored = searchIndex
    .map((entry) => {
      let score = 0;
      for (const term of terms) {
        if (!entry.haystack.includes(term)) {
          score = -1;
          break;
        }
        score += 1;
        if (entry.title.toLowerCase().includes(term)) score += 3;
        if (entry.title.toLowerCase().startsWith(term)) score += 2;
      }
      if (entry.kind === "Chapter") score += 0.5;
      return { entry, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  return scored.map((s) => s.entry);
}
