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
      eyebrow="Get Started"
      title="Before You Begin"
      intro="A jargon-free primer. By the end of this short chapter, the words you'll meet later — API, token, OAuth, JSON, terminal — won't feel like a foreign language."
      learningGoals={[
        "Explain what an API, a token, and OAuth are in plain English",
        "Recognise JSON and know why it's everywhere in this guide",
        "Feel comfortable opening a terminal and running a command",
        "Understand what an MCP server is, at a high level",
      ]}
      toc={[
        { id: "no-expert", label: "You don't need to be an expert" },
        { id: "words", label: "Words you'll meet" },
        { id: "mcp-plain", label: "MCP in plain English" },
        { id: "mindset", label: "The security mindset" },
      ]}
      summary={
        <ul>
          <li>An API is how programs talk; a token is a temporary pass.</li>
          <li>OAuth lets you grant access without sharing your password.</li>
          <li>JSON is the text format used to send structured data.</li>
          <li>
            An MCP server is a safe, standard way to give an AI agent tools.
          </li>
        </ul>
      }
      reviewItems={[
        { id: "api", label: "I can explain an API in one sentence" },
        { id: "token", label: "I understand what a token is and why it expires" },
        { id: "oauth", label: "I know what 'delegated access' means" },
        { id: "json", label: "I can recognise JSON" },
        { id: "terminal", label: "I'm comfortable running a terminal command" },
      ]}
    >
      <h2 id="no-expert">You don&apos;t need to be an expert</h2>
      <p>
        This guide assumes you are new to Python and new to agentic tools. You
        do <strong>not</strong> need to memorise anything here — treat this page
        as a friendly glossary you can come back to whenever a term feels fuzzy.
      </p>

      <Callout variant="beginner" title="Read this whole page first">
        Five minutes here will save you confusion in every later chapter. Each
        idea below is explained again, in context, where you actually use it.
      </Callout>

      <h2 id="words">Words you&apos;ll meet</h2>

      <CardGrid>
        <Card title="API" icon="🔌">
          An <strong>Application Programming Interface</strong> is how one
          program asks another program to do something — like a waiter taking
          your order to the kitchen. Jira has an API; your MCP server calls it.
        </Card>
        <Card title="Token" icon="🎟️">
          A <strong>token</strong> is a temporary pass that proves who you are.
          Like a hotel key card, it expires and can be revoked. Your server
          forwards the user&apos;s token to Jira instead of storing a password.
        </Card>
        <Card title="OAuth" icon="🔑">
          <strong>OAuth</strong> is a way to grant an app access to your data{" "}
          <em>without giving it your password</em>. You sign in once and approve
          what the app can do. That approval produces a token.
        </Card>
        <Card title="JSON" icon="📦">
          <strong>JSON</strong> is a simple text format for structured data —
          lists, labels, and values. APIs send and receive JSON. You&apos;ll see
          a lot of it, and it&apos;s easy to read once it clicks.
        </Card>
        <Card title="Endpoint" icon="📍">
          An <strong>endpoint</strong> is a single URL an API listens on. This
          server&apos;s main endpoint is <Code>/mcp</Code>.
        </Card>
        <Card title="Terminal" icon="⌨️">
          The <strong>terminal</strong> (here, PowerShell) is a text window where
          you type commands instead of clicking buttons. VS Code has one built
          in.
        </Card>
      </CardGrid>

      <p>Here is a tiny piece of JSON, so it&apos;s not a surprise later:</p>

      <Table
        headers={["You'll see…", "It means…"]}
        rows={[
          [
            <Code key="1">{`{ "status": "ok" }`}</Code>,
            "An object with one label 'status' whose value is the text 'ok'.",
          ],
          [
            <Code key="2">{`"key": "PROJ-123"`}</Code>,
            "A label 'key' with the value 'PROJ-123'.",
          ],
          [
            <Code key="3">{`[ "a", "b" ]`}</Code>,
            "A list containing two text items.",
          ],
        ]}
      />

      <h2 id="mcp-plain">MCP in plain English</h2>
      <p>
        <strong>MCP (Model Context Protocol)</strong> is a standard way to give
        an AI agent a set of <em>tools</em>. Instead of teaching the AI to poke
        at a raw API, you publish a tidy menu of actions — &ldquo;search
        issues&rdquo;, &ldquo;create issue&rdquo; — and the agent picks the right
        one.
      </p>
      <p>Think of it like this:</p>
      <Table
        headers={["Everyday analogy", "MCP equivalent"]}
        rows={[
          ["A restaurant menu", "The list of tools the server exposes"],
          ["Ordering a dish", "The agent calling a tool"],
          [
            "The kitchen",
            "Your MCP server doing the real work (calling Jira)",
          ],
          [
            "The waiter checking your ID",
            "Delegated token: actions run as the signed-in user",
          ],
        ]}
      />

      <ConceptCheck
        question={
          <p>
            Why is forwarding the <em>user&apos;s</em> token to Jira safer than
            using one shared account for everyone?
          </p>
        }
        answer={
          <p>
            Because Jira already knows what each user is allowed to see. If the
            server acts as the signed-in user, Jira automatically enforces that
            user&apos;s permissions. A single shared account would either
            over-expose data (it can see everything) or force you to rebuild
            Jira&apos;s permission rules yourself.
          </p>
        }
      />

      <h2 id="mindset">The security mindset</h2>
      <p>
        One idea will repeat in every chapter:{" "}
        <strong>
          never hold more power than you need, and never store secrets you
          don&apos;t have to.
        </strong>{" "}
        That&apos;s why this design uses short-lived per-user tokens, keeps
        secrets in Azure Key Vault, and puts a gateway in front of the server.
      </p>

      <Callout variant="why">
        Beginners often reach for the &ldquo;easy&rdquo; option: one API key
        that does everything. This guide deliberately avoids that, because easy
        shortcuts become the security incident later. Learning the safe pattern
        from day one is the whole point.
      </Callout>

      <VideoCard
        verified={false}
        concept="What the Model Context Protocol is and why it exists"
        level="beginner"
        searchQuery='"Model Context Protocol" introduction (modelcontextprotocol.io OR Microsoft OR VS Code)'
        why="A short conceptual overview from an official MCP, Microsoft, or VS Code source helps the protocol click before you read code."
      />
    </ChapterShell>
  );
}
