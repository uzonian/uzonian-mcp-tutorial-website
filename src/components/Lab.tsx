import type { ReactNode } from "react";

interface LabProps {
  title: string;
  /** Estimated time, e.g. "10 minutes". */
  time?: string;
  goal?: ReactNode;
  children: ReactNode;
}

/** A short hands-on lab block. */
export function Lab({ title, time, goal, children }: LabProps) {
  return (
    <section className="my-6 overflow-hidden rounded-xl border-2 border-azure-200 dark:border-azure-900/60">
      <header className="flex items-center justify-between gap-3 bg-azure-50 px-4 py-3 dark:bg-azure-950/40">
        <h3 className="m-0 flex items-center gap-2 text-base font-semibold text-azure-800 dark:text-azure-200">
          🧪 Hands-on lab: {title}
        </h3>
        {time && (
          <span className="whitespace-nowrap rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-azure-700 dark:bg-slate-900 dark:text-azure-300">
            ~{time}
          </span>
        )}
      </header>
      <div className="bg-white px-4 py-4 dark:bg-slate-900">
        {goal && (
          <p className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
            <span className="text-azure-600 dark:text-azure-400">Goal: </span>
            {goal}
          </p>
        )}
        <div className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          {children}
        </div>
      </div>
    </section>
  );
}

interface MiniProjectProps {
  title: string;
  children: ReactNode;
}

export function MiniProject({ title, children }: MiniProjectProps) {
  return (
    <section className="my-6 rounded-xl border-2 border-dashed border-violet-300 bg-violet-50/50 p-4 dark:border-violet-800 dark:bg-violet-950/30">
      <h3 className="m-0 flex items-center gap-2 text-base font-semibold text-violet-800 dark:text-violet-200">
        🛠️ Mini-project: {title}
      </h3>
      <div className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        {children}
      </div>
    </section>
  );
}
