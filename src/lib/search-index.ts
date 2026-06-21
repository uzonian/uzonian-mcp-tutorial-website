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
    title: "What is Copilot Cowork?",
    href: "/before-you-begin/#what-is-cowork",
    snippet: "The agentic experience in Microsoft 365 Copilot that does the work.",
  },
  {
    title: "Plug-in vs skill vs connector",
    href: "/before-you-begin/#plugin-vs-skill",
    snippet: "Skills are the know-how; connectors are the reach into systems.",
  },
  {
    title: "Components of an MCP connection",
    href: "/concepts/#components",
    snippet:
      "Action descriptor, server URL, tools, widgets, and the auth binding.",
  },
  {
    title: "How Cowork discovers tools",
    href: "/concepts/#discovery",
    snippet: "Tools are discovered dynamically from the MCP server at runtime.",
  },
  {
    title: "Streamable HTTP transport",
    href: "/concepts/#streamable-http",
    snippet: "One remote /mcp endpoint; stateless_http and json_response.",
  },
  {
    title: "High-level architecture diagram",
    href: "/architecture/#high-level",
    snippet:
      "User → Copilot Cowork → plug-in action → MCP server on Azure → Salesforce / ServiceNow / Jira.",
  },
  {
    title: "Request lifecycle",
    href: "/architecture/#lifecycle",
    snippet: "Step-by-step trip of an ask through the plug-in and MCP connection.",
  },
  {
    title: "Scaffold a declarative agent",
    href: "/quickstart/#scaffold",
    snippet: "Create New Agent/App → Declarative Agent in the Agents Toolkit.",
  },
  {
    title: "Add an MCP server action",
    href: "/quickstart/#add-action",
    snippet: "Add an Action → Start with an MCP Server → enter the server URL.",
  },
  {
    title: "Fetch tools into ai-plugin.json",
    href: "/quickstart/#fetch-tools",
    snippet: "Open .vscode/mcp.json, Start, then ATK: Fetch action from MCP.",
  },
  {
    title: "The plug-in package, file by file",
    href: "/anatomy/#package",
    snippet: "manifest.json, declarativeAgent.json, ai-plugin.json, and mcp.json.",
  },
  {
    title: "The action descriptor (ai-plugin.json)",
    href: "/anatomy/#action",
    snippet: "Declares the MCP runtime: server URL, selected tools, and auth.",
  },
  {
    title: "The authentication binding",
    href: "/anatomy/#auth-binding",
    snippet: "How the MCP connection proves identity to the backend.",
  },
  {
    title: "Request-scoped delegated token",
    href: "/implementation/#auth",
    snippet: "Store the user's bearer token per request in a ContextVar.",
  },
  {
    title: "Payload trimming and byte budget",
    href: "/implementation/#trim",
    snippet: "Field projection, text clipping, and a MAX_RESPONSE_BYTES cap.",
  },
  {
    title: "MCP connection types",
    href: "/security/#connection-types",
    snippet: "Anonymous, API key, OAuth 2.1 static registration, and Entra SSO.",
  },
  {
    title: "OAuth 2.1 with static registration",
    href: "/security/#oauth",
    snippet: "The recommended per-user delegated connection type.",
  },
  {
    title: "Choosing a connection type",
    href: "/security/#choosing",
    snippet: "A decision guide for picking the right authentication mode.",
  },
  {
    title: "Register the OAuth app",
    href: "/copilot-studio/#register-oauth",
    snippet:
      "Redirect URI https://teams.microsoft.com/api/platform/v1.0/oAuthRedirect.",
  },
  {
    title: "Publish and govern the plug-in",
    href: "/copilot-studio/#publish",
    snippet: "Deploy to the tenant and govern access via the admin center.",
  },
  {
    title: "Deploy the MCP server to Azure",
    href: "/deployment/#deploy",
    snippet: "Bicep to Container Apps or App Service, fronted by APIM.",
  },
  {
    title: "Salesforce example plug-in",
    href: "/extending/#salesforce",
    snippet: "MCP connection, SOQL tools, a pipeline-triage skill, and OAuth.",
  },
  {
    title: "ServiceNow example plug-in",
    href: "/extending/#servicenow",
    snippet: "Incident and KB tools, an incident first-response skill, and OAuth.",
  },
  {
    title: "Jira Cloud example plug-in",
    href: "/extending/#jira",
    snippet: "JQL tools, a standup-prep skill, and Atlassian OAuth 2.0 (3LO).",
  },
  {
    title: "No tools appear in Copilot",
    href: "/troubleshooting/#no-tools",
    snippet: "Check the MCP server URL, the fetch step, and the auth consent.",
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
