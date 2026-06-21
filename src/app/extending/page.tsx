import { ChapterShell } from "@/components/ChapterShell";
import { Callout } from "@/components/Callout";
import { CodeBlock } from "@/components/CodeBlock";
import { Card, CardGrid } from "@/components/Card";
import { Table, Code } from "@/components/content";
import { VideoCard } from "@/components/VideoCard";
import { Mermaid } from "@/components/Mermaid";

export const metadata = { title: "Example Assets: Salesforce, ServiceNow & Jira" };

export default function Page() {
  return (
    <ChapterShell
      slug="extending"
      eyebrow="Chapter 15 · Extend"
      title="Worked Example Assets: Salesforce, ServiceNow & Jira Cloud"
      intro="Three complete, production-shaped MCP connections — one for each enterprise system — showing the reusable pattern of connector + tools + skill + auth. Use them as starter kits or reference implementations."
      learningGoals={[
        "Recognise the repeatable pattern that every connector follows",
        "Set up the MCP connection, tools, skill, and OAuth for Salesforce",
        "Do the same for ServiceNow and Jira Cloud",
        "Reuse the pattern to build your own connector for any system",
      ]}
      toc={[
        { id: "pattern", label: "The reusable pattern" },
        { id: "salesforce", label: "Salesforce" },
        { id: "servicenow", label: "ServiceNow" },
        { id: "jira", label: "Jira Cloud" },
        { id: "reuse", label: "Reusing the pattern" },
      ]}
      summary={
        <ul>
          <li key="s1">Every connector follows the same four-part pattern: connection, tools, skill, auth.</li>
          <li key="s2">Salesforce uses OAuth 2.0 connected app; ServiceNow uses OAuth 2.0; Jira uses Atlassian 3LO.</li>
          <li key="s3">All assets live in <Code>demo/plugins/&lt;system&gt;/</Code> and <Code>demo/src/cowork_mcp/connectors/&lt;system&gt;.py</Code>.</li>
        </ul>
      }
    >
      <h2 id="pattern">The reusable pattern</h2>
      <p>
        Every example asset in this guide follows the same four-part structure.
        Once you internalise this pattern, adding a new enterprise system is
        copy-paste-adapt, not start-from-scratch.
      </p>
      <Mermaid
        chart={`graph LR
  A[MCP Connection] --> B[Tools]
  B --> C[Skill]
  C --> D[Auth Setup]
  D --> A`}
        alt="Circular pattern: MCP Connection leads to Tools, then Skill, then Auth Setup, which feeds back to MCP Connection."
        caption="The four-part connector pattern"
      />
      <CardGrid cols={2}>
        <Card title="Connection" icon="🔌">
          The MCP server endpoint and the <Code>ai-plugin.json</Code> action
          descriptor that references it.
        </Card>
        <Card title="Tools" icon="🛠️">
          Python functions decorated with <Code>@mcp.tool()</Code> that wrap the
          upstream API.
        </Card>
        <Card title="Skill" icon="📋">
          A <Code>SKILL.md</Code> recipe that orchestrates the tools into a
          repeatable workflow.
        </Card>
        <Card title="Auth" icon="🔐">
          OAuth 2.1 configuration — client ID, scopes, redirect URIs — wired
          into the plug-in manifest.
        </Card>
      </CardGrid>
      <Callout variant="beginner" title="Where do these files live?">
        Plug-in manifests live in <Code>demo/plugins/&lt;system&gt;/</Code>.
        Connector code lives in{" "}
        <Code>demo/src/cowork_mcp/connectors/&lt;system&gt;.py</Code>. The
        server registers all connectors in <Code>demo/src/cowork_mcp/server.py</Code>.
      </Callout>

      {/* ─── Salesforce ─────────────────────────────────────── */}
      <h2 id="salesforce">Salesforce</h2>
      <p>
        The Salesforce connector uses an OAuth 2.0 Connected App (web-server
        flow) to obtain a per-user access token. The connector exposes five
        tools and ships with a &ldquo;Pipeline triage&rdquo; skill.
      </p>
      <Table
        headers={["Tool", "Purpose"]}
        rows={[
          [<Code key="t1">salesforce_whoami</Code>, "Return the signed-in Salesforce user"],
          [<Code key="t2">salesforce_query</Code>, "Run a SOQL query"],
          [<Code key="t3">salesforce_get_record</Code>, "Fetch a single record by ID"],
          [<Code key="t4">salesforce_create_case</Code>, "Create a new Case"],
          [<Code key="t5">salesforce_update_opportunity</Code>, "Update fields on an Opportunity"],
        ]}
      />
      <CodeBlock
        language="python"
        filename="demo/src/cowork_mcp/connectors/salesforce.py (excerpt)"
        code={`from mcp.server.fastmcp import FastMCP

mcp = FastMCP("salesforce")


@mcp.tool()
async def salesforce_whoami(ctx) -> dict:
    """Return the current Salesforce user identity."""
    client = await _get_client(ctx)
    return await client.get("/services/oauth2/userinfo")


@mcp.tool()
async def salesforce_query(ctx, soql: str) -> dict:
    """Execute a SOQL query and return trimmed results."""
    client = await _get_client(ctx)
    resp = await client.get("/services/data/v60.0/query", params={"q": soql})
    return trim_response(resp["records"])`}
      />
      <CodeBlock
        language="json"
        filename="demo/plugins/salesforce/ai-plugin.json (auth section)"
        code={`{
  "runtimes": [{
    "type": "OpenApi",
    "auth": {
      "type": "OAuthPluginVault",
      "reference_id": "salesforce-oauth"
    },
    "spec": {
      "url": "https://YOUR_SERVER/mcp"
    }
  }]
}`}
      />
      <Callout variant="security" title="Salesforce OAuth scopes">
        Request only the scopes you need: <Code>api</Code>,{" "}
        <Code>refresh_token</Code>, <Code>id</Code>. Never request{" "}
        <Code>full</Code> unless you genuinely need all data access. The
        Connected App must have the Copilot redirect URI registered.
      </Callout>

      {/* ─── ServiceNow ─────────────────────────────────────── */}
      <h2 id="servicenow">ServiceNow</h2>
      <p>
        The ServiceNow connector authenticates with OAuth 2.0 (or basic auth for
        local dev). It exposes six tools and ships with an &ldquo;Incident first
        response&rdquo; skill that triages a new incident, finds related KB
        articles, and sets priority.
      </p>
      <Table
        headers={["Tool", "Purpose"]}
        rows={[
          [<Code key="t1">servicenow_whoami</Code>, "Return the signed-in ServiceNow user"],
          [<Code key="t2">servicenow_search_incidents</Code>, "Search incidents by query"],
          [<Code key="t3">servicenow_get_incident</Code>, "Fetch a single incident by sys_id"],
          [<Code key="t4">servicenow_create_incident</Code>, "Create a new incident"],
          [<Code key="t5">servicenow_update_incident</Code>, "Update fields on an incident"],
          [<Code key="t6">servicenow_search_kb</Code>, "Search the knowledge base"],
        ]}
      />
      <CodeBlock
        language="python"
        filename="demo/src/cowork_mcp/connectors/servicenow.py (excerpt)"
        code={`from mcp.server.fastmcp import FastMCP

mcp = FastMCP("servicenow")


@mcp.tool()
async def servicenow_whoami(ctx) -> dict:
    """Return the current ServiceNow user."""
    client = await _get_client(ctx)
    return await client.get("/api/now/table/sys_user?sysparm_query=user_name=javascript:gs.getUserName()")


@mcp.tool()
async def servicenow_search_incidents(ctx, query: str, limit: int = 10) -> list:
    """Search incidents using an encoded query string."""
    client = await _get_client(ctx)
    resp = await client.get(
        "/api/now/table/incident",
        params={"sysparm_query": query, "sysparm_limit": limit},
    )
    return trim_response(resp["result"])`}
      />
      <CodeBlock
        language="json"
        filename="demo/plugins/servicenow/ai-plugin.json (auth section)"
        code={`{
  "runtimes": [{
    "type": "OpenApi",
    "auth": {
      "type": "OAuthPluginVault",
      "reference_id": "servicenow-oauth"
    },
    "spec": {
      "url": "https://YOUR_SERVER/mcp"
    }
  }]
}`}
      />
      <Callout variant="security" title="ServiceNow OAuth setup">
        Create an OAuth Application in ServiceNow (System OAuth &gt; Application
        Registry). Grant Type: Authorization Code. Set the redirect URI to the
        Copilot redirect. Use the <Code>useraccount</Code> scope so tokens are
        per-user, not admin-level.
      </Callout>

      {/* ─── Jira Cloud ─────────────────────────────────────── */}
      <h2 id="jira">Jira Cloud</h2>
      <p>
        The Jira Cloud connector uses Atlassian OAuth 2.0 (3LO) for per-user
        delegated access. It exposes six tools and ships with a &ldquo;Sprint
        standup prep&rdquo; skill that gathers open issues and drafts a standup
        summary.
      </p>
      <Table
        headers={["Tool", "Purpose"]}
        rows={[
          [<Code key="t1">jira_whoami</Code>, "Return the signed-in Jira user"],
          [<Code key="t2">jira_search</Code>, "Search issues with JQL"],
          [<Code key="t3">jira_get_issue</Code>, "Fetch a single trimmed issue"],
          [<Code key="t4">jira_create_issue</Code>, "Create a new issue"],
          [<Code key="t5">jira_add_comment</Code>, "Add a comment to an issue"],
          [<Code key="t6">jira_transition_issue</Code>, "Apply a workflow transition"],
        ]}
      />
      <CodeBlock
        language="python"
        filename="demo/src/cowork_mcp/connectors/jira.py (excerpt)"
        code={`from mcp.server.fastmcp import FastMCP

mcp = FastMCP("jira")


@mcp.tool()
async def jira_whoami(ctx) -> dict:
    """Return the signed-in Jira user."""
    client = await _get_client(ctx)
    return await client.get("/rest/api/3/myself")


@mcp.tool()
async def jira_search(ctx, jql: str, max_results: int = 20) -> list:
    """Search Jira issues with JQL and return trimmed results."""
    client = await _get_client(ctx)
    resp = await client.get(
        "/rest/api/3/search",
        params={"jql": jql, "maxResults": max_results, "fields": "summary,status,assignee"},
    )
    return trim_response(resp["issues"])`}
      />
      <CodeBlock
        language="json"
        filename="demo/plugins/jira/ai-plugin.json (auth section)"
        code={`{
  "runtimes": [{
    "type": "OpenApi",
    "auth": {
      "type": "OAuthPluginVault",
      "reference_id": "jira-oauth"
    },
    "spec": {
      "url": "https://YOUR_SERVER/mcp"
    }
  }]
}`}
      />
      <Callout variant="security" title="Atlassian OAuth 2.0 (3LO) scopes">
        Register your app at developer.atlassian.com. Required scopes:{" "}
        <Code>read:jira-work</Code>, <Code>read:jira-user</Code>,{" "}
        <Code>write:jira-work</Code>, <Code>offline_access</Code>. The redirect
        URI must be the Copilot redirect for production and the VS Code redirect
        for dev.
      </Callout>

      {/* ─── Reuse ─────────────────────────────────────── */}
      <h2 id="reuse">Reusing the pattern</h2>
      <p>
        To add a fourth system (GitHub, Zendesk, SAP, etc.), copy any connector
        folder and adapt:
      </p>
      <ol>
        <li key="r1">Create <Code>demo/src/cowork_mcp/connectors/new_system.py</Code> with the tools.</li>
        <li key="r2">Create <Code>demo/plugins/new_system/</Code> with manifest, agent, and action files.</li>
        <li key="r3">Write a <Code>SKILL.md</Code> that orchestrates the tools into a workflow.</li>
        <li key="r4">Configure OAuth in the upstream system with the Copilot redirect URI.</li>
        <li key="r5">Register the connector in <Code>server.py</Code> and run the smoke tests.</li>
      </ol>
      <CardGrid cols={3}>
        <Card title="Same structure" icon="📁">
          Every connector has the same file layout — predictable for reviewers
          and CI.
        </Card>
        <Card title="Same auth model" icon="🔐">
          Delegated OAuth 2.1 with per-user tokens — no service accounts.
        </Card>
        <Card title="Same trimming" icon="✂️">
          All connectors share <Code>trim.py</Code> for payload budgeting.
        </Card>
      </CardGrid>
      <VideoCard
        verified={false}
        concept="Building an MCP server with FastMCP for multiple enterprise connectors"
        searchQuery="FastMCP Python MCP server tutorial enterprise connectors (Microsoft OR Anthropic)"
        why="Seeing the multi-connector server pattern built live reinforces the reusable structure."
      />
    </ChapterShell>
  );
}
