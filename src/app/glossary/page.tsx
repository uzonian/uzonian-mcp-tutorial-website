import { ChapterShell } from "@/components/ChapterShell";
import { Callout } from "@/components/Callout";
import { glossary } from "@/lib/glossary";

export const metadata = { title: "Glossary & Principles" };

const PRINCIPLES = [
  "Start MCP-first — make /mcp the primary agent endpoint.",
  "Use delegated per-user identity whenever user data is involved.",
  "Never store user tokens in the MCP server; use request-scoped context.",
  "Put APIM in front for production; validate the gateway secret in the app.",
  "Store secrets in Key Vault, accessed via managed identity.",
  "Design tools that do one clear thing and return compact, typed results.",
  "Cap search sizes and enforce a byte budget before serialising responses.",
  "Follow the four-part pattern: connection, tools, skill, auth.",
  "Test auth failures as carefully as success paths.",
  "Treat the plug-in manifest as production code — version and validate it.",
  "Document every required portal value, redirect URI, scope, and environment variable.",
  "Validate the whole path: Copilot → plug-in → APIM → MCP server → upstream and back.",
  "Make local development easy, but never weaken production security for convenience.",
  "Prefer clear, narrow tools over broad API passthrough tools.",
  "Ship a SKILL.md with every connector so the agent knows how to orchestrate the tools.",
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
      intro="Plain-English definitions of every key term used in this guide, followed by the fifteen principles for building extensible Copilot Cowork plug-ins."
      learningGoals={[
        "Look up any term used in the guide",
        "Internalise the final implementation principles for extensible plug-ins",
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

      <h2 id="principles">Final principles for extensible Cowork plug-ins</h2>
      <Callout variant="why" title="Use these as a pre-ship review">
        Read down this list before any production deploy. If you cannot
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
