"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { SidebarNav } from "./SidebarNav";
import { QuickSearch } from "./QuickSearch";
import { ThemeToggle } from "./ThemeToggle";
import { ReadingProgress } from "./ReadingProgress";

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <ReadingProgress />

      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <div className="flex h-16 items-center gap-3 px-4 lg:px-6">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 lg:hidden dark:border-slate-700 dark:text-slate-300"
            aria-label="Open navigation menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
              />
            </svg>
          </button>

          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 font-semibold text-slate-900 dark:text-white"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-azure-600 text-sm font-bold text-white">
              MCP
            </span>
            <span className="hidden text-sm sm:inline">
              Building Plug-ins for Copilot Cowork
            </span>
          </Link>

          <div className="ml-auto flex flex-1 items-center justify-end gap-3">
            <div className="hidden flex-1 justify-end sm:flex">
              <QuickSearch />
            </div>
            <ThemeToggle />
          </div>
        </div>
        <div className="px-4 pb-3 sm:hidden">
          <QuickSearch />
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[100rem]">
        {/* Desktop sidebar */}
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-72 shrink-0 overflow-y-auto border-r border-slate-200 lg:block dark:border-slate-800 thin-scroll">
          <SidebarNav />
        </aside>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-slate-900/50"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <div className="absolute left-0 top-0 h-full w-72 overflow-y-auto bg-white shadow-xl dark:bg-slate-950 thin-scroll">
              <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-800">
                <span className="font-semibold text-slate-900 dark:text-white">
                  Chapters
                </span>
                <button
                  type="button"
                  aria-label="Close navigation menu"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <SidebarNav onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-10">
          <div className="mx-auto w-full max-w-3xl">{children}</div>
        </main>
      </div>

      <footer className="border-t border-slate-200 px-6 py-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <p>
          A learning companion for building extensible Microsoft Copilot Cowork
          plug-ins with Python, FastMCP, and Azure.
        </p>
        <p className="mt-1">
          Generated from the Copilot Cowork Plug-ins Textbook Guide · Content
          for educational use.
        </p>
      </footer>
    </div>
  );
}
