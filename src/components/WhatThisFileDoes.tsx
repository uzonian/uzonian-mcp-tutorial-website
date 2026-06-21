import type { ReactNode } from "react";

interface WhatThisFileDoesProps {
  path: string;
  does: ReactNode;
  /** What a beginner can safely change. */
  edit?: ReactNode;
  /** What a beginner should not touch yet. */
  dontEdit?: ReactNode;
}

/** A "what this file does" card with beginner edit guidance. */
export function WhatThisFileDoes({
  path,
  does,
  edit,
  dontEdit,
}: WhatThisFileDoesProps) {
  return (
    <div className="my-5 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-100 px-4 py-2 dark:border-slate-700 dark:bg-slate-800">
        <span aria-hidden="true">📄</span>
        <code className="font-mono text-sm font-medium text-slate-700 dark:text-slate-200">
          {path}
        </code>
      </div>
      <div className="space-y-3 bg-white p-4 dark:bg-slate-900">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            What it does
          </p>
          <div className="mt-1 text-sm text-slate-700 dark:text-slate-300">
            {does}
          </div>
        </div>
        {edit && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-900/60 dark:bg-emerald-950/40">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
              ✏️ Beginners can edit
            </p>
            <div className="mt-1 text-sm text-slate-700 dark:text-slate-300">
              {edit}
            </div>
          </div>
        )}
        {dontEdit && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/60 dark:bg-amber-950/40">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
              🚧 Don&apos;t edit yet
            </p>
            <div className="mt-1 text-sm text-slate-700 dark:text-slate-300">
              {dontEdit}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
