import Link from "next/link";
import type { ReactNode } from "react";

interface CardProps {
  title: ReactNode;
  children: ReactNode;
  icon?: ReactNode;
  href?: string;
  /** Small label shown above the title, e.g. a group name. */
  eyebrow?: string;
}

export function Card({ title, children, icon, href, eyebrow }: CardProps) {
  const inner = (
    <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-900">
      {eyebrow && (
        <span className="mb-1 text-xs font-semibold uppercase tracking-wide text-azure-600 dark:text-azure-400">
          {eyebrow}
        </span>
      )}
      <h3 className="mt-0 flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white">
        {icon && <span aria-hidden="true">{icon}</span>}
        {title}
      </h3>
      <div className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        {children}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="group block h-full">
        {inner}
      </Link>
    );
  }
  return inner;
}

interface CardGridProps {
  children: ReactNode;
  /** Columns at the large breakpoint. */
  cols?: 2 | 3;
}

export function CardGrid({ children, cols = 2 }: CardGridProps) {
  return (
    <div
      className={`my-6 grid grid-cols-1 gap-4 ${
        cols === 3 ? "lg:grid-cols-3" : "sm:grid-cols-2"
      }`}
    >
      {children}
    </div>
  );
}
