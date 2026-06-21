import { ChapterShell } from "@/components/ChapterShell";
import { Callout } from "@/components/Callout";
import { CodeBlock } from "@/components/CodeBlock";
import { ConceptCheck } from "@/components/ConceptCheck";
import { Table, Code, ExpectedOutput } from "@/components/content";
import { Mermaid } from "@/components/Mermaid";

export const metadata = { title: "Quickstart: Your First Success" };

const SUCCESS_FLOW = `flowchart TD
    A[Install prerequisites] --> B[Open project in VS Code]
    B --> C[Create .venv]
    C --> D[Activate .venv]
    D --> E[Install dependencies]
    E --> F[Start the server]
    F --> G{/healthz returns ok?}
    G -- No --> T[See Troubleshooting]
    G -- Yes --> H[Run smoke test]
    H --> I{Smoke passes?}
    I -- No --> T
    I -- Yes --> J[Inspect /mcp endpoint]
    J --> K([First success!])`;

export default function Page() {
  return (
    <ChapterShell
      slug="quickstart"
      eyebrow="Get Started"
      title="Quickstart: Your First Success"
      intro="The fastest path to a running MCP server on your own machine. Follow each step in order. By the end, the server will answer a health check and pass the smoke test — your first concrete win."
      learningGoals={[
        "Install the prerequisites on Windows",
        "Open the reference project in VS Code",
        "Create and activate a Python virtual environment",
        "Install dependencies and start the server locally",
        "Run the smoke test and inspect the /mcp endpoint",
        "Recognise exactly what success looks like",
      ]}
      toc={[
        { id: "path", label: "The first-success path" },
        { id: "prereqs", label: "1. Install prerequisites" },
        { id: "open", label: "2. Open in VS Code" },
        { id: "venv", label: "3. Create & activate a venv" },
        { id: "deps", label: "4. Install dependencies" },
        { id: "run", label: "5. Start the server" },
        { id: "health", label: "6. Check health" },
        { id: "smoke", label: "7. Run the smoke test" },
        { id: "mcp-endpoint", label: "8. Inspect /mcp" },
        { id: "success", label: "What success looks like" },
      ]}
      summary={
        <ul>
          <li>
            A virtual environment keeps this project&apos;s packages separate
            from the rest of your system.
          </li>
          <li>
            <Code>run_local.ps1</Code> automates setup and starts the server on
            port 8080.
          </li>
          <li>
            <Code>/healthz</Code> and the smoke test prove the server is alive
            and that <Code>/mcp</Code> correctly rejects unauthenticated calls.
          </li>
          <li>
            Hitting Jira for real needs an Atlassian token — that comes later.
          </li>
        </ul>
      }
      reviewItems={[
        { id: "prereqs", label: "Prerequisites installed (Python, VS Code, Node, Git)" },
        { id: "venv", label: "Created and activated .venv" },
        { id: "run", label: "Server started on http://localhost:8080" },
        { id: "health", label: "/healthz returned status ok" },
        { id: "smoke", label: "Smoke test passed" },
        { id: "mcp", label: "Opened /mcp in MCP Inspector" },
      ]}
    >
      <h2 id="path">The first-success path</h2>
      <Mermaid
        chart={SUCCESS_FLOW}
        alt="A flowchart of the quickstart: install prerequisites, open the project in VS Code, create a virtual environment, activate it, install dependencies, start the server. If /healthz returns ok, run the smoke test; if it passes, inspect the /mcp endpoint to reach first success. Any failure points to the Troubleshooting chapter."
        caption="Your route to first success. Any failure step routes you to Troubleshooting."
      />

      <Callout variant="beginner" title="Where do I type these commands?">
        Every command on this page is <strong>Windows PowerShell</strong>. Open
        a PowerShell terminal inside VS Code with{" "}
        <Code>Terminal → New Terminal</Code>, or press{" "}
        <Code>Ctrl</Code> + <Code>` </Code> (backtick).
      </Callout>

      <h2 id="prereqs">1. Install prerequisites</h2>
      <p>
        Install these once. The{" "}
        <a href="/environment/">Development Environment</a> chapter explains each
        in detail; for now, just get them on your machine.
      </p>
      <Table
        headers={["Tool", "Why you need it"]}
        rows={[
          ["VS Code", "Editor and integrated terminal"],
          ["Python 3.11 or later", "Runs the MCP server"],
          ["Git", "Source control"],
          ["Node.js LTS", "Runs MCP Inspector via npx"],
          ["PowerShell 7 (or Windows PowerShell)", "Runs the project scripts"],
        ]}
      />
      <Callout variant="tip">
        Verify Python is installed by running <Code>python --version</Code>. You
        should see <Code>Python 3.11.x</Code> or higher.
      </Callout>

      <h2 id="open">2. Open the project in VS Code</h2>
      <p>Open the reference implementation folder. Always quote Windows paths that contain spaces:</p>
      <CodeBlock
        language="powershell"
        code={`cd "C:\\Users\\uacholonu\\OneDrive - Microsoft\\Documents\\DevZone\\CoworkDev\\Plugin Projects\\My MCP Builds\\Microsoft Scout Opus 4.8\\jira-mcp-copilot-studio"
code .`}
      />

      <h2 id="venv">3. Create and activate a virtual environment</h2>
      <p>
        A <strong>virtual environment</strong> (&ldquo;venv&rdquo;) is a private
        folder of Python packages for this project only. It stops this
        project&apos;s dependencies from clashing with anything else on your
        computer.
      </p>
      <CodeBlock
        language="powershell"
        code={`python -m venv .venv
.\\.venv\\Scripts\\Activate.ps1`}
      />
      <p>
        When activation works, your prompt is prefixed with{" "}
        <Code>(.venv)</Code>.
      </p>

      <Callout variant="warning" title="PowerShell blocks the activation script?">
        If you see an error about scripts being disabled, allow signed local
        scripts for your user, then open a new terminal and retry:
        <CodeBlock
          language="powershell"
          code={`Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`}
        />
      </Callout>

      <h2 id="deps">4. Install dependencies</h2>
      <CodeBlock
        language="powershell"
        code={`python -m pip install --upgrade pip
python -m pip install -e ".[dev]"`}
      />
      <p>
        The <Code>-e &quot;.[dev]&quot;</Code> part installs the project itself
        (in editable mode) plus its development tools like the test runner and
        linter.
      </p>

      <h2 id="run">5. Start the server</h2>
      <p>
        The included helper script does steps 3–5 for you if you skipped them:
        it creates <Code>.venv</Code> if missing, installs dependencies, copies{" "}
        <Code>.env.example</Code> to <Code>.env</Code>, and starts the server.
      </p>
      <CodeBlock language="powershell" code={`.\\scripts\\run_local.ps1`} />
      <ExpectedOutput>{`Starting MCP server on http://localhost:8080/mcp ...`}</ExpectedOutput>

      <h2 id="health">6. Check health</h2>
      <p>Leave the server running. Open a second terminal and ask it if it&apos;s alive:</p>
      <CodeBlock
        language="powershell"
        code={`Invoke-RestMethod http://localhost:8080/healthz
Invoke-RestMethod http://localhost:8080/readyz`}
      />
      <ExpectedOutput>{`status version
------ -------
ok     1.0.0

status server
------ ------
ready  microsoft-scout-jira-mcp`}</ExpectedOutput>
      <Callout variant="beginner">
        <Code>/healthz</Code> means &ldquo;the process is alive.&rdquo;{" "}
        <Code>/readyz</Code> means &ldquo;it&apos;s ready to take traffic.&rdquo;
        Cloud platforms use these two probes to decide whether to route requests
        to your server.
      </Callout>

      <h2 id="smoke">7. Run the smoke test</h2>
      <p>
        A <strong>smoke test</strong> is a tiny end-to-end check. This one
        confirms the essentials without needing a real Jira token.
      </p>
      <CodeBlock language="powershell" code={`python scripts\\smoke.py`} />
      <Table
        headers={["The smoke test checks…", "Expected result"]}
        rows={[
          [<Code key="1">/healthz</Code>, "Returns 200 locally"],
          [
            <Code key="2">/mcp</Code>,
            <span key="2b">
              Without a bearer token, returns <strong>401</strong> (good — it
              refuses anonymous calls)
            </span>,
          ],
          ["MCP initialize", "Returns 200 with a placeholder bearer"],
          [
            "tools/list",
            "Checked only when you supply a real Atlassian token",
          ],
        ]}
      />

      <Callout variant="success" title="A 401 here is a pass, not a failure">
        It can feel wrong to celebrate a <Code>401 Unauthorized</Code>, but it
        proves the server correctly <em>refuses</em> requests with no token.
        That refusal is a security feature.
      </Callout>

      <h2 id="mcp-endpoint">8. Inspect the /mcp endpoint</h2>
      <p>
        Use the official MCP Inspector to see the transport and discover tools:
      </p>
      <CodeBlock
        language="powershell"
        code={`npx @modelcontextprotocol/inspector`}
      />
      <Table
        headers={["Inspector setting", "Value"]}
        rows={[
          ["Transport", "Streamable HTTP"],
          ["URL", <Code key="u">http://localhost:8080/mcp</Code>],
        ]}
      />
      <Callout variant="note">
        Tool calls that actually hit Jira need a real Atlassian OAuth access
        token. The Inspector is still valuable now for verifying MCP transport
        and tool discovery. You&apos;ll wire up real tokens in the{" "}
        <a href="/copilot-studio/">Copilot Studio &amp; OAuth</a> chapter.
      </Callout>

      <h2 id="success">What success looks like</h2>
      <Callout variant="success">
        <ul>
          <li>The server prints its startup line and keeps running.</li>
          <li>
            <Code>/healthz</Code> returns <Code>status: ok</Code>.
          </li>
          <li>The smoke test reports a pass.</li>
          <li>
            <Code>/mcp</Code> without a token returns <Code>401</Code>; with the
            placeholder bearer, <Code>initialize</Code> returns <Code>200</Code>.
          </li>
        </ul>
        If all four are true, you have a working MCP server on your machine. 🎉
      </Callout>

      <ConceptCheck
        question={
          <p>
            You started the server and <Code>/healthz</Code> works, but the
            smoke test fails on the <Code>/mcp</Code> step saying it got{" "}
            <Code>200</Code> instead of <Code>401</Code>. What does that suggest?
          </p>
        }
        answer={
          <p>
            The server is <em>not</em> requiring a bearer token on{" "}
            <Code>/mcp</Code>. That&apos;s a security problem: anonymous callers
            could invoke tools. Check that the middleware is active and that the
            request really is missing the <Code>Authorization</Code> header.
            Anonymous <Code>/mcp</Code> must be rejected.
          </p>
        }
      />
    </ChapterShell>
  );
}
