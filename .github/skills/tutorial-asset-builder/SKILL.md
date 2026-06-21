---
name: tutorial-asset-builder
description: >-
  Generate a complete two-part tutorial asset set for a given topic: (1) a flat
  Markdown "textbook" source doc and (2) a Next.js static tutorial website built
  from it. The single input is a free-text description of the topic to build the
  assets for. Learning content prefers Python over JavaScript and uses Azure for
  infrastructure and Microsoft Copilot for the AI layer; the website keeps the
  existing Next.js 15 + React 18 + TypeScript + Tailwind static-export stack
  unchanged. Use this skill whenever the user wants to turn a topic into a
  polished, beginner-friendly interactive tutorial site like this repository.
---

# Tutorial Asset Builder

This skill turns **a single topic description** into two coordinated assets, the
same way this repository's MCP tutorial was built:

1. **Asset 1 — the flat source doc** (`<TOPIC>_Textbook_Guide.md`): one long,
   linear Markdown "textbook" that is the content brain.
2. **Asset 2 — the website**: a Next.js static-export site that transforms Asset
   1 into an interactive, multi-chapter learning product.

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

Work in two stages. Do Stage A fully before Stage B, because the website is
generated from the source doc.

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

## Output

- `<TOPIC>_Textbook_Guide.md` at the repo root (Asset 1).
- An updated/duplicated website whose content reflects the new topic (Asset 2),
  passing typecheck, lint, and build.

## References

- [`references/source-doc-template.md`](references/source-doc-template.md) - the
  flat source-doc skeleton and authoring rules.
- [`references/website-build.md`](references/website-build.md) - exact component
  and data-file APIs for wiring content into the unchanged site.
