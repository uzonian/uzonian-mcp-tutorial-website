"use client";

import { useEffect, useRef, useState } from "react";
import { hubUrl, modules, moduleId } from "@/lib/module";

/**
 * Hub-level navigation that sits above the module's own header. It connects this
 * module back to the central tutorial hub ("All Tutorials") and lets users jump
 * between modules. All links here are cross-zone, so they are plain anchors with
 * absolute URLs — never next/link, which would prepend this module's basePath.
 */
export function HubBar() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = modules.find((m) => m.id === moduleId);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60">
      <div className="mx-auto flex h-10 w-full max-w-[100rem] items-center gap-3 px-4 lg:px-6">
        <a
          href={`${hubUrl}/`}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
        >
          <GridIcon />
          <span>All Tutorials</span>
        </a>

        <div ref={ref} className="relative ml-auto">
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <span className="text-slate-400 dark:text-slate-500">Module:</span>
            <span className="max-w-[10rem] truncate">
              {current?.shortTitle ?? "This module"}
            </span>
            <ChevronIcon />
          </button>

          {open && (
            <div
              role="menu"
              className="absolute right-0 z-50 mt-1.5 w-72 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900"
            >
              <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Tutorial modules
              </p>
              <ul className="pb-1">
                {modules.map((m) => {
                  const active = m.id === moduleId;
                  if (m.comingSoon) {
                    return (
                      <li key={m.id}>
                        <span className="flex cursor-default items-start gap-2 px-3 py-2 opacity-60">
                          <ModuleDot muted />
                          <span className="min-w-0">
                            <span className="block text-sm font-medium text-slate-500 dark:text-slate-400">
                              {m.title}
                            </span>
                            <span className="block text-xs text-slate-400 dark:text-slate-500">
                              {m.summary}
                            </span>
                          </span>
                        </span>
                      </li>
                    );
                  }
                  return (
                    <li key={m.id}>
                      <a
                        href={m.href}
                        role="menuitem"
                        aria-current={active ? "true" : undefined}
                        className={`flex items-start gap-2 px-3 py-2 ${
                          active
                            ? "bg-azure-50 dark:bg-azure-950/40"
                            : "hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                      >
                        <ModuleDot active={active} />
                        <span className="min-w-0">
                          <span
                            className={`block text-sm font-medium ${
                              active
                                ? "text-azure-700 dark:text-azure-300"
                                : "text-slate-800 dark:text-slate-100"
                            }`}
                          >
                            {m.title}
                            {active && " (current)"}
                          </span>
                          <span className="block text-xs text-slate-500 dark:text-slate-400">
                            {m.summary}
                          </span>
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function GridIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-3.5 w-3.5"
      aria-hidden="true"
    >
      <path d="M3 3h6v6H3V3Zm8 0h6v6h-6V3ZM3 11h6v6H3v-6Zm8 0h6v6h-6v-6Z" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-3.5 w-3.5 text-slate-400"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ModuleDot({
  active,
  muted,
}: {
  active?: boolean;
  muted?: boolean;
}) {
  const color = muted
    ? "bg-slate-300 dark:bg-slate-600"
    : active
      ? "bg-azure-500"
      : "bg-slate-400";
  return (
    <span
      className={`mt-1 h-2 w-2 shrink-0 rounded-full ${color}`}
      aria-hidden="true"
    />
  );
}
