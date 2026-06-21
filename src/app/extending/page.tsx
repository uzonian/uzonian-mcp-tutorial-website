import { ChapterShell } from "@/components/ChapterShell";
import { Callout } from "@/components/Callout";
import { CodeBlock } from "@/components/CodeBlock";
import { ConceptCheck } from "@/components/ConceptCheck";
import { Table, Code, Compare } from "@/components/content";
import { MiniProject } from "@/components/Lab";

export const metadata = { title: "Extending the Server" };

export default function Page() {
  return (
    <ChapterShell
      slug="extending"
      eyebrow="Chapter 14 · Operate"
      title="Extending the Server"
      intro="Add new capabilities without weakening the design. The same discipline applies to every new tool: narrow scope, typed arguments, trimmed responses, tests. Then learn how to port the whole pattern to a different system."
      learningGoals={[
        "Add a new Jira read tool the safe way",
        "Add a write tool with confirmation and compact responses",
        "Port the pattern to another enterprise system while keeping the safe parts",
      ]}
      toc={[
        { id: "read-tool", label: "Add a read tool" },
        { id: "write-tool", label: "Add a write tool" },
        { id: "port", label: "Port to another system" },
      ]}
      summary={
        <ul>
          <li>
            Read tool: add a client method, request only needed fields, reuse a
            model, add a wrapper, test, verify with Inspector.
          </li>
          <li>
            Write tool: keep it narrow, require explicit identifiers, return a
            compact confirmation, never hide permission failures.
          </li>
          <li>
            Porting: replace the system-specific layers; keep FastMCP structure,
            token context, middleware, APIM, Key Vault, trimming, tests,
            connector, and Dockerfile.
          </li>
        </ul>
      }
      reviewItems={[
        { id: "read", label: "I can list the six steps to add a read tool" },
        { id: "write", label: "I know the rules for a safe write tool" },
        { id: "port", label: "I know what to replace and what to keep when porting" },
      ]}
    >
      <h2 id="read-tool">Add a new Jira read tool</h2>
      <ol>
        <li>
          Add a method to <Code>JiraClient</Code>.
        </li>
        <li>Request only required Jira fields.</li>
        <li>Add or reuse a Pydantic response model.</li>
        <li>
          Add a tool wrapper in <Code>app/tools/__init__.py</Code>.
        </li>
        <li>Add unit tests.</li>
        <li>Validate with MCP Inspector.</li>
      </ol>
      <Table
        headers={["New capability", "Preferred tool shape"]}
        rows={[
          ["Get issue comments", <Code key="1">jira_get_comments(issue_key, max_results=10)</Code>],
          ["List boards", <Code key="2">jira_list_boards(project_key=&quot;&quot;)</Code>],
          ["Get sprints", <Code key="3">jira_get_sprints(board_id, state=&quot;active&quot;)</Code>],
        ]}
      />

      <h2 id="write-tool">Add a new Jira write tool</h2>
      <p>For write tools:</p>
      <ol>
        <li>Keep the operation narrow.</li>
        <li>Require explicit identifiers.</li>
        <li>Return a compact confirmation.</li>
        <li>Do not hide permission failures.</li>
        <li>
          Consider whether Copilot Studio should require user confirmation before
          invoking it.
        </li>
      </ol>
      <Compare
        betterLabel="Good write response"
        worseLabel="Bad write response"
        rows={[
          {
            better: <CodeBlock language="json" noCopy code={`{ "key": "PROJ-123", "updated": true }`} />,
            worse: <CodeBlock language="json" noCopy code={`{ "raw": "...entire Jira response..." }`} />,
          },
        ]}
      />
      <Callout variant="warning">
        Write tools change real data. Prefer testing them against a
        non-production Jira project, and consider an explicit confirmation step
        in the agent before destructive or far-reaching actions.
      </Callout>

      <h2 id="port">Port the pattern to another system</h2>
      <p>Replace the system-specific layers:</p>
      <Table
        headers={["Current layer", "Replace with"]}
        rows={[
          [<Code key="1">app/jira/client.py</Code>, "Client for your system."],
          [<Code key="2">app/jira/trim.py</Code>, "Response shaping for your system."],
          ["Atlassian scopes", "OAuth scopes for your system."],
          ["Atlassian accessible resources", "Equivalent tenant/site/resource discovery."],
          ["Jira tools", "Domain-specific tools."],
        ]}
      />
      <Callout variant="success" title="Keep these — they're the valuable part">
        <ul>
          <li>FastMCP server structure</li>
          <li>request-scoped token context</li>
          <li>middleware pattern</li>
          <li>APIM gateway and Key Vault-backed gateway secret</li>
          <li>payload trimming discipline</li>
          <li>tests, connector shape, Dockerfile, and CI patterns</li>
        </ul>
      </Callout>

      <MiniProject title="Design jira_get_comments end to end">
        <p>
          Sketch the full change for a <Code>jira_get_comments</Code> read tool:
          the new <Code>JiraClient</Code> method and its Jira endpoint, the fields
          you&apos;d request, a compact comment model (author, created, trimmed
          body), the capped <Code>max_results</Code>, the tool wrapper with a
          clear docstring, and two unit tests (happy path + a 404). You don&apos;t
          have to run it — just produce the design and check it against the
          read-tool steps above.
        </p>
      </MiniProject>

      <ConceptCheck
        question={
          <p>
            When porting to a system that returns very large records, which
            single reused layer prevents the most production incidents, and why?
          </p>
        }
        answer={
          <p>
            The trimming / byte-budget layer (the analogue of{" "}
            <Code>app/jira/trim.py</Code>). It keeps responses within the agent
            platform&apos;s size limit regardless of how large the upstream
            records are, preventing payload-too-large failures — the most common
            way these integrations break under real data.
          </p>
        }
      />
    </ChapterShell>
  );
}
