import { ChapterShell } from "@/components/ChapterShell";
import { Callout } from "@/components/Callout";
import { Card, CardGrid } from "@/components/Card";
import { ConceptCheck } from "@/components/ConceptCheck";
import { Table, Code } from "@/components/content";
import { VideoCard } from "@/components/VideoCard";

export const metadata = { title: "Before You Begin" };

export default function Page() {
  return (
    <ChapterShell
      slug="before-you-begin"
      eyebrow="Orientation"
      title="Before You Begin: A Jargon Primer"
      intro="Get comfortable with the key terms — Copilot Cowork, plug-ins, skills, connectors, and MCP — so nothing in the chapters ahead feels unfamiliar."
      learningGoals={[
        "Explain what Copilot Cowork is and how it differs from chat-only Copilot",
        "Distinguish a plug-in from a skill from a connector",
        "Summarize what MCP does in one sentence",
        "Identify the software and access you need to follow along",
      ]}
      toc={[
        { id: "what-is-cowork", label: "What is Copilot Cowork?" },
        { id: "plugin-vs-skill", label: "Plug-in vs skill vs connector" },
        { id: "mcp-in-one-minute", label: "MCP in one minute" },
        { id: "jargon", label: "Jargon table" },
        { id: "what-you-need", label: "What you need" },
      ]}
      summary={
        <ul>
          <li>
            <strong>Copilot Cowork</strong> is the agentic layer of Microsoft 365
            Copilot that executes multi-step tasks.
          </li>
          <li>
            A <strong>plug-in</strong> bundles a declarative agent with{" "}
            <strong>skills</strong> (know-how) and <strong>connectors</strong>{" "}
            (reach via MCP).
          </li>
          <li>
            <strong>MCP</strong> lets Cowork discover and call your tools
            dynamically over one HTTPS endpoint.
          </li>
          <li>
            You need VS Code with the M365 Agents Toolkit, Python 3.11+, Azure
            CLI, and a tenant with Copilot access.
          </li>
        </ul>
      }
      reviewItems={[
        { id: "cowork", label: "I can explain what Copilot Cowork does" },
        { id: "plugin", label: "I know the difference between a plug-in, a skill, and a connector" },
        { id: "mcp", label: "I can summarize MCP in one sentence" },
        { id: "ready", label: "I have the required software and tenant access" },
      ]}
    >
      <h2 id="what-is-cowork">What is Copilot Cowork?</h2>
      <p>
        Microsoft 365 Copilot has two faces. The one you already know answers
        questions and summarizes documents. <strong>Copilot Cowork</strong> is the
        other face — it <em>does the work</em>. Give it a multi-step task
        (&ldquo;triage these incidents, find related KB articles, and set
        priorities&rdquo;) and it executes the whole sequence, reaching into
        external systems on your behalf.
      </p>
      <Callout variant="beginner" title="Think of it this way">
        Chat Copilot is a helpful advisor. Cowork is a capable colleague who
        actually carries out the task end to end.
      </Callout>

      <h2 id="plugin-vs-skill">Plug-in vs skill vs connector</h2>
      <p>
        These three words come up constantly. They sit at different levels of the
        extensibility stack, and once you see how they nest, everything else in
        this guide makes sense.
      </p>
      <CardGrid cols={3}>
        <Card title="Plug-in" icon="📦">
          The deployable package. It uses the Microsoft 365 app model (same as
          Teams apps) and contains one <strong>declarative agent</strong> plus its
          skills and connectors.
        </Card>
        <Card title="Skill" icon="📋">
          A markdown recipe (<Code>SKILL.md</Code>) that describes <em>how</em>{" "}
          to accomplish a task — the know-how. No new API access required.
        </Card>
        <Card title="Connector / action" icon="🔌">
          The live connection that gives the agent <em>reach</em> into an
          external system. The modern approach: an <strong>MCP server
          action</strong>.
        </Card>
      </CardGrid>
      <Callout variant="tip" title="Skills + connectors = powerful agents">
        A skill describes the workflow; a connector supplies the live data. The
        best plug-ins pair both.
      </Callout>

      <h2 id="mcp-in-one-minute">MCP in one minute</h2>
      <p>
        <strong>Model Context Protocol (MCP)</strong> is an open standard that
        lets an agent discover and call tools exposed by a remote server. Instead
        of hard-coding one connector per API endpoint, your plug-in points at a
        single MCP server URL. Cowork asks the server what tools it has, what
        arguments they accept, and then calls them — all over one HTTPS endpoint
        using <Code>streamable HTTP</Code> transport.
      </p>
      <ConceptCheck
        question={
          <p>
            Why is dynamic tool discovery better than hand-coding one connector
            operation per API call?
          </p>
        }
        answer={
          <p>
            Because you add new capabilities on the server side and Cowork picks
            them up automatically — no plug-in rebuild needed for each new tool.
          </p>
        }
      />

      <h2 id="jargon">Jargon table</h2>
      <p>
        Bookmark this table. These terms reappear in every chapter.
      </p>
      <Table
        headers={["Term", "One-line definition"]}
        rows={[
          [<strong key="a">Copilot Cowork</strong>, "The agentic layer of M365 Copilot that executes multi-step tasks."],
          [<strong key="b">Plug-in</strong>, "A deployable package (M365 app model) containing the agent, skills, and connectors."],
          [<strong key="c">Declarative agent</strong>, "The agent definition inside a plug-in: instructions, conversation starters, and actions."],
          [<strong key="d">Skill</strong>, "A markdown recipe that describes a repeatable workflow (the know-how)."],
          [<strong key="e">Connector / action</strong>, "The live link to an external system — an MCP server action in modern plug-ins."],
          [<strong key="f">MCP</strong>, "Model Context Protocol — the standard for agent-to-tool communication."],
          [<strong key="g">Tool</strong>, "A callable function on an MCP server (name + typed args + description)."],
          [<strong key="h">Streamable HTTP</strong>, "The HTTPS transport Cowork uses to talk to an MCP server (/mcp endpoint)."],
          [<strong key="i">FastMCP</strong>, "The Python library (MCP SDK) used to build MCP servers in this guide."],
          [<strong key="j">M365 Agents Toolkit</strong>, "The VS Code extension (v6.3+) that scaffolds and manages plug-in projects."],
        ]}
      />

      <h2 id="what-you-need">What you need</h2>
      <p>
        Before diving into the quickstart, make sure you have access to the
        following. The <a href="/environment/">Environment Setup</a> chapter walks
        through installation step by step.
      </p>
      <CardGrid cols={2}>
        <Card title="Software" icon="💻">
          VS Code, M365 Agents Toolkit v6.3+, Python 3.11+, Azure CLI, Node.js
          LTS.
        </Card>
        <Card title="Tenant access" icon="🔑">
          A Microsoft 365 tenant with custom app upload enabled and a Copilot
          license (or developer tenant with Copilot access).
        </Card>
      </CardGrid>
      <Callout variant="note" title="Don&apos;t have a tenant?">
        You can request a free Microsoft 365 developer tenant at{" "}
        <Code>developer.microsoft.com/microsoft-365/dev-program</Code>. Copilot
        access may require a separate license or trial.
      </Callout>
      <VideoCard
        verified={false}
        concept="Introduction to Microsoft Copilot Cowork extensibility and plug-ins"
        searchQuery='"Copilot Cowork" plug-in extensibility overview (Microsoft Build OR Ignite)'
      />
    </ChapterShell>
  );
}
