import { ChapterShell } from "@/components/ChapterShell";
import { Callout } from "@/components/Callout";
import { Card, CardGrid } from "@/components/Card";
import { ConceptCheck } from "@/components/ConceptCheck";
import { CodeBlock } from "@/components/CodeBlock";
import { Table, Code, Compare } from "@/components/content";
import { VideoCard } from "@/components/VideoCard";

export const metadata = { title: "Core Concepts" };

export default function Page() {
  return (
    <ChapterShell
      slug="concepts"
      eyebrow="Chapter 1 · Understand"
      title="Core Concepts"
      intro="The eight ideas that everything else builds on: MCP and tools, streamable HTTP, native MCP versus REST, delegated OAuth 3LO, the Copilot Studio connector, APIM, Key Vault, and payload trimming."
      learningGoals={[
        "Define MCP, tools, and streamable HTTP",
        "Explain why native MCP is preferred over a REST fallback",
        "Describe delegated OAuth 2.0 3LO and why no service account is used",
        "Say what APIM, Key Vault, and payload trimming each protect against",
      ]}
      toc={[
        { id: "mcp", label: "What is MCP?" },
        { id: "tool", label: "Tools" },
        { id: "streamable-http", label: "Streamable HTTP" },
        { id: "native-vs-rest", label: "Native MCP vs REST" },
        { id: "connector", label: "Copilot Studio connector" },
        { id: "oauth-3lo", label: "Delegated OAuth 3LO" },
        { id: "apim", label: "API Management" },
        { id: "key-vault", label: "Key Vault" },
        { id: "trimming", label: "Payload trimming" },
      ]}
      summary={
        <ul>
          <li>MCP standardises how an agent discovers and calls tools.</li>
          <li>
            Streamable HTTP exposes one <Code>/mcp</Code> endpoint;{" "}
            <Code>stateless_http</Code> and <Code>json_response</Code> make it
            gateway-friendly.
          </li>
          <li>
            Native MCP is the primary design; REST is only a fallback for
            environments that can&apos;t use MCP.
          </li>
          <li>
            Delegated 3LO runs actions as the user — no service accounts, no
            PATs. APIM, Key Vault, and trimming protect the edge, secrets, and
            response size.
          </li>
        </ul>
      }
      reviewItems={[
        { id: "mcp", label: "I can define MCP and a tool" },
        { id: "transport", label: "I know why stateless_http and json_response matter" },
        { id: "native", label: "I can argue for native MCP over REST" },
        { id: "3lo", label: "I can explain delegated 3LO and why no service account" },
        { id: "edge", label: "I know what APIM, Key Vault, and trimming protect" },
      ]}
    >
      <h2 id="mcp">What is MCP?</h2>
      <p>
        <strong>Model Context Protocol</strong> is a protocol for connecting AI
        applications to tools and data sources. Instead of teaching the model to
        call a random API directly, an MCP server describes tools in a standard
        way. A client can ask:
      </p>
      <ul>
        <li>What tools do you expose?</li>
        <li>What parameters does each tool accept?</li>
        <li>Call this tool with these arguments.</li>
      </ul>
      <p>
        In the reference implementation, <Code>FastMCP</Code> from the Python MCP
        SDK handles the protocol details for you.
      </p>

      <h2 id="tool">Tools</h2>
      <p>
        A <strong>tool</strong> is a callable function exposed to the agent. Its
        name, typed arguments, and docstring are all part of what the MCP client
        discovers. The reference server exposes tools like these:
      </p>
      <Table
        headers={["Tool", "Purpose"]}
        rows={[
          [<Code key="1">jira_whoami</Code>, "Return the signed-in Jira user."],
          [<Code key="2">jira_search</Code>, "Search Jira with JQL."],
          [<Code key="3">jira_get_issue</Code>, "Return one trimmed issue."],
          [<Code key="4">jira_create_issue</Code>, "Create an issue."],
          [<Code key="5">jira_add_comment</Code>, "Add a comment."],
          [<Code key="6">jira_transition_issue</Code>, "Apply a workflow transition."],
          [<Code key="7">jira_get_projects</Code>, "List visible projects."],
        ]}
      />
      <Callout variant="tip" title="The golden rule of tool design">
        A tool should do <strong>one clear thing</strong> and return a{" "}
        <strong>predictable, compact object</strong>. You&apos;ll revisit this
        in <a href="/build-your-own/">Build Your Own</a>.
      </Callout>

      <h2 id="streamable-http">Streamable HTTP</h2>
      <p>
        Streamable HTTP is the MCP transport used here. The server exposes one
        HTTP endpoint, <Code>/mcp</Code>, and the client sends JSON-RPC-style
        requests through it. The reference server creates the app like this:
      </p>
      <CodeBlock
        language="python"
        code={`FastMCP(settings.server_name, stateless_http=True, json_response=True)`}
      />
      <Table
        headers={["Setting", "Meaning"]}
        rows={[
          [
            <Code key="1">stateless_http=True</Code>,
            "Every request is self-contained — important behind gateways and cloud load balancers.",
          ],
          [
            <Code key="2">json_response=True</Code>,
            "Return buffered JSON instead of relying on a long-lived streaming connection. Gateway-friendly.",
          ],
        ]}
      />

      <h2 id="native-vs-rest">Native MCP versus REST fallback</h2>
      <p>
        Native MCP exposes a single <Code>/mcp</Code> operation and the agent
        discovers tools dynamically. A REST fallback exposes separate operations
        like <Code>/tools/jira_search</Code> — easier to grasp at first, but it
        loses dynamic discovery and forces you to maintain connector operations
        by hand.
      </p>
      <Compare
        betterLabel="Native MCP (primary design)"
        worseLabel="REST fallback (last resort)"
        rows={[
          {
            better: "One /mcp operation; tools discovered dynamically",
            worse: "One REST route per tool, maintained manually",
          },
          {
            better: "Copilot Studio treats it as an MCP tool source",
            worse: "Behaves like an ordinary REST connector",
          },
          {
            better: "New tools appear automatically",
            worse: "Every new tool means new connector work",
          },
        ]}
      />
      <Callout variant="warning" title="Don't 'simplify' to REST">
        REST can feel familiar, so it&apos;s tempting. The build review was
        explicit: native MCP is the correct primary design. Keep REST only for
        environments that genuinely cannot use MCP — never convert the
        production design to REST just because it feels easier.
      </Callout>

      <h2 id="connector">The Copilot Studio MCP connector</h2>
      <p>
        Copilot Studio consumes the server through a Power Platform custom
        connector. The important file is{" "}
        <Code>openapi\\mcp-connector.swagger.json</Code>, and the critical line
        is:
      </p>
      <CodeBlock
        language="json"
        code={`"x-ms-agentic-protocol": "mcp-streamable-1.0"`}
      />
      <Callout variant="warning">
        Without that extension, Copilot Studio may treat the connector like a
        normal REST connector instead of an MCP tool source — and no tools will
        appear.
      </Callout>

      <h2 id="oauth-3lo">Delegated OAuth 2.0 3LO</h2>
      <p>
        Delegated OAuth means the user signs in and grants access; the server
        receives a short-lived access token <em>for that user</em>.{" "}
        <strong>3LO</strong> means three-legged OAuth, with three parties:
      </p>
      <CardGrid cols={3}>
        <Card title="1. User" icon="👤">
          The person asking the agent a question.
        </Card>
        <Card title="2. Client app" icon="🧩">
          The Power Platform / Copilot Studio connector.
        </Card>
        <Card title="3. Resource provider" icon="🗄️">
          Atlassian, which owns the Jira data.
        </Card>
      </CardGrid>
      <p>
        The server does <strong>not</strong> own a Jira identity. It forwards the
        user&apos;s token to Jira, so permissions stay correct automatically:
      </p>
      <ul>
        <li>If the user can see an issue, the tool can see it.</li>
        <li>If the user cannot, Jira rejects the request.</li>
        <li>The server never recreates Jira&apos;s permission logic.</li>
      </ul>
      <Callout variant="security" title="No service account. No PAT.">
        This design deliberately avoids shared standing credentials. They
        over-grant access, are hard to rotate, and turn one leak into a
        tenant-wide incident. Delegated per-user tokens are the safe default.
      </Callout>

      <h2 id="apim">Azure API Management (APIM)</h2>
      <p>Azure API Management is the public gateway in front of the MCP server. It provides:</p>
      <ul>
        <li>An HTTPS gateway endpoint</li>
        <li>CORS policy and IP filtering</li>
        <li>Rate limits and quotas</li>
        <li>Header checks and gateway integrity secret injection</li>
        <li>Response hardening headers</li>
      </ul>
      <Callout variant="note">
        APIM is not the <em>only</em> line of defense. The app still validates
        its security assumptions — defense in depth.
      </Callout>

      <h2 id="key-vault">Azure Key Vault</h2>
      <p>
        Key Vault stores the <strong>gateway shared secret</strong>. APIM reads
        it as a named value and injects it as <Code>X-Gateway-Token</Code>; the
        app verifies it. That secret proves a request actually came through APIM,
        blocking attempts to reach the app host directly.
      </p>

      <h2 id="trimming">Payload trimming</h2>
      <p>
        Agent platforms have response-size limits. Jira issue payloads can be
        huge (descriptions, comments, changelogs, custom fields). The reference
        implementation prevents oversized responses by:
      </p>
      <ol>
        <li>Requesting only the fields it needs from Jira.</li>
        <li>Converting issues into small response models.</li>
        <li>Clipping long text.</li>
        <li>Enforcing a byte budget before returning data to Copilot Studio.</li>
      </ol>

      <ConceptCheck
        question={
          <p>
            A teammate suggests returning the full raw Jira JSON &ldquo;so the
            agent has everything.&rdquo; Why is that a bad idea here?
          </p>
        }
        answer={
          <p>
            Raw Jira payloads can blow past Copilot Studio&apos;s response-size
            limit and trigger <Code>AsyncResponsePayloadTooLarge</Code>, breaking
            the tool call. Returning compact, trimmed models keeps responses
            predictable and within budget — and the agent rarely needs the full
            payload anyway.
          </p>
        }
      />

      <VideoCard
        verified={false}
        concept="OAuth 2.0 authorization code flow (the basis of 3LO)"
        level="intermediate"
        searchQuery='"OAuth 2.0" authorization code flow explained (Microsoft OR Okta OR Auth0 official)'
        why="Seeing the redirect-and-consent dance animated makes delegated 3LO much easier to reason about."
      />
    </ChapterShell>
  );
}
