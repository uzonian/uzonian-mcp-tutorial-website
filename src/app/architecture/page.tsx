import { ChapterShell } from "@/components/ChapterShell";
import { Callout } from "@/components/Callout";
import { Mermaid } from "@/components/Mermaid";
import { ConceptCheck } from "@/components/ConceptCheck";
import { Table, Code } from "@/components/content";

export const metadata = { title: "Architecture & Request Lifecycle" };

const HIGH_LEVEL = `flowchart LR
    User([User]) --> Agent[Copilot Studio agent]
    Agent --> Connector[Power Platform connector]
    Connector --> APIM[Azure API Management]
    APIM --> App[Python FastMCP server]
    App --> Jira[(Jira Cloud REST API)]
    Connector -. OAuth 2.0 3LO .-> Atlassian[Atlassian OAuth]
    APIM -. gateway secret .-> KeyVault[(Azure Key Vault)]
    App -. logs/traces .-> AppInsights[(Application Insights)]`;

const LIFECYCLE = `sequenceDiagram
    autonumber
    participant U as User
    participant CS as Copilot Studio
    participant PP as Power Platform connector
    participant APIM as Azure API Management
    participant MCP as FastMCP server
    participant JR as Jira Cloud
    U->>CS: Ask for Jira information
    CS->>PP: Select MCP connector
    PP->>PP: Refresh or obtain Atlassian user token
    PP->>APIM: POST /jira-mcp/mcp (Authorization: Bearer)
    APIM->>APIM: Check CORS, IP, rate limits, Authorization
    APIM->>MCP: Forward /mcp and inject X-Gateway-Token
    MCP->>MCP: Verify origin and gateway token
    MCP->>MCP: Bind bearer token to request ContextVar
    MCP->>JR: Resolve accessible Jira site
    MCP->>JR: Call Jira REST API as signed-in user
    JR-->>MCP: Return Jira response
    MCP->>MCP: Trim fields and enforce byte budget
    MCP-->>APIM: Return MCP tool result
    APIM-->>PP: Return response
    PP-->>CS: Tool result
    CS-->>U: Natural-language answer`;

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
      slug="architecture"
      eyebrow="Chapter 2 · Understand"
      title="Architecture & Request Lifecycle"
      intro="Follow a single question from a user's lips all the way to Jira and back. Once you can trace this path, every later chapter is just a close-up of one box in the diagram."
      learningGoals={[
        "Name each component in the end-to-end architecture",
        "Trace a request through the connector, APIM, the server, and Jira",
        "Explain where the user's token is obtained, forwarded, and discarded",
        "Identify which component enforces which protection",
      ]}
      toc={[
        { id: "high-level", label: "High-level architecture" },
        { id: "lifecycle", label: "Request lifecycle" },
        { id: "identity", label: "Where identity flows" },
        { id: "who-does-what", label: "Who does what" },
      ]}
      summary={
        <ul>
          <li>
            User → Copilot Studio → connector → APIM → FastMCP server → Jira, and
            back.
          </li>
          <li>
            The connector handles OAuth and holds tokens; the server only{" "}
            <em>borrows</em> the token for the duration of one request.
          </li>
          <li>
            APIM guards the edge; the app re-checks the gateway secret; Jira
            enforces user permissions.
          </li>
        </ul>
      }
      reviewItems={[
        { id: "components", label: "I can name every component in order" },
        { id: "token-life", label: "I know where the token is obtained and discarded" },
        { id: "protections", label: "I can map each protection to a component" },
      ]}
    >
      <h2 id="high-level">High-level architecture</h2>
      <p>
        Six moving parts, plus three supporting services (OAuth, Key Vault,
        Application Insights). Solid arrows are the request path; dotted arrows
        are supporting relationships.
      </p>
      <Mermaid
        chart={HIGH_LEVEL}
        alt="The user talks to a Copilot Studio agent, which uses a Power Platform connector, which calls Azure API Management, which forwards to the Python FastMCP server, which calls the Jira Cloud REST API. The connector does OAuth 2.0 3LO with Atlassian; API Management reads a gateway secret from Key Vault; the server sends logs and traces to Application Insights."
        caption="Solid = request path. Dotted = supporting services."
      />

      <h2 id="lifecycle">Request lifecycle</h2>
      <p>
        Here is the same flow as a step-by-step sequence. Read it top to bottom:
        each numbered line is one hop.
      </p>
      <Mermaid
        chart={LIFECYCLE}
        alt="A sequence diagram. The user asks Copilot Studio for Jira information. Copilot Studio selects the MCP connector. The Power Platform connector refreshes or obtains the Atlassian user token, then POSTs to /jira-mcp/mcp through API Management with a bearer token. API Management checks CORS, IP, rate limits, and the Authorization header, then forwards /mcp and injects X-Gateway-Token. The FastMCP server verifies the origin and gateway token, binds the bearer token to a request ContextVar, resolves the accessible Jira site, and calls the Jira REST API as the signed-in user. Jira returns a response; the server trims fields and enforces a byte budget, then returns the result back through API Management and the connector to Copilot Studio, which gives the user a natural-language answer."
        caption="One round trip. Every step maps to a chapter later in this guide."
      />

      <Callout variant="why" title="Why trace the whole path?">
        When something breaks in production, the fastest debuggers already have
        this picture in their head. A 401 vs a 403 vs a payload error each points
        to a different box. Memorising this flow pays off in{" "}
        <a href="/troubleshooting/">Troubleshooting</a>.
      </Callout>

      <h2 id="identity">Where identity flows</h2>
      <p>
        The single most important thread to follow is the{" "}
        <strong>user&apos;s token</strong>. It is created by Atlassian, held by
        the connector, borrowed by the server for one request, and used to call
        Jira as the user.
      </p>
      <Mermaid
        chart={IDENTITY}
        alt="The user authorises the Power Platform connector, which runs the OAuth 2.0 authorization code flow with Atlassian OAuth. Atlassian returns an access token for the user to the connector. The connector sends that token as a bearer Authorization header to the MCP server, which forwards the same bearer token to Jira Cloud. Jira enforces the user's permissions and responds to the MCP server."
        caption="The server never stores the token — it forwards it, then forgets it."
      />

      <h2 id="who-does-what">Who does what</h2>
      <Table
        headers={["Component", "Main responsibility", "Key protection"]}
        rows={[
          ["Copilot Studio", "Hosts the agent and chooses tools", "—"],
          [
            "Power Platform connector",
            "Runs OAuth, holds and refreshes tokens",
            "Tokens live here, not in the server",
          ],
          [
            "Azure API Management",
            "Public gateway and routing",
            "CORS, IP filtering, rate limits, gateway secret",
          ],
          [
            "FastMCP server",
            "Runs tools, calls Jira",
            "Re-checks gateway secret; request-scoped token",
          ],
          [
            "Jira Cloud",
            "Owns the data",
            "Enforces the user's permissions",
          ],
          ["Key Vault", "Stores the gateway secret", "Secret never in code"],
          [
            "Application Insights",
            "Logs and traces",
            "Tokens and secrets redacted",
          ],
        ]}
      />

      <ConceptCheck
        question={
          <p>
            A request reaches the app host directly (not through APIM) and is
            rejected with a 403. Which protection caught it, and where is the
            secret it relied on stored?
          </p>
        }
        answer={
          <p>
            The <Code>X-Gateway-Token</Code> check caught it: APIM injects that
            header, and the app verifies it. A direct request never went through
            APIM, so it lacks the correct token and is rejected. The secret
            itself is stored in <strong>Azure Key Vault</strong> and read by APIM
            as a named value.
          </p>
        }
      />
    </ChapterShell>
  );
}
