import { ModuleCard } from "@/components/ModuleCard";
import {
  modules,
  publishedModules,
  comingSoonModules,
} from "@/lib/modules";

const HIGHLIGHTS = [
  {
    title: "Production-grade",
    body: "Real architectures, security, testing, and deployment — not toy demos.",
  },
  {
    title: "Hands-on",
    body: "Follow along with labs, checklists, and copy-pasteable steps in every chapter.",
  },
  {
    title: "One domain",
    body: "Each tutorial is its own focused module, stitched together under a single site.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-slate-200 bg-gradient-to-br from-azure-50 to-white dark:border-slate-800 dark:from-azure-950/40 dark:to-slate-950">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <span className="inline-flex items-center rounded-full bg-azure-100 px-3 py-1 text-xs font-semibold text-azure-700 dark:bg-azure-950/60 dark:text-azure-300">
            Hands-on · Production-grade
          </span>
          <h1 className="mt-5 max-w-3xl">
            Uzonian Dev Tutorials
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-600 sm:text-xl dark:text-slate-300">
            A growing hub of hands-on, production-grade tutorial modules. Each
            one takes you end-to-end on a real-world build — from local
            development to a secure, deployed system you can actually ship.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#modules"
              className="rounded-lg bg-azure-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-azure-700"
            >
              Browse tutorials →
            </a>
            {publishedModules[0] && (
              <a
                href={publishedModules[0].href}
                className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Start with {publishedModules[0].shortTitle}
              </a>
            )}
          </div>

          <dl className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {HIGHLIGHTS.map((h) => (
              <div
                key={h.title}
                className="rounded-xl border border-slate-200 bg-white/70 p-5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/50"
              >
                <dt className="text-sm font-semibold text-slate-900 dark:text-white">
                  {h.title}
                </dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {h.body}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Module grid */}
      <section
        id="modules"
        aria-labelledby="modules-heading"
        className="scroll-mt-20"
      >
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 id="modules-heading">Tutorial modules</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              Pick a module to dive in. Published modules are ready now; more
              are on the way.
            </p>
          </div>

          <ul
            className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            aria-label="Tutorial modules"
          >
            {modules.map((module) => (
              <li key={module.id} className="h-full">
                <ModuleCard module={module} />
              </li>
            ))}
          </ul>

          {comingSoonModules.length > 0 && (
            <p className="mt-8 text-sm text-slate-500 dark:text-slate-400">
              {comingSoonModules.length} more module
              {comingSoonModules.length === 1 ? "" : "s"} in progress — check
              back soon.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
