import type { ReactNode } from "react";

/**
 * The hub brand mark: a 2x2 grid glyph in an azure tile. The grid echoes the
 * "All Tutorials" icon in each module's HubBar, so the hub and its modules read
 * as one product.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={
        className ??
        "flex h-8 w-8 items-center justify-center rounded-lg bg-azure-600 text-white"
      }
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-4 w-4"
        aria-hidden="true"
      >
        <path d="M3 3h6v6H3V3Zm8 0h6v6h-6V3ZM3 11h6v6H3v-6Zm8 0h6v6h-6v-6Z" />
      </svg>
    </span>
  );
}

/** Brand mark + wordmark, used in the header and footer. */
export function Brand({ subtitle }: { subtitle?: ReactNode }) {
  return (
    <span className="flex items-center gap-2.5">
      <BrandMark />
      <span className="flex flex-col leading-tight">
        <span className="text-sm font-bold text-slate-900 dark:text-white">
          Uzonian Dev Tutorials
        </span>
        {subtitle && (
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {subtitle}
          </span>
        )}
      </span>
    </span>
  );
}
