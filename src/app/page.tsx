import Link from "next/link";
import { Card, CardGrid } from "@/components/Card";
import { Mermaid } from "@/components/Mermaid";
import { Callout } from "@/components/Callout";
import { chapters, groupOrder } from "@/lib/chapters";

const ARCH = `flowchart LR
    User([User]) --> Agent[Copilot Studio agent]
    Agent --> Connector[Power Platform custom connector]
    Connector --> APIM[Azure API Management]
    APIM --> App[Python FastMCP server]
    App --> Jira[(Jira Cloud REST API)]
    Connector -. OAuth 2.0 3LO .-> Atlassian[Atlassian OAuth]
    APIM -. gateway secret .-> KeyVault[(Azure Key Vault)]
    App -. logs/traces .-> AppInsights[(Application Insights)]`;

export default function HomePage() {
  return (
    <div className="prose-content">
      {/* Hero */}
      <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-azure-50 to-white p-8 dark:border-slate-800 dark:from-azure-950/40 dark:to-slate-950">
        <span className="inline-block rounded-full bg-azure-100 px-3 py-1 text-xs font-semibold text-azure-700 dark:bg-azure-950/60 dark:text-azure-300">
          Beginner-friendly · Production-grade
        </span>
        <h1 className="mt-4">
          Build a production-ready MCP server for Microsoft Copilot Studio
        </h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
          Learn to design, build, secure, test, deploy, and operate a Model
          Context Protocol (MCP) server in Python — then connect it to a Copilot
          Studio agent through Azure API Management. The reference example
          exposes Jira Cloud, but the patterns work for any enterprise system.
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
        understand the complete path from local development to a working Copilot
        Studio integration. Every chapter adds plain-English explanations,
        visuals, hands-on labs, and review checklists.
      </p>

      <CardGrid cols={3}>
        <Card title="New to MCP" icon="🌱">
          Start with <Link href="/before-you-begin/">Before You Begin</Link> for
          a jargon-free primer, then follow the chapters in order.
        </Card>
        <Card title="Want a quick win" icon="⚡">
          Go straight to the{" "}
          <Link href="/quickstart/">Quickstart</Link> to run the server locally
          and pass the smoke test.
        </Card>
        <Card title="Shipping to production" icon="🚀">
          Jump to{" "}
          <Link href="/deployment/">Deployment</Link>,{" "}
          <Link href="/security/">Security</Link>, and the{" "}
          <Link href="/checklist/">Production Checklist</Link>.
        </Card>
      </CardGrid>

      {/* What you'll build */}
      <h2>What you&apos;ll build</h2>
      <p>
        A server that lets an AI agent safely use tools. In the reference
        implementation, the agent is a Copilot Studio agent and the external
        system is Jira Cloud. When a user asks{" "}
        <em>&ldquo;Find my open Jira issues&rdquo;</em>, the MCP server reads the
        signed-in user&apos;s delegated token, calls Jira as that user, trims the
        response, and returns a compact result.
      </p>

      <Mermaid
        chart={ARCH}
        alt="High-level architecture: a user talks to a Copilot Studio agent, which uses a Power Platform custom connector. The connector calls Azure API Management, which forwards to a Python FastMCP server, which calls the Jira Cloud REST API. The connector performs OAuth 2.0 3LO with Atlassian. API Management reads a gateway secret from Azure Key Vault. The server sends logs and traces to Application Insights."
        caption="The big picture. Every chapter zooms into one part of this flow."
      />

      <Callout variant="security" title="Security is central, not an afterthought">
        This design uses <strong>delegated OAuth 2.0 3LO</strong> so actions run
        as the signed-in user — never a shared service account or API token.
        Tokens are request-scoped and never stored, APIM hardens the public
        edge, and a Key Vault-backed gateway secret proves traffic came through
        the gateway. You&apos;ll see these themes repeated throughout.
      </Callout>

      {/* Learning path */}
      <h2>The learning path</h2>
      <p>
        Nineteen chapters grouped into six stages. Work through them in order,
        or use the sidebar and search to jump around.
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
