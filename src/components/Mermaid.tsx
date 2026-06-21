"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTheme } from "next-themes";

interface MermaidProps {
  chart: string;
  /** Text equivalent for screen readers and when JS/diagram fails. */
  caption?: string;
  /** Accessible description of what the diagram shows. */
  alt: string;
}

export function Mermaid({ chart, caption, alt }: MermaidProps) {
  const { resolvedTheme } = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const reactId = useId().replace(/[:]/g, "");
  const [error, setError] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    let cancelled = false;

    async function render() {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: resolvedTheme === "dark" ? "dark" : "default",
          fontFamily: "Segoe UI, system-ui, sans-serif",
        });
        const id = `mermaid-${reactId}`;
        const { svg } = await mermaid.render(id, chart);
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg;
          setError(false);
        }
      } catch {
        if (!cancelled) setError(true);
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [chart, resolvedTheme, mounted, reactId]);

  return (
    <figure className="my-6">
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
        {error ? (
          <pre className="whitespace-pre-wrap text-xs text-slate-500 dark:text-slate-400">
            {alt}
          </pre>
        ) : (
          <div
            ref={ref}
            className="mermaid-container flex justify-center"
            role="img"
            aria-label={alt}
          >
            {!mounted && (
              <span className="py-8 text-sm text-slate-400">
                Loading diagram…
              </span>
            )}
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
