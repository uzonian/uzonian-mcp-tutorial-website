import { ChapterShell } from "@/components/ChapterShell";
import { Callout } from "@/components/Callout";
import { CodeBlock } from "@/components/CodeBlock";
import { ConceptCheck } from "@/components/ConceptCheck";
import { Mermaid } from "@/components/Mermaid";
import { Table, Code } from "@/components/content";
import { VideoCard } from "@/components/VideoCard";

export const metadata = { title: "Register & Publish the Plug-in in Copilot Cowork" };

export default function Page() {
  return (
    <ChapterShell
      slug="copilot-studio"
      eyebrow="Chapter 8 · Ship"
      title="Register & Publish the Plug-in in Copilot Cowork"
      intro="Your MCP server is running and your plug-in package is ready. This chapter walks you through provisioning the plug-in with the Agents Toolkit, registering OAuth, sideloading into Copilot, and finally publishing through the admin center so every user in your tenant can reach it."
      learningGoals={[
        "Provision a plug-in with the Microsoft 365 Agents Toolkit",
        "Register the OAuth app with the correct redirect URI",
        "Sideload and test the agent in Copilot Cowork",
        "Publish and govern the plug-in via the admin center",
      ]}
      toc={[
        { id: "provision", label: "Provision" },
        { id: "register-oauth", label: "Register OAuth" },
        { id: "sideload", label: "Sideload" },
        { id: "use", label: "Use the agent" },
        { id: "publish", label: "Publish" },
        { id: "govern", label: "Govern" },
      ]}
      summary={
        <ul>
          <li>
            <strong>Provision</strong> uses the Agents Toolkit to register the
            plug-in in your M365 tenant.
          </li>
          <li>
            <strong>Register OAuth</strong> connects the delegated identity flow
            (redirect URI:{" "}
            <Code>https://teams.microsoft.com/api/platform/v1.0/oAuthRedirect</Code>).
          </li>
          <li>
            <strong>Sideload</strong> installs the dev version so you can test
            at <Code>m365.cloud.microsoft/chat</Code>.
          </li>
          <li>
            <strong>Publish</strong> submits the app for admin approval and
            tenant-wide deployment.
          </li>
        </ul>
      }
      reviewItems={[
        { id: "prov", label: "I can provision a plug-in with the Agents Toolkit" },
        { id: "oauth", label: "I know the redirect URI for Copilot OAuth" },
        { id: "side", label: "I can sideload and test the agent" },
        { id: "pub", label: "I understand the publish + govern workflow" },
      ]}
    >
      <h2 id="provision">Provision the plug-in</h2>
      <p>
        Provisioning registers your plug-in package in the Microsoft 365 tenant
        and creates the necessary app registrations. Before you run it, confirm
        two prerequisites in your tenant:
      </p>
      <Table
        headers={["Prerequisite", "Where to check"]}
        rows={[
          [
            <strong key="a">Custom App Upload enabled</strong>,
            "Teams Admin Center → Manage apps → Org-wide app settings",
          ],
          [
            <strong key="b">Copilot Access enabled</strong>,
            "Microsoft 365 Admin Center → Copilot → Settings",
          ],
        ]}
      />
      <p>
        Open your project in VS Code with the Agents Toolkit extension (v6.3+).
        Sign in to your M365 developer tenant, then run{" "}
        <strong>ATK: Provision</strong> from the Command Palette.
      </p>
      <CodeBlock
        language="text"
        filename="Command Palette"
        code={`ATK: Provision

# The toolkit:
# 1. Uploads the manifest package to your tenant
# 2. Creates or updates the app registration
# 3. Writes tenant-specific IDs back into env files`}
      />
      <Callout variant="beginner" title="First time?">
        If you see a &ldquo;sign-in required&rdquo; prompt, choose your M365
        developer account — the same one linked to the tenant where Copilot is
        enabled.
      </Callout>

      <h2 id="register-oauth">Register the OAuth app</h2>
      <p>
        For enterprise connections (Salesforce, ServiceNow, Jira), the plug-in
        needs delegated user identity. During provisioning the toolkit prompts
        you for your OAuth app details. Enter:
      </p>
      <Table
        headers={["Field", "Value"]}
        rows={[
          [<strong key="a">Client ID</strong>, "The OAuth app client ID from the resource provider"],
          [<strong key="b">Client secret</strong>, "The matching secret (stored securely by the platform)"],
          [
            <strong key="c">Redirect URI</strong>,
            <Code key="c2">https://teams.microsoft.com/api/platform/v1.0/oAuthRedirect</Code>,
          ],
        ]}
      />
      <Callout variant="security" title="Redirect URI must match exactly">
        The redirect URI{" "}
        <Code>https://teams.microsoft.com/api/platform/v1.0/oAuthRedirect</Code>{" "}
        must be registered in your resource provider&apos;s OAuth app settings
        (e.g., Atlassian Developer Console, Salesforce Connected App). A
        mismatch causes a silent auth failure.
      </Callout>
      <CodeBlock
        language="json"
        filename="ai-plugin.json (auth section)"
        code={`{
  "auth": {
    "type": "OAuthPluginVault",
    "reference_id": "my-connection-oauth"
  }
}`}
      />

      <h2 id="sideload">Sideload the agent</h2>
      <p>
        After provisioning, the toolkit automatically sideloads the plug-in into
        your Copilot environment. You can also trigger this manually with{" "}
        <strong>ATK: Sideload</strong>. The agent appears in the Copilot chat
        list with a <Code>dev</Code> suffix appended to its name.
      </p>
      <Mermaid
        alt="Diagram showing the sideload flow from VS Code to Copilot"
        chart={`sequenceDiagram
    participant Dev as VS Code (ATK)
    participant M365 as M365 Tenant
    participant Chat as Copilot Chat
    Dev->>M365: Upload manifest package
    M365-->>Dev: App ID + sideload confirmation
    Dev->>Chat: Sideload agent (dev)
    Chat-->>Dev: Agent visible with "dev" suffix`}
        caption="Sideload flow: Agents Toolkit → M365 → Copilot Chat"
      />

      <h2 id="use">Use the agent</h2>
      <p>
        Open{" "}
        <a
          href="https://m365.cloud.microsoft/chat"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://m365.cloud.microsoft/chat
        </a>{" "}
        in your browser. Your sideloaded agent appears in the agent list with a{" "}
        <Code>dev</Code> suffix. Select it, then try one of the conversation
        starters defined in your declarative agent. The first call will trigger
        the OAuth consent flow if you chose OAuth 2.1.
      </p>
      <Callout variant="tip" title="Testing the OAuth flow">
        After consent, verify the tool actually returns live data. If you see a
        generic error, check that your redirect URI matches exactly and that the
        required scopes are granted.
      </Callout>
      <ConceptCheck
        question={
          <p>
            Why does the sideloaded agent name end with <Code>dev</Code>?
          </p>
        }
        answer={
          <p>
            The <Code>dev</Code> suffix distinguishes a sideloaded (developer)
            version from a published, admin-approved version. It prevents
            confusion when both exist in the same tenant.
          </p>
        }
      />

      <h2 id="publish">Publish the plug-in</h2>
      <p>
        When you&apos;re satisfied the agent works, submit it for admin approval.
        Run <strong>ATK: Publish</strong> from the Command Palette. This
        packages your manifest and uploads it to the organization&apos;s app
        catalog, where a tenant admin can review and approve it.
      </p>
      <CodeBlock
        language="text"
        filename="Command Palette"
        code={`ATK: Publish

# Submits the app to the tenant app catalog.
# An admin must approve before it appears to all users.`}
      />

      <h2 id="govern">Govern via the admin center</h2>
      <p>
        After publishing, the tenant admin governs the plug-in from the Teams
        Admin Center (or the Microsoft 365 Admin Center). Governance includes:
      </p>
      <ul>
        <li>Approving or blocking the app for the organization</li>
        <li>Assigning user groups who can access the plug-in</li>
        <li>Reviewing permissions and OAuth consent grants</li>
        <li>Revoking or updating the app when a new version is submitted</li>
      </ul>
      <Callout variant="production" title="Admin review is mandatory">
        No plug-in reaches end users without admin approval. This is a
        deliberate security gate — treat it as part of your release process, not
        an afterthought.
      </Callout>
      <VideoCard
        verified={false}
        concept="Publishing and governing Copilot plug-ins via the admin center"
        level="intermediate"
        searchQuery="Microsoft 365 Copilot publish plug-in admin center governance (official Microsoft)"
        why="Seeing the admin approval flow end-to-end helps you prepare your submission and avoid common rejection reasons."
      />
    </ChapterShell>
  );
}
