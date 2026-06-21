import { ChapterShell } from "@/components/ChapterShell";
import { Callout } from "@/components/Callout";
import { glossary } from "@/lib/glossary";

export const metadata = { title: "Glossary & Principles" };

const PRINCIPLES = [
  "Start native MCP-first.",
  "Keep /mcp as the primary agent endpoint.",
  "Use delegated identity whenever user data is involved.",
  "Do not store user tokens in the MCP server.",
  "Put APIM in front for production.",
  "Use Key Vault for gateway secrets.",
  "Validate the gateway secret in the app, not only in APIM.",
  "Return compact, typed results.",
  "Cap search sizes.",
  "Test auth failures as carefully as success paths.",
  "Treat the connector schema as production code.",
  "Prefer clear, narrow tools over broad API passthrough tools.",
  "Make local development easy, but do not weaken production security.",
  "Document every required portal value, redirect URI, scope, and environment variable.",
  "Validate the whole path: Copilot Studio → connector → APIM → MCP server → upstream and back.",
];

function anchor(term: string) {
  return term.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export default function Page() {
  return (
    <ChapterShell
      slug="glossary"
      eyebrow="Reference"
      title="Glossary & Final Principles"
      intro="Plain-English definitions of every key term, followed by the fifteen principles to keep in mind whenever you build an MCP server from this scaffold."
      learningGoals={[
        "Look up any term used in the guide",
        "Internalise the final implementation principles",
      ]}
      toc={[
        { id: "terms", label: "Glossary terms" },
        { id: "principles", label: "Final principles" },
      ]}
      summary={
        <p>
          Keep this page bookmarked. The terms are linked from search, and the
          principles double as a quick design review before you ship.
        </p>
      }
    >
      <h2 id="terms">Glossary terms</h2>
      <dl className="mt-4 space-y-4">
        {glossary.map((g) => (
          <div
            key={g.term}
            id={anchor(g.term)}
            className="scroll-mt-24 rounded-xl border border-slate-200 p-4 dark:border-slate-700"
          >
            <dt className="font-semibold text-slate-900 dark:text-white">
              {g.term}
            </dt>
            <dd className="mt-1 text-sm text-slate-700 dark:text-slate-300">
              {g.short}
              {g.detail && (
                <span className="mt-2 block text-slate-600 dark:text-slate-400">
                  {g.detail}
                </span>
              )}
            </dd>
          </div>
        ))}
      </dl>

      <h2 id="principles">Final implementation principles</h2>
      <Callout variant="why" title="Use these as a pre-ship review">
        Read down this list before any production deploy. If you can&apos;t
        confidently say &ldquo;yes&rdquo; to each, revisit the relevant chapter.
      </Callout>
      <ol className="mt-4 space-y-2">
        {PRINCIPLES.map((p, i) => (
          <li
            key={i}
            className="flex items-start gap-3 rounded-lg border border-slate-200 p-3 text-sm dark:border-slate-700"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-azure-100 text-xs font-bold text-azure-700 dark:bg-azure-950/60 dark:text-azure-300">
              {i + 1}
            </span>
            <span className="text-slate-700 dark:text-slate-300">{p}</span>
          </li>
        ))}
      </ol>
    </ChapterShell>
  );
}
