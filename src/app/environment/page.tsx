import { ChapterShell } from "@/components/ChapterShell";
import { Callout } from "@/components/Callout";
import { CodeBlock } from "@/components/CodeBlock";
import { Card, CardGrid } from "@/components/Card";
import { Table, Code } from "@/components/content";
import { WhatThisFileDoes } from "@/components/WhatThisFileDoes";

export const metadata = { title: "Environment Setup" };

export default function Page() {
  return (
    <ChapterShell
      slug="environment"
      eyebrow="Chapter 3 · Prepare"
      title="Environment Setup"
      intro="Install the required software, configure your Microsoft 365 tenant, and open the demo project so you are ready to build and test plug-ins locally."
      learningGoals={[
        "Install VS Code, the M365 Agents Toolkit, Python, Azure CLI, and Node.js",
        "Verify that the Agents Toolkit extension is v6.3 or later",
        "Confirm your tenant allows custom app uploads and has Copilot access",
        "Clone and open the demo project in VS Code",
      ]}
      toc={[
        { id: "software", label: "Required software" },
        { id: "agents-toolkit", label: "Agents Toolkit" },
        { id: "tenant-access", label: "Tenant access" },
        { id: "open-project", label: "Opening the demo project" },
      ]}
      summary={
        <ul>
          <li>
            You need VS Code, the M365 Agents Toolkit v6.3+, Python 3.11+, Azure
            CLI, and Node.js LTS.
          </li>
          <li>
            Your Microsoft 365 tenant must have custom app upload enabled and a
            Copilot license.
          </li>
          <li>
            Clone the demo repo and open it in VS Code to follow along with the
            guide.
          </li>
        </ul>
      }
      reviewItems={[
        { id: "software", label: "All required software is installed" },
        { id: "toolkit", label: "Agents Toolkit v6.3+ is active in VS Code" },
        { id: "tenant", label: "My tenant is configured for custom apps + Copilot" },
        { id: "project", label: "The demo project opens without errors" },
      ]}
    >
      <h2 id="software">Required software</h2>
      <p>
        Everything in this guide builds on a small, standard toolchain. Install
        each item below — you&apos;ll use all of them throughout the tutorial.
      </p>
      <Table
        headers={["Tool", "Version", "Purpose"]}
        rows={[
          [<Code key="a">VS Code</Code>, "Latest stable", "Editor and Agents Toolkit host"],
          [<Code key="b">M365 Agents Toolkit</Code>, "v6.3+", "Scaffold, provision, and sideload plug-ins"],
          [<Code key="c">Python</Code>, "3.11+", "MCP server runtime (FastMCP)"],
          [<Code key="d">Azure CLI</Code>, "Latest", "Deploy infrastructure and authenticate to Azure"],
          [<Code key="e">Node.js</Code>, "LTS (20+)", "Toolkit dependency and local tooling"],
        ]}
      />
      <CodeBlock
        language="bash"
        filename="Verify versions"
        code={`code --version
python --version   # 3.11+
az --version       # latest
node --version     # 20+`}
      />

      <h2 id="agents-toolkit">Agents Toolkit</h2>
      <p>
        The <strong>Microsoft 365 Agents Toolkit</strong> (formerly Teams Toolkit)
        is a VS Code extension that scaffolds declarative agents, provisions cloud
        resources, and sideloads your plug-in into Copilot. Version 6.3 introduced
        MCP server actions; version 6.6.1 added MCP apps (UI widgets).
      </p>
      <CardGrid cols={2}>
        <Card title="Install from Marketplace" icon="🧩">
          Search &ldquo;Microsoft 365 Agents Toolkit&rdquo; in the VS Code
          Extensions panel and install it. Confirm the version is 6.3 or higher.
        </Card>
        <Card title="Verify" icon="✅">
          Open the Command Palette → type &ldquo;M365 Agents Toolkit&rdquo;. You
          should see commands like &ldquo;Create New Agent/App&rdquo; and
          &ldquo;Fetch action from MCP.&rdquo;
        </Card>
      </CardGrid>
      <Callout variant="tip" title="Stay up to date">
        The toolkit evolves fast. Enable auto-update in VS Code to get new MCP
        features as they ship.
      </Callout>

      <h2 id="tenant-access">Tenant access</h2>
      <p>
        Two tenant settings must be enabled before you can sideload and test a
        Cowork plug-in:
      </p>
      <Table
        headers={["Setting", "Where to check", "What it does"]}
        rows={[
          [
            <strong key="a">Custom app upload</strong>,
            "Microsoft 365 Admin Center → Settings → Org settings → Apps",
            "Allows developers to sideload apps without admin approval.",
          ],
          [
            <strong key="b">Copilot access</strong>,
            "Microsoft 365 Admin Center → Copilot → Manage",
            "Ensures your user account is licensed for Copilot (including Cowork).",
          ],
        ]}
      />
      <Callout variant="warning" title="Admin required">
        Both settings require Global Admin or Teams Admin privileges. If you
        don&apos;t have them, ask your IT team or use a developer tenant.
      </Callout>

      <h2 id="open-project">Opening the demo project</h2>
      <p>
        Clone the repository that accompanies this guide and open the{" "}
        <Code>demo/</Code> folder in VS Code. This folder contains the MCP server
        source, plug-in manifests for all three example systems, infrastructure
        templates, and test scripts.
      </p>
      <CodeBlock
        language="bash"
        filename="Clone and open"
        code={`git clone https://github.com/your-org/cowork-mcp-tutorial.git
cd cowork-mcp-tutorial/demo
code .`}
      />
      <WhatThisFileDoes
        path="demo/"
        does={
          <span>
            Contains the full MCP server, plug-in packages for Salesforce /
            ServiceNow / Jira, Bicep infra, and test scripts.
          </span>
        }
        edit={
          <span>
            You&apos;ll add tools in <Code>src/cowork_mcp/connectors/</Code> and
            tweak manifests in <Code>plugins/</Code>.
          </span>
        }
        dontEdit={
          <span>
            Don&apos;t modify <Code>infra/main.bicep</Code> until the Deployment
            chapter.
          </span>
        }
      />
      <Callout variant="beginner" title="Next step">
        With your environment ready, head to the{" "}
        <a href="/quickstart/">Quickstart</a> to scaffold your first plug-in, or
        jump to <a href="/concepts/">Core Concepts</a> if you want the theory
        first.
      </Callout>
    </ChapterShell>
  );
}
