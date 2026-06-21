import { ChapterShell } from "@/components/ChapterShell";
import { Callout } from "@/components/Callout";
import { Card, CardGrid } from "@/components/Card";
import { CodeBlock } from "@/components/CodeBlock";
import { ConceptCheck } from "@/components/ConceptCheck";
import { Table, Code } from "@/components/content";

export const metadata = { title: "Repository Anatomy & Python Basics" };

const TREE = `jira-mcp-copilot-studio
|-- app
|   |-- server.py          # entry point, builds the FastMCP app
|   |-- middleware.py      # origin / gateway / bearer checks
|   |-- config.py          # settings from env vars and .env
|   |-- context.py         # request-scoped token storage
|   |-- errors.py          # error envelope helpers
|   |-- telemetry.py       # logging + redaction + App Insights
|   |-- auth/bearer.py     # token + Jira site resolution
|   |-- jira/client.py     # async Jira REST client
|   |-- jira/trim.py       # payload trimming models
|   |-- tools/__init__.py  # MCP tool registration
|-- docs                   # implementation, deployment, security docs
|-- infra                  # main.bicep, containerapp.bicep, apim-policy.xml
|-- openapi                # mcp-connector.swagger.json, rest-fallback
|-- scripts                # run_local.ps1, deploy.ps1, smoke.py
|-- tests                  # unit tests
|-- Dockerfile
|-- pyproject.toml
|-- requirements.txt
|-- azure.yaml`;

export default function Page() {
  return (
    <ChapterShell
      slug="anatomy"
      eyebrow="Chapter 4 · Build"
      title="Repository Anatomy & Python Basics"
      intro="A map of the project folders, plus the small set of Python ideas you need to read the code with confidence. You don't have to be a Python expert — just comfortable with these six concepts."
      learningGoals={[
        "Navigate the project folders and know what each is responsible for",
        "Read async functions, context managers, and Pydantic models",
        "Understand modules, packages, and environment variables",
        "Know which folders you'll touch first as a beginner",
      ]}
      toc={[
        { id: "tree", label: "Repository layout" },
        { id: "areas", label: "What each area owns" },
        { id: "python", label: "Python ideas you'll use" },
      ]}
      summary={
        <ul>
          <li>
            <Code>app/</Code> holds runtime code; <Code>infra/</Code>,{" "}
            <Code>openapi/</Code>, <Code>scripts/</Code>, and <Code>tests/</Code>{" "}
            hold deployment, connector, automation, and tests.
          </li>
          <li>
            You only need six Python ideas: module, package, async functions,
            context managers, Pydantic models, and environment variables.
          </li>
        </ul>
      }
      reviewItems={[
        { id: "folders", label: "I can say what app/, infra/, openapi/, scripts/ each do" },
        { id: "async", label: "I can read an async function and an 'async with' block" },
        { id: "pydantic", label: "I understand what a Pydantic model gives us" },
        { id: "env", label: "I know how settings come from environment variables" },
      ]}
    >
      <h2 id="tree">Repository layout</h2>
      <p>
        Here is the whole project at a glance. The comments show what each file
        is for — you&apos;ll meet them in detail in the{" "}
        <a href="/implementation/">Implementation Walkthrough</a>.
      </p>
      <CodeBlock language="text" filename="Project structure" noCopy code={TREE} />

      <h2 id="areas">What each area owns</h2>
      <Table
        headers={["Area", "Responsibility"]}
        rows={[
          [<Code key="1">app</Code>, "Runtime server code."],
          [<Code key="2">app/tools</Code>, "MCP tool definitions."],
          [<Code key="3">app/jira</Code>, "Jira API client and payload trimming."],
          [
            <Code key="4">app/auth</Code>,
            "Delegated bearer token and Jira site resolution.",
          ],
          [<Code key="5">infra</Code>, "Azure infrastructure (Bicep, APIM policy)."],
          [<Code key="6">openapi</Code>, "Copilot Studio connector definitions."],
          [
            <Code key="7">scripts</Code>,
            "Local run, deployment, and smoke validation scripts.",
          ],
          [<Code key="8">tests</Code>, "Unit tests."],
          [<Code key="9">docs</Code>, "Production docs and architecture decisions."],
        ]}
      />

      <Callout variant="beginner" title="What should a beginner touch first?">
        Start by reading <Code>app/tools/__init__.py</Code> (the tool menu) and{" "}
        <Code>app/config.py</Code> (the settings). Leave{" "}
        <Code>app/middleware.py</Code> and the <Code>infra/</Code> Bicep files
        alone until you&apos;ve read their chapters — small changes there have
        big security and deployment consequences.
      </Callout>

      <h2 id="python">Python ideas you&apos;ll use</h2>

      <CardGrid>
        <Card title="Module" icon="📄">
          A <Code>.py</Code> file is a module. <Code>app/server.py</Code> is
          imported as <Code>app.server</Code>.
        </Card>
        <Card title="Package" icon="📦">
          A folder with <Code>__init__.py</Code> is a package. The{" "}
          <Code>app</Code> folder is a package.
        </Card>
        <Card title="Environment variable" icon="🌱">
          Configures the app without changing code, e.g.{" "}
          <Code>$env:MAX_RESPONSE_BYTES = &quot;90000&quot;</Code>. Read via{" "}
          <Code>pydantic-settings</Code> in <Code>config.py</Code>.
        </Card>
      </CardGrid>

      <h3>Async functions</h3>
      <p>
        The server uses asynchronous I/O because web servers spend most of their
        time <em>waiting</em> for network calls. An async function can wait for
        one operation without blocking the whole server.
      </p>
      <CodeBlock
        language="python"
        code={`async def jira_whoami() -> dict:
    ...`}
      />

      <h3>Context manager</h3>
      <p>
        The <Code>async with</Code> block guarantees setup and cleanup happen
        reliably — here, it opens an HTTP client, resolves the Jira site, and
        closes the client afterward.
      </p>
      <CodeBlock
        language="python"
        code={`async with JiraClient() as jira:
    return await jira.whoami()`}
      />

      <h3>Pydantic model</h3>
      <p>
        Pydantic models define structured data. In <Code>app/jira/trim.py</Code>,{" "}
        <Code>IssueSummary</Code> defines the compact issue shape returned to the
        agent — predictable and small, instead of raw Jira JSON.
      </p>
      <CodeBlock
        language="python"
        code={`class IssueSummary(BaseModel):
    id: str | None = None
    key: str | None = None
    status: str | None = None
    summary: str | None = None
    assignee: str | None = None
    url: str | None = None`}
      />

      <ConceptCheck
        question={
          <p>
            Why does a web server benefit from <Code>async</Code> functions even
            though most code in this project isn&apos;t doing heavy computation?
          </p>
        }
        answer={
          <p>
            Because the bottleneck is <em>waiting on the network</em> (calls to
            Jira and Atlassian), not CPU work. Async lets the server handle other
            requests while one request waits for Jira to respond, so a single
            process serves many concurrent users efficiently.
          </p>
        }
      />
    </ChapterShell>
  );
}
