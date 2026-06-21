import { ChapterShell } from "@/components/ChapterShell";
import { Callout } from "@/components/Callout";
import { CodeBlock } from "@/components/CodeBlock";
import { Mermaid } from "@/components/Mermaid";
import { ConceptCheck } from "@/components/ConceptCheck";
import { Table, Code } from "@/components/content";

export const metadata = { title: "Testing Strategy" };

const SMOKE = `flowchart TD
    A[Deploy app] --> B[GET /healthz on app]
    B --> C[POST /mcp without bearer through APIM]
    C --> D{401?}
    D -- No --> X[Fail]
    D -- Yes --> E[POST initialize with bearer]
    E --> F{200?}
    F -- No --> X
    F -- Yes --> G[POST tools/list]
    G --> H{Jira tools present?}
    H -- No --> X
    H -- Yes --> I[Call jira_whoami]
    I --> J[Call jira_search with safe JQL]
    J --> K([Pass])`;

export default function Page() {
  return (
    <ChapterShell
      slug="testing"
      eyebrow="Chapter 11 · Operate"
      title="Testing Strategy"
      intro="Test the failure paths as carefully as the success paths. The reference build ships solid unit tests; here's what exists, what to add before production, and the smoke sequence to run after every deploy."
      learningGoals={[
        "Know which unit tests already exist and what they cover",
        "Plan the integration tests to add before production",
        "Run the deploy-time smoke sequence and read its decision points",
        "Run the full local and remote validation commands safely",
      ]}
      toc={[
        { id: "existing", label: "Existing tests" },
        { id: "to-add", label: "Tests to add" },
        { id: "smoke-sequence", label: "Smoke sequence" },
        { id: "commands", label: "Commands" },
      ]}
      summary={
        <ul>
          <li>
            Existing unit tests cover auth, middleware, and trimming with a
            deterministic environment.
          </li>
          <li>
            Add MCP protocol, gateway integrity, OAuth, Jira error, multi-site,
            connector schema, and payload-stress tests.
          </li>
          <li>
            The smoke sequence verifies the deployed path end-to-end, including
            the deliberate 401.
          </li>
        </ul>
      }
      reviewItems={[
        { id: "existing", label: "I reviewed what the existing tests cover" },
        { id: "add", label: "I have a list of integration tests to add" },
        { id: "smoke", label: "I can run the deploy-time smoke sequence" },
        { id: "secrets", label: "I never commit real tokens" },
      ]}
    >
      <h2 id="existing">Existing tests in the reference build</h2>
      <Table
        headers={["File", "Coverage"]}
        rows={[
          [<Code key="1">tests/test_auth.py</Code>, "Token hashing, cache expiry, Jira resource selection."],
          [<Code key="2">tests/test_middleware.py</Code>, "Bearer extraction, origin checks, missing-token behavior."],
          [<Code key="3">tests/test_trim.py</Code>, "Issue trimming, clipping, max-result clamp, byte-budget overflow, ADF shape."],
          [<Code key="4">tests/conftest.py</Code>, "Deterministic test environment and token-context reset."],
        ]}
      />

      <h2 id="to-add">Tests to add before production</h2>
      <Table
        headers={["Category", "Tests"]}
        rows={[
          ["MCP protocol", "initialize, tools/list, tools/call."],
          ["Gateway integrity", "missing, wrong, and correct X-Gateway-Token."],
          ["OAuth behavior", "missing, malformed, expired token; insufficient scopes."],
          ["Jira errors", "401, 403, 404, 429, 5xx."],
          ["Multi-site users", "pinned cloud id, pinned site URL, no matching site."],
          ["Connector schema", "validates the MCP extension and OAuth scopes."],
          ["Payload stress", "huge custom fields, long summaries, many issues."],
          ["Deployment smoke", "APIM endpoint responds and rejects direct app bypass."],
        ]}
      />
      <Callout variant="why">
        Auth failures are where security bugs hide. A test that asserts a{" "}
        <em>wrong</em> gateway token is rejected is just as important as one that
        asserts the right one is accepted.
      </Callout>

      <h2 id="smoke-sequence">Suggested smoke sequence</h2>
      <Mermaid
        chart={SMOKE}
        alt="A deployment smoke flowchart. Deploy the app, then GET /healthz on the app. POST /mcp without a bearer through API Management; if it does not return 401, fail. If it returns 401, POST initialize with a bearer; if not 200, fail. If 200, POST tools/list; if Jira tools are not present, fail. If present, call jira_whoami, then jira_search with safe JQL, and pass."
        caption="Run this after every deploy. Each diamond is a go/no-go gate."
      />

      <h2 id="commands">Commands</h2>
      <p>Local validation:</p>
      <CodeBlock
        language="powershell"
        code={`ruff check .
python -m compileall app
pytest -q
python scripts\\smoke.py`}
      />
      <p>Remote smoke against a deployed APIM endpoint:</p>
      <CodeBlock
        language="powershell"
        code={`$env:BASE = "https://<apim-host>/jira-mcp"
$env:TOKEN = "<short-lived-atlassian-access-token>"
python scripts\\smoke.py`}
      />
      <Callout variant="security" title="Never commit or paste real tokens">
        Tokens belong in transient environment variables only. Do not put them in
        files, commit messages, or screenshots. Treat a leaked token as a
        credential incident.
      </Callout>

      <ConceptCheck
        question={
          <p>
            Your remote smoke run reaches <Code>tools/list</Code> but no Jira
            tools appear, even though the server is healthy. Where do you look
            first?
          </p>
        }
        answer={
          <p>
            The connector / MCP wiring, not the Jira client. If the server is
            healthy and <Code>initialize</Code> works but no tools are listed,
            suspect the connector being treated as REST (missing{" "}
            <Code>x-ms-agentic-protocol</Code>) or tools not registered. The
            connector-schema test exists to catch exactly this before deploy.
          </p>
        }
      />
    </ChapterShell>
  );
}
