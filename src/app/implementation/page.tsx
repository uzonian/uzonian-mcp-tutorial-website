import { ChapterShell } from "@/components/ChapterShell";
import { Callout } from "@/components/Callout";
import { CodeBlock } from "@/components/CodeBlock";
import { ConceptCheck } from "@/components/ConceptCheck";
import { Mermaid } from "@/components/Mermaid";
import { Table, Code } from "@/components/content";
import { WhatThisFileDoes } from "@/components/WhatThisFileDoes";

export const metadata = { title: "Implementation Walkthrough" };

const MIDDLEWARE = `flowchart TD
    A[HTTP request] --> B{Is HTTP?}
    B -- No --> Z[Pass through]
    B -- Yes --> C{Origin allowed?}
    C -- No --> C1[403 Origin not allowed]
    C -- Yes --> D{Path starts with /mcp?}
    D -- No --> E[Bind token if present, continue]
    D -- Yes --> F{Gateway secret configured?}
    F -- Yes --> G{X-Gateway-Token matches?}
    G -- No --> G1[403 Not trusted gateway]
    G -- Yes --> H{Bearer token present?}
    F -- No --> H
    H -- No --> H1[401 Missing bearer]
    H -- Yes --> I[Set ContextVar]
    I --> J[Call FastMCP app]
    J --> K[Reset ContextVar]`;

export default function Page() {
  return (
    <ChapterShell
      slug="implementation"
      eyebrow="Chapter 5 · Build"
      title="Implementation Walkthrough"
      intro="We follow a request through the code in the exact order it travels: entry point, configuration, request-scoped token, middleware, auth, Jira client, trimming, tools, errors, and telemetry."
      learningGoals={[
        "Trace how server.py builds and mounts the FastMCP app",
        "Explain why the user token lives in a ContextVar, not a global",
        "Read the middleware security flow and its failure responses",
        "Describe how the Jira client and trimmer keep responses safe and small",
      ]}
      toc={[
        { id: "server", label: "Server entry point" },
        { id: "config", label: "Configuration" },
        { id: "context", label: "Request-scoped token" },
        { id: "middleware", label: "Middleware" },
        { id: "bearer", label: "Bearer & site resolution" },
        { id: "jira-client", label: "Jira client" },
        { id: "search", label: "Modern JQL search" },
        { id: "trimming", label: "Payload trimming" },
        { id: "tools", label: "Tool registration" },
        { id: "errors", label: "Error envelope" },
        { id: "telemetry", label: "Telemetry & redaction" },
      ]}
      summary={
        <ul>
          <li>
            <Code>server.py</Code> builds the FastMCP app, registers tools,
            mounts it at <Code>/</Code> (so MCP is at <Code>/mcp</Code>), and
            adds health endpoints.
          </li>
          <li>
            The token lives in a <Code>ContextVar</Code> so concurrent users
            never overlap; middleware sets and resets it.
          </li>
          <li>
            The Jira client retries transient failures and returns trimmed
            models; the trimmer enforces a byte budget.
          </li>
          <li>The error envelope and redacting logger keep failures safe.</li>
        </ul>
      }
      reviewItems={[
        { id: "mount", label: "I know why /mcp is the endpoint" },
        { id: "ctx", label: "I can explain the ContextVar choice" },
        { id: "mw", label: "I can read the middleware flow and its 401/403 paths" },
        { id: "trim", label: "I understand the byte-budget trimming strategy" },
        { id: "redact", label: "I know what telemetry must never log" },
      ]}
    >
      <h2 id="server">Server entry point</h2>
      <WhatThisFileDoes
        path="app/server.py"
        does={
          <p>
            Configures logging and telemetry, creates the FastMCP server,
            registers tools, mounts MCP into a Starlette app, adds health
            endpoints and middleware, and starts Uvicorn when run as a module.
          </p>
        }
        edit={
          <p>
            Add new health metadata or register new tool modules as your server
            grows.
          </p>
        }
        dontEdit={
          <p>
            The mount path and FastMCP construction — changing them can break the{" "}
            <Code>/mcp</Code> endpoint and gateway behavior.
          </p>
        }
      />
      <CodeBlock
        language="python"
        code={`mcp = FastMCP(settings.server_name, stateless_http=True, json_response=True)
register_tools(mcp)

# Mounted at "/", so the MCP endpoint is available at /mcp
Mount("/", app=mcp.streamable_http_app())`}
      />
      <Table
        headers={["Endpoint", "Purpose"]}
        rows={[
          [<Code key="1">/healthz</Code>, "Liveness probe — the process is alive."],
          [<Code key="2">/readyz</Code>, "Readiness probe — ready to receive traffic."],
          [<Code key="3">/mcp</Code>, "The MCP endpoint agents call."],
        ]}
      />

      <h2 id="config">Configuration</h2>
      <WhatThisFileDoes
        path="app/config.py"
        does={
          <p>
            A <Code>Settings</Code> class reads runtime configuration from
            environment variables and <Code>.env</Code> via{" "}
            <Code>pydantic-settings</Code>. Safe defaults let the app start
            locally; production secrets are injected by Azure.
          </p>
        }
        edit={
          <p>
            Tune limits like <Code>MAX_RESPONSE_BYTES</Code> or{" "}
            <Code>DEFAULT_MAX_RESULTS</Code> for your environment.
          </p>
        }
        dontEdit={
          <p>
            Don&apos;t hard-code secrets here. Secrets come from the environment
            or Key Vault references, never the source.
          </p>
        }
      />
      <Table
        headers={["Setting", "Default", "Purpose"]}
        rows={[
          [<Code key="1">GATEWAY_SHARED_SECRET</Code>, "empty", "Enables the APIM gateway integrity check when set."],
          [<Code key="2">ALLOWED_ORIGINS</Code>, "Copilot Studio / Power Platform", "Browser origin allow-list."],
          [<Code key="3">DEFAULT_MAX_RESULTS</Code>, "25", "Default Jira search page size."],
          [<Code key="4">MAX_RESULTS_CAP</Code>, "50", "Maximum page size accepted from callers."],
          [<Code key="5">MAX_RESPONSE_BYTES</Code>, "90000", "Response budget after trimming."],
          [<Code key="6">MAX_TEXT_CHARS</Code>, "2000", "Long-text clipping limit."],
        ]}
      />

      <h2 id="context">Request-scoped token storage</h2>
      <WhatThisFileDoes
        path="app/context.py"
        does={
          <p>
            Holds the current user&apos;s bearer token while a tool runs — using
            a <Code>ContextVar</Code> so concurrent requests from different users
            never overlap.
          </p>
        }
      />
      <CodeBlock
        language="python"
        code={`_user_token: ContextVar[str | None] = ContextVar("user_token", default=None)`}
      />
      <Callout variant="why" title="Why not a normal global variable?">
        A normal global is shared across all requests. Under concurrency, User
        A&apos;s token could leak into User B&apos;s request — a serious
        cross-user data risk. A <Code>ContextVar</Code> gives each async request
        its own isolated value. The middleware resets it in a{" "}
        <Code>finally</Code> block so the token never persists after the request.
      </Callout>

      <h2 id="middleware">Middleware</h2>
      <WhatThisFileDoes
        path="app/middleware.py"
        does={
          <p>
            Runs before the MCP server handles a request. For protected{" "}
            <Code>/mcp</Code> routes it checks the origin, optionally verifies
            the gateway token, requires a bearer token, binds it to the request
            context, and resets it afterward.
          </p>
        }
        dontEdit={
          <p>
            The order of these checks is security-critical. Read the{" "}
            <a href="/security/">Security</a> chapter before changing anything
            here.
          </p>
        }
      />
      <Mermaid
        chart={MIDDLEWARE}
        alt="Middleware decision flow. If the request isn't HTTP, pass through. If the origin isn't allowed, return 403. If the path doesn't start with /mcp, bind the token if present and continue. If it does start with /mcp: when a gateway secret is configured, the X-Gateway-Token must match or return 403; then a bearer token must be present or return 401. When present, set the ContextVar, call the FastMCP app, and reset the ContextVar afterward."
        caption="Every protected /mcp request passes these gates in order."
      />
      <Callout variant="note">
        The middleware allows requests with no <Code>Origin</Code> header — handy
        for server-to-server and local test calls — while still enforcing the
        bearer token and (when configured) the gateway secret.
      </Callout>

      <h2 id="bearer">Bearer token & Jira site resolution</h2>
      <WhatThisFileDoes
        path="app/auth/bearer.py"
        does={
          <p>
            Requires a delegated bearer token, then calls Atlassian&apos;s
            accessible-resources endpoint to find the user&apos;s Jira site
            (its <Code>cloudId</Code>). Caches the result keyed by a SHA-256 hash
            of the token — never the raw token.
          </p>
        }
      />
      <CodeBlock
        language="text"
        noCopy
        code={`Jira Cloud API URL shape:
https://api.atlassian.com/ex/jira/{cloudId}/rest/api/3

Site discovery call:
https://api.atlassian.com/oauth/token/accessible-resources`}
      />
      <p>Site selection rules, in order:</p>
      <ol>
        <li>
          If <Code>JIRA_CLOUD_ID</Code> is configured, use it.
        </li>
        <li>
          Else if <Code>JIRA_SITE_URL</Code> is configured, find the matching
          resource.
        </li>
        <li>Else prefer a resource with Jira scopes.</li>
        <li>Else use the first accessible resource.</li>
      </ol>

      <h2 id="jira-client">Jira client</h2>
      <WhatThisFileDoes
        path="app/jira/client.py"
        does={
          <p>
            An async wrapper around Jira Cloud REST calls. It requires the
            current user token, resolves the site, builds URLs, sends the
            user&apos;s bearer token to Jira, retries transient failures (HTTP
            429, 5xx, network) up to three times, and converts auth failures into
            safe errors.
          </p>
        }
      />
      <Table
        headers={["Client method", "Jira operation"]}
        rows={[
          [<Code key="1">whoami()</Code>, <Code key="1b">GET /myself</Code>],
          [<Code key="2">search_issues()</Code>, <Code key="2b">POST /search/jql</Code>],
          [<Code key="3">get_issue()</Code>, <Code key="3b">GET /issue/&#123;key&#125;</Code>],
          [<Code key="4">create_issue()</Code>, <Code key="4b">POST /issue</Code>],
          [<Code key="5">add_comment()</Code>, <Code key="5b">POST /issue/&#123;key&#125;/comment</Code>],
          [<Code key="6">transition_issue()</Code>, <Code key="6b">POST /issue/&#123;key&#125;/transitions</Code>],
        ]}
      />

      <h2 id="search">Modern JQL search</h2>
      <p>
        The implementation uses token-based paging, which Atlassian is moving
        toward, instead of legacy offset paging:
      </p>
      <CodeBlock
        language="json"
        code={`{
  "jql": "...",
  "maxResults": 25,
  "fields": ["summary", "status", "assignee"],
  "nextPageToken": "optional"
}`}
      />
      <Callout variant="beginner">
        Don&apos;t calculate offsets. To get the next page, pass the returned{" "}
        <Code>nextPageToken</Code> into the next <Code>jira_search</Code> call.
        The response&apos;s <Code>isLast</Code> tells you when to stop.
      </Callout>

      <h2 id="trimming">Payload trimming</h2>
      <WhatThisFileDoes
        path="app/jira/trim.py"
        does={
          <p>
            Protects the agent platform from oversized responses. It requests
            only <Code>summary</Code>, <Code>status</Code>, and{" "}
            <Code>assignee</Code> from Jira, converts issues into a compact
            model, and enforces a byte budget.
          </p>
        }
      />
      <p>Budget enforcement strategy:</p>
      <ol>
        <li>Serialize the result and check byte size.</li>
        <li>If it fits, return it.</li>
        <li>If not, clip summaries more aggressively.</li>
        <li>If still too big, drop trailing issues.</li>
        <li>Report how many issues were omitted.</li>
      </ol>
      <Callout variant="production">
        This is far safer than returning raw Jira JSON, which can break Copilot
        Studio with <Code>AsyncResponsePayloadTooLarge</Code>.
      </Callout>

      <h2 id="tools">Tool registration</h2>
      <p>
        Tools are registered in <Code>app/tools/__init__.py</Code> with the{" "}
        <Code>@mcp.tool()</Code> decorator. The function name becomes the tool
        name; the docstring becomes the description.
      </p>
      <CodeBlock
        language="python"
        code={`@mcp.tool()
@_guard
async def jira_get_issue(issue_key: str) -> dict:
    """Get one Jira issue by key, trimmed to id, key, status, summary, assignee, and URL."""
    async with JiraClient() as jira:
        return _dump(await jira.get_issue(issue_key))`}
      />

      <h2 id="errors">Error envelope</h2>
      <p>
        The <Code>_guard</Code> decorator turns exceptions into structured
        results so agents can handle them gracefully instead of seeing a broken
        transport:
      </p>
      <CodeBlock
        language="json"
        code={`{
  "error": "forbidden",
  "status": 403,
  "message": "Jira rejected the delegated token or the user lacks permission."
}`}
      />
      <Callout variant="warning">
        The guard includes a broad final catch only to avoid crashing the MCP
        transport on unexpected errors. Keep it <strong>logging-only</strong> —
        never use a broad catch to silently hide expected validation failures.
      </Callout>

      <h2 id="telemetry">Telemetry & redaction</h2>
      <WhatThisFileDoes
        path="app/telemetry.py"
        does={
          <p>
            Configures logging with a filter that masks bearer tokens,
            authorization headers, and gateway token headers. If{" "}
            <Code>APPLICATIONINSIGHTS_CONNECTION_STRING</Code> is set, it
            configures Azure Monitor export.
          </p>
        }
      />
      <Callout variant="security" title="Never log secrets">
        Never log raw user tokens, refresh tokens, API keys, or gateway secrets.
        The redacting filter exists precisely so an accidental{" "}
        <Code>log.info(headers)</Code> doesn&apos;t leak a credential into your
        telemetry.
      </Callout>

      <ConceptCheck
        question={
          <p>
            The middleware sets the token in a <Code>ContextVar</Code> and resets
            it in a <Code>finally</Code> block. What bug could appear if you
            forgot the reset?
          </p>
        }
        answer={
          <p>
            The token could linger in the context and be reused by a later
            request that should have been anonymous — or, worse, by a different
            user&apos;s request if the runtime reuses the context. Resetting in{" "}
            <Code>finally</Code> guarantees cleanup even when the tool raises an
            exception.
          </p>
        }
      />
    </ChapterShell>
  );
}
