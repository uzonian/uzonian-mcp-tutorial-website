import type { ReactNode } from "react";
import Link from "next/link";
import { BrandMark } from "./BrandMark";
import { ThemeToggle } from "./ThemeToggle";

/** Brand name shown next to the mark across the hub. */
export const BRAND_NAME = "Uzonian Dev Tutorials";

/**
 * The hub's shared chrome: a sticky top bar (brand mark + global theme toggle)
 * and a footer, with the page content rendered as the main landmark in between.
 * Branding mirrors the modules' HubBar so navigating between zones feels like
 * one continuous product.
 */
export function HubShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2.5 font-semibold text-slate-900 dark:text-white"
          >
            <BrandMark className="h-8 w-8 rounded-lg" />
            <span className="text-sm sm:text-base">{BRAND_NAME}</span>
          </Link>

          <nav
            aria-label="Primary"
            className="ml-auto flex items-center gap-3"
          >
            <a
              href="#modules"
              className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 sm:inline-block dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              Browse tutorials
            </a>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main id="main-content" className="flex-1">
        {children}
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
            <div className="flex items-center gap-2.5">
              <BrandMark className="h-7 w-7 rounded-md" />
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {BRAND_NAME}
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Hands-on, production-grade tutorials for developers · Content for
              educational use.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
