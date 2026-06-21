# MCP Server Implementation — Tutorial Website

[![Azure Static Web Apps CI/CD](https://github.com/uzonian/uzonian-mcp-tutorial-website/actions/workflows/azure-static-web-apps.yml/badge.svg)](https://github.com/uzonian/uzonian-mcp-tutorial-website/actions/workflows/azure-static-web-apps.yml)

🌐 **Live site:** https://thankful-moss-0e745710f.7.azurestaticapps.net

A polished, beginner-friendly documentation website that teaches how to design,
build, secure, test, deploy, and operate a **Model Context Protocol (MCP)
server** in Python and connect it to **Microsoft Copilot Studio** through Azure
API Management.

The content is transformed from `MCP_Server_Implementation_Textbook_Guide.md`
into a structured, multi-chapter learning product with diagrams, code blocks,
labs, concept checks, an interactive production checklist, a glossary, and local
search.

> The reference example exposes **Jira Cloud**, but the architecture and
> patterns apply to any enterprise system you want to expose to an AI agent.

---

## ✨ Features

- **19 chapters** across six stages (Get Started → Understand → Build →
  Integrate & Ship → Operate → Reference)
- **Learning scaffolding** on every chapter: learning goals, plain-English
  primers, beginner/security/why-this-matters callouts, concept checks with
  reveal answers, hands-on labs, mini-projects, "what this file does" cards, and
  end-of-chapter review checklists
- **Guided first-success path** (Quickstart): install → open in VS Code → create
  a venv → install deps → start the server → smoke test → inspect `/mcp`
- **Mermaid diagrams** for architecture, request lifecycle, auth/identity flow,
  middleware logic, deployment topology, troubleshooting decision trees, and the
  CI/CD pipeline — each with an accessible text equivalent
- **Syntax-highlighted code** (offline, via `highlight.js`) with **copy buttons**
- **Local search** (Ctrl/⌘ + K) over chapters, sections, and glossary — no
  network calls
- **Dark / light mode** with system preference
- **Interactive production checklist** that saves progress in the browser
- **Responsive** desktop + mobile layout, keyboard-friendly, with a skip link,
  ARIA labels, and reading-progress indicator
- Optional **"Watch to reinforce this concept"** video cards — verified sources
  only, otherwise an honest placeholder with an exact search query (no invented
  URLs)

---

## 🧱 Stack

| Layer            | Choice                                   |
| ---------------- | ---------------------------------------- |
| Framework        | Next.js 15 (App Router), static export   |
| Language         | TypeScript + React 18                    |
| Styling          | Tailwind CSS 3.4                          |
| Theme            | next-themes (class-based dark mode)       |
| Diagrams         | Mermaid (client-rendered)                |
| Code highlight   | highlight.js (offline, theme-aware)      |
| Search           | Custom dependency-free static index      |

The site is a **fully static export** (`output: "export"`), so it works offline
(except optional external videos) and deploys to any static host.

---

## ✅ Prerequisites

- **Node.js 18.18+** (built and validated on Node 24)
- **npm 9+**

Check your versions (Windows PowerShell):

```powershell
node --version
npm --version
```

---

## 🚀 Install, run, and build (Windows PowerShell)

From the website folder:

```powershell
cd "C:\Users\uacholonu\OneDrive - Microsoft\Documents\DevZone\CoworkDev\Plugin Projects\My MCP Builds\MCP Tutorial Website"
```

### 1. Install dependencies

```powershell
npm install
```

### 2. Run the development server

```powershell
npm run dev
```

Then open <http://localhost:3000>.

### 3. Type-check and lint (optional but recommended)

```powershell
npm run typecheck
npm run lint
```

### 4. Build the production site (static export)

```powershell
npm run build
```

The static site is written to the **`out/`** folder.

### 5. Preview the production build locally

```powershell
npx serve out
```

Then open the URL it prints (usually <http://localhost:3000>).

---

## ☁️ Deploy

The build produces a static `out/` folder, so any static host works. Two
Microsoft-friendly options:

### Option A — Azure Static Web Apps (recommended)

A `public/staticwebapp.config.json` is included (it is copied into `out/` on
build) with sensible fallback routing and security headers.

**Using the SWA CLI (PowerShell):**

```powershell
npm install -g @azure/static-web-apps-cli
npm run build
swa deploy .\out --env production
```

**Using GitHub Actions:** create a Static Web App in the Azure Portal and point
it at your repo with these build settings:

| Setting          | Value   |
| ---------------- | ------- |
| App location     | `/`     |
| Output location  | `out`   |
| API location     | (empty) |

Azure injects a deployment workflow that runs `npm run build` and publishes
`out/`.

### Option B — Azure Storage static website

```powershell
npm run build
az storage blob upload-batch `
  --account-name <youraccount> `
  --destination '$web' `
  --source .\out
```

(Enable the static website feature on the storage account first.)

---

## 📁 Project structure

```text
MCP Tutorial Website
|-- src
|   |-- app
|   |   |-- layout.tsx           # root layout, theme provider, app shell
|   |   |-- page.tsx             # homepage
|   |   |-- globals.css          # Tailwind + highlight.js token theme
|   |   |-- <chapter>/page.tsx   # one folder per chapter route
|   |-- components               # reusable UI (callouts, diagrams, code, etc.)
|   |-- lib
|       |-- chapters.ts          # chapter manifest, nav order, prev/next
|       |-- glossary.ts          # glossary terms
|       |-- search-index.ts      # static search index + ranking
|-- public
|   |-- staticwebapp.config.json # Azure Static Web Apps config
|-- next.config.mjs              # static export config
|-- tailwind.config.ts
|-- package.json
```

### Key reusable components

| Component             | Purpose                                             |
| --------------------- | --------------------------------------------------- |
| `ChapterShell`        | Standard chapter frame: goals, TOC, summary, review, prev/next |
| `Callout`             | Tip / warning / security / beginner / why / production notes |
| `CodeBlock`           | Highlighted code with a copy button                 |
| `Mermaid`             | Theme-aware diagram with text alt                   |
| `ConceptCheck`        | Question with an expandable "show me the answer"     |
| `Checklist`           | Interactive checklist with saved progress           |
| `VideoCard`           | Verified video card or honest placeholder           |
| `WhatThisFileDoes`    | File explainer with beginner edit guidance          |
| `Lab` / `MiniProject` | Hands-on exercise blocks                            |
| `QuickSearch`         | Ctrl/⌘ + K command-palette search                   |

---

## 🧭 Content principles preserved

This site intentionally keeps the security and architecture posture of the
source guide:

- Native MCP at `/mcp` is the **primary** design; REST is only a fallback.
- **Delegated OAuth 2.0 3LO** — actions run as the signed-in user.
- **No service accounts, no PATs**, no stored user tokens.
- **APIM** gateway + **Key Vault**-backed gateway secret (verified by the app).
- **Payload trimming** with a byte budget to avoid oversized agent responses.
- Copilot Studio connector concepts (`x-ms-agentic-protocol`) are central.

---

## ♿ Accessibility

- Semantic HTML, labelled controls, and a "skip to content" link
- Every diagram has a meaningful `alt` / text equivalent
- Keyboard-operable search, theme toggle, and navigation
- Color choices aim for adequate contrast in both themes

---

## ⚠️ Known limitations

- **Video cards are placeholders by design.** To avoid inventing URLs, verified
  videos are not embedded; each placeholder includes the exact search query for
  an official source (Microsoft, Azure, Atlassian, GitHub, VS Code, Python, or
  MCP). Replace them with verified links via the `VideoCard` props once
  confirmed.
- Search is a lightweight static index (titles, summaries, keywords, and curated
  section anchors), not a full-text index of every paragraph.
- The site documents the reference implementation; it does not contain or run the
  Python MCP server itself.

---

## 📄 Source

Generated from `MCP_Server_Implementation_Textbook_Guide.md`. Content is for
educational use.
