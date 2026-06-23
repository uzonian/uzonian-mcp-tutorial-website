import { publishedModules, comingSoonModules } from "@/lib/modules";

/** Global footer for the hub. */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 px-4 py-10 dark:border-slate-800">
      <div className="mx-auto w-full max-w-6xl text-center text-sm text-slate-500 dark:text-slate-400">
        <p>
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Uzonian Dev Tutorials
          </span>{" "}
          — hands-on, production-grade tutorial modules for developers.
        </p>
        <p className="mt-1">
          {publishedModules.length} module
          {publishedModules.length === 1 ? "" : "s"} published ·{" "}
          {comingSoonModules.length} coming soon · Content for educational use.
        </p>
        <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
          © {year} uzoniandev.com
        </p>
      </div>
    </footer>
  );
}
