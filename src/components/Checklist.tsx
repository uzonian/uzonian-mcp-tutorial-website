"use client";

import { useEffect, useState } from "react";

interface ChecklistProps {
  /** A stable id so progress persists per checklist in localStorage. */
  id: string;
  items: { id: string; label: string }[];
  title?: string;
}

/** An interactive checklist that remembers progress in the browser. */
export function Checklist({ id, items, title }: ChecklistProps) {
  const storageKey = `mcp-checklist:${id}`;
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setChecked(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, [storageKey]);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(checked));
    } catch {
      /* ignore */
    }
  }, [checked, loaded, storageKey]);

  const done = items.filter((i) => checked[i.id]).length;
  const pct = items.length ? Math.round((done / items.length) * 100) : 0;

  function toggle(itemId: string) {
    setChecked((c) => ({ ...c, [itemId]: !c[itemId] }));
  }

  function reset() {
    setChecked({});
  }

  return (
    <div className="my-6 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-3">
        <h3 className="m-0 text-base font-semibold text-slate-900 dark:text-white">
          {title ?? "Checklist"}
        </h3>
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {done}/{items.length} done
        </span>
      </div>

      <div
        className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${title ?? "Checklist"} progress`}
      >
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>

      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li key={item.id}>
            <label className="flex cursor-pointer items-start gap-3 rounded-lg p-2 hover:bg-slate-50 dark:hover:bg-slate-800">
              <input
                type="checkbox"
                checked={!!checked[item.id]}
                onChange={() => toggle(item.id)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-azure-600 focus:ring-azure-500"
              />
              <span
                className={`text-sm ${
                  checked[item.id]
                    ? "text-slate-400 line-through dark:text-slate-500"
                    : "text-slate-700 dark:text-slate-300"
                }`}
              >
                {item.label}
              </span>
            </label>
          </li>
        ))}
      </ul>

      {done > 0 && (
        <button
          type="button"
          onClick={reset}
          className="mt-3 text-xs font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
        >
          Reset this checklist
        </button>
      )}
    </div>
  );
}
