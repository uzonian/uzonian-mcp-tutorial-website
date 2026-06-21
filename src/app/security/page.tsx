import { ChapterShell } from "@/components/ChapterShell";
import { Callout } from "@/components/Callout";
import { CodeBlock } from "@/components/CodeBlock";
import { ConceptCheck } from "@/components/ConceptCheck";
import { Mermaid } from "@/components/Mermaid";
import { Table, Code } from "@/components/content";
import { VideoCard } from "@/components/VideoCard";

export const metadata = { title: "Security & Connection Types" };

export default function Page() {
  return (
    <ChapterShell
      slug="security"
      eyebrow="Chapter 10 · Secure"
      title="Security: MCP Connection & Authentication Types"
      intro="Every Copilot Cowork plug-in connects to its MCP server through one of four authentication modes. This chapter explains each type — what it is, when to use it, how to configure it — then gives you a decision guide and a list of non-negotiable security rules."
      learningGoals={[
        "Name the four MCP connection/auth types Cowork supports",
        "Choose the right type for a given scenario",
        "Configure OAuth 2.1 with the correct redirect URI",
        "Apply the non-negotiable security rules to every plug-in",
      ]}
      toc={[
        { id: "connection-types", label: "Connection types overview" },
        { id: "anonymous", label: "Anonymous / None" },
        { id: "api-key", label: "API key" },
        { id: "oauth", label: "OAuth 2.1" },
        { id: "entra-sso", label: "Microsoft Entra SSO" },
        { id: "choosing", label: "Choosing a type" },
        { id: "rules", label: "Non-negotiable rules" },
      ]}
      summary={
        <ul>
          <li>
            Four connection types: <strong>Anonymous</strong>,{" "}
            <strong>API key</strong>, <strong>OAuth 2.1</strong>, and{" "}
            <strong>Entra SSO</strong>.
          </li>
          <li>
            <strong>OAuth 2.1 with static registration</strong> is the
            recommended default for enterprise systems — it gives delegated,
            per-user access.
          </li>
          <li>
            Redirect URI for Copilot:{" "}
            <Code>https://teams.microsoft.com/api/platform/v1.0/oAuthRedirect</Code>.
          </li>
          <li>
            Security rules are non-negotiable: least privilege, secrets in Key
            Vault, request-scoped tokens never logged.
          </li>
        </ul>
      }
      reviewItems={[
        { id: "types", label: "I can name all four connection types" },
        { id: "choose", label: "I can pick the right type for my scenario" },
        { id: "oauth-cfg", label: "I know the OAuth redirect URI" },
        { id: "rules", label: "I can recite the security non-negotiables" },
      ]}
    >
      <h2 id="connection-types">Connection types overview</h2>
      <p>
        When a Copilot Cowork plug-in calls your MCP server, it must prove who
        (or what) is calling. The platform supports four authentication modes,
        each suited to different trust levels and use cases.
      </p>
      <Table
        headers={["Type", "Identity", "Use case", "Production-ready?"]}
        rows={[
          [
            <strong key="a">Anonymous / None</strong>,
            "No identity",
            "Dev servers, public read-only APIs",
            "No (dev only)",
          ],
          [
            <strong key="b">API key</strong>,
            "Shared secret (machine)",
            "Machine-to-machine, no user context",
            "Limited",
          ],
          [
            <strong key="c">OAuth 2.1 (static reg.)</strong>,
            "Delegated per-user token",
            "Enterprise systems (Salesforce, Jira, ServiceNow)",
            "Yes ✓ (recommended)",
          ],
          [
            <strong key="d">Microsoft Entra SSO</strong>,
            "User\u2019s M365 identity",
            "Backend trusts Entra ID directly",
            "Yes ✓",
          ],
        ]}
      />

      <h2 id="anonymous">Anonymous / None</h2>
      <p>
        The simplest mode: no authentication at all. The MCP server receives
        requests without any identity claims. Use this only during local
        development or for genuinely public, read-only data sources.
      </p>
      <Callout variant="warning" title="Never ship anonymous to production">
        An anonymous connection means anyone who discovers the URL can call your
        tools. There is no user identity, no audit trail, and no way to scope
        data per user. Keep it for <Code>localhost</Code> only.
      </Callout>
      <CodeBlock
        language="json"
        filename="ai-plugin.json (anonymous)"
        code={`{
  "auth": {
    "type": "None"
  }
}`}
      />

      <h2 id="api-key">API key</h2>
      <p>
        An API key is a shared secret sent as a header on every request. It
        identifies the <em>application</em>, not the user. Good for
        machine-to-machine integrations where user context is unnecessary — for
        example, calling an internal metrics service.
      </p>
      <CodeBlock
        language="json"
        filename="ai-plugin.json (API key)"
        code={`{
  "auth": {
    "type": "ApiKeyPluginVault",
    "reference_id": "my-api-key-ref"
  }
}`}
      />
      <Callout variant="tip" title="When API key is enough">
        If every user should see the same data and there is no per-user
        permission model, an API key is simpler than OAuth. But the moment you
        need &ldquo;show me <em>my</em> tickets,&rdquo; you need delegated
        identity.
      </Callout>

      <h2 id="oauth">OAuth 2.1 with static registration</h2>
      <p>
        This is the <strong>recommended</strong> connection type for enterprise
        plug-ins. The user signs in to the resource system (Salesforce,
        ServiceNow, Jira) and grants consent. The platform exchanges the
        authorization code for a short-lived, <strong>delegated</strong> token
        scoped to that user. Your MCP server receives the token on each request
        and uses it to call the resource on behalf of the signed-in user.
      </p>
      <Table
        headers={["Setting", "Value"]}
        rows={[
          [<strong key="a">Auth type in ai-plugin.json</strong>, <Code key="a2">OAuthPluginVault</Code>],
          [
            <strong key="b">Redirect URI (Copilot)</strong>,
            <Code key="b2">https://teams.microsoft.com/api/platform/v1.0/oAuthRedirect</Code>,
          ],
          [
            <strong key="c">Redirect URI (VS Code fetch)</strong>,
            <Code key="c2">https://vscode.dev/redirect</Code>,
          ],
          [<strong key="d">Token lifetime</strong>, "Short-lived (resource decides); refresh via offline_access"],
        ]}
      />
      <CodeBlock
        language="json"
        filename="ai-plugin.json (OAuth 2.1)"
        code={`{
  "auth": {
    "type": "OAuthPluginVault",
    "reference_id": "jira-oauth"
  }
}`}
      />
      <Mermaid
        alt="OAuth 2.1 delegated flow: user consent, code exchange, token passed to MCP server"
        chart={`sequenceDiagram
    participant User
    participant Copilot
    participant AuthServer as Resource Auth Server
    participant MCP as MCP Server
    User->>Copilot: Invoke tool
    Copilot->>User: Redirect to consent
    User->>AuthServer: Sign in + consent
    AuthServer->>Copilot: Authorization code
    Copilot->>AuthServer: Exchange code for token
    AuthServer->>Copilot: Access token (delegated)
    Copilot->>MCP: Call tool + ******
    MCP->>AuthServer: Validate / use token
    MCP->>Copilot: Tool result`}
        caption="OAuth 2.1 delegated token flow for a Cowork plug-in"
      />
      <Callout variant="security" title="Per-user, request-scoped tokens">
        The token belongs to one user and one request. Never cache tokens across
        users, never log token values, and always let them expire naturally.
      </Callout>

      <h2 id="entra-sso">Microsoft Entra SSO</h2>
      <p>
        When your MCP server backend already trusts Microsoft Entra ID (formerly
        Azure AD), you can use <strong>Entra SSO</strong>. The user&apos;s
        existing M365 identity flows through without an extra sign-in prompt.
        This is ideal for first-party or internal services that accept Entra
        tokens.
      </p>
      <Table
        headers={["Setting", "Value"]}
        rows={[
          [<strong key="a">Auth type</strong>, <Code key="a2">MicrosoftEntra</Code>],
          [
            <strong key="b">Consent redirect URI</strong>,
            <Code key="b2">https://teams.microsoft.com/api/platform/v1.0/oAuthConsentRedirect</Code>,
          ],
          [<strong key="c">Token issuer</strong>, "Microsoft identity platform (v2.0)"],
        ]}
      />
      <CodeBlock
        language="json"
        filename="ai-plugin.json (Entra SSO)"
        code={`{
  "auth": {
    "type": "MicrosoftEntra",
    "reference_id": "entra-sso-ref"
  }
}`}
      />

      <h2 id="choosing">Choosing the right connection type</h2>
      <p>
        Use this decision guide when starting a new plug-in. Begin at the top
        and follow the first match:
      </p>
      <Mermaid
        alt="Decision tree for choosing an MCP connection authentication type"
        chart={`flowchart TD
    A[Does the backend trust Entra ID?] -->|Yes| B[Use Entra SSO]
    A -->|No| C[Do you need per-user identity?]
    C -->|Yes| D[Use OAuth 2.1]
    C -->|No| E[Is it production?]
    E -->|Yes| F[Use API key]
    E -->|No| G[Use Anonymous]`}
        caption="Decision tree: pick the simplest type that meets your security requirements"
      />
      <ConceptCheck
        question={
          <p>
            Your plug-in connects to ServiceNow and must show each user only
            their own incidents. Which connection type should you choose?
          </p>
        }
        answer={
          <p>
            <strong>OAuth 2.1 with static registration.</strong> You need
            delegated, per-user identity so ServiceNow can scope results to the
            signed-in user. An API key would give everyone the same view.
          </p>
        }
      />

      <h2 id="rules">Non-negotiable security rules</h2>
      <p>
        Regardless of which connection type you choose, these rules apply to
        every Copilot Cowork plug-in. Treat them as a checklist before every
        release.
      </p>
      <Table
        headers={["Rule", "Rationale"]}
        rows={[
          [
            <strong key="a">Delegated per-user OAuth over service accounts</strong>,
            "Users see only what they are allowed to see — no over-privileged shared identity.",
          ],
          [
            <strong key="b">Secrets in Key Vault</strong>,
            "No secrets in env vars, config files, or source code. Managed identity reads them at runtime.",
          ],
          [
            <strong key="c">APIM gateway in front</strong>,
            "Rate-limiting, validation, and a stable URL. Never expose the raw compute endpoint.",
          ],
          [
            <strong key="d">Least privilege scopes</strong>,
            "Request only the OAuth scopes the tools actually need. No wildcard access.",
          ],
          [
            <strong key="e">Request-scoped tokens, never logged</strong>,
            "Tokens live for one request. Log the operation, never the token value.",
          ],
          [
            <strong key="f">Payload trimming</strong>,
            "Enforce a byte budget on tool responses to avoid exceeding Copilot context limits.",
          ],
        ]}
      />
      <Callout variant="security" title="Zero exceptions">
        These rules are non-negotiable. A plug-in that violates any of them
        should not pass code review, regardless of convenience or deadlines.
      </Callout>
      <VideoCard
        verified={false}
        concept="OAuth 2.1 authentication for Microsoft 365 Copilot plug-ins"
        level="intermediate"
        searchQuery="Microsoft Copilot plug-in OAuth authentication setup (official Microsoft docs)"
        why="Understanding the OAuth consent and token flow visually prevents the most common auth configuration mistakes."
      />
    </ChapterShell>
  );
}
