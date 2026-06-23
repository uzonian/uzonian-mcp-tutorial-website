import { ModuleCard } from "@/components/ModuleCard";
import {
  modules,
  publishedModules,
  comingSoonModules,
} from "@/lib/modules";

const featured = publishedModules[0];

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
      {/* Hero */}
      <section
        aria-labelledby="hero-heading"
        className="mt-8 rounded-2xl border border-slate-200 bg-gradient-to-br from-azure-50 to-white p-8 sm:p-12 dark:border-slate-800 dark:from-azure-950/40 dark:to-slate-950"
      >
        <span className="inline-block rounded-full bg-azure-100 px-3 py-1 text-xs font-semibold text-azure-700 dark:bg-azure-950/60 dark:text-azure-300">
          Hands-on · Production-grade
        </span>
        <h1 id="hero-heading" className="mt-4 max-w-3xl">
          Uzonian Dev Tutorials
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
          A growing library of hands-on, production-grade tutorial modules. Each
          one walks you end-to-end through building real, deployable software —
          with plain-English explanations, architecture diagrams, and labs you
          can follow on your own machine.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="#modules"
            className="rounded-lg bg-azure-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-azure-700"
          >
            Browse tutorials
          </a>
          {featured?.href && (
            <a
              href={featured.href}
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Start with {featured.shortTitle} →
            </a>
          )}
        </div>
      </section>

      {/* Modules */}
      <section aria-labelledby="modules-heading" className="mt-16 scroll-mt-24" id="modules">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 id="modules-heading">Tutorial modules</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Pick a module to dive in. Each is a self-contained tutorial site.
            </p>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {publishedModules.length} available · {comingSoonModules.length}{" "}
            coming soon
          </p>
        </div>

        <ul
          role="list"
          className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {modules.map((module) => (
            <li key={module.id} className="h-full">
              <ModuleCard module={module} />
            </li>
          ))}
        </ul>
      </section>

      {/* Closing note */}
      <section
        aria-label="About these tutorials"
        className="my-16 rounded-2xl border border-slate-200 bg-slate-50 p-8 dark:border-slate-800 dark:bg-slate-900/50"
      >
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
          One domain, many modules
        </h2>
        <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-400">
          Every tutorial lives at its own path under{" "}
          <span className="font-mono text-sm text-azure-700 dark:text-azure-300">
            uzoniandev.com
          </span>{" "}
          — for example{" "}
          <span className="font-mono text-sm text-azure-700 dark:text-azure-300">
            /mcp-server/
          </span>
          . Each module is a standalone static site, so they ship and update
          independently while sharing one front door, one brand, and one
          consistent reading experience.
        </p>
      </section>
    </div>
  );
}
