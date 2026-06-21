import type { ReactNode } from "react";

export type CalloutVariant =
  | "tip"
  | "warning"
  | "security"
  | "beginner"
  | "why"
  | "note"
  | "production"
  | "success";

interface CalloutProps {
  variant?: CalloutVariant;
  title?: string;
  children: ReactNode;
}

const STYLES: Record<
  CalloutVariant,
  { wrap: string; badge: string; label: string; icon: ReactNode }
> = {
  tip: {
    wrap: "border-emerald-200 bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-950/40",
    badge: "text-emerald-700 dark:text-emerald-300",
    label: "Tip",
    icon: "💡",
  },
  warning: {
    wrap: "border-amber-300 bg-amber-50 dark:border-amber-900/60 dark:bg-amber-950/40",
    badge: "text-amber-800 dark:text-amber-300",
    label: "Warning",
    icon: "⚠️",
  },
  security: {
    wrap: "border-rose-300 bg-rose-50 dark:border-rose-900/60 dark:bg-rose-950/40",
    badge: "text-rose-800 dark:text-rose-300",
    label: "Security",
    icon: "🔒",
  },
  beginner: {
    wrap: "border-azure-200 bg-azure-50 dark:border-azure-900/60 dark:bg-azure-950/40",
    badge: "text-azure-700 dark:text-azure-300",
    label: "Beginner note",
    icon: "🧭",
  },
  why: {
    wrap: "border-violet-200 bg-violet-50 dark:border-violet-900/60 dark:bg-violet-950/40",
    badge: "text-violet-700 dark:text-violet-300",
    label: "Why this matters",
    icon: "🎯",
  },
  note: {
    wrap: "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/60",
    badge: "text-slate-700 dark:text-slate-300",
    label: "Note",
    icon: "📝",
  },
  production: {
    wrap: "border-indigo-200 bg-indigo-50 dark:border-indigo-900/60 dark:bg-indigo-950/40",
    badge: "text-indigo-700 dark:text-indigo-300",
    label: "Production note",
    icon: "🏭",
  },
  success: {
    wrap: "border-teal-200 bg-teal-50 dark:border-teal-900/60 dark:bg-teal-950/40",
    badge: "text-teal-700 dark:text-teal-300",
    label: "What success looks like",
    icon: "✅",
  },
};

export function Callout({ variant = "note", title, children }: CalloutProps) {
  const s = STYLES[variant];
  return (
    <div
      className={`my-5 rounded-xl border p-4 ${s.wrap}`}
      role={
        variant === "warning" || variant === "security" ? "alert" : undefined
      }
    >
      <div className={`mb-1 flex items-center gap-2 text-sm font-semibold ${s.badge}`}>
        <span aria-hidden="true">{s.icon}</span>
        <span>{title ?? s.label}</span>
      </div>
      <div className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 [&>p]:my-2 [&>ul]:my-2 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:my-2 [&>ol]:list-decimal [&>ol]:pl-5">
        {children}
      </div>
    </div>
  );
}
