"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { searchEntries, type SearchEntry } from "@/lib/search-index";

const KIND_BADGE: Record<SearchEntry["kind"], string> = {
  Chapter:
    "bg-azure-100 text-azure-700 dark:bg-azure-950/60 dark:text-azure-300",
  Section:
    "bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300",
  Glossary:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
};

export function QuickSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = query ? searchEntries(query, 8) : [];

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
        setTimeout(() => inputRef.current?.focus(), 0);
      }
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => setActive(0), [query]);

  function go(entry: SearchEntry) {
    setOpen(false);
    setQuery("");
    router.push(entry.href);
  }

  function onInputKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      if (results[active]) go(results[active]);
      else if (query.trim()) {
        setOpen(false);
        router.push(`/search/?q=${encodeURIComponent(query)}`);
      }
    }
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setTimeout(() => inputRef.current?.focus(), 0);
        }}
        className={`flex w-full items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-400 hover:bg-white dark:border-slate-700 dark:bg-slate-800/60 dark:hover:bg-slate-800 ${
          open ? "hidden" : "flex"
        }`}
        aria-label="Open search"
      >
        <SearchIcon />
        <span>Search the guide…</span>
        <kbd className="ml-auto hidden rounded border border-slate-300 px-1.5 text-xs text-slate-400 sm:inline dark:border-slate-600">
          Ctrl K
        </kbd>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-0 z-40">
          <div className="flex items-center gap-2 rounded-t-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
            <SearchIcon />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onInputKey}
              placeholder="Search chapters, concepts, glossary…"
              className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100"
              aria-label="Search"
            />
          </div>
          {query && (
            <ul className="max-h-80 overflow-y-auto rounded-b-lg border border-t-0 border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
              {results.length === 0 ? (
                <li className="px-4 py-3 text-sm text-slate-500">
                  No matches. Press Enter for the full search page.
                </li>
              ) : (
                results.map((entry, i) => (
                  <li key={`${entry.href}-${i}`}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onClick={() => go(entry)}
                      className={`flex w-full items-center gap-2 px-4 py-2.5 text-left ${
                        i === active
                          ? "bg-slate-50 dark:bg-slate-800"
                          : "bg-transparent"
                      }`}
                    >
                      <span
                        className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${KIND_BADGE[entry.kind]}`}
                      >
                        {entry.kind}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                          {entry.title}
                        </span>
                        <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
                          {entry.snippet}
                        </span>
                      </span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4 shrink-0"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
