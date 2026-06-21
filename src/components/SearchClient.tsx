"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { searchEntries, type SearchEntry } from "@/lib/search-index";

const KIND_BADGE: Record<SearchEntry["kind"], string> = {
  Chapter: "bg-azure-100 text-azure-700 dark:bg-azure-950/60 dark:text-azure-300",
  Section: "bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300",
  Glossary: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
};

export function SearchClient() {
  const params = useSearchParams();
  const initial = params.get("q") ?? "";
  const [query, setQuery] = useState(initial);

  useEffect(() => {
    setQuery(params.get("q") ?? "");
  }, [params]);

  const results = useMemo(() => searchEntries(query, 50), [query]);

  return (
    <div>
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-5 w-5 text-slate-400"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
            clipRule="evenodd"
          />
        </svg>
        <input
          type="text"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search chapters, concepts, and glossary…"
          aria-label="Search the guide"
          className="w-full bg-transparent text-base text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100"
        />
      </div>

      <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
        {query
          ? `${results.length} result${results.length === 1 ? "" : "s"} for "${query}"`
          : "Type to search across every chapter, section, and glossary term."}
      </p>

      <ul className="mt-4 space-y-3">
        {results.map((entry, i) => (
          <li key={`${entry.href}-${i}`}>
            <Link
              href={entry.href}
              className="block rounded-xl border border-slate-200 p-4 transition-colors hover:border-azure-300 hover:bg-azure-50/40 dark:border-slate-700 dark:hover:border-azure-700 dark:hover:bg-azure-950/30"
            >
              <span className="flex items-center gap-2">
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${KIND_BADGE[entry.kind]}`}
                >
                  {entry.kind}
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {entry.title}
                </span>
              </span>
              <span className="mt-1 block text-sm text-slate-600 dark:text-slate-400">
                {entry.snippet}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
