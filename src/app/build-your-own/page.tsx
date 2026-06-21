import { ChapterShell } from "@/components/ChapterShell";
import { Callout } from "@/components/Callout";
import { CodeBlock } from "@/components/CodeBlock";
import { ConceptCheck } from "@/components/ConceptCheck";
import { Table, Code, Compare } from "@/components/content";
import { MiniProject } from "@/components/Lab";

export const metadata = { title: "Build Your Own MCP Server" };

export default function Page() {
  return (
    <ChapterShell
      slug="build-your-own"
      eyebrow="Chapter 7 · Build"
      title="Build Your Own MCP Server"
      intro="The repeatable 15-step method distilled from the reference implementation. Use it to design tools, choose an auth model, add trimming and tests, and ship a connector — for Jira or any other system."
      learningGoals={[
        "Define the user and system boundary before writing code",
        "Choose a safe authentication model and design narrow tools",
        "Scaffold a Python MCP project with the right dependencies",
        "Plan trimming, tests, the connector, container, and deployment",
      ]}
      toc={[
        { id: "boundary", label: "1. Define the boundary" },
        { id: "auth", label: "2. Pick the auth model" },
        { id: "tools", label: "3. Design tools" },
        { id: "scaffold", label: "4–6. Scaffold & configure" },
        { id: "internals", label: "7–11. Internals & tests" },
        { id: "ship", label: "12–15. Connector, container, deploy, operate" },
      ]}
      summary={
        <ul>
          <li>
            Start from the boundary (who is the user, what system, user or app
            identity) and let it drive every later decision.
          </li>
          <li>
            Prefer delegated identity; design small, clear, capped tools; return
            trimmed models.
          </li>
          <li>
            Keep the FastMCP structure, request-scoped token, middleware, APIM,
            Key Vault, trimming, tests, connector, and Dockerfile patterns.
          </li>
        </ul>
      }
      reviewItems={[
        { id: "boundary", label: "I can fill in the boundary questions for my system" },
        { id: "auth", label: "I chose delegated identity (or justified an exception)" },
        { id: "tools", label: "My tools are small, clear, and capped" },
        { id: "trim", label: "I defined the smallest useful response" },
        { id: "tests", label: "I planned unit and integration tests" },
      ]}
    >
      <h2 id="boundary">Step 1 — Define the user and system boundary</h2>
      <p>Answer these before writing any code:</p>
      <Table
        headers={["Question", "Example answer for Jira"]}
        rows={[
          ["Who is the user?", "A Copilot Studio user signed into Atlassian."],
          ["What system is called?", "Jira Cloud."],
          ["Does the call run as user or app?", "User."],
          ["Where are tokens stored?", "Power Platform connector, not the MCP server."],
          ["What endpoint does the agent call?", "/mcp."],
          ["What gateway fronts the server?", "Azure API Management."],
        ]}
      />

      <h2 id="auth">Step 2 — Pick the authentication model</h2>
      <p>For enterprise user data, prefer delegated identity.</p>
      <Compare
        betterLabel="Prefer"
        worseLabel="Avoid"
        rows={[
          { better: "Delegated per-user OAuth tokens", worse: "Service accounts" },
          { better: "Tokens held by the connector", worse: "Shared API keys" },
          { better: "Request-scoped, never stored", worse: "Hardcoded tokens" },
          { better: "Refresh handled by the platform", worse: "Refresh tokens stored in your server" },
        ]}
      />
      <Callout variant="security">
        Use service credentials only when the system truly has no
        user-delegated model <em>and</em> the data is not user-permissioned.
        Treat that as the rare exception, not the default.
      </Callout>

      <h2 id="tools">Step 3 — Design tools</h2>
      <Compare
        betterLabel="Good tools are…"
        worseLabel="Bad tools are…"
        rows={[
          { better: "Small and clear", worse: "Vague or multi-purpose" },
          { better: "Permission-safe and predictable", worse: "Raw query passthroughs without guardrails" },
          { better: "Documented by their docstring", worse: "Unlimited search operations" },
          { better: "Compact in response size", worse: "Returning entire upstream payloads" },
        ]}
      />
      <Table
        headers={["Better", "Worse"]}
        rows={[
          [<Code key="1">jira_get_issue(issue_key)</Code>, <Code key="1b">jira_api(method, path, body)</Code>],
          [<Code key="2">jira_search(jql, max_results, next_page_token)</Code>, <Code key="2b">run_any_jql_without_limits(query)</Code>],
          [<Code key="3">jira_add_comment(issue_key, body)</Code>, <Code key="3b">modify_issue_arbitrarily(payload)</Code>],
        ]}
      />

      <h2 id="scaffold">Steps 4–6 — Scaffold, dependencies, configuration</h2>
      <p>Minimum Python project shape:</p>
      <CodeBlock
        language="text"
        noCopy
        code={`my-mcp-server
|-- app
|   |-- __init__.py
|   |-- server.py
|   |-- config.py
|   |-- middleware.py
|   |-- context.py
|   |-- errors.py
|   |-- tools/__init__.py
|-- tests
|-- pyproject.toml
|-- Dockerfile
|-- README.md`}
      />
      <p>The reference dependency set:</p>
      <CodeBlock
        language="text"
        filename="dependencies"
        code={`mcp>=1.2.0
starlette>=0.37.0
uvicorn[standard]>=0.30.0
httpx>=0.27.0
pydantic>=2.7.0
pydantic-settings>=2.3.0`}
      />
      <Callout variant="warning" title="Configuration hygiene">
        Keep configuration outside code. Use <Code>.env.example</Code> for
        placeholders, <strong>never real secrets</strong>. Categories: host/port,
        allowed origins, gateway secret, upstream base URL, payload limits, and
        telemetry.
      </Callout>

      <h2 id="internals">Steps 7–11 — Middleware, client, trimming, tools, tests</h2>
      <ul>
        <li>
          <strong>Middleware:</strong> origin checks, bearer extraction, gateway
          integrity, request-scoped token binding, cleanup in{" "}
          <Code>finally</Code>.
        </li>
        <li>
          <strong>Upstream client:</strong> build URLs from settings, attach the
          delegated token, set timeouts, retry only transient failures, convert
          errors safely, return trimmed models.
        </li>
        <li>
          <strong>Trimming:</strong> limit fields, cap page size, use cursor
          paging, enforce a byte budget, note omitted results.
        </li>
        <li>
          <strong>Tools:</strong> typed arguments, clear docstring, use the
          client, return a dict or model, covered by tests.
        </li>
        <li>
          <strong>Tests:</strong> start with unit tests (token extraction, origin
          allow-list, missing token, trimming, paging), then integration tests
          (initialize, tools/list, a real call, auth failure, gateway failure,
          upstream 401/403/429/5xx).
        </li>
      </ul>

      <h2 id="ship">Steps 12–15 — Connector, container, deploy, operate</h2>
      <p>
        For Copilot Studio MCP, expose a single <Code>/mcp</Code> POST operation
        and include the agentic-protocol extension:
      </p>
      <CodeBlock
        language="json"
        code={`"x-ms-agentic-protocol": "mcp-streamable-1.0"`}
      />
      <Table
        headers={["Connector field", "Value"]}
        rows={[
          ["host", "APIM host, e.g. example-apim.azure-api.net"],
          ["basePath", "/jira-mcp"],
          ["paths", "/mcp"],
          ["OAuth provider", "Generic OAuth 2"],
          ["Authorization URL", "https://auth.atlassian.com/authorize?audience=api.atlassian.com&prompt=consent"],
          ["Token URL", "https://auth.atlassian.com/oauth/token"],
        ]}
      />
      <p>
        Then containerize (multi-stage slim image, non-root user, health check,{" "}
        <Code>python -m app.server</Code>), deploy behind APIM, and operate with
        logs, health and readiness probes, autoscale, and secret rotation.
        Details are in <a href="/deployment/">Deployment</a> and{" "}
        <a href="/security/">Security</a>.
      </p>

      <MiniProject title="Port the scaffold to a new tool">
        <p>
          Without writing production code yet, design a new read tool for a
          system you know (e.g. ServiceNow incidents or GitHub issues). Write
          down: the tool name and typed arguments, the smallest useful response
          model, the page-size cap, and one unit test you would add. Compare your
          design against the &ldquo;good tools&rdquo; checklist above.
        </p>
      </MiniProject>

      <ConceptCheck
        question={
          <p>
            Your upstream system <em>does</em> support per-user OAuth, but a
            colleague wants to use one service account &ldquo;to keep it
            simple.&rdquo; Which step of this method addresses that, and what is
            the correct call?
          </p>
        }
        answer={
          <p>
            Step 2 (pick the authentication model). Because the system supports a
            user-delegated model and the data is user-permissioned, the correct
            choice is delegated identity. A service account would over-grant
            access and bypass per-user permissions — reserve service credentials
            for systems with no delegated model and non-user data.
          </p>
        }
      />
    </ChapterShell>
  );
}
