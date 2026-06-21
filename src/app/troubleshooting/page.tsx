import { ChapterShell } from "@/components/ChapterShell";
import { Callout } from "@/components/Callout";
import { Mermaid } from "@/components/Mermaid";
import { ConceptCheck } from "@/components/ConceptCheck";
import { Table, Code } from "@/components/content";

export const metadata = { title: "Troubleshooting" };

const TREE = `flowchart TD
    S([/mcp call fails]) --> A{HTTP status?}
    A -- 401 --> A1[Missing/malformed bearer<br/>Reauthenticate connection<br/>Verify Authorization reaches APIM]
    A -- 403 --> B{Gateway or Jira?}
    B -- Gateway --> B1[App didn't get correct X-Gateway-Token<br/>Call through APIM; check Key Vault named value]
    B -- Jira --> B2[User lacks permission / wrong site<br/>Check Jira project permissions; pin JIRA_SITE_URL]
    A -- Payload error --> C[AsyncResponsePayloadTooLarge<br/>Lower MAX_RESPONSE_BYTES & MAX_RESULTS_CAP]
    A -- No tools listed --> D[Connector imported as REST<br/>Reimport, preserve x-ms-agentic-protocol]`;

export default function Page() {
  return (
    <ChapterShell
      slug="troubleshooting"
      eyebrow="Chapter 13 · Operate"
      title="Troubleshooting"
      intro="When something breaks, the HTTP status code usually tells you which box in the architecture to look at. Start with the decision tree, then use the symptom-cause-fix table for specifics."
      learningGoals={[
        "Use status codes to localise a failure to one component",
        "Diagnose the most common 401, 403, origin, and payload errors",
        "Recognise the 'no tools listed' connector problem",
      ]}
      toc={[
        { id: "tree", label: "Decision tree" },
        { id: "table", label: "Symptom · cause · fix" },
      ]}
      summary={
        <ul>
          <li>401 → token; 403 → gateway secret or Jira permission.</li>
          <li>No tools → connector imported as REST (missing MCP extension).</li>
          <li>
            Payload errors → lower <Code>MAX_RESPONSE_BYTES</Code> /{" "}
            <Code>MAX_RESULTS_CAP</Code> and trim harder.
          </li>
        </ul>
      }
      reviewItems={[
        { id: "401", label: "I can diagnose a 401 on /mcp" },
        { id: "403", label: "I can tell a gateway 403 from a Jira 403" },
        { id: "tools", label: "I know why no tools would be listed" },
        { id: "payload", label: "I know how to fix a payload-too-large error" },
      ]}
    >
      <h2 id="tree">Decision tree</h2>
      <p>
        Start at the top with the status code or symptom, then follow the branch
        to the likely cause and fix.
      </p>
      <Mermaid
        chart={TREE}
        alt="A troubleshooting decision tree for a failing /mcp call. If the status is 401, the bearer token is missing or malformed: reauthenticate the connection and verify the Authorization header reaches API Management. If 403, decide whether it's a gateway or Jira error: a gateway 403 means the app didn't receive the correct X-Gateway-Token, so call through API Management and check the Key Vault named value; a Jira 403 means the user lacks permission or the wrong site was selected, so check Jira project permissions and pin JIRA_SITE_URL. A payload error (AsyncResponsePayloadTooLarge) means lower MAX_RESPONSE_BYTES and MAX_RESULTS_CAP. If no tools are listed, the connector was imported as REST, so reimport and preserve x-ms-agentic-protocol."
        caption="The fastest triage: let the status code point you at the right component."
      />

      <Callout variant="beginner" title="Why status codes matter">
        A <Code>401</Code> means &ldquo;who are you?&rdquo; (authentication) — the
        token problem. A <Code>403</Code> means &ldquo;I know who you are, but
        no&rdquo; (authorization) — either the gateway didn&apos;t trust the call,
        or Jira denied the user. Telling them apart saves hours.
      </Callout>

      <h2 id="table">Symptom · cause · fix</h2>
      <Table
        headers={["Symptom", "Likely cause", "Fix"]}
        rows={[
          [<Code key="1">/mcp</Code>, "Missing or malformed bearer token", "Reauthenticate the connection; verify the Authorization header reaches APIM."],
          [<span key="2"><Code>/mcp</Code> 403 gateway error</span>, "App didn't receive correct X-Gateway-Token", "Call through APIM; verify the Key Vault named value resolved; verify the app setting."],
          ["Origin blocked", "Origin not in ALLOWED_ORIGINS", "Add the correct Copilot Studio / Power Platform origin; never use wildcard in production."],
          ["Jira returns 403", "User lacks permission or wrong site selected", "Verify Jira project permissions; pin JIRA_SITE_URL if needed."],
          ["No tools listed in Copilot Studio", "Connector imported as REST or MCP extension missing", "Reimport mcp-connector.swagger.json and preserve x-ms-agentic-protocol."],
          ["Atlassian sign-in fails", "Redirect URI mismatch", "Match the Atlassian callback URL to the Power Platform connector redirect URL."],
          ["Token refresh fails", "Missing offline_access", "Add the scope to the Atlassian app and the connector."],
          [<Code key="8">AsyncResponsePayloadTooLarge</Code>, "Response budget too high or tool returns too much", "Lower MAX_RESPONSE_BYTES and MAX_RESULTS_CAP; trim fields more aggressively."],
          ["Local server starts but Jira calls fail", "No real Atlassian token", "Use a Copilot Studio connection or supply a valid short-lived token for tests."],
          ["APIM deploy succeeds but calls fail", "Placeholder IP filter still active", "Replace or temporarily remove REPLACE_START_IP / REPLACE_END_IP."],
          ["Container does not start", "Wrong image, port, or dependency issue", "Check App Service / Container Apps logs; verify PORT and WEBSITES_PORT."],
        ]}
      />

      <ConceptCheck
        question={
          <p>
            Calls through APIM return <Code>403</Code> with a gateway message,
            but the app&apos;s own <Code>/healthz</Code> is fine and a direct
            call to the app host (bypassing APIM) actually <em>works</em>. What
            does this tell you?
          </p>
        }
        answer={
          <p>
            APIM isn&apos;t injecting the expected <Code>X-Gateway-Token</Code>{" "}
            (or the app&apos;s configured secret doesn&apos;t match), so
            legitimate gateway traffic is rejected while the unprotected direct
            path still responds. Fix the Key Vault named value / app setting so
            the tokens match — and make sure direct host access is <em>not</em>{" "}
            your production path.
          </p>
        }
      />
    </ChapterShell>
  );
}
