"use client";

import { useState } from "react";
import { findTerm } from "@/lib/glossary";

interface GlossaryTermProps {
  /** The term key to look up (case-insensitive). */
  term: string;
  /** Optional display text if different from the term. */
  children?: React.ReactNode;
}

/** Inline term with a hover/focus tooltip pulling from the glossary. */
export function GlossaryTerm({ term, children }: GlossaryTermProps) {
  const [open, setOpen] = useState(false);
  const entry = findTerm(term);
  const label = children ?? term;

  if (!entry) {
    return <span>{label}</span>;
  }

  return (
    <span className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((o) => !o)}
        aria-label={`Definition of ${entry.term}`}
        className="cursor-help border-b border-dashed border-azure-400 font-medium text-azure-700 dark:text-azure-300"
      >
        {label}
      </button>
      {open && (
        <span
          role="tooltip"
          className="absolute bottom-full left-1/2 z-30 mb-2 w-64 -translate-x-1/2 rounded-lg border border-slate-200 bg-white p-3 text-left text-xs font-normal leading-relaxed text-slate-700 shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          <span className="block font-semibold text-slate-900 dark:text-white">
            {entry.term}
          </span>
          <span className="mt-1 block">{entry.short}</span>
        </span>
      )}
    </span>
  );
}
