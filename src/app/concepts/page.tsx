import { ChapterShell } from "@/components/ChapterShell";
import { Callout } from "@/components/Callout";
import { Card, CardGrid } from "@/components/Card";
import { ConceptCheck } from "@/components/ConceptCheck";
import { CodeBlock } from "@/components/CodeBlock";
import { Table, Code, Compare } from "@/components/content";
import { VideoCard } from "@/components/VideoCard";

export const metadata = { title: "Core Concepts" };

export default function Page() {
  return (
    <ChapterShell
      slug="concepts"
      eyebrow="Chapter 1 · Understand"
      title="Core Concepts: Plug-ins, Skills & MCP Connections"
      intro="The handful of ideas everything else builds on: how a Copilot Cowork plug-in is put together, the difference between a skill and a connector, and the components of the MCP connection that gives your plug-in reach into enterprise systems."
      learningGoals={[
        "Describe what a Cowork plug-in contains and how it extends Copilot",
        "Tell a skill apart from a connector (and know when you need each)",
        "Name the components of an MCP connection inside a plug-in",
        "Explain how Cowork discovers tools and widgets over streamable HTTP",
      ]}
      toc={[
        { id: "plugin-anatomy", label: "What a plug-in contains" },
        { id: "skill-vs-connector", label: "Skill vs connector" },
        { id: "mcp-connection", label: "The MCP connection" },
        { id: "components", label: "Connection components" },
        { id: "tools", label: "Tools" },
        { id: "streamable-http", label: "Streamable HTTP" },
        { id: "widgets", label: "UI widgets" },
        { id: "discovery", label: "How Cowork discovers them" },
      ]}
      summary={
        <ul>
          <li>
            A plug-in packages a <strong>declarative agent</strong> with{" "}
            <strong>skills</strong> (know-how) and <strong>connectors</strong>{" "}
            (reach).
          </li>
          <li>
            A connector reaches a system through an <strong>MCP connection</strong>{" "}
            — a remote MCP server exposed over <Code>streamable HTTP</Code>.
          </li>
          <li>
            The connection&apos;s components are the action descriptor, the server
            URL, the discovered tools, optional widgets, and the auth binding.
          </li>
          <li>
            Cowork discovers tools dynamically, so new tools appear without
            rebuilding the connector.
          </li>
        </ul>
      }
      reviewItems={[
        { id: "contains", label: "I can list what a plug-in package contains" },
        { id: "skill", label: "I can tell a skill apart from a connector" },
        { id: "components", label: "I can name the MCP connection components" },
        { id: "discovery", label: "I understand dynamic tool discovery" },
      ]}
    >
      <h2 id="plugin-anatomy">What a Copilot Cowork plug-in contains</h2>
      <p>
        Copilot Cowork is the part of Microsoft 365 Copilot that{" "}
        <em>does the work</em> — it carries out multi-step tasks instead of just
        answering questions. A <strong>plug-in</strong> is how you teach Cowork to
        work inside <em>your</em> systems. It is packaged with the same Microsoft
        365 app model used for Teams apps and declarative agents, so an admin can
        deploy and govern it centrally.
      </p>
      <p>A plug-in package bundles three kinds of things:</p>
      <CardGrid cols={3}>
        <Card title="Declarative agent" icon="🧠">
          The agent definition: its name, instructions, conversation starters, and
          the list of actions it can take.
        </Card>
        <Card title="Skills" icon="📋">
          Reusable, instruction-based recipes (a <Code>SKILL.md</Code>) that tell
          Cowork <em>how</em> to accomplish a task — the know-how.
        </Card>
        <Card title="Connectors / actions" icon="🔌">
          How the agent reaches the outside world. A modern connector is an{" "}
          <strong>MCP server action</strong> — the reach.
        </Card>
      </CardGrid>

      <h2 id="skill-vs-connector">Skill versus connector</h2>
      <p>
        These two are easy to confuse but do different jobs. A{" "}
        <strong>skill</strong> is the <em>know-how</em>: a markdown recipe that
        describes the steps to complete a task (&ldquo;to prepare a standup, gather
        my open issues, group them by status, and draft a summary&rdquo;). A{" "}
        <strong>connector</strong> is the <em>reach</em>: the live connection that
        lets the agent actually read and change data in Jira, Salesforce, or
        ServiceNow.
      </p>
      <Compare
        betterLabel="Use a skill when…"
        worseLabel="Use a connector when…"
        rows={[
          {
            better: "You are describing a repeatable workflow or house style",
            worse: "You need live data or to take an action in a system",
          },
          {
            better: "The steps are stable but the data changes each run",
            worse: "Permissions must match the signed-in user",
          },
          {
            better: "No new API access is required",
            worse: "You must authenticate to an external service",
          },
        ]}
      />
      <Callout variant="tip" title="They work together">
        A great plug-in pairs both: a <strong>skill</strong> describes the
        workflow, and the <strong>MCP connection</strong> behind a connector
        supplies the live data the skill needs. The three example assets in this
        guide each ship a skill <em>and</em> a connection.
      </Callout>

      <h2 id="mcp-connection">The MCP connection</h2>
      <p>
        <strong>Model Context Protocol (MCP)</strong> is a standard way for an
        agent to discover and call tools. Instead of hand-coding one connector
        operation per API call, your plug-in points at a <strong>remote MCP
        server</strong>, and Cowork asks it three questions:
      </p>
      <ul>
        <li>What tools do you expose?</li>
        <li>What arguments does each tool accept?</li>
        <li>Call this tool with these arguments.</li>
      </ul>
      <p>
        That is the <strong>MCP connection</strong>: the link between your plug-in
        and a server that speaks MCP. You build the server in Python with{" "}
        <Code>FastMCP</Code>, host it on Azure, and reference its URL from the
        plug-in.
      </p>

      <h2 id="components">Components of the MCP connection</h2>
      <p>
        This is the heart of plug-in extensibility. Whenever you add an MCP
        connection to a Cowork plug-in, these are the moving parts. The{" "}
        <a href="/anatomy/">Plug-in Anatomy</a> chapter opens each one file by
        file.
      </p>
      <Table
        headers={["Component", "What it is", "Lives in"]}
        rows={[
          [
            <strong key="a">Action descriptor</strong>,
            "Declares the MCP runtime: server URL, selected tools, and the auth reference.",
            <Code key="a2">ai-plugin.json</Code>,
          ],
          [
            <strong key="b">MCP server endpoint</strong>,
            "The remote HTTPS /mcp URL the connection talks to (streamable HTTP).",
            "Your Azure host",
          ],
          [
            <strong key="c">Tools</strong>,
            "The callable operations the server exposes and Cowork discovers.",
            "MCP server (Python)",
          ],
          [
            <strong key="d">UI widgets (optional)</strong>,
            "Interactive cards the server can render inside Copilot (MCP apps).",
            "MCP server",
          ],
          [
            <strong key="e">Authentication binding</strong>,
            "How the connection proves identity: none, API key, OAuth 2.1, or Entra SSO.",
            <Code key="e2">ai-plugin.json</Code>,
          ],
          [
            <strong key="f">Declarative agent + manifest</strong>,
            "The agent definition and package identity that reference the action.",
            <Code key="f2">manifest.json</Code>,
          ],
          [
            <strong key="g">Dev pointer</strong>,
            "A local file the Agents Toolkit uses to start and fetch tools while building.",
            <Code key="g2">.vscode/mcp.json</Code>,
          ],
        ]}
      />
      <Callout variant="beginner" title="You don't write all of this by hand">
        The Microsoft 365 Agents Toolkit scaffolds the manifest, declarative
        agent, and <Code>ai-plugin.json</Code> for you, and fetches the tool list
        from your server. You mostly write the <strong>MCP server</strong> (the
        tools) and choose an <strong>auth mode</strong>.
      </Callout>

      <h2 id="tools">Tools</h2>
      <p>
        A <strong>tool</strong> is a callable function the server exposes to the
        agent. Its name, typed arguments, and description are all part of what
        Cowork discovers. Good tools do one clear thing and return a small,
        predictable object. The Jira example connection exposes tools like these:
      </p>
      <Table
        headers={["Tool", "Purpose"]}
        rows={[
          [<Code key="1">jira_whoami</Code>, "Return the signed-in Jira user."],
          [<Code key="2">jira_search</Code>, "Search Jira with JQL."],
          [<Code key="3">jira_get_issue</Code>, "Return one trimmed issue."],
          [<Code key="4">jira_create_issue</Code>, "Create an issue."],
          [<Code key="5">jira_transition_issue</Code>, "Apply a workflow transition."],
        ]}
      />
      <Callout variant="tip" title="The golden rule of tool design">
        A tool should do <strong>one clear thing</strong> and return a{" "}
        <strong>predictable, compact object</strong>. You&apos;ll revisit this in{" "}
        <a href="/build-your-own/">Build Your Own</a>.
      </Callout>

      <h2 id="streamable-http">Streamable HTTP</h2>
      <p>
        A Cowork plug-in always connects to a <strong>remote</strong> MCP server
        over <strong>streamable HTTP</strong> — one HTTPS endpoint, usually{" "}
        <Code>/mcp</Code>, that accepts JSON-RPC-style requests. (Local{" "}
        <Code>stdio</Code> servers are fine while developing but are not a
        supported production connection.) In Python you create the server like
        this:
      </p>
      <CodeBlock
        language="python"
        code={`FastMCP(settings.server_name, stateless_http=True, json_response=True)`}
      />
      <Table
        headers={["Setting", "Meaning"]}
        rows={[
          [
            <Code key="1">stateless_http=True</Code>,
            "Every request is self-contained — important behind gateways and load balancers.",
          ],
          [
            <Code key="2">json_response=True</Code>,
            "Return buffered JSON instead of a long-lived stream. Gateway-friendly.",
          ],
        ]}
      />

      <h2 id="widgets">UI widgets (MCP apps)</h2>
      <p>
        A connection can do more than return text. With <strong>MCP apps</strong>,
        your server can return interactive <strong>UI widgets</strong> — for
        example a sprint board or an opportunity card — that render directly inside
        Copilot. Widgets are optional; you add them once the text experience works.
      </p>
      <Callout variant="note">
        MCP apps need the Agents Toolkit 6.6.1+ and OAuth 2.1 or Entra SSO. Start
        text-only, then add widgets. This guide focuses on tools; widgets are an
        optional extension covered in <a href="/extending/">Example Assets</a>.
      </Callout>

      <h2 id="discovery">How Cowork discovers tools</h2>
      <p>
        Because the connection speaks MCP, Cowork discovers tools{" "}
        <strong>dynamically</strong>. You select which operations to expose once in
        the Agents Toolkit; after that, the agent learns the tool list from the
        server at runtime.
      </p>
      <Compare
        betterLabel="MCP connection (dynamic)"
        worseLabel="Hand-built REST connector (static)"
        rows={[
          {
            better: "One action; tools discovered from the server",
            worse: "One connector operation per API call, maintained by hand",
          },
          {
            better: "Add a tool on the server — it appears automatically",
            worse: "Every new capability means new connector work",
          },
          {
            better: "Cowork treats it as an MCP tool source",
            worse: "Behaves like an ordinary REST connector",
          },
        ]}
      />
      <ConceptCheck
        question={
          <p>
            A teammate wants to &ldquo;just add ten REST operations&rdquo; to the
            plug-in instead of an MCP server. Why prefer the MCP connection?
          </p>
        }
        answer={
          <p>
            With an MCP connection you declare one action and the tools are
            discovered dynamically, so adding capabilities is a server-side change.
            A hand-built REST connector needs a new operation defined and
            maintained for every call, and it loses MCP&apos;s dynamic discovery
            and shared auth model.
          </p>
        }
      />
      <VideoCard
        verified={false}
        concept="What Model Context Protocol (MCP) is and why agents use it"
        level="beginner"
        searchQuery='"Model Context Protocol" explained (Microsoft OR Anthropic official)'
        why="A short visual explainer makes the discover-then-call pattern click before you build a server."
      />
    </ChapterShell>
  );
}
