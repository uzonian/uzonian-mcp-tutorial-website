import type { ReactNode } from "react";

export type VideoLevel = "beginner" | "intermediate" | "advanced";

interface VideoCardProps {
  /** When verified is false, render a placeholder with the exact search query. */
  verified?: boolean;
  title?: string;
  source?: string;
  url?: string;
  /** The concept this video reinforces. */
  concept: string;
  level?: VideoLevel;
  why?: ReactNode;
  dateChecked?: string;
  /** Exact search query to use when no verified video is available. */
  searchQuery?: string;
}

const LEVEL_BADGE: Record<VideoLevel, string> = {
  beginner:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300",
  intermediate:
    "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
  advanced: "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300",
};

export function VideoCard({
  verified = false,
  title,
  source,
  url,
  concept,
  level = "beginner",
  why,
  dateChecked,
  searchQuery,
}: VideoCardProps) {
  return (
    <div className="my-5 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          ▶ Watch to reinforce this concept
        </span>
        <span className="text-xs text-slate-400">Optional supplement</span>
      </div>

      {verified ? (
        <div className="mt-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base font-semibold text-azure-600 hover:underline dark:text-azure-400"
          >
            {title}
          </a>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {source}
            {dateChecked ? ` · checked ${dateChecked}` : ""}
          </p>
        </div>
      ) : (
        <div className="mt-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-800/60">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Recommended video needed
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            No specific video is linked here on purpose — we don&apos;t invent
            URLs. Search an official source (Microsoft, Azure, Atlassian, GitHub,
            VS Code, Python, or Model Context Protocol) using:
          </p>
          {searchQuery && (
            <p className="mt-2 rounded bg-white px-2.5 py-1.5 font-mono text-xs text-slate-700 dark:bg-slate-900 dark:text-slate-300">
              {searchQuery}
            </p>
          )}
        </div>
      )}

      <dl className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Reinforces
          </dt>
          <dd className="text-slate-700 dark:text-slate-300">{concept}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Level
          </dt>
          <dd>
            <span
              className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize ${LEVEL_BADGE[level]}`}
            >
              {level}
            </span>
          </dd>
        </div>
      </dl>

      {why && (
        <div className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          <span className="font-medium text-slate-700 dark:text-slate-300">
            Why it helps:{" "}
          </span>
          {why}
        </div>
      )}
    </div>
  );
}
