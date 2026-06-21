"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { chapters, groupOrder, type Chapter } from "@/lib/chapters";

function hrefFor(c: Chapter) {
  return `/${c.slug}${c.slug ? "/" : ""}`;
}

interface SidebarProps {
  onNavigate?: () => void;
}

export function SidebarNav({ onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Chapters" className="px-3 py-4">
      {groupOrder.map((group) => {
        const items = chapters.filter((c) => c.group === group);
        if (items.length === 0) return null;
        return (
          <div key={group} className="mb-5">
            <p className="px-3 pb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {group}
            </p>
            <ul className="space-y-0.5">
              {items.map((c) => {
                const href = hrefFor(c);
                const active =
                  pathname === href ||
                  (c.slug === "" && pathname === "/") ||
                  pathname === `/${c.slug}`;
                return (
                  <li key={c.slug || "home"}>
                    <Link
                      href={href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={`block rounded-lg px-3 py-1.5 text-sm transition-colors ${
                        active
                          ? "bg-azure-50 font-semibold text-azure-700 dark:bg-azure-950/50 dark:text-azure-300"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                      }`}
                    >
                      {c.navTitle}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
