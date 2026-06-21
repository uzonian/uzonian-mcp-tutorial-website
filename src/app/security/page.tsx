import { ChapterShell } from "@/components/ChapterShell";
import { Callout } from "@/components/Callout";
import { Mermaid } from "@/components/Mermaid";
import { ConceptCheck } from "@/components/ConceptCheck";
import { Table, Code } from "@/components/content";

export const metadata = { title: "Security Model" };

const IDENTITY = `flowchart TD
    U[User] --> PP[Power Platform connector]
    PP -->|OAuth 2.0 authorization code flow| ATL[Atlassian OAuth]
    ATL -->|access token for user| PP
    PP -->|Authorization: Bearer user token| MCP[MCP server]
    MCP -->|same bearer token| JIRA[Jira Cloud]
    JIRA -->|enforces user permissions| MCP`;

export default function Page() {
  return (
    <ChapterShell
      slug="security"
      eyebrow="Chapter 10 · Operate"
      title="Security Model"
      intro="The rules that keep this server safe in production: delegated identity, no standing credentials, a hardened gateway, redacted logs, and bounded responses. Read this before you deploy anything real."
      learningGoals={[
        "Recite the non-negotiable security rules",
        "Trace where identity flows and where permissions are enforced",
        "Map each asset to its threat and mitigation",
        "Convert the server to a safe read-only deployment",
      ]}
      toc={[
        { id: "rules", label: "Non-negotiable rules" },
        { id: "identity", label: "Identity diagram" },
        { id: "threats", label: "Threat model" },
        { id: "read-only", label: "Read-only mode" },
      ]}
      summary={
        <ul>
          <li>
            No service accounts, no PATs, no stored refresh tokens, no token
            logging, no wildcard CORS, no unlimited search.
          </li>
          <li>
            Jira enforces user permissions; the gateway secret blocks direct app
            access.
          </li>
          <li>
            Read-only mode = drop write scopes and write tools, keep read tools.
          </li>
        </ul>
      }
      reviewItems={[
        { id: "rules", label: "I can list the eight non-negotiable rules" },
        { id: "identity", label: "I can explain where permissions are enforced" },
        { id: "threats", label: "I reviewed the threat model table" },
        { id: "readonly", label: "I know how to make a read-only deployment" },
      ]}
    >
      <h2 id="rules">Non-negotiable rules</h2>
      <Callout variant="security" title="For this type of MCP server">
        <ol>
          <li>Do not use Jira service accounts for user-specific data.</li>
          <li>Do not store Jira PATs.</li>
          <li>Do not store user refresh tokens in the MCP server.</li>
          <li>Do not log bearer tokens.</li>
          <li>Do not return raw upstream errors that may contain sensitive data.</li>
          <li>Do not use wildcard CORS in production.</li>
          <li>Do not expose direct app host access as the intended production path.</li>
          <li>Do not return unlimited search results.</li>
        </ol>
      </Callout>

      <h2 id="identity">Identity diagram</h2>
      <Mermaid
        chart={IDENTITY}
        alt="The user authorises the Power Platform connector, which runs the OAuth 2.0 authorization code flow with Atlassian OAuth. Atlassian returns an access token for the user. The connector sends that token as a bearer Authorization header to the MCP server, which forwards the same token to Jira Cloud. Jira enforces the user's permissions."
        caption="Permissions are enforced by Jira, using the user's own token — the server never decides what a user may see."
      />

      <h2 id="threats">Threat model summary</h2>
      <Table
        headers={["Asset", "Threat", "Mitigation"]}
        rows={[
          ["User Jira data", "Cross-user access", "Delegated bearer token per request; Jira enforces user permissions."],
          ["Atlassian OAuth client secret", "Leakage", "Stored in the Power Platform connector, not server code."],
          ["Gateway secret", "Direct app bypass", "Key Vault secret injected by APIM and checked by the app."],
          ["Public endpoint", "Abuse", "APIM rate limits, quotas, IP filtering, TLS."],
          ["Tokens in logs", "Disclosure", "Redacting logging filter."],
          ["Large Jira responses", "Agent failure", "Field projection and byte-budget trimming."],
          ["Container runtime", "Privilege escalation", "Non-root runtime user."],
          ["Source repository", "Secret leakage", ".env ignored and gitleaks in CI."],
        ]}
      />

      <Callout variant="why" title="Defense in depth">
        Notice that no single control is trusted alone. Even if APIM is
        misconfigured, the app still checks the gateway token; even if a log line
        is careless, the redaction filter catches the token. Layers mean one
        mistake isn&apos;t a breach.
      </Callout>

      <h2 id="read-only">Read-only mode</h2>
      <p>For a read-only deployment:</p>
      <ol>
        <li>
          Remove <Code>write:jira-work</Code> from the connector scopes.
        </li>
        <li>
          Remove the write tools: <Code>jira_create_issue</Code>,{" "}
          <Code>jira_update_issue_summary</Code>, <Code>jira_add_comment</Code>,{" "}
          <Code>jira_transition_issue</Code>.
        </li>
        <li>
          Keep the read tools: <Code>jira_whoami</Code>,{" "}
          <Code>jira_search</Code>, <Code>jira_get_issue</Code>,{" "}
          <Code>jira_list_transitions</Code>, <Code>jira_get_projects</Code>.
        </li>
        <li>Update documentation and tests to match.</li>
      </ol>
      <Callout variant="tip">
        Read-only is an excellent first production deployment: it delivers value
        (search, lookups, project lists) while removing any chance of the agent
        modifying data while you build confidence.
      </Callout>

      <ConceptCheck
        question={
          <p>
            Someone proposes adding a <Code>jira_run_jql</Code> tool that
            executes any JQL with no result cap, &ldquo;for power users.&rdquo;
            Which two non-negotiable rules does this violate?
          </p>
        }
        answer={
          <p>
            Rule 8 (do not return unlimited search results) most directly, and
            arguably the spirit of narrow, guardrailed tools. Unbounded results
            risk oversized payloads (breaking the agent) and unreviewed,
            expensive queries. Keep search capped with{" "}
            <Code>max_results</Code> and cursor paging.
          </p>
        }
      />
    </ChapterShell>
  );
}
