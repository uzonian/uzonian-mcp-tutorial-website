import { ChapterShell } from "@/components/ChapterShell";
import { Callout } from "@/components/Callout";
import { CodeBlock } from "@/components/CodeBlock";
import { Mermaid } from "@/components/Mermaid";
import { ConceptCheck } from "@/components/ConceptCheck";
import { Table, Code } from "@/components/content";
import { CardGrid, Card } from "@/components/Card";

export const metadata = { title: "Architecture" };

export default function Page() {
  return (
    <ChapterShell
      slug="architecture"
      eyebrow="Chapter 2 · Understand"
      title="Architecture: How the Pieces Fit Together"
      intro="A bird&rsquo;s-eye view of the runtime architecture — from the user&rsquo;s prompt in Copilot Cowork all the way to the enterprise system, through the MCP server, Azure API Management, and the OAuth token exchange."
      learningGoals={[
        "Draw the high-level architecture from user to enterprise system",
        "Walk through a single request lifecycle step by step",
        "Explain how delegated identity flows through the stack",
        "Identify how Salesforce, ServiceNow, and Jira each fit the pattern",
      ]}
      toc={[
        { id: "high-level", label: "High-level diagram" },
        { id: "lifecycle", label: "Request lifecycle" },
        { id: "identity", label: "Identity & delegated tokens" },
        { id: "three-systems", label: "The three example systems" },
      ]}
      summary={
        <ul>
          <li>
            A user prompt flows from Copilot Cowork → plug-in action → APIM
            gateway → MCP server on Azure → enterprise system.
          </li>
          <li>
            Each request carries a <strong>delegated token</strong> scoped to the
            signed-in user — never a shared service account.
          </li>
          <li>
            Secrets live in Azure Key Vault; the MCP server never persists tokens.
          </li>
          <li>
            Salesforce, ServiceNow, and Jira each plug into the same pattern with
            their own OAuth flows.
          </li>
        </ul>
      }
      reviewItems={[
        { id: "diagram", label: "I can draw the architecture from memory" },
        { id: "lifecycle", label: "I can trace a request through the stack" },
        { id: "identity", label: "I understand delegated vs service-account auth" },
        { id: "systems", label: "I see how each example system fits the pattern" },
      ]}
    >
      <h2 id="high-level">High-level diagram</h2>
      <p>
        The architecture is a straight pipeline. The user talks to Copilot Cowork;
        Cowork invokes the plug-in&apos;s MCP server action; the call flows through
        Azure API Management (rate limiting, policy enforcement) to your MCP server
        running on Azure Container Apps; the server calls the enterprise system
        with the user&apos;s delegated OAuth token; secrets stay in Key Vault.
      </p>
      <Mermaid
        alt="Architecture diagram showing flow from user through Copilot Cowork to MCP server on Azure and then to Salesforce, ServiceNow, or Jira via OAuth"
        chart={`flowchart LR
  U[User] --> C[Copilot Cowork]
  C --> PA[Plug-in Action]
  PA --> APIM[Azure APIM]
  APIM --> MCP[MCP Server\\nAzure Container Apps]
  MCP --> SF[Salesforce]
  MCP --> SN[ServiceNow]
  MCP --> JR[Jira Cloud]
  MCP --> KV[Azure Key Vault]
  PA -. OAuth 2.1 .-> SF
  PA -. OAuth 2.1 .-> SN
  PA -. OAuth 2.1 .-> JR`}
        caption="End-to-end flow: user → Copilot Cowork → plug-in → APIM → MCP server → enterprise system"
      />

      <h2 id="lifecycle">Request lifecycle</h2>
      <p>
        When a user says &ldquo;show me my open incidents,&rdquo; here is exactly
        what happens under the hood, step by step.
      </p>
      <Table
        headers={["Step", "What happens", "Where"]}
        rows={[
          ["1", "User sends a prompt to Copilot Cowork.", "m365.cloud.microsoft/chat"],
          ["2", "Cowork matches the prompt to a tool in the plug-in\u2019s action descriptor.", "Copilot orchestrator"],
          ["3", "Cowork calls the MCP server endpoint over streamable HTTP with the tool name and arguments.", "APIM → MCP server"],
          ["4", "The MCP server authenticates using the delegated bearer token attached to the request.", "MCP server (auth.py)"],
          ["5", "The server calls the enterprise API (e.g., ServiceNow Table API) with the user\u2019s token.", "Connector client"],
          ["6", "The response is trimmed to fit Copilot\u2019s payload limits.", "MCP server (trim.py)"],
          ["7", "The trimmed result is returned to Cowork, which renders it for the user.", "Copilot Cowork UI"],
        ]}
      />
      <Callout variant="security" title="Tokens are never logged">
        The delegated bearer token is request-scoped and stored in a Python{" "}
        <Code>ContextVar</Code>. It is never written to logs, never persisted to
        disk, and never shared between requests.
      </Callout>

      <h2 id="identity">Identity &amp; delegated tokens</h2>
      <p>
        The connection uses <strong>OAuth 2.1 with delegated (per-user)
        tokens</strong>. When the user first invokes the plug-in, Copilot
        redirects them to the enterprise system&apos;s consent screen. After
        consent, Copilot holds a short-lived access token (and a refresh token)
        scoped to <em>that user</em>. Every subsequent tool call sends the token
        in the request context so the MCP server acts on behalf of the real person
        — never a shared service account.
      </p>
      <CodeBlock
        language="python"
        filename="src/cowork_mcp/auth.py (simplified)"
        code={`from contextvars import ContextVar

_bearer: ContextVar[str] = ContextVar("bearer")

def set_token(token: str) -> None:
    _bearer.set(token)

def get_token() -> str:
    return _bearer.get()`}
      />
      <Callout variant="why" title="Why delegated over service accounts?">
        A service-account PAT grants blanket access to <em>all</em> data. A
        delegated token respects the user&apos;s actual permissions — least
        privilege by default.
      </Callout>

      <h2 id="three-systems">The three example systems</h2>
      <p>
        This guide ships worked examples for three enterprise systems. Each one
        follows the exact same architecture — only the OAuth provider details and
        tool definitions change.
      </p>
      <CardGrid cols={3}>
        <Card title="Salesforce" icon="☁️" eyebrow="CRM">
          OAuth 2.0 connected app (web server flow). Tools for SOQL queries,
          record retrieval, case creation, and opportunity updates.
        </Card>
        <Card title="ServiceNow" icon="🎫" eyebrow="ITSM">
          OAuth 2.0 (or basic auth for dev). Tools for incident search, creation,
          update, and knowledge-base lookup.
        </Card>
        <Card title="Jira Cloud" icon="📋" eyebrow="Project tracking">
          Atlassian OAuth 2.0 (3LO). Tools for JQL search, issue CRUD, comments,
          and workflow transitions.
        </Card>
      </CardGrid>
      <ConceptCheck
        question={
          <p>
            If you wanted to add a fourth enterprise system (say, GitHub), what
            would you need to change in the architecture?
          </p>
        }
        answer={
          <p>
            You would add a new connector module on the MCP server with its own
            OAuth configuration and tool definitions. The architecture stays the
            same — APIM, Key Vault, and the plug-in action descriptor are
            unchanged; only the connector client and tools differ.
          </p>
        }
      />
    </ChapterShell>
  );
}
