# Flat Source-Doc Template (Asset 1)

This is the skeleton and authoring rules for the flat Markdown "textbook" that
the website is generated from. Save the file as `<TOPIC>_Textbook_Guide.md` at
the repository root.

## Authoring rules

- **Length / shape:** one long, linear Markdown file (target ~1,500-2,000 lines
  for a full topic). Plain Markdown only: headings, prose, bullet lists, tables,
  and fenced code blocks. No HTML, no framework code.
- **Code -> Python.** Every code/concept example uses Python unless the topic
  strictly requires otherwise. Allowed exceptions: Bicep (Azure IaC), YAML
  (GitHub Actions / config), `bash`/`powershell` (commands), JSON (payloads).
- **AI layer -> Microsoft Copilot.** Any AI integration is expressed through
  Copilot Studio / Copilot connectors / agents and the agentic-protocol concepts.
- **Infra -> Azure.** App Service / Container Apps / Functions, APIM, Key Vault,
  Static Web Apps, Bicep, Azure CLI.
- **Beginner-first.** Define jargon before using it; lead each section with a
  plain-English paragraph before any code.
- **Fence every code block with a language tag** (` ```python `, ` ```bicep `,
  ` ```yaml `, ` ```bash `, ` ```powershell `, ` ```json `). The site's code
  highlighter and language label depend on these tags.

## Six-stage learning path

Re-sequence the topic into these stages (rename only if a stage truly does not
apply). Each stage contains one or more chapters; each chapter becomes one
website route.

| Stage | Purpose |
|---|---|
| **Get Started** | Onboarding - jargon primer, prerequisites, quickstart / first win |
| **Understand** | Core concepts and architecture before any code |
| **Build** | Hands-on implementation chapters (Python-first) |
| **Integrate & Ship** | Copilot integration + Azure deployment |
| **Operate** | Security, testing, CI/CD, troubleshooting, extending |
| **Reference** | Production checklist, glossary, search |

## Per-chapter section skeleton

Write each chapter with these building blocks. Each maps directly onto a website
component (see `website-build.md`), so including them here makes Stage B
mechanical:

1. **Learning goals** - "By the end you'll be able to..." bullet list.
2. **Plain-English intro** - one paragraph, no jargon.
3. **Concept explanations** - prose + bullet definitions.
4. **Beginner / security / why-this-matters notes** - short call-out paragraphs,
   clearly labelled (these become callouts).
5. **Diagrams** - describe architecture/flows as text *and* as a Mermaid-style
   description (e.g. `flowchart LR ...`) plus a one-sentence text alternative.
6. **Code blocks** - Python-first, language-tagged, ideally with a filename.
7. **"What this file does"** - for each key source file: what it does, what a
   beginner may safely edit, what not to touch yet.
8. **Comparison tables** - a "do this / avoid that" two-column table.
9. **Concept checks** - a question plus a revealed answer.
10. **Hands-on lab** - a short exercise with a time estimate and a goal.
11. **Mini-project** - an open-ended design challenge.
12. **Chapter summary** - key takeaways.
13. **Review checklist** - tick-box statements confirming understanding.

## Recommended chapter set (adapt to the topic)

A typical full topic maps to ~17-19 chapters. Start from this list and rename to
fit the topic:

- `before-you-begin` - jargon primer (define every term a beginner will hit).
- `quickstart` - first-success path (install -> run -> smoke test).
- `concepts` - the handful of foundational ideas everything builds on.
- `architecture` - diagrams + request/data lifecycle.
- `environment` - required software and versions.
- `anatomy` - a tour of the repo/system the learner works inside + language basics.
- `implementation` - the file-by-file Python walkthrough (the meat).
- `local-dev` - the day-to-day development loop.
- `build-your-own` - a repeatable N-step method to generalize the example.
- `copilot-studio` - the Microsoft Copilot integration chapter.
- `deployment` - Azure deploy (Bicep, App Service/Container Apps/Functions, APIM).
- `security` - the non-negotiable rules and threat model.
- `testing` - unit + integration tests (pytest) and a smoke sequence.
- `cicd` - GitHub Actions pipeline design.
- `troubleshooting` - a decision tree and a symptom/cause/fix table.
- `extending` - adding new capabilities / porting to other systems.
- `checklist` - production-readiness items (becomes the interactive checklist).
- `glossary` - every term with a one-line and a longer definition.

## Closing sections to include once

- **Security non-negotiables** - an explicit numbered list of hard rules
  (becomes `security` callouts). Example posture to preserve where relevant:
  delegated OAuth over service accounts/PATs; secrets in Key Vault; gateway via
  APIM; least privilege.
- **Glossary** - a flat list of `Term - short definition - longer explanation`.
- **Production checklist** - grouped, checkable readiness items.
