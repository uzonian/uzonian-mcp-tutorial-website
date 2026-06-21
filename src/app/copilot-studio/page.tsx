import { ChapterShell } from "@/components/ChapterShell";
import { Callout } from "@/components/Callout";
import { CodeBlock } from "@/components/CodeBlock";
import { ConceptCheck } from "@/components/ConceptCheck";
import { Table, Code } from "@/components/content";
import { VideoCard } from "@/components/VideoCard";

export const metadata = { title: "Copilot Studio & Atlassian OAuth" };

export default function Page() {
  return (
    <ChapterShell
      slug="copilot-studio"
      eyebrow="Chapter 8 · Integrate & Ship"
      title="Copilot Studio & Atlassian OAuth Setup"
      intro="Connect the pieces a user actually sees: create an Atlassian OAuth app, import the MCP connector into Power Platform, and add it to a Copilot Studio agent so a person can sign in and use your tools."
      learningGoals={[
        "Create an Atlassian OAuth 2.0 app with the right scopes and callback",
        "Explain why offline_access is required",
        "Import the MCP connector with the correct host and security settings",
        "Add the connector to a Copilot Studio agent and test it",
      ]}
      toc={[
        { id: "atlassian-app", label: "Create the Atlassian OAuth app" },
        { id: "offline", label: "Why offline_access" },
        { id: "import-connector", label: "Import the MCP connector" },
        { id: "add-to-agent", label: "Add to a Copilot Studio agent" },
      ]}
      summary={
        <ul>
          <li>
            The Atlassian app needs scopes <Code>read:jira-work</Code>,{" "}
            <Code>read:jira-user</Code>, <Code>write:jira-work</Code>, and{" "}
            <Code>offline_access</Code>.
          </li>
          <li>
            Client ID and secret live in the connector — never in the MCP server.
          </li>
          <li>
            Keep <Code>x-ms-agentic-protocol</Code> when importing, and set the
            generic OAuth 2 URLs.
          </li>
        </ul>
      }
      reviewItems={[
        { id: "app", label: "Atlassian app created with the four scopes" },
        { id: "callback", label: "Callback URL matches the Power Platform redirect" },
        { id: "offline", label: "I understand why offline_access is needed" },
        { id: "import", label: "Connector imported with the APIM host and MCP extension" },
        { id: "agent", label: "Connector added to an agent and tested" },
      ]}
    >
      <h2 id="atlassian-app">Create the Atlassian OAuth app</h2>
      <p>In the Atlassian Developer Console:</p>
      <ol>
        <li>Create an OAuth 2.0 integration.</li>
        <li>Add Jira API permissions.</li>
        <li>
          Add scopes: <Code>read:jira-work</Code>, <Code>read:jira-user</Code>,{" "}
          <Code>write:jira-work</Code>, <Code>offline_access</Code>.
        </li>
        <li>Set the callback URL:</li>
      </ol>
      <CodeBlock
        language="text"
        code={`https://global.consent.azure-apim.net/redirect`}
      />
      <Callout variant="note">
        For sovereign clouds, use the matching Power Platform redirect host. The
        Client ID and Client Secret are entered in the Copilot Studio / Power
        Platform connector — they are <strong>not</strong> stored in the MCP
        server.
      </Callout>

      <h2 id="offline">Why offline_access is needed</h2>
      <Callout variant="why">
        Power Platform needs to <strong>refresh</strong> the user&apos;s
        Atlassian access token. Without <Code>offline_access</Code>, the user may
        have to reauthenticate too frequently, or the connector may fail once the
        short-lived access token expires. Adding it lets the platform obtain a
        refresh token and keep the connection working.
      </Callout>

      <h2 id="import-connector">Import the MCP connector</h2>
      <p>
        Edit <Code>openapi\\mcp-connector.swagger.json</Code> and replace the
        host placeholder with your APIM host:
      </p>
      <CodeBlock
        language="json"
        code={`"host": "REPLACE-WITH-APIM-NAME.azure-api.net"`}
      />
      <p>
        Keep the base path aligned with APIM, and keep the agentic-protocol
        extension:
      </p>
      <CodeBlock
        language="json"
        code={`"basePath": "/jira-mcp"
"x-ms-agentic-protocol": "mcp-streamable-1.0"`}
      />
      <p>Import the Swagger as a custom connector and configure security:</p>
      <Table
        headers={["Setting", "Value"]}
        rows={[
          ["Identity provider", "Generic OAuth 2"],
          ["Authorization URL", "https://auth.atlassian.com/authorize"],
          ["Token URL", "https://auth.atlassian.com/oauth/token"],
          ["Refresh URL", "https://auth.atlassian.com/oauth/token"],
          ["Scope", "read:jira-work read:jira-user write:jira-work offline_access"],
        ]}
      />
      <Callout variant="warning">
        If you import the file and Copilot Studio shows no tools, the most common
        cause is a lost <Code>x-ms-agentic-protocol</Code> extension — the
        connector was treated as plain REST. Re-import and preserve it.
      </Callout>

      <h2 id="add-to-agent">Add the connector to a Copilot Studio agent</h2>
      <ol>
        <li>Open the target agent.</li>
        <li>Go to tools.</li>
        <li>Add a Model Context Protocol tool.</li>
        <li>Select the custom connector.</li>
        <li>Create a connection and sign in to Atlassian.</li>
        <li>Let Copilot Studio discover the tools.</li>
      </ol>
      <p>Test prompts:</p>
      <Table
        headers={["Prompt", "Expected tool"]}
        rows={[
          ['"Who am I in Jira?"', <Code key="1">jira_whoami</Code>],
          ['"Find my open Jira issues."', <Code key="2">jira_search</Code>],
          ['"List projects I can see in Jira."', <Code key="3">jira_get_projects</Code>],
          ['"Create a task in PROJ called Test from Copilot."', <Code key="4">jira_create_issue</Code>],
        ]}
      />

      <ConceptCheck
        question={
          <p>
            A user connects successfully and <Code>jira_whoami</Code> works, but
            an hour later every call fails until they reconnect. Which scope is
            most likely missing, and why?
          </p>
        }
        answer={
          <p>
            <Code>offline_access</Code>. Without it, Power Platform can&apos;t
            obtain a refresh token, so once the initial short-lived access token
            expires (often around an hour), there&apos;s no way to refresh it and
            calls fail until the user re-authenticates. Add{" "}
            <Code>offline_access</Code> to both the Atlassian app and the
            connector scopes.
          </p>
        }
      />

      <VideoCard
        verified={false}
        concept="Adding an MCP / custom connector tool to a Copilot Studio agent"
        level="intermediate"
        searchQuery='Copilot Studio add Model Context Protocol tool custom connector (Microsoft official)'
        why="An official Microsoft walkthrough of the Copilot Studio tools UI removes guesswork from the connection and consent steps."
      />
    </ChapterShell>
  );
}
