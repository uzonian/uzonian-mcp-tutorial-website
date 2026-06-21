import { ChapterShell } from "@/components/ChapterShell";
import { Callout } from "@/components/Callout";
import { CodeBlock } from "@/components/CodeBlock";
import { Mermaid } from "@/components/Mermaid";
import { Table, Code } from "@/components/content";
import { WhatThisFileDoes } from "@/components/WhatThisFileDoes";
import { VideoCard } from "@/components/VideoCard";

export const metadata = { title: "Plug-in Anatomy" };

export default function Page() {
  return (
    <ChapterShell
      slug="anatomy"
      eyebrow="Chapter 4 · Understand"
      title="Plug-in Anatomy: Every Component, File by File"
      intro="A guided tour of every file and moving part inside a Copilot Cowork plug-in package — and the MCP connection that lives inside it. By the end you will be able to trace a tool call from the agent all the way to your Python server and back."
      learningGoals={[
        "Identify every file in a Cowork plug-in package and explain its role",
        "Describe the MCP connection components inside the package",
        "Trace the flow from manifest to declarative agent to action to server",
        "Explain how .vscode/mcp.json fits into the development workflow",
      ]}
      toc={[
        { id: "package", label: "The plug-in package" },
        { id: "manifest", label: "manifest.json" },
        { id: "declarative-agent", label: "declarativeAgent.json" },
        { id: "action", label: "ai-plugin.json (action descriptor)" },
        { id: "mcp-server", label: "MCP server endpoint" },
        { id: "tools", label: "Tools" },
        { id: "widgets", label: "UI widgets" },
        { id: "auth-binding", label: "Authentication binding" },
        { id: "mcp-json", label: ".vscode/mcp.json" },
        { id: "map", label: "Component map" },
      ]}
      summary={
        <ul>
          <li>
            A plug-in package is a folder with a <Code>manifest.json</Code>, a{" "}
            <Code>declarativeAgent.json</Code>, and one or more action
            descriptors (<Code>ai-plugin.json</Code>).
          </li>
          <li>
            The action descriptor declares the MCP runtime — the server URL, the
            selected tools, and the auth binding.
          </li>
          <li>
            The MCP server exposes tools (and optional widgets) over streamable
            HTTP at <Code>/mcp</Code>.
          </li>
          <li>
            During development, <Code>.vscode/mcp.json</Code> tells the Agents
            Toolkit where to find the running server.
          </li>
        </ul>
      }
      reviewItems={[
        { id: "files", label: "I can name every file in a plug-in package" },
        { id: "action", label: "I understand what ai-plugin.json declares" },
        { id: "flow", label: "I can trace a tool call end to end" },
        { id: "dev", label: "I know what .vscode/mcp.json is for" },
      ]}
    >
      <h2 id="package">The plug-in package</h2>
      <p>
        A Copilot Cowork plug-in ships as a folder of JSON files that follow the
        Microsoft 365 app model — the same packaging used for Teams apps and
        declarative agents. Everything an admin needs to deploy, govern, and
        update the plug-in lives in this folder.
      </p>
      <CodeBlock
        language="text"
        filename="plugins/salesforce/"
        code={`plugins/salesforce/
├── manifest.json            # Package identity and references
├── declarativeAgent.json    # Agent definition (instructions + actions)
├── ai-plugin.json           # Action descriptor (MCP runtime + auth)
└── SKILL.md                 # Skill recipe (optional)`}
      />
      <Callout variant="beginner" title="The Toolkit scaffolds this for you">
        You rarely write these JSON files from scratch. The Microsoft 365 Agents
        Toolkit generates the manifest and declarative agent when you create a
        new project, and fills in <Code>ai-plugin.json</Code> when you fetch
        tools from your server.
      </Callout>

      <h2 id="manifest">manifest.json</h2>
      <p>
        The manifest is the outermost identity file. It gives the plug-in a name,
        version, icons, and a pointer to the declarative agent definition. Admin
        consent, Teams app store listing, and update governance all key off this
        file.
      </p>
      <WhatThisFileDoes
        path="plugins/salesforce/manifest.json"
        does={
          <span>
            Declares the plug-in&apos;s identity (name, version, icons) and
            references the declarative agent file.
          </span>
        }
        edit={
          <span>
            Name, description, version, and icon paths.
          </span>
        }
        dontEdit={
          <span>
            The <Code>$schema</Code> URL, <Code>manifestVersion</Code>, and the{" "}
            <Code>copilotAgents</Code> reference structure.
          </span>
        }
      />
      <CodeBlock
        language="json"
        filename="manifest.json (key fields)"
        code={`{
  "$schema": "https://developer.microsoft.com/json-schemas/copilot/plugin/v2.2/schema.json",
  "version": "1.0.0",
  "name": { "short": "Salesforce Cowork", "full": "Salesforce Cowork Plug-in" },
  "description": { "short": "Connect Copilot Cowork to Salesforce" },
  "icons": { "color": "color.png", "outline": "outline.png" },
  "copilotAgents": {
    "declarativeAgents": [
      { "id": "salesforceAgent", "file": "declarativeAgent.json" }
    ]
  }
}`}
      />

      <h2 id="declarative-agent">declarativeAgent.json</h2>
      <p>
        The declarative agent is the brain of the plug-in. It contains the
        system instructions that shape behaviour, conversation starters that help
        users begin, and the list of actions the agent can take. Actions are
        references to action descriptors — each one an MCP connection.
      </p>
      <WhatThisFileDoes
        path="plugins/salesforce/declarativeAgent.json"
        does={
          <span>
            Defines the agent&apos;s instructions, conversation starters, and
            lists the actions (MCP connections) it may invoke.
          </span>
        }
        edit={
          <span>
            Instructions text and conversation starters to fit your workflow.
          </span>
        }
        dontEdit={
          <span>
            The <Code>actions</Code> array structure — the Toolkit manages this
            when you add or remove MCP connections.
          </span>
        }
      />
      <CodeBlock
        language="json"
        filename="declarativeAgent.json"
        code={`{
  "$schema": "https://aka.ms/json-schemas/copilot/plugin/v1.0/schema.json",
  "name": "Salesforce Cowork Agent",
  "description": "Helps you work inside Salesforce from Copilot Cowork.",
  "instructions": "You help the user query Salesforce data, manage cases, and triage the pipeline. Always confirm before creating or updating records.",
  "conversation_starters": [
    { "title": "Pipeline triage", "text": "Show at-risk opportunities this quarter" },
    { "title": "New case", "text": "Create a support case for Contoso" }
  ],
  "actions": [
    { "id": "salesforceMcp", "file": "ai-plugin.json" }
  ]
}`}
      />

      <h2 id="action">ai-plugin.json — the action descriptor</h2>
      <p>
        This is the most important file for the MCP connection. It declares the
        MCP runtime — the server URL, the list of functions (tools) the agent may
        call, and the authentication configuration. When you run{" "}
        <Code>ATK: Fetch action from MCP</Code> in the Toolkit, this file is what
        gets written.
      </p>
      <WhatThisFileDoes
        path="plugins/salesforce/ai-plugin.json"
        does={
          <span>
            Declares the MCP server URL, the selected tools, and the
            authentication binding for this action.
          </span>
        }
        edit={
          <span>
            The <Code>functions</Code> list (to add or remove exposed tools) and
            the auth configuration.
          </span>
        }
        dontEdit={
          <span>
            The <Code>runtimes</Code> block structure — generated by the Toolkit
            from your server&apos;s MCP response.
          </span>
        }
      />
      <CodeBlock
        language="json"
        filename="ai-plugin.json (simplified)"
        code={`{
  "schema_version": "v2.2",
  "name_for_human": "Salesforce MCP",
  "runtimes": [
    {
      "type": "OpenApi",
      "auth": { "type": "OAuthPluginVault" },
      "spec": {
        "url": "https://my-mcp-server.azurecontainerapps.io/mcp"
      },
      "run_for_functions": [
        "salesforce_whoami",
        "salesforce_query",
        "salesforce_get_record",
        "salesforce_create_case",
        "salesforce_update_opportunity"
      ]
    }
  ],
  "functions": [
    {
      "name": "salesforce_whoami",
      "description": "Return the currently signed-in Salesforce user."
    },
    {
      "name": "salesforce_query",
      "description": "Execute a SOQL query against Salesforce.",
      "parameters": {
        "type": "object",
        "properties": { "soql": { "type": "string" } },
        "required": ["soql"]
      }
    }
  ]
}`}
      />
      <Callout variant="security" title="The auth block is critical">
        The <Code>auth</Code> object inside the runtime tells Cowork how to
        obtain a token before calling the server. Never ship{" "}
        <Code>{'"type": "None"'}</Code> to production unless the server is truly
        public and read-only.
      </Callout>

      <h2 id="mcp-server">The MCP server endpoint</h2>
      <p>
        The MCP server is your Python application — built with FastMCP — that
        listens at an HTTPS endpoint (typically <Code>/mcp</Code>). Cowork
        connects to this URL using streamable HTTP, sends JSON-RPC requests to
        discover tools, and calls them. The server runs on Azure Container Apps
        or App Service in production.
      </p>
      <WhatThisFileDoes
        path="src/cowork_mcp/server.py"
        does={
          <span>
            Creates the FastMCP application, registers tools, and exposes the{" "}
            <Code>/mcp</Code> endpoint over streamable HTTP.
          </span>
        }
        edit={
          <span>
            Server name, tool registrations, and middleware configuration.
          </span>
        }
        dontEdit={
          <span>
            The <Code>stateless_http</Code> and <Code>json_response</Code>{" "}
            settings — changing them breaks gateway compatibility.
          </span>
        }
      />
      <CodeBlock
        language="python"
        filename="src/cowork_mcp/server.py (skeleton)"
        code={`from mcp.server.fastmcp import FastMCP
from .config import settings

mcp = FastMCP(settings.server_name, stateless_http=True, json_response=True)

# Tools are registered by importing connector modules
from .connectors import salesforce  # noqa: E402, F401

if __name__ == "__main__":
    mcp.run(transport="http", host="0.0.0.0", port=8000)`}
      />

      <h2 id="tools">Tools</h2>
      <p>
        A tool is a single callable function that the MCP server exposes to
        Cowork. Each tool has a name, a description, and typed parameters. When
        Cowork decides it needs live data or must take an action, it calls a tool
        on the server. Well-designed tools do one thing, accept clear inputs, and
        return compact responses.
      </p>
      <WhatThisFileDoes
        path="src/cowork_mcp/connectors/salesforce.py"
        does={
          <span>
            Registers Salesforce-specific tools (e.g.{" "}
            <Code>salesforce_query</Code>, <Code>salesforce_create_case</Code>)
            with the FastMCP server.
          </span>
        }
        edit={
          <span>
            Add or modify tool functions and their parameter schemas.
          </span>
        }
        dontEdit={
          <span>
            The <Code>@mcp.tool()</Code> decorator pattern — it is how FastMCP
            discovers your functions.
          </span>
        }
      />
      <CodeBlock
        language="python"
        filename="connectors/salesforce.py (one tool)"
        code={`from ..server import mcp
from ..auth import get_token
from ..trim import trim_payload

@mcp.tool()
async def salesforce_whoami() -> dict:
    """Return the currently signed-in Salesforce user."""
    token = get_token()
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{settings.sf_instance_url}/services/data/v60.0/chatter/users/me",
            headers={"Authorization": f"******"},
        )
        resp.raise_for_status()
    return trim_payload(resp.json(), max_bytes=4096)`}
      />

      <h2 id="widgets">UI widgets (MCP apps)</h2>
      <p>
        Beyond returning text, an MCP server can return interactive UI widgets —
        rich cards that render directly inside Copilot. These are called{" "}
        <strong>MCP apps</strong>. A widget might show an opportunity card with
        an &ldquo;Update Stage&rdquo; button or a sprint board with drag-drop.
        Widgets are optional and added after tools work.
      </p>
      <WhatThisFileDoes
        path="src/cowork_mcp/widgets/ (optional)"
        does={
          <span>
            Contains UI widget definitions (MCP apps) that render interactive
            cards inside Copilot alongside tool responses.
          </span>
        }
        edit={
          <span>
            Widget layout, fields, and actions.
          </span>
        }
        dontEdit={
          <span>
            The widget protocol envelope — Cowork expects a specific shape.
          </span>
        }
      />
      <Callout variant="note" title="Widgets require Toolkit 6.6.1+">
        MCP apps need OAuth 2.1 or Entra SSO (not anonymous or API-key) and the
        Agents Toolkit version 6.6.1 or later. Start with text-only tools, add
        widgets once the connection is solid.
      </Callout>

      <h2 id="auth-binding">Authentication binding</h2>
      <p>
        The authentication binding tells Cowork how to get a credential before it
        calls your server. The binding lives in the <Code>auth</Code> object
        inside <Code>ai-plugin.json</Code>. Cowork supports four modes:
        anonymous, API key, OAuth 2.1, and Microsoft Entra SSO.
      </p>
      <WhatThisFileDoes
        path="ai-plugin.json → runtimes[].auth"
        does={
          <span>
            Configures how Cowork authenticates to the MCP server — selecting the
            auth type and providing client/tenant IDs or key references.
          </span>
        }
        edit={
          <span>
            Auth type, OAuth client ID / authority URL, or API key header name.
          </span>
        }
        dontEdit={
          <span>
            Token exchange internals — Cowork handles the token lifecycle.
          </span>
        }
      />
      <Table
        headers={["Mode", "When to use", "ai-plugin.json type value"]}
        rows={[
          [
            <strong key="a1">Anonymous</strong>,
            "Dev/testing or public read-only",
            <Code key="a2">None</Code>,
          ],
          [
            <strong key="b1">API key</strong>,
            "Machine-to-machine, shared secret",
            <Code key="b2">ApiKeyPluginVault</Code>,
          ],
          [
            <strong key="c1">OAuth 2.1</strong>,
            "Enterprise per-user delegated access (recommended)",
            <Code key="c2">OAuthPluginVault</Code>,
          ],
          [
            <strong key="d1">Entra SSO</strong>,
            "Backend trusts Microsoft Entra identity",
            <Code key="d2">MicrosoftEntra</Code>,
          ],
        ]}
      />

      <h2 id="mcp-json">.vscode/mcp.json</h2>
      <p>
        This file is for development only. It tells the Agents Toolkit where your
        running MCP server is so it can start it, connect, and fetch tools. It is
        <em> not</em> part of the deployed plug-in package.
      </p>
      <WhatThisFileDoes
        path=".vscode/mcp.json"
        does={
          <span>
            Points the Agents Toolkit at your local (or remote) MCP server during
            development so you can fetch tools and test without deploying.
          </span>
        }
        edit={
          <span>
            The server URL and any environment variable references.
          </span>
        }
        dontEdit={
          <span>
            Do not commit secrets here — use <Code>.env</Code> references.
          </span>
        }
      />
      <CodeBlock
        language="json"
        filename=".vscode/mcp.json"
        code={`{
  "inputs": [],
  "servers": {
    "cowork-mcp-local": {
      "type": "http",
      "url": "http://localhost:8000/mcp"
    }
  }
}`}
      />

      <h2 id="map">Component map</h2>
      <p>
        Now let&apos;s see how all the pieces relate. The manifest references the
        declarative agent, which references the action descriptor, which points
        at the remote MCP server. The server exposes tools (and optional widgets)
        that Cowork discovers dynamically. The auth binding gates every call.
      </p>
      <Mermaid
        alt="Diagram showing the relationship between plug-in package files: manifest references declarative agent, which references the action descriptor pointing to the MCP server with tools and widgets"
        chart={`graph LR
  M[manifest.json] --> DA[declarativeAgent.json]
  DA --> AP[ai-plugin.json]
  AP -->|MCP URL| S[MCP Server /mcp]
  AP -->|auth binding| AUTH[OAuth / Entra / Key]
  S --> T[Tools]
  S --> W[Widgets]
  DEV[.vscode/mcp.json] -.->|dev only| S`}
        caption="How plug-in package files relate to the MCP server"
      />
      <Table
        headers={["Component", "File", "Purpose"]}
        rows={[
          [
            <strong key="r1">Package identity</strong>,
            <Code key="r1f">manifest.json</Code>,
            "Name, version, icons, pointer to agent",
          ],
          [
            <strong key="r2">Declarative agent</strong>,
            <Code key="r2f">declarativeAgent.json</Code>,
            "Instructions, starters, action list",
          ],
          [
            <strong key="r3">Action descriptor</strong>,
            <Code key="r3f">ai-plugin.json</Code>,
            "MCP runtime URL, tools, auth binding",
          ],
          [
            <strong key="r4">MCP server</strong>,
            <Code key="r4f">server.py</Code>,
            "Hosts tools over streamable HTTP",
          ],
          [
            <strong key="r5">Tools</strong>,
            <Code key="r5f">connectors/*.py</Code>,
            "Callable functions Cowork discovers",
          ],
          [
            <strong key="r6">Widgets</strong>,
            <Code key="r6f">widgets/ (optional)</Code>,
            "Interactive cards in Copilot UI",
          ],
          [
            <strong key="r7">Auth binding</strong>,
            <Code key="r7f">ai-plugin.json → auth</Code>,
            "Credential type and config",
          ],
          [
            <strong key="r8">Dev pointer</strong>,
            <Code key="r8f">.vscode/mcp.json</Code>,
            "Toolkit connects to server locally",
          ],
        ]}
        caption="Complete component inventory"
      />
      <VideoCard
        verified={false}
        concept="Anatomy of a Copilot Cowork plug-in package and MCP connection"
        level="intermediate"
        searchQuery="Microsoft Copilot Cowork plugin anatomy MCP connection components walkthrough"
        why="A visual walkthrough of the package structure helps cement how files reference each other."
      />
    </ChapterShell>
  );
}
