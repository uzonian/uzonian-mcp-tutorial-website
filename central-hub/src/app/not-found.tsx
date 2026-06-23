import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8">
      <span className="inline-flex items-center rounded-full bg-azure-100 px-3 py-1 text-xs font-semibold text-azure-700 dark:bg-azure-950/60 dark:text-azure-300">
        404
      </span>
      <h1 className="mt-4">This page wandered off</h1>
      <p className="mt-4 max-w-md text-lg text-slate-600 dark:text-slate-300">
        We couldn&apos;t find what you were looking for. It may have moved into
        one of the tutorial modules.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-lg bg-azure-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-azure-700"
      >
        Back to all tutorials
      </Link>
    </section>
  );
}
