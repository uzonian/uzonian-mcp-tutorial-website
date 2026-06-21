import Link from "next/link";
import { Card, CardGrid } from "@/components/Card";
import { Mermaid } from "@/components/Mermaid";
import { Callout } from "@/components/Callout";
import { chapters, groupOrder } from "@/lib/chapters";

const ARCH = `flowchart LR
    User([User]) --> Cowork[Copilot Cowork agent]
    Cowork --> Plugin[Plug-in action]
    Plugin --> MCP[Remote MCP server on Azure]
    MCP --> SF[(Salesforce)]
    MCP --> SN[(ServiceNow)]
    MCP --> Jira[(Jira Cloud)]
    Plugin -. OAuth 2.1 sign-in .-> IdP[Resource OAuth]
    MCP -. secrets .-> KeyVault[(Azure Key Vault)]`;

export default function HomePage() {
  return (
    <div className="prose-content">
      {/* Hero */}
      <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-azure-50 to-white p-8 dark:border-slate-800 dark:from-azure-950/40 dark:to-slate-950">
        <span className="inline-block rounded-full bg-azure-100 px-3 py-1 text-xs font-semibold text-azure-700 dark:bg-azure-950/60 dark:text-azure-300">
          Beginner-friendly · Extensibility-first
        </span>
        <h1 className="mt-4">
          Build plug-ins that extend Microsoft Copilot Cowork
        </h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
          Learn how a Copilot Cowork plug-in is put together and how it reaches
          into enterprise systems through a <strong>Model Context Protocol (MCP)
          connection</strong>. You&apos;ll go deep on the components of that
          connection, the connection types Cowork supports, and how to set them
          up — then ship worked example plug-ins for{" "}
          <strong>Salesforce</strong>, <strong>ServiceNow</strong>, and{" "}
          <strong>Jira Cloud</strong>.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/before-you-begin/"
            className="rounded-lg bg-azure-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-azure-700"
          >
            Start from the beginning →
          </Link>
          <Link
            href="/quickstart/"
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Jump to the Quickstart
          </Link>
        </div>
      </section>

      {/* Who is this for */}
      <h2>Who this is for</h2>
      <p>
        This site is written for someone with{" "}
        <strong>limited Python experience</strong> and{" "}
        <strong>limited experience with agentic tools</strong>, who needs to
        understand the complete path from a local MCP server to a governed Copilot
        Cowork plug-in. Every chapter adds plain-English explanations, visuals,
        hands-on labs, and review checklists.
      </p>

      <CardGrid cols={3}>
        <Card title="New to plug-ins" icon="🌱">
          Start with <Link href="/before-you-begin/">Before You Begin</Link> for a
          jargon-free primer, then follow the chapters in order.
        </Card>
        <Card title="Here for the connection" icon="🔌">
          Jump to <Link href="/concepts/">Core Concepts</Link> and{" "}
          <Link href="/anatomy/">Plug-in Anatomy</Link> for the components of an
          MCP connection.
        </Card>
        <Card title="Want the examples" icon="🧰">
          Go straight to{" "}
          <Link href="/extending/">Salesforce, ServiceNow &amp; Jira</Link> for
          three worked example plug-ins.
        </Card>
      </CardGrid>

      {/* What you'll build */}
      <h2>What you&apos;ll build</h2>
      <p>
        A Copilot Cowork plug-in that gives the agent real reach into your
        systems. When a user asks{" "}
        <em>&ldquo;Prep my standup from my open Jira issues&rdquo;</em>, the plug-in
        runs a <strong>skill</strong> that calls tools over an{" "}
        <strong>MCP connection</strong>; the MCP server reads the signed-in
        user&apos;s delegated token, calls Jira as that user, trims the response,
        and returns a compact result the agent can act on.
      </p>

      <Mermaid
        chart={ARCH}
        alt="High-level architecture: a user talks to a Copilot Cowork agent, which uses a plug-in action. The action calls a remote MCP server hosted on Azure, which calls Salesforce, ServiceNow, and Jira Cloud. The action performs an OAuth 2.1 sign-in with the resource's identity provider. The MCP server reads secrets from Azure Key Vault."
        caption="The big picture. Every chapter zooms into one part of this flow."
      />

      <Callout variant="security" title="Extensibility and security go together">
        The recommended connection type is <strong>OAuth 2.1 with static
        registration</strong>, so actions run as the signed-in user — never a
        shared service account or API token. Tokens are request-scoped and never
        stored, APIM hardens the public edge, and secrets live in Key Vault.
        You&apos;ll see these themes repeated throughout.
      </Callout>

      {/* Learning path */}
      <h2>The learning path</h2>
      <p>
        Eighteen chapters grouped into six stages. Work through them in order, or
        use the sidebar and search to jump around.
      </p>

      {groupOrder.map((group) => {
        const items = chapters.filter(
          (c) => c.group === group && c.slug !== "search" && c.slug !== ""
        );
        if (items.length === 0) return null;
        return (
          <div key={group} className="my-6">
            <h3 className="mt-6">{group}</h3>
            <CardGrid>
              {items.map((c) => (
                <Card
                  key={c.slug}
                  title={c.title}
                  href={`/${c.slug}/`}
                  eyebrow={group}
                >
                  {c.summary}
                </Card>
              ))}
            </CardGrid>
          </div>
        );
      })}

      <Callout variant="beginner" title="How to use this site">
        <ul>
          <li>
            Use the <strong>search box</strong> (press{" "}
            <kbd className="inline-code">Ctrl</kbd> +{" "}
            <kbd className="inline-code">K</kbd>) to find any concept fast.
          </li>
          <li>
            Toggle <strong>dark / light mode</strong> with the button in the top
            bar.
          </li>
          <li>
            Look for <strong>concept checks</strong>, <strong>labs</strong>, and{" "}
            <strong>end-of-chapter checklists</strong> — they make the ideas
            stick.
          </li>
        </ul>
      </Callout>
    </div>
  );
}
