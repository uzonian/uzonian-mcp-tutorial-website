---
name: tutorial-asset-builder
description: >-
  Generate a complete two-part tutorial asset set for a given topic: (1) a flat
  Markdown "textbook" source doc and (2) a Next.js static tutorial website built
  from it. The single input is a free-text description of the topic to build the
  assets for. Learning content prefers Python over JavaScript and uses Azure for
  infrastructure and Microsoft Copilot for the AI layer; the website keeps the
  existing Next.js 15 + React 18 + TypeScript + Tailwind static-export stack
  unchanged. Optionally also scaffolds the runnable demo / reference
  implementation that the tutorial teaches. Use this skill whenever the user
  wants to turn a topic into a polished, beginner-friendly interactive tutorial
  site like this repository.
---

# Tutorial Asset Builder

This skill turns **a single topic description** into two coordinated assets, the
same way this repository's MCP tutorial was built:

1. **Asset 1 — the flat source doc** (`<TOPIC>_Textbook_Guide.md`): one long,
   linear Markdown "textbook" that is the content brain.
2. **Asset 2 — the website**: a Next.js static-export site that transforms Asset
   1 into an interactive, multi-chapter learning product.

Optionally, it can also build:

3. **Asset 3 — the demo / reference implementation** (Stage C, opt-in): the
   actual working project the tutorial teaches (e.g. the runnable Python app,
   Azure infra, and Copilot integration), so learners have real code to run, not
   just docs about it.

## Input

The only required input is a **description of the topic** (free text). Example
inputs:

- "Building a retrieval-augmented chatbot on Azure AI Search with Copilot."
- "Automating Azure infrastructure with Bicep and GitHub Actions for beginners."
- "Writing Python data pipelines with Azure Functions and Event Hubs."

If the description is thin, infer a sensible scope and state your assumptions;
do not block on clarifying questions unless the topic is genuinely ambiguous.

## Non-negotiable conventions

These conventions are fixed regardless of topic:

- **Content code -> Python.** In the source doc and chapter content, use Python
  for code and concept examples wherever the topic allows. Drop to another
  language only when the topic strictly requires it (Bicep for infra, YAML for
  workflows, shell/PowerShell for commands).
- **AI layer -> Microsoft Copilot** (Copilot Studio, Copilot connectors/agents,
  the agentic protocol concepts) wherever an AI integration is shown.
- **Infrastructure -> Azure** (App Service / Container Apps / Functions, APIM,
  Key Vault, Static Web Apps, Bicep IaC, Azure CLI).
- **Website stack -> unchanged.** Do **not** change the framework, build tooling,
  components, or deploy assets. The site stays Next.js 15 (App Router) + React 18
  + TypeScript + Tailwind with `output: "export"`, deployed to Azure Static Web
  Apps. The "Python over JavaScript" rule applies to *learning content only*, not
  to the site's own TypeScript/React source. Only the per-topic **content and
  data files** change.

## Procedure

Work in stages. Do Stage A fully before Stage B, because the website is
generated from the source doc. **Stage C is optional** — only run it when the
user asks for the demo/reference assets to be built as well.

### Stage A - Author the flat source doc

1. Expand the topic description into a **6-stage learning path** and a chapter
   list. Re-sequence so beginners read top-to-bottom without hitting advanced
   material too early.
2. Write `<TOPIC>_Textbook_Guide.md` following the structure, section skeleton,
   and Python/Azure/Copilot conventions in
   [`references/source-doc-template.md`](references/source-doc-template.md).
3. While writing, deliberately include the **raw materials the website
   components consume**: fenced code blocks with language tags, comparison
   ("do this / avoid that") tables, symptom/cause/fix troubleshooting tables, an
   explicit security "non-negotiables" list, a glossary, and a production
   checklist. This makes Stage B a mechanical transform.

### Stage B - Generate the website

1. Use this repository as the **template**. Everything outside the per-topic
   content is topic-agnostic and is copied unchanged: the entire
   `src/components/` toolbox, `src/app/layout.tsx`, the app shell, `globals.css`,
   `tailwind.config.ts`, `next.config.mjs` (static export), and all deploy assets
   (`azure.yaml`, `infra/*.bicep`, `.github/workflows/azure-static-web-apps.yml`,
   `public/staticwebapp.config.json`).
2. Rewrite only the **content and data files** by mapping the source doc onto the
   components, following
   [`references/website-build.md`](references/website-build.md):
   - `src/lib/chapters.ts` - the chapter manifest (drives nav, prev/next, cards,
     search).
   - `src/lib/glossary.ts` - the glossary terms.
   - `src/lib/search-index.ts` - chapter + section + glossary entries.
   - one `src/app/<slug>/page.tsx` per chapter, composing existing components.
   - `src/app/page.tsx` (homepage) and `src/app/layout.tsx` metadata.
   - `README.md` (genericize any machine-specific path / live URL).
3. **Validate** with the existing scripts (do not add new tooling):
   ```bash
   npm install
   npm run typecheck
   npm run lint
   npm run build
   ```
   All three must pass and the static `out/` folder must export cleanly.

### Stage C - Build the demo / reference implementation (OPTIONAL)

Run this stage **only when the user opts in** (e.g. "also build the demo",
"create the actual project it teaches"). It produces the real, runnable artifact
the tutorial describes, so the docs are backed by working code.

1. **Confirm scope before building.** Skip this stage entirely unless the user
   asked for it. If asked, restate what you will build (language, Azure services,
   Copilot integration) and where it will live.
2. **Place it in a separate folder**, conventionally `demo/` at the repo root, so
   it never interferes with the website build. The static-export site only emits
   `src/` + `public/`, so a sibling `demo/` folder is safe.
3. **Follow the same content conventions** as the source doc: Python-first code,
   Azure for infra (Bicep, App Service / Container Apps / Functions, APIM, Key
   Vault), Microsoft Copilot for the AI layer.
4. **Keep the demo and the tutorial in lockstep.** The code, file names, commands,
   and architecture in `demo/` must match what the chapters describe (especially
   the `implementation`, `quickstart`, `deployment`, and `testing` chapters and
   the "What this file does" cards). Prefer scaffolding/ecosystem tools (e.g.
   `python -m venv`, `pip`, `azd init`, `az`) over hand-writing boilerplate.
5. **Make it runnable and verified.** Include a `demo/README.md` with prerequisites
   and exact run/test/deploy commands, plus a smoke test. Validate the demo with
   its own tooling (e.g. `pip install -r requirements.txt`, `pytest`, a local
   run). Do **not** run the demo's linters/tests as part of the website's
   validation — they are independent.
6. **Never commit secrets.** Use `.env.example` placeholders and Key Vault
   references; scan before committing.

See [`references/demo-build.md`](references/demo-build.md) for the recommended
demo layout and checklist.

## Output

- `<TOPIC>_Textbook_Guide.md` at the repo root (Asset 1).
- An updated/duplicated website whose content reflects the new topic (Asset 2),
  passing typecheck, lint, and build.
- *(optional, Stage C)* a runnable `demo/` reference implementation (Asset 3)
  that matches the tutorial, with its own README and smoke test.

## References

- [`references/source-doc-template.md`](references/source-doc-template.md) - the
  flat source-doc skeleton and authoring rules.
- [`references/website-build.md`](references/website-build.md) - exact component
  and data-file APIs for wiring content into the unchanged site.
- [`references/demo-build.md`](references/demo-build.md) - optional demo /
  reference-implementation layout and checklist (Stage C).
