import type { ReactNode } from "react";

/** An anchored h2 so the on-this-page links and deep links work. */
export function Section({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  return <h2 id={id}>{children}</h2>;
}

/** An anchored h3. */
export function Sub({ id, children }: { id?: string; children: ReactNode }) {
  return <h3 id={id}>{children}</h3>;
}

interface TableProps {
  headers: ReactNode[];
  rows: ReactNode[][];
  caption?: string;
}

/** A responsive, styled data table. */
export function Table({ headers, rows, caption }: TableProps) {
  return (
    <div className="my-5 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 thin-scroll">
      <table className="data-table">
        {caption && (
          <caption className="px-4 py-2 text-left text-xs text-slate-500 dark:text-slate-400">
            {caption}
          </caption>
        )}
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} scope="col">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Inline code styled consistently. */
export function Code({ children }: { children: ReactNode }) {
  return <code className="inline-code">{children}</code>;
}

interface CompareProps {
  betterLabel?: string;
  worseLabel?: string;
  rows: { better: ReactNode; worse: ReactNode }[];
}

/** A "do this / not that" comparison table with color cues. */
export function Compare({
  betterLabel = "Better",
  worseLabel = "Avoid",
  rows,
}: CompareProps) {
  return (
    <div className="my-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/30">
        <p className="mb-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
          ✓ {betterLabel}
        </p>
        <ul className="space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
          {rows.map((r, i) => (
            <li key={i}>{r.better}</li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-4 dark:border-rose-900/60 dark:bg-rose-950/30">
        <p className="mb-2 text-sm font-semibold text-rose-700 dark:text-rose-300">
          ✗ {worseLabel}
        </p>
        <ul className="space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
          {rows.map((r, i) => (
            <li key={i}>{r.worse}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Expected command output block. */
export function ExpectedOutput({ children }: { children: ReactNode }) {
  return (
    <div className="my-5 rounded-xl border border-slate-200 dark:border-slate-700">
      <div className="border-b border-slate-200 bg-slate-100 px-4 py-1.5 text-xs font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
        Expected output
      </div>
      <pre className="thin-scroll overflow-x-auto bg-white px-4 py-3 font-mono text-xs leading-relaxed text-slate-600 dark:bg-slate-900 dark:text-slate-300">
        {children}
      </pre>
    </div>
  );
}
