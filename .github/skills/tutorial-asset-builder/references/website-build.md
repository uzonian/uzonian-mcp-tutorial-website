# Website Build Guide (Asset 2)

How to turn the flat source doc into the website **without changing the stack**.
The framework, components, and deploy assets are copied unchanged; only the
content and data files below are rewritten per topic.

## What you copy unchanged (topic-agnostic)

- `src/components/**` (the whole component toolbox)
- `src/app/layout.tsx`, `src/app/globals.css`, `src/app/icon.svg`
- `next.config.mjs` (`output: "export"`), `tailwind.config.ts`,
  `postcss.config.mjs`, `tsconfig.json`, `.eslintrc.json`
- `azure.yaml`, `infra/*.bicep`, `infra/main.parameters.json`
- `.github/workflows/azure-static-web-apps.yml`
- `public/staticwebapp.config.json`

## What you rewrite (per-topic content & data)

### 1. `src/lib/chapters.ts` - the manifest that drives everything

One ordered array of `Chapter`. It drives the sidebar, prev/next, homepage cards,
and search. Shape:

```ts
export type ChapterGroup =
  | "Get Started" | "Understand" | "Build"
  | "Integrate & Ship" | "Operate" | "Reference";

export interface Chapter {
  slug: string;        // URL path, e.g. "concepts"; "" is the homepage
  title: string;       // full page title
  navTitle: string;    // short sidebar label
  group: ChapterGroup; // which stage
  summary: string;     // one-line description for cards + search
  keywords: string[];  // search boosters
}
```

Order of the array == sidebar order == prev/next order. Keep the exported
helpers `learningPath`, `chapterBySlug`, `siblings`, and `groupOrder` as-is.

### 2. `src/lib/glossary.ts`

```ts
export interface GlossaryTerm {
  term: string;
  short: string;    // one-line definition
  detail?: string;  // longer beginner-friendly explanation
}
export const glossary: GlossaryTerm[] = [ /* ... */ ];
```

### 3. `src/lib/search-index.ts`

Rebuild the `sections` array (curated deep-link anchors, e.g.
`/concepts/#oauth-3lo`) for the new topic. Chapter and glossary entries are
generated automatically from the other two files; keep that logic.

### 4. `src/app/<slug>/page.tsx` - one per chapter

Each chapter is a folder with a `page.tsx` that composes existing components
inside `ChapterShell`. Export `metadata = { title: "..." }` and a default
component. Every `toc` id must match an `<h2 id="...">` (use `Section` from
`content.tsx`) so the on-this-page links and search anchors work.

### 5. `src/app/page.tsx` and `src/app/layout.tsx`

Update the homepage hero + learning-path grid, and the `layout.tsx` SEO metadata
(title template, description, keywords).

## Component API reference (exact props)

Import from `@/components/...`. Use these to transform source-doc sections:

| Source-doc block | Component | Key props |
|---|---|---|
| Chapter frame | `ChapterShell` | `slug, eyebrow?, title, intro, learningGoals[], toc?[{id,label}], summary, reviewItems?[{id,label}], children` |
| Section heading (anchored) | `Section` (from `content`) | `id, children` -> renders `<h2 id>`; `Sub` -> `<h3>` |
| Beginner / security / why / tip notes | `Callout` | `variant?: "tip"\|"warning"\|"security"\|"beginner"\|"why"\|"note"\|"production"\|"success"`, `title?`, `children` |
| Code block | `CodeBlock` | `code, language?, filename?, noCopy?` (languages: python, json, bash, powershell, xml, html, yaml, dockerfile, text) |
| Inline code | `Code` (from `content`) | `children` |
| Data table | `Table` (from `content`) | `headers[], rows[][], caption?` |
| Do-this/avoid-that | `Compare` (from `content`) | `rows: {better, worse}[], betterLabel?, worseLabel?` |
| Expected command output | `ExpectedOutput` (from `content`) | `children` |
| Diagram | `Mermaid` | `chart, caption?, alt?` |
| Quiz | `ConceptCheck` | `question, answer, label?` |
| Hands-on / open-ended | `Lab` / `MiniProject` | `Lab: title, time, goal, children`; `MiniProject: title, children` |
| File explainer | `WhatThisFileDoes` | `path, does, edit?, dontEdit?` |
| Production checklist | `Checklist` | `id, items, title?` |
| Concept cards | `Card` / `CardGrid` | `Card: title, children, icon?, href?, eyebrow?`; `CardGrid: children, cols?` |
| Video recommendation | `VideoCard` | `concept` (required); when `verified` is false, pass `searchQuery` (never invent URLs); else `title, source, url, level?, dateChecked?, why?` |

### `VideoCard` honesty rule

Do **not** invent video URLs. If you do not have a verified link, render the
placeholder by passing `verified={false}` and a precise `searchQuery` pointing at
an official channel (Microsoft, Azure, GitHub, Python, etc.).

## Validate (existing scripts only - do not add tooling)

```bash
npm install
npm run typecheck   # tsc --noEmit
npm run lint        # next lint
npm run build       # static export to out/
```

All must pass; `out/` must contain one HTML file per route. The site is a static
export, so it works offline and deploys to Azure Static Web Apps via the existing
workflow.
