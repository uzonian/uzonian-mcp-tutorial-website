import Link from "next/link";
import type { ReactNode } from "react";
import { siblings } from "@/lib/chapters";
import { Checklist } from "./Checklist";

interface TocItem {
  id: string;
  label: string;
}

interface ChapterShellProps {
  slug: string;
  /** Chapter number label, e.g. "Chapter 3". */
  eyebrow?: string;
  title: string;
  intro: ReactNode;
  learningGoals: string[];
  /** Optional "on this page" anchors. */
  toc?: TocItem[];
  children: ReactNode;
  summary: ReactNode;
  reviewItems?: { id: string; label: string }[];
}

export function ChapterShell({
  slug,
  eyebrow,
  title,
  intro,
  learningGoals,
  toc,
  children,
  summary,
  reviewItems,
}: ChapterShellProps) {
  const { prev, next } = siblings(slug);

  return (
    <article className="prose-content">
      <header>
        {eyebrow && (
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-azure-600 dark:text-azure-400">
            {eyebrow}
          </p>
        )}
        <h1>{title}</h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
          {intro}
        </p>
      </header>

      {/* Learning goals */}
      <section
        aria-label="Learning goals"
        className="my-6 rounded-xl border border-azure-200 bg-azure-50/60 p-5 dark:border-azure-900/60 dark:bg-azure-950/30"
      >
        <h2 className="m-0 flex items-center gap-2 text-base font-semibold text-azure-800 dark:text-azure-200">
          🎯 What you&apos;ll be able to do
        </h2>
        <ul className="mb-0 mt-3 space-y-1.5">
          {learningGoals.map((goal, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className="mt-0.5 text-azure-500" aria-hidden="true">
                ✓
              </span>
              <span className="text-slate-700 dark:text-slate-300">{goal}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* On this page */}
      {toc && toc.length > 0 && (
        <nav
          aria-label="On this page"
          className="my-6 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            On this page
          </p>
          <ul className="mt-2 grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2">
            {toc.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="text-sm text-azure-600 hover:underline dark:text-azure-400"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {children}

      {/* Chapter summary */}
      <section className="my-8 rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="m-0 flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white">
          📌 Chapter summary
        </h2>
        <div className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300 [&>ul]:mt-2 [&>ul]:list-disc [&>ul]:space-y-1 [&>ul]:pl-5">
          {summary}
        </div>
      </section>

      {/* Review checklist */}
      {reviewItems && reviewItems.length > 0 && (
        <Checklist
          id={`review-${slug}`}
          title="✅ End-of-chapter review"
          items={reviewItems}
        />
      )}

      {/* Prev / next */}
      <nav
        aria-label="Chapter navigation"
        className="mt-12 grid grid-cols-1 gap-4 border-t border-slate-200 pt-6 sm:grid-cols-2 dark:border-slate-800"
      >
        {prev ? (
          <Link
            href={`/${prev.slug}${prev.slug ? "/" : ""}`}
            className="group rounded-xl border border-slate-200 p-4 hover:border-azure-300 hover:bg-azure-50/50 dark:border-slate-700 dark:hover:border-azure-700 dark:hover:bg-azure-950/30"
          >
            <span className="text-xs font-medium text-slate-400">
              ← Previous
            </span>
            <span className="mt-1 block font-semibold text-slate-900 dark:text-white">
              {prev.navTitle}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link
            href={`/${next.slug}${next.slug ? "/" : ""}`}
            className="group rounded-xl border border-slate-200 p-4 text-right hover:border-azure-300 hover:bg-azure-50/50 dark:border-slate-700 dark:hover:border-azure-700 dark:hover:bg-azure-950/30"
          >
            <span className="text-xs font-medium text-slate-400">Next →</span>
            <span className="mt-1 block font-semibold text-slate-900 dark:text-white">
              {next.navTitle}
            </span>
          </Link>
        )}
      </nav>
    </article>
  );
}
