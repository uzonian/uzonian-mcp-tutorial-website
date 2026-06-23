import Link from "next/link";
import { Brand } from "./Brand";
import { ThemeToggle } from "./ThemeToggle";

/**
 * The hub's global top bar. Mirrors the branding the modules show in their
 * HubBar (same brand mark + name) and carries the global theme toggle, so
 * switching between the hub and a module feels seamless.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="Uzonian Dev Tutorials home"
          className="flex shrink-0 items-center rounded-lg"
        >
          <Brand />
        </Link>

        <nav aria-label="Primary" className="ml-auto flex items-center gap-3">
          <a
            href="#modules"
            className="hidden rounded-md px-2.5 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 sm:inline-block dark:text-slate-300 dark:hover:text-white"
          >
            Modules
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
