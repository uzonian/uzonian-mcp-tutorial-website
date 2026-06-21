"use client";

import { useEffect, useRef, useState } from "react";
import hljs from "highlight.js/lib/core";
import python from "highlight.js/lib/languages/python";
import json from "highlight.js/lib/languages/json";
import bash from "highlight.js/lib/languages/bash";
import powershell from "highlight.js/lib/languages/powershell";
import xml from "highlight.js/lib/languages/xml";
import yaml from "highlight.js/lib/languages/yaml";
import dockerfile from "highlight.js/lib/languages/dockerfile";
import plaintext from "highlight.js/lib/languages/plaintext";

let registered = false;
function registerLanguages() {
  if (registered) return;
  hljs.registerLanguage("python", python);
  hljs.registerLanguage("json", json);
  hljs.registerLanguage("bash", bash);
  hljs.registerLanguage("powershell", powershell);
  hljs.registerLanguage("xml", xml);
  hljs.registerLanguage("html", xml);
  hljs.registerLanguage("yaml", yaml);
  hljs.registerLanguage("dockerfile", dockerfile);
  hljs.registerLanguage("text", plaintext);
  hljs.registerLanguage("plaintext", plaintext);
  registered = true;
}

export interface CodeBlockProps {
  code: string;
  language?: string;
  /** Optional filename label shown in the title bar. */
  filename?: string;
  /** Hide the copy button (e.g. for non-command snippets). */
  noCopy?: boolean;
}

const LANGUAGE_LABELS: Record<string, string> = {
  python: "Python",
  json: "JSON",
  bash: "Bash",
  powershell: "PowerShell",
  xml: "XML",
  html: "HTML",
  yaml: "YAML",
  dockerfile: "Dockerfile",
  text: "Text",
  plaintext: "Text",
};

export function CodeBlock({
  code,
  language = "text",
  filename,
  noCopy = false,
}: CodeBlockProps) {
  const ref = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const trimmed = code.replace(/\n$/, "");

  useEffect(() => {
    registerLanguages();
    if (ref.current) {
      const lang = hljs.getLanguage(language) ? language : "plaintext";
      try {
        const result = hljs.highlight(trimmed, { language: lang });
        ref.current.innerHTML = result.value;
      } catch {
        ref.current.textContent = trimmed;
      }
    }
  }, [trimmed, language]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(trimmed);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard not available */
    }
  }

  const label = LANGUAGE_LABELS[language] ?? language;

  return (
    <div className="group my-5 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-100 px-4 py-2 dark:border-slate-700 dark:bg-slate-800">
        <span className="font-mono text-xs font-medium text-slate-500 dark:text-slate-400">
          {filename ?? label}
        </span>
        {!noCopy && (
          <button
            type="button"
            onClick={copy}
            aria-label="Copy code to clipboard"
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-200 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
          >
            {copied ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4 text-emerald-500"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                    clipRule="evenodd"
                  />
                </svg>
                Copied
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path d="M7 3.5A1.5 1.5 0 0 1 8.5 2h3.879a1.5 1.5 0 0 1 1.06.44l3.122 3.12A1.5 1.5 0 0 1 17 6.622V12.5A1.5 1.5 0 0 1 15.5 14h-1v-3.379a3 3 0 0 0-.879-2.121L10.5 5.379A3 3 0 0 0 8.379 4.5H7v-1Z" />
                  <path d="M4.5 6A1.5 1.5 0 0 0 3 7.5v9A1.5 1.5 0 0 0 4.5 18h7a1.5 1.5 0 0 0 1.5-1.5v-5.879a1.5 1.5 0 0 0-.44-1.06L9.44 6.439A1.5 1.5 0 0 0 8.378 6H4.5Z" />
                </svg>
                Copy
              </>
            )}
          </button>
        )}
      </div>
      <pre className="thin-scroll overflow-x-auto px-4 py-4 text-sm leading-relaxed">
        <code ref={ref} className="hljs font-mono">
          {trimmed}
        </code>
      </pre>
    </div>
  );
}
