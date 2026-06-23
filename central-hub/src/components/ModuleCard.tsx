import type { HubModule } from "@/lib/modules";

/** Topic chip shown on a module card. */
function Tag({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
      {children}
    </span>
  );
}

function ArrowIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CardBody({ module }: { module: HubModule }) {
  const isComingSoon = module.status === "coming-soon";
  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <span
          className={
            isComingSoon
              ? "inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400"
              : "inline-flex items-center rounded-full bg-azure-100 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-azure-700 dark:bg-azure-950/60 dark:text-azure-300"
          }
        >
          {isComingSoon ? "Coming soon" : "Published"}
        </span>
        {!isComingSoon && (
          <span
            className="text-azure-600 dark:text-azure-400"
            aria-hidden="true"
          >
            <ArrowIcon />
          </span>
        )}
      </div>

      <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
        {module.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        {module.summary}
      </p>

      {module.tags.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Topics">
          {module.tags.map((tag) => (
            <li key={tag}>
              <Tag>{tag}</Tag>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

/**
 * A single tutorial-module card.
 *
 * Published modules are mounted at their own path prefix and live in a separate
 * deployment zone, so the card is a plain `<a>` with an absolute href — a full
 * document load (NOT next/link, which would treat the path as an internal route
 * and break cross-zone navigation). Coming-soon modules render as a disabled,
 * non-interactive card.
 */
export function ModuleCard({ module }: { module: HubModule }) {
  const baseCard =
    "flex h-full flex-col rounded-xl border p-6 transition-shadow";

  if (module.status === "coming-soon") {
    return (
      <div
        aria-disabled="true"
        className={`${baseCard} border-dashed border-slate-200 bg-slate-50/60 opacity-75 dark:border-slate-800 dark:bg-slate-900/40`}
      >
        <CardBody module={module} />
      </div>
    );
  }

  return (
    <a
      href={module.href}
      aria-label={`Open tutorial: ${module.title}`}
      className={`group ${baseCard} border-slate-200 bg-white hover:border-azure-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-azure-700`}
    >
      <CardBody module={module} />
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-azure-600 dark:text-azure-400">
        Start tutorial
        <ArrowIcon />
      </span>
    </a>
  );
}
