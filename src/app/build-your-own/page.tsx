import { ChapterShell } from "@/components/ChapterShell";
import { Callout } from "@/components/Callout";
import { CardGrid, Card } from "@/components/Card";
import { CodeBlock } from "@/components/CodeBlock";
import { Table, Code } from "@/components/content";
import { MiniProject } from "@/components/Lab";
import { Mermaid } from "@/components/Mermaid";
import { VideoCard } from "@/components/VideoCard";

export const metadata = { title: "Build Your Own" };

export default function Page() {
  return (
    <ChapterShell
      slug="build-your-own"
      eyebrow="Chapter 7 · Apply"
      title="Build Your Own: A Repeatable Method"
      intro="A numbered, repeatable method you can follow to ship a Copilot Cowork plug-in for any external system — whether it is a CRM, ITSM platform, project tracker, or internal API. Design tools, pick a connection type, choose an auth mode, package, and ship."
      learningGoals={[
        "Apply a repeatable five-step method to build any Cowork plug-in",
        "Design tools that are focused, discoverable, and trim-friendly",
        "Choose the right connection type and auth mode for a given system",
        "Package and validate a plug-in before publishing",
      ]}
      toc={[
        { id: "method", label: "The five-step method" },
        { id: "design-tools", label: "Design tools" },
        { id: "pick-connection", label: "Pick a connection type" },
        { id: "pick-auth", label: "Pick an auth mode" },
        { id: "package", label: "Package the plug-in" },
        { id: "checklist", label: "Ship-readiness checklist" },
      ]}
      summary={
        <ul>
          <li>
            Follow a five-step method: design tools, pick connection, pick auth,
            package, and validate.
          </li>
          <li>
            Good tools do one thing, accept typed inputs, and return compact
            responses within the byte budget.
          </li>
          <li>
            Connection type is always remote streamable HTTP for production; auth
            mode depends on whether you need per-user identity.
          </li>
          <li>
            Use the ship-readiness checklist before publishing to the Teams Admin
            Center.
          </li>
        </ul>
      }
      reviewItems={[
        { id: "method", label: "I can list the five steps" },
        { id: "tools", label: "I can design focused, trim-friendly tools" },
        { id: "auth", label: "I can pick the right auth mode for a scenario" },
        { id: "ship", label: "I can run through the ship-readiness checklist" },
      ]}
    >
      <h2 id="method">The five-step method</h2>
      <p>
        No matter what system you are connecting — Salesforce, ServiceNow, Jira,
        or your own internal API — the process follows the same five steps. This
        method keeps you from over-engineering early and ensures you ship
        something testable at each stage.
      </p>
      <Mermaid
        alt="Flowchart showing the five steps: Design Tools, Pick Connection, Pick Auth, Package, Validate and Ship"
        chart={`graph LR
  A[1. Design Tools] --> B[2. Pick Connection]
  B --> C[3. Pick Auth]
  C --> D[4. Package]
  D --> E[5. Validate & Ship]`}
        caption="The repeatable five-step method"
      />
      <CardGrid cols={3}>
        <Card title="1. Design" icon="✏️">
          Identify the API operations and map them to focused MCP tools.
        </Card>
        <Card title="2. Connect" icon="🔌">
          Choose remote streamable HTTP and set up your FastMCP server.
        </Card>
        <Card title="3. Auth" icon="🔐">
          Pick the auth mode that matches your security needs.
        </Card>
        <Card title="4. Package" icon="📦">
          Author the manifest, declarative agent, and action descriptor.
        </Card>
        <Card title="5. Ship" icon="🚀">
          Validate with the checklist, provision, and publish.
        </Card>
      </CardGrid>

      <h2 id="design-tools">Step 1: Design tools</h2>
      <p>
        Tool design is the most important step. A well-designed tool set makes
        Cowork effective; a poorly designed one confuses the agent and produces
        bad results. Follow these principles:
      </p>
      <Table
        headers={["Principle", "Why it matters", "Example"]}
        rows={[
          [
            <strong key="p1">One tool = one action</strong>,
            "Cowork can compose multiple tools; overloaded tools reduce flexibility.",
            <span key="p1e"><Code>jira_get_issue</Code> not <Code>jira_do_everything</Code></span>,
          ],
          [
            <strong key="p2">Typed parameters</strong>,
            "FastMCP generates the schema from type hints; Cowork uses it to fill arguments.",
            <span key="p2e"><Code>soql: str</Code>, <Code>max_results: int = 10</Code></span>,
          ],
          [
            <strong key="p3">Compact responses</strong>,
            "Byte budget is real; trim early and drop low-value fields.",
            "Return 5 fields, not the full 80-field API response.",
          ],
          [
            <strong key="p4">Clear names</strong>,
            "The tool name is what Cowork sees when deciding which tool to call.",
            <span key="p4e"><Code>servicenow_search_incidents</Code> not <Code>sn_search</Code></span>,
          ],
          [
            <strong key="p5">Helpful docstrings</strong>,
            "The docstring becomes the tool description in ai-plugin.json.",
            <span key="p5e">&ldquo;Search Jira issues using JQL. Returns up to 10 results.&rdquo;</span>,
          ],
        ]}
      />
      <Callout variant="tip" title="Start with three to five tools">
        Ship a small set first. You can add tools on the server later and they
        appear automatically through MCP discovery — no plug-in update needed.
      </Callout>
      <CodeBlock
        language="python"
        filename="Example: designing Jira tools"
        code={`# Good: focused, typed, documented
@mcp.tool()
async def jira_search(jql: str, max_results: int = 10) -> dict:
    """Search Jira issues using JQL. Returns up to max_results issues."""
    ...

@mcp.tool()
async def jira_get_issue(issue_key: str) -> dict:
    """Return a single Jira issue by key (e.g. PROJ-123)."""
    ...

@mcp.tool()
async def jira_create_issue(
    project_key: str, summary: str, issue_type: str = "Task"
) -> dict:
    """Create a new Jira issue in the given project."""
    ...`}
      />

      <h2 id="pick-connection">Step 2: Pick a connection type</h2>
      <p>
        For production Cowork plug-ins there is one supported connection type:{" "}
        <strong>remote streamable HTTP</strong>. Your MCP server exposes an HTTPS{" "}
        <Code>/mcp</Code> endpoint and Cowork connects to it. Local stdio
        servers work during development but are not supported in deployed
        plug-ins.
      </p>
      <Table
        headers={["Type", "Use case", "Production?"]}
        rows={[
          [
            <strong key="t1">Remote streamable HTTP</strong>,
            "All production plug-ins",
            "✅ Yes",
          ],
          [
            <strong key="t2">Local stdio</strong>,
            "Dev-only, personal automation",
            "❌ No",
          ],
        ]}
      />
      <CodeBlock
        language="python"
        filename="Server transport configuration"
        code={`# Production: streamable HTTP (stateless, JSON response)
mcp = FastMCP("my-server", stateless_http=True, json_response=True)

# Dev-only: stdio (not deployable as a Cowork plug-in)
# mcp.run(transport="stdio")  # don't use in production`}
      />

      <h2 id="pick-auth">Step 3: Pick an auth mode</h2>
      <p>
        The auth mode determines how Cowork proves identity when calling your
        server. Your choice depends on whether the external system needs per-user
        identity and whether it trusts Microsoft Entra tokens directly.
      </p>
      <Table
        headers={["Mode", "Best for", "Token flow"]}
        rows={[
          [
            <strong key="a1">Anonymous</strong>,
            "Dev/testing, public read-only APIs",
            "No token sent",
          ],
          [
            <strong key="a2">API key</strong>,
            "Machine-to-machine, internal APIs",
            "Shared secret in header",
          ],
          [
            <strong key="a3">OAuth 2.1</strong>,
            "Enterprise systems (Salesforce, ServiceNow, Jira)",
            "User signs in, delegated token per request",
          ],
          [
            <strong key="a4">Entra SSO</strong>,
            "Backend trusts Microsoft Entra directly",
            "User's M365 token forwarded",
          ],
        ]}
      />
      <Callout variant="security" title="OAuth 2.1 is the default choice">
        Unless your backend natively trusts Entra tokens, use OAuth 2.1 with
        static registration. It gives you per-user delegated access with proper
        consent, and works with any OAuth-capable system.
      </Callout>
      <Mermaid
        alt="Decision tree for choosing an auth mode: starts with 'need per-user identity?' and branches to Anonymous/API key (no) or OAuth/Entra (yes)"
        chart={`graph TD
  Q1{Need per-user identity?}
  Q1 -->|No| Q2{Public or internal?}
  Q2 -->|Public| ANON[Anonymous]
  Q2 -->|Internal| KEY[API Key]
  Q1 -->|Yes| Q3{Backend trusts Entra?}
  Q3 -->|Yes| ENTRA[Entra SSO]
  Q3 -->|No| OAUTH[OAuth 2.1]`}
        caption="Auth mode decision tree"
      />

      <h2 id="package">Step 4: Package the plug-in</h2>
      <p>
        Packaging means assembling the three JSON files (manifest, declarative
        agent, action descriptor) into a plug-in folder that the Agents Toolkit
        can provision and sideload. The Toolkit does most of the work; you
        review and customise.
      </p>
      <CodeBlock
        language="text"
        filename="Plug-in folder structure"
        code={`plugins/my-system/
├── manifest.json
├── declarativeAgent.json
├── ai-plugin.json
├── color.png
├── outline.png
└── SKILL.md (optional)`}
      />
      <CodeBlock
        language="bash"
        filename="Terminal — Toolkit commands"
        code={`# In VS Code with Agents Toolkit:
# 1. Create project: ATK: Create New Agent/App -> Declarative Agent
# 2. Add action:     ATK: Add an Action -> Start with an MCP Server
# 3. Enter URL:      http://localhost:8000/mcp (dev) or https://... (prod)
# 4. Fetch tools:    ATK: Fetch action from MCP
# 5. Select tools and auth mode in the UI
# 6. Provision:      ATK: Provision
# 7. Sideload:       ATK: Sideload`}
      />

      <h2 id="checklist">Ship-readiness checklist</h2>
      <p>
        Before you publish the plug-in to your organisation, run through this
        checklist. It covers the common failure modes that block deployment or
        cause runtime errors.
      </p>
      <MiniProject title="Build a plug-in for your system">
        <p>
          Pick an external system you work with daily. Apply the five-step method
          to build a Cowork plug-in for it:
        </p>
        <ol>
          <li>List 3–5 API operations and design MCP tools for them.</li>
          <li>Scaffold the FastMCP server and implement the tools.</li>
          <li>Choose OAuth 2.1 (or Entra SSO if applicable) and configure auth.</li>
          <li>Package with the Agents Toolkit and sideload.</li>
          <li>Run the checklist below and fix any issues.</li>
        </ol>
      </MiniProject>
      <Table
        headers={["#", "Check", "How to verify"]}
        rows={[
          [
            "1",
            "Server starts and exposes /mcp",
            <span key="c1">Run locally, hit <Code>http://localhost:8000/mcp</Code></span>,
          ],
          [
            "2",
            "All tools discoverable",
            <span key="c2">MCP Inspector shows all expected tools</span>,
          ],
          [
            "3",
            "Payload fits byte budget",
            <span key="c3"><Code>pytest tests/test_trim.py</Code> passes</span>,
          ],
          [
            "4",
            "Auth works end-to-end",
            <span key="c4">Sideloaded agent calls tools without 401</span>,
          ],
          [
            "5",
            "No secrets in source",
            <span key="c5">All credentials in Key Vault / env vars only</span>,
          ],
          [
            "6",
            "HTTPS in production",
            <span key="c6">ai-plugin.json URL starts with <Code>https://</Code></span>,
          ],
          [
            "7",
            "Manifest validates",
            <span key="c7">Agents Toolkit shows no schema errors</span>,
          ],
          [
            "8",
            "Tests pass",
            <span key="c8"><Code>pytest tests/ -v</Code> — all green</span>,
          ],
        ]}
        caption="Ship-readiness checklist"
      />
      <Callout variant="production" title="Iterate after shipping">
        You can add tools on the server after publishing — MCP discovery means
        Cowork picks them up without a plug-in update. Ship small, iterate fast.
      </Callout>
      <VideoCard
        verified={false}
        concept="End-to-end process for shipping a Copilot Cowork plug-in"
        level="intermediate"
        searchQuery="Microsoft Copilot Cowork plug-in end to end build ship tutorial"
        why="A full walkthrough from design to publish cements the five-step method."
      />
    </ChapterShell>
  );
}
