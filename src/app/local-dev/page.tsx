import { ChapterShell } from "@/components/ChapterShell";
import { Callout } from "@/components/Callout";
import { CodeBlock } from "@/components/CodeBlock";
import { ConceptCheck } from "@/components/ConceptCheck";
import { Table, Code, ExpectedOutput } from "@/components/content";
import { Lab } from "@/components/Lab";

export const metadata = { title: "Local Development Workflow" };

export default function Page() {
  return (
    <ChapterShell
      slug="local-dev"
      eyebrow="Chapter 6 · Build"
      title="Local Development Workflow"
      intro="Your day-to-day loop: start the server, check health, run the smoke test, explore with MCP Inspector, and run tests and lint before you commit."
      learningGoals={[
        "Start and validate the server locally",
        "Interpret smoke-test results, including the deliberate 401",
        "Use MCP Inspector to discover tools over Streamable HTTP",
        "Run unit tests and the linter",
      ]}
      toc={[
        { id: "start", label: "Start the server" },
        { id: "health", label: "Validate health" },
        { id: "smoke", label: "Run the smoke test" },
        { id: "inspector", label: "Use MCP Inspector" },
        { id: "tests", label: "Tests and lint" },
      ]}
      summary={
        <ul>
          <li>
            <Code>run_local.ps1</Code> starts the server on port 8080.
          </li>
          <li>
            <Code>/healthz</Code> and <Code>/readyz</Code> confirm liveness and
            readiness.
          </li>
          <li>The smoke test verifies the essentials without a real token.</li>
          <li>
            <Code>pytest -q</Code> and <Code>ruff check .</Code> keep the code
            healthy.
          </li>
        </ul>
      }
      reviewItems={[
        { id: "start", label: "I can start the server and read its startup line" },
        { id: "health", label: "I validated /healthz and /readyz" },
        { id: "smoke", label: "I ran the smoke test and understand the 401" },
        { id: "inspector", label: "I connected MCP Inspector to /mcp" },
        { id: "tests", label: "I ran pytest and ruff" },
      ]}
    >
      <h2 id="start">Start the server</h2>
      <CodeBlock language="powershell" code={`.\\scripts\\run_local.ps1`} />
      <ExpectedOutput>{`Starting MCP server on http://localhost:8080/mcp ...`}</ExpectedOutput>

      <h2 id="health">Validate health</h2>
      <p>In another terminal:</p>
      <CodeBlock
        language="powershell"
        code={`Invoke-RestMethod http://localhost:8080/healthz
Invoke-RestMethod http://localhost:8080/readyz`}
      />
      <p>Expected shapes:</p>
      <CodeBlock
        language="json"
        noCopy
        code={`{ "status": "ok", "version": "1.0.0" }

{ "status": "ready", "server": "microsoft-scout-jira-mcp" }`}
      />

      <h2 id="smoke">Run the smoke test</h2>
      <CodeBlock language="powershell" code={`python scripts\\smoke.py`} />
      <Table
        headers={["Step", "What it confirms"]}
        rows={[
          [<Code key="1">/healthz</Code>, "Returns 200 locally."],
          [
            <Code key="2">/mcp</Code>,
            "Without a bearer, returns 401 (correctly rejects anonymous calls).",
          ],
          ["MCP initialize", "Returns 200 with a placeholder bearer."],
          ["tools/list", "Checked only when a real token is supplied."],
        ]}
      />
      <Callout variant="success" title="The 401 is expected">
        A <Code>401</Code> on anonymous <Code>/mcp</Code> is a pass — it proves
        the server refuses unauthenticated tool calls.
      </Callout>

      <h2 id="inspector">Use MCP Inspector</h2>
      <CodeBlock
        language="powershell"
        code={`npx @modelcontextprotocol/inspector`}
      />
      <Table
        headers={["Setting", "Value"]}
        rows={[
          ["Transport", "Streamable HTTP"],
          ["URL", <Code key="u">http://localhost:8080/mcp</Code>],
        ]}
      />
      <Callout variant="note">
        Tool calls that hit Jira need a real Atlassian OAuth access token. The
        Inspector is still useful for verifying MCP transport and tool discovery
        behavior even without one.
      </Callout>

      <h2 id="tests">Tests and lint</h2>
      <CodeBlock
        language="powershell"
        code={`pytest -q
ruff check .`}
      />
      <Callout variant="tip">
        Run these before every commit. They&apos;re the same checks CI runs, so
        catching issues locally saves a failed pipeline later (see{" "}
        <a href="/cicd/">CI/CD</a>).
      </Callout>

      <Lab title="Your first full local loop" time="15 minutes" goal="Run the complete develop-and-verify cycle once, end to end.">
        <ol className="list-decimal space-y-1 pl-5">
          <li>Start the server with the helper script.</li>
          <li>
            Validate <Code>/healthz</Code> and <Code>/readyz</Code> in a second
            terminal.
          </li>
          <li>
            Run <Code>python scripts\\smoke.py</Code> and confirm the 401 step
            passes.
          </li>
          <li>Open MCP Inspector and connect to the local endpoint.</li>
          <li>
            Stop the server, then run <Code>pytest -q</Code> and{" "}
            <Code>ruff check .</Code>.
          </li>
        </ol>
      </Lab>

      <ConceptCheck
        question={
          <p>
            The smoke test passes locally, but you want to verify a real{" "}
            <Code>tools/list</Code>. What do you need, and where does it come
            from?
          </p>
        }
        answer={
          <p>
            You need a real, short-lived Atlassian OAuth access token. It comes
            from a Copilot Studio connection (the connector&apos;s OAuth flow) or
            a manual OAuth exchange for testing. Supply it to the smoke script as
            described in <a href="/testing/">Testing</a> — and never commit it.
          </p>
        }
      />
    </ChapterShell>
  );
}
