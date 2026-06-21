"use client";

import { useState, type ReactNode } from "react";

interface ConceptCheckProps {
  question: ReactNode;
  answer: ReactNode;
  /** Optional number/label, e.g. "Concept check 2". */
  label?: string;
}

export function ConceptCheck({
  question,
  answer,
  label = "Concept check",
}: ConceptCheckProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="my-6 rounded-xl border border-azure-200 bg-azure-50/60 p-4 dark:border-azure-900/60 dark:bg-azure-950/30">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-azure-700 dark:text-azure-300">
        ❓ {label}
      </p>
      <div className="text-sm font-medium text-slate-800 dark:text-slate-200 [&>p]:my-1">
        {question}
      </div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-azure-300 bg-white px-3 py-1.5 text-sm font-medium text-azure-700 hover:bg-azure-100 dark:border-azure-700 dark:bg-slate-900 dark:text-azure-300 dark:hover:bg-slate-800"
      >
        {open ? "Hide the answer" : "Show me the answer"}
      </button>
      {open && (
        <div className="mt-3 rounded-lg border border-azure-200 bg-white p-3 text-sm leading-relaxed text-slate-700 dark:border-azure-900/60 dark:bg-slate-900 dark:text-slate-300 [&>p]:my-2 [&>ul]:my-2 [&>ul]:list-disc [&>ul]:pl-5">
          {answer}
        </div>
      )}
    </div>
  );
}
