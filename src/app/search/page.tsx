import { Suspense } from "react";
import { SearchClient } from "@/components/SearchClient";

export const metadata = { title: "Search" };

export default function Page() {
  return (
    <div className="prose-content">
      <h1>Search the guide</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-300">
        Everything is indexed locally — no network calls. You can also press{" "}
        <kbd className="inline-code">Ctrl</kbd> +{" "}
        <kbd className="inline-code">K</kbd> anywhere to search.
      </p>
      <div className="mt-6">
        <Suspense
          fallback={
            <p className="text-sm text-slate-500">Loading search…</p>
          }
        >
          <SearchClient />
        </Suspense>
      </div>
    </div>
  );
}
