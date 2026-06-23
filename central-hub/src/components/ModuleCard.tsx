import type { HubModule } from "@/lib/modules";

function StatusBadge({ status }: { status: HubModule["status"] }) {
  if (status === "published") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
        Published
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
      <span className="h-1.5 w-1.5 rounded-full bg-slate-400" aria-hidden="true" />
      Coming soon
    </span>
  );
}

function TagList({ tags }: { tags: string[] }) {
  return (
    <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Topics">
      {tags.map((tag) => (
        <li
          key={tag}
          className="rounded-md bg-azure-50 px-2 py-0.5 text-xs font-medium text-azure-700 dark:bg-azure-950/40 dark:text-azure-300"
        >
          {tag}
        </li>
      ))}
    </ul>
  );
}

/** Inner card body shared by the published (linked) and disabled variants. */
function CardBody({ module }: { module: HubModule }) {
  const published = module.status === "published";

  return (
    <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 transition-shadow group-hover:shadow-md dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          {module.title}
        </h3>
        <StatusBadge status={module.status} />
      </div>

      <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        {module.summary}
      </p>

      <TagList tags={module.tags} />

      <div className="mt-5 flex items-center pt-1">
        {published ? (
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-azure-600 group-hover:text-azure-700 dark:text-azure-400 dark:group-hover:text-azure-300">
            Open tutorial
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
          </span>
        ) : (
          <span className="text-sm font-medium text-slate-400 dark:text-slate-500">
            Not available yet
          </span>
        )}
      </div>
    </article>
  );
}

/**
 * A single tutorial module in the landing grid.
 *
 * Published modules link to their absolute mounted path (e.g. "/mcp-server/").
 * That navigation is CROSS-ZONE — a full document load handled by Front Door —
 * so this is a plain <a>, never next/link (which would resolve within the hub
 * zone). Coming-soon modules render as a non-interactive, dimmed card.
 */
export function ModuleCard({ module }: { module: HubModule }) {
  if (module.status === "published" && module.href) {
    return (
      <a
        href={module.href}
        className="group block h-full rounded-xl focus-visible:outline-none"
        aria-label={`Open tutorial: ${module.title}`}
      >
        <CardBody module={module} />
      </a>
    );
  }

  return (
    <div
      className="group block h-full cursor-default opacity-60"
      aria-disabled="true"
      aria-label={`${module.title} — coming soon`}
    >
      <CardBody module={module} />
    </div>
  );
}
