import { ChapterShell } from "@/components/ChapterShell";
import { Callout } from "@/components/Callout";
import { CodeBlock } from "@/components/CodeBlock";
import { ConceptCheck } from "@/components/ConceptCheck";
import { Lab } from "@/components/Lab";
import { Table, Code } from "@/components/content";
import { CardGrid, Card } from "@/components/Card";

export const metadata = { title: "Quickstart" };

export default function Page() {
  return (
    <ChapterShell
      slug="quickstart"
      eyebrow="Chapter 0 · Do"
      title="Quickstart: Your First Cowork Plug-in in 15 Minutes"
      intro="Follow the Microsoft 365 Agents Toolkit happy path to scaffold a declarative agent, connect it to an MCP server, and run it inside Copilot Cowork — all before writing a single line of server code."
      learningGoals={[
        "List the prerequisites for building a Cowork plug-in",
        "Scaffold a declarative agent with the Agents Toolkit",
        "Add an MCP server action and fetch tools into the plug-in",
        "Choose an authentication mode and sideload the agent into Copilot",
      ]}
      toc={[
        { id: "prereqs", label: "Prerequisites" },
        { id: "scaffold", label: "Scaffold a declarative agent" },
        { id: "add-action", label: "Add an MCP server action" },
        { id: "fetch-tools", label: "Fetch tools into ai-plugin.json" },
        { id: "choose-auth", label: "Choose authentication" },
        { id: "run-it", label: "Run it in Copilot" },
        { id: "recap", label: "Recap" },
      ]}
      summary={
        <ul>
          <li>
            The Agents Toolkit scaffolds the full plug-in structure in seconds.
          </li>
          <li>
            You add an MCP server action by entering the server&apos;s HTTPS URL.
          </li>
          <li>
            &ldquo;Fetch action from MCP&rdquo; populates{" "}
            <Code>ai-plugin.json</Code> with the discovered tools.
          </li>
          <li>
            After choosing an auth mode and provisioning, the agent appears at{" "}
            <Code>m365.cloud.microsoft/chat</Code> with a <Code>dev</Code> suffix.
          </li>
        </ul>
      }
      reviewItems={[
        { id: "prereqs", label: "I have all prerequisites installed" },
        { id: "scaffold", label: "I can scaffold a new declarative agent" },
        { id: "fetch", label: "I know how to fetch MCP tools into a plug-in" },
        { id: "run", label: "I can sideload and test my agent in Copilot" },
      ]}
    >
      <h2 id="prereqs">Prerequisites</h2>
      <p>
        Before you start, confirm these are installed and working. If anything is
        missing, see the <a href="/environment/">Environment Setup</a> chapter for
        detailed instructions.
      </p>
      <Table
        headers={["Requirement", "Minimum version"]}
        rows={[
          [<Code key="a">VS Code</Code>, "Latest stable"],
          [<Code key="b">M365 Agents Toolkit extension</Code>, "v6.3+"],
          [<Code key="c">Node.js</Code>, "LTS (20+)"],
          [<Code key="d">Python</Code>, "3.11+"],
          [<Code key="e">Azure CLI</Code>, "Latest"],
          ["M365 tenant with Copilot + custom app upload", "—"],
        ]}
      />

      <h2 id="scaffold">Scaffold a declarative agent</h2>
      <p>
        Open the VS Code Command Palette and choose{" "}
        <strong>M365 Agents Toolkit: Create New Agent/App</strong>. Select{" "}
        <strong>Declarative Agent</strong> as the template. The toolkit generates
        a project with the manifest, declarative agent definition, and a starter{" "}
        <Code>ai-plugin.json</Code>.
      </p>
      <CodeBlock
        language="text"
        filename="Command Palette"
        code={`M365 Agents Toolkit: Create New Agent/App
→ Declarative Agent
→ Name: cowork-demo
→ Location: ~/projects/cowork-demo`}
      />
      <Callout variant="beginner" title="What got created?">
        The scaffold gives you <Code>manifest.json</Code>,{" "}
        <Code>declarativeAgent.json</Code>, and <Code>ai-plugin.json</Code> — the
        three files that define your plug-in package.
      </Callout>

      <h2 id="add-action">Add an MCP server action</h2>
      <p>
        Now tell the agent where its tools live. In the Command Palette run{" "}
        <strong>M365 Agents Toolkit: Add an Action</strong> and choose{" "}
        <strong>Start with an MCP Server</strong>. Paste the HTTPS URL of your MCP
        server (for example{" "}
        <Code>https://my-mcp-server.azurecontainerapps.io/mcp</Code>). The toolkit
        creates a <Code>.vscode/mcp.json</Code> dev pointer for local fetching.
      </p>
      <CodeBlock
        language="json"
        filename=".vscode/mcp.json"
        code={`{
  "inputs": [],
  "servers": {
    "cowork-demo": {
      "type": "http",
      "url": "https://my-mcp-server.azurecontainerapps.io/mcp"
    }
  }
}`}
      />

      <h2 id="fetch-tools">Fetch tools into ai-plugin.json</h2>
      <p>
        With the server entry in <Code>mcp.json</Code>, open the Command Palette
        again and run <strong>ATK: Fetch action from MCP</strong>. The toolkit
        connects to your server, discovers its tools, and lets you pick which ones
        to include. Selected tools are written into the{" "}
        <Code>ai-plugin.json</Code> runtimes block.
      </p>
      <Callout variant="tip" title="Start small">
        Select only 2–3 tools for your first run. You can always fetch more later
        without rebuilding the package.
      </Callout>

      <h2 id="choose-auth">Choose authentication</h2>
      <p>
        The toolkit asks which auth mode the connection should use. For a quick
        test with a public demo server, pick <strong>None</strong>. For production
        systems (Salesforce, ServiceNow, Jira) you&apos;ll choose{" "}
        <strong>OAuth 2.1</strong> or <strong>Entra SSO</strong> — covered in the{" "}
        <a href="/security/">Security &amp; Auth</a> chapter.
      </p>
      <CardGrid cols={2}>
        <Card title="None / Anonymous" icon="🔓">
          Good for public or demo servers. No user identity.
        </Card>
        <Card title="OAuth 2.1" icon="🔐">
          Recommended for enterprise. The user signs in to the resource and the
          connection gets a delegated token.
        </Card>
      </CardGrid>

      <h2 id="run-it">Run it in Copilot</h2>
      <p>
        Run <strong>M365 Agents Toolkit: Provision</strong> then{" "}
        <strong>Sideload</strong>. Open{" "}
        <Code>https://m365.cloud.microsoft/chat</Code> in your browser. Your
        agent appears with <Code>dev</Code> appended to its name. Select it and
        try a prompt that exercises one of the tools you fetched.
      </p>
      <CodeBlock
        language="text"
        code={`@cowork-demo dev  Show me my open Jira issues`}
      />
      <Callout variant="note">
        The first load may take 10–20 seconds while Copilot discovers the tools
        from your MCP server.
      </Callout>

      <h2 id="recap">Recap</h2>
      <p>
        In under fifteen minutes you scaffolded a plug-in, pointed it at a remote
        MCP server, fetched tools, and saw them work inside Copilot Cowork. The
        rest of this guide unpacks each step so you can build production-quality
        connections for Salesforce, ServiceNow, and Jira.
      </p>
      <Lab title="Quickstart lab" time="15 min" goal="Scaffold, fetch, and run a plug-in end to end">
        <ol>
          <li>
            Open VS Code and create a new Declarative Agent with the Agents
            Toolkit.
          </li>
          <li>
            Add an MCP server action using the demo server URL from the{" "}
            <Code>demo/</Code> folder&apos;s README.
          </li>
          <li>Fetch tools — select at least two.</li>
          <li>Choose &ldquo;None&rdquo; for auth (demo mode).</li>
          <li>Provision and sideload.</li>
          <li>
            Open <Code>m365.cloud.microsoft/chat</Code>, find your agent, and
            confirm a tool call returns data.
          </li>
        </ol>
      </Lab>
      <ConceptCheck
        question={
          <p>
            After you fetch tools from an MCP server, where are the selected
            operations stored in the plug-in project?
          </p>
        }
        answer={
          <p>
            In the <Code>ai-plugin.json</Code> file, inside the{" "}
            <Code>runtimes</Code> block that declares the MCP runtime, server URL,
            and selected functions.
          </p>
        }
      />
    </ChapterShell>
  );
}
