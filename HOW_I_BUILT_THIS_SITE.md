# How I Built the MCP Tutorial Website — A Complete Walkthrough

> **Who this is for:** You — someone who isn't a web developer but wants to understand every decision and step taken to build this site, so you can repeat the process in the future.
>
> **What this file is:** A plain-English, step-by-step record of everything that was done, why each decision was made, and what each piece of technology actually does.

---

## Table of Contents

1. [The starting point — what I was given](#1-the-starting-point)
2. [The plan — deciding what kind of site to build](#2-the-plan)
3. [Choosing the technology stack](#3-choosing-the-technology-stack)
4. [Setting up the project skeleton](#4-setting-up-the-project-skeleton)
5. [Installing all the tools the project needs](#5-installing-dependencies)
6. [Organising the content into chapters](#6-organising-the-content-into-chapters)
7. [Building the visual design system](#7-building-the-visual-design-system)
8. [Building the reusable components](#8-building-the-reusable-components)
9. [Building the navigation shell](#9-building-the-navigation-shell)
10. [Writing every chapter page](#10-writing-every-chapter-page)
11. [Adding search](#11-adding-search)
12. [Validating everything works](#12-validating-everything-works)
13. [Deployment configuration](#13-deployment-configuration)
14. [Writing the README](#14-writing-the-readme)
15. [Feature checklist — everything the site has](#15-feature-checklist)
16. [Key lessons — how to repeat this yourself](#16-key-lessons)

---

## 1. The Starting Point

### What I was given
A single long Markdown file:
`MCP_Server_Implementation_Textbook_Guide.md` (~1,800 lines, ~53 KB)

This file was a detailed technical guide covering 19 topics — things like:
- What MCP is and how it works
- How to set up a Python project
- How Azure, security, and deployment work
- Troubleshooting tables
- A glossary of terms

### What I was asked to do
Transform that flat text file into a **polished, interactive, multi-page learning website** — not just paste the Markdown into a webpage, but genuinely reorganise it into something a beginner could follow.

### First thing I did: read the whole guide
Before writing a single line of code, I read sections of the source file to understand:
- How many major topics it covered (19)
- Which topics were for beginners vs. advanced users
- What diagrams, tables, code blocks, and checklists existed
- What the security rules were (important — I had to preserve them accurately)

---

## 2. The Plan

### Producing an internal plan
I wrote a plan for myself (a file called `plan.md`) that answered:
- What pages would exist?
- In what order should a beginner read them?
- What visual features does each page need?
- What components (reusable building blocks) would I need?

### Organising the content into a learning path
The original guide had 19 numbered sections, but they weren't in the best learning order for a beginner. I reorganised them into **six stages**:

| Stage | Purpose |
|---|---|
| **Get Started** | Onboarding — prerequisites, quickstart, first win |
| **Understand** | Concepts and architecture before any code |
| **Build** | Hands-on implementation chapters |
| **Integrate & Ship** | Connecting to Copilot Studio and deploying to Azure |
| **Operate** | Security, testing, CI/CD, troubleshooting, extending |
| **Reference** | Checklist, glossary, search |

This "learning path" approach means a beginner can work top to bottom without hitting advanced topics too early.

---

## 3. Choosing the Technology Stack

> **Plain English:** A "stack" is the collection of software tools that work together to build a website. Think of it like choosing which brand of power tools to use before building a piece of furniture.

### The choices made and why

| Tool | What it is | Why I chose it |
|---|---|---|
| **Next.js 15** | The main website framework | Industry standard for modern documentation sites; works great for static exports |
| **React 18** | The system for building UI components | Next.js is built on React; it lets you build reusable "blocks" of UI |
| **TypeScript** | A stricter version of JavaScript | Catches mistakes before they become bugs; much safer than plain JavaScript for a large project |
| **Tailwind CSS** | A styling system | Lets you style everything directly in the code without writing separate style sheets; very fast |
| **next-themes** | Dark/light mode switching | A tiny, reliable library that handles the theme toggle cleanly |
| **Mermaid** | Diagram rendering | Takes text descriptions and draws them as proper diagrams — flowcharts, sequence diagrams, etc. |
| **highlight.js** | Code syntax highlighting | Makes code blocks colour-coded so they're easier to read — all offline, no internet needed |

### The most important architectural decision: static export
I configured Next.js to produce a **static export** — meaning the final output is just HTML, CSS, and JavaScript files in a folder called `out/`. 

Why does that matter?
- It works offline (no server needed to run it)
- It's free to host on Azure Static Web Apps
- It's fast to load
- It's simple to deploy anywhere

---

## 4. Setting Up the Project Skeleton

### Creating the configuration files
Every modern web project needs several "instruction files" that tell the tools how to behave. I created all of these:

| File | What it does |
|---|---|
| `package.json` | Lists all the software packages the project needs and defines commands like `npm run build` |
| `next.config.mjs` | Tells Next.js to produce a static export |
| `tsconfig.json` | Tells TypeScript how strict to be and where files live |
| `tailwind.config.ts` | Tells Tailwind what colours and fonts to use (I added Microsoft's Azure blue colour palette) |
| `postcss.config.mjs` | A tool Tailwind needs behind the scenes |
| `.eslintrc.json` | Configures a code quality checker |
| `.gitignore` | Tells the version control system which files to ignore (e.g. `node_modules`) |

### Creating the folder structure
```
src/
├── app/           ← One subfolder per page/route
├── components/    ← Reusable building blocks
└── lib/           ← Shared data and utility functions
public/            ← Static files (images, config)
```

> **Plain English:** Think of `src/app/` like a filing cabinet where each drawer is a page of the website. `src/components/` is like a toolbox of reusable UI pieces you can drop into any page.

---

## 5. Installing Dependencies

### What "installing dependencies" means
The `package.json` file lists the names of all the software packages needed. Running `npm install` goes out and downloads all of them into a folder called `node_modules/`.

### The packages installed
| Package | Purpose |
|---|---|
| `next` | The web framework |
| `react`, `react-dom` | The UI building system |
| `next-themes` | Dark/light mode |
| `mermaid` | Diagram rendering |
| `highlight.js` | Code syntax highlighting |
| `tailwindcss`, `autoprefixer`, `postcss` | Styling tools |
| `typescript`, `@types/*` | TypeScript and its type definitions |
| `eslint`, `eslint-config-next` | Code quality checker |

### A security upgrade
The initially installed version of Next.js (15.1.6) had a known security vulnerability. I immediately upgraded it to **15.5.19** (the patched version) before writing any pages. This is good practice — always use the latest safe version of your dependencies.

---

## 6. Organising the Content into Chapters

### The chapters data file (`src/lib/chapters.ts`)
I created a single file that acts as the **master list** of all chapters. For each chapter it stores:
- The **slug** (the URL path, e.g. `/concepts/`)
- The **title** (full page title)
- The **navTitle** (short label for the sidebar)
- The **group** (which stage it belongs to)
- A **summary** (one sentence description)
- **Keywords** (for search)

This single file drives:
- The sidebar navigation (automatically built from it)
- The previous/next links on every chapter
- The homepage chapter cards
- The search index

> **Key insight:** By centralising the chapter list, I only had to update one file to add, remove, or reorder chapters — everything else updated automatically.

### The glossary data file (`src/lib/glossary.ts`)
All 24 glossary terms (MCP, APIM, OAuth, etc.) were written in one data file with:
- The term name
- A short one-line definition
- A longer beginner-friendly explanation

This feeds the Glossary page AND the hover-tooltip feature (when you hover over a term, a popup appears with its definition).

---

## 7. Building the Visual Design System

### Global styles (`src/app/globals.css`)
I wrote a global stylesheet that defines:
- **Base typography** — font sizes for headings (h1, h2, h3) in both light and dark mode
- **Focus rings** — the blue outline you see when navigating by keyboard (accessibility requirement)
- **Reusable CSS classes** — `.prose-content`, `.inline-code`, `.data-table` used throughout all pages
- **Syntax highlighting colours** — custom colour tokens for every type of code element (keywords, strings, numbers, comments) in both light and dark mode, all defined offline without needing external CSS files
- **Tailwind directives** — the three lines `@tailwind base/components/utilities` that load the Tailwind system

### The colour palette
I extended Tailwind with Microsoft's Azure blue (`azure-50` through `azure-900`) so the site feels visually consistent with Microsoft's products.

### Font choices
- **Body:** Segoe UI (Microsoft's system font) → falls back to system-ui → sans-serif
- **Code:** Cascadia Code (Microsoft's coding font) → Consolas → monospace

---

## 8. Building the Reusable Components

> **Plain English:** A "component" is like a template or a stamp. You design it once, then reuse it everywhere. When you update the template, every page that uses it updates automatically.

Here are all the components I built, what they are, and what they do:

### `ThemeProvider.tsx` — Dark/light mode engine
Wraps the whole site and listens for the user's system preference (dark or light). All other components can ask "what theme are we in?" and respond accordingly.

### `ThemeToggle.tsx` — The theme switch button
The sun/moon icon button in the top bar. When clicked, it switches between dark and light mode and remembers the choice. Completely accessible — it has a proper `aria-label` for screen readers.

### `CodeBlock.tsx` — Syntax-highlighted code with copy button
Every code snippet on the site goes through this component. It:
- Detects the programming language (Python, PowerShell, JSON, YAML, etc.)
- Applies colour-coding using highlight.js
- Shows a filename or language label in the title bar
- Has a **Copy** button that puts the code on your clipboard and briefly shows "Copied ✓"
- Works completely offline (no CDN needed)

### `Callout.tsx` — The coloured notice boxes
The boxes that say "🔒 Security", "💡 Tip", "⚠️ Warning", "🧭 Beginner note", "🎯 Why this matters", etc. Each has a different colour scheme. They have `role="alert"` on security and warning variants so screen readers announce them prominently.

### `Mermaid.tsx` — Diagram renderer
Takes a text description like:
```
flowchart LR
    User --> APIM --> Server --> Jira
```
…and renders it as a proper visual diagram. It:
- Loads Mermaid only in the browser (not during build), avoiding server errors
- Automatically switches between light and dark diagram themes to match the site theme
- Shows a text fallback if the diagram fails to render (accessibility)
- Has a caption below explaining what the diagram teaches

### `ConceptCheck.tsx` — Expandable quiz questions
A question block with a "Show me the answer" button. When clicked, the answer slides open. Built to reinforce learning without just giving everything away upfront. Uses React state to track open/closed.

### `VideoCard.tsx` — Video recommendations (verified or placeholder)
Shows a "Watch to reinforce this concept" card. Critically:
- If a verified video exists (with real title, URL, source), it shows a link
- If not (which is the case here — I refused to invent fake YouTube URLs), it shows an honest placeholder with the **exact search query** to use on an official channel
- This was a deliberate choice: fake links are worse than no links

### `Card.tsx` and `CardGrid.tsx` — Info cards in a grid
The boxes on the homepage and in the "Before You Begin" chapter that show concepts like "API", "Token", "OAuth". Cards can optionally be links. The grid is responsive — 1 column on mobile, 2 or 3 columns on desktop.

### `Lab.tsx` and `MiniProject.tsx` — Hands-on exercise blocks
Styled blocks that mark hands-on activities. Labs have a time estimate and a goal. Mini-projects are more open-ended design exercises. These were added as **learning scaffolding** — research shows exercises improve retention much more than passive reading.

### `WhatThisFileDoes.tsx` — File explainer cards
For key source code files (like `server.py`, `middleware.py`), this card shows:
- What the file does
- What a beginner can safely edit
- What a beginner should NOT touch yet (and why)

### `Checklist.tsx` — Interactive checkboxes with saved progress
The production readiness checklist uses this component. It:
- Renders a list of checkboxes
- Shows a progress bar at the top
- Saves your checked/unchecked state to browser `localStorage` (so progress persists when you refresh)
- Has a "Reset this checklist" link

### `GlossaryTerm.tsx` — Hover-tooltip for glossary words
When a technical term is wrapped in this component, hovering over it (or focusing it with keyboard) shows a small popup with the term's definition from the glossary data file. No external library needed.

### `ReadingProgress.tsx` — Progress bar at top of page
The thin blue bar at the very top of the page that fills in as you scroll down. Uses a scroll event listener and tracks position as a percentage.

---

## 9. Building the Navigation Shell

### `SidebarNav.tsx` — The left-hand chapter list
Reads the chapters data file and renders the navigation. It:
- Groups chapters by stage ("Get Started", "Understand", etc.)
- Highlights the current page with a blue background
- Sets `aria-current="page"` on the active item for screen readers
- Accepts an `onNavigate` callback so the mobile drawer can close after you tap a link

### `QuickSearch.tsx` — The Ctrl+K search popup
The search box in the top bar. It:
- Listens for `Ctrl+K` (or `⌘+K` on Mac) anywhere on the page
- Opens a command-palette-style input
- Searches in real time as you type (no server, no network — all from the static index)
- Supports arrow-key navigation through results
- Press Enter to go to the selected result or the full search page

### `AppShell.tsx` — The master layout wrapper
This is the "frame" that every page lives inside. It includes:
- The sticky top bar (with logo, search, and theme toggle)
- The desktop sidebar (always visible on large screens)
- The mobile drawer (slides in from the left on small screens, with a hamburger button)
- A skip-to-content link (hidden, but revealed when you press Tab — for accessibility)
- The footer
- A "MCP" logo badge in the top-left corner

### `ChapterShell.tsx` — The standard chapter template
Every chapter page uses this wrapper. It automatically adds:
- The eyebrow label (e.g., "Chapter 3 · Build")
- The learning goals box (green ✓ list)
- The "On this page" table of contents with anchor links
- The chapter summary box
- The end-of-chapter review checklist
- Previous/Next navigation buttons

---

## 10. Writing Every Chapter Page

### The root layout (`src/app/layout.tsx`)
This wraps the entire site. It:
- Sets the HTML language to English
- Configures the browser tab title template (`"Title · MCP Server Guide"`)
- Sets the SEO metadata (description, keywords)
- Wraps everything in `ThemeProvider` and `AppShell`
- Adds a skip-to-content accessibility link

### The homepage (`src/app/page.tsx`)
The homepage includes:
- A hero section explaining who the site is for and what they'll build
- The high-level architecture Mermaid diagram
- A security callout (prominent, because it's important)
- A "who is this for" section with three cards (New to MCP / Want a quick win / Shipping to production)
- The full learning path card grid — all chapters organised by stage

### The 19 chapter pages
Each chapter lives in its own folder under `src/app/`:

| Folder | Chapter |
|---|---|
| `before-you-begin/` | Jargon primer — API, token, OAuth, JSON, terminal |
| `quickstart/` | First success path — install, run, smoke test |
| `concepts/` | Core concepts — MCP, tools, OAuth 3LO, APIM, trimming |
| `architecture/` | Architecture diagrams and request lifecycle |
| `environment/` | Dev environment setup on Windows |
| `anatomy/` | Repository tour and Python basics |
| `implementation/` | Code walkthrough — middleware, context, client, trimming |
| `local-dev/` | Day-to-day development loop |
| `build-your-own/` | 15-step method for building from scratch |
| `copilot-studio/` | Atlassian OAuth app and connector setup |
| `deployment/` | Azure deploy script, Bicep, APIM policy |
| `security/` | Non-negotiable rules and threat model |
| `testing/` | Unit tests, integration tests, smoke sequence |
| `cicd/` | GitHub Actions pipeline design |
| `troubleshooting/` | Decision tree and symptom/cause/fix table |
| `extending/` | Adding new tools and porting to other systems |
| `checklist/` | Interactive production readiness checklist |
| `glossary/` | All 24 terms + 15 final principles |
| `search/` | Full search results page |

### What every chapter contains (the learning scaffolding)
For each chapter I wrote (following the assignment requirements):

1. **Eyebrow label** — which stage and chapter number
2. **Learning goals** — "By the end, you'll be able to…" bullet list
3. **On-this-page TOC** — anchor links to every section
4. **Plain-English intro paragraph** — before any technical content
5. **Beginner callouts** — `🧭` boxes explaining confusing concepts in simple language
6. **Security callouts** — `🔒` boxes for security-sensitive actions
7. **"Why this matters" callouts** — `🎯` boxes explaining the real-world reason
8. **Diagrams** — Mermaid visuals with captions and text alternatives
9. **Code blocks** — syntax-highlighted with copy buttons
10. **Tables** — for comparisons, settings, and mappings
11. **"What this file does" cards** — for key source files
12. **Concept checks** — quiz questions with reveal answers
13. **Hands-on labs** — short exercises with time estimates
14. **Mini-projects** — open-ended design challenges
15. **Video cards** — honest placeholders with search queries
16. **Chapter summary** — key takeaways
17. **Review checklist** — tick-boxes to confirm understanding
18. **Previous/Next navigation** — links to adjacent chapters

---

## 11. Adding Search

### The search index (`src/lib/search-index.ts`)
Instead of a database or a search service, I built a **static search index** — a JavaScript object that lists every searchable item:
- All 19 chapters (with title, URL, summary, and keywords)
- ~20 curated deep-link sections (so search can land you at `/concepts/#oauth-3lo`, not just `/concepts/`)
- All 24 glossary terms

Total: ~60 indexed entries.

### The ranking algorithm
A simple but effective ranking function:
1. Split the query into words
2. Every indexed entry must contain **all** the words (otherwise filtered out)
3. Entries that match in the title score higher than body matches
4. Chapter-level entries get a slight bonus over section entries
5. Results are sorted by score and limited to 30

This runs entirely in your browser. No server, no API, no network request.

### Two search surfaces
- **`QuickSearch.tsx`** — The Ctrl+K command palette (appears on every page)
- **`search/page.tsx`** + **`SearchClient.tsx`** — A dedicated `/search/` page with a full input and up to 50 results, readable from the URL query string (so links like `/search/?q=oauth` work)

---

## 12. Validating Everything Works

After writing all the pages, I ran three validation checks:

### TypeScript typecheck
```powershell
npm run typecheck
```
This checks every file for type errors — like trying to pass a number where a string is expected. **Result: zero errors.**

### ESLint
```powershell
npm run lint
```
This checks for code quality problems — unused variables, accessibility issues, etc. **Result: zero warnings or errors.**

### Production build
```powershell
npm run build
```
This is the most important check. It:
- Compiles all TypeScript to JavaScript
- Runs lint and typecheck again
- Generates all 23 static HTML pages
- Exports them to the `out/` folder

**Result: build succeeded, all 23 routes exported cleanly.**

### Runtime check
I served the `out/` folder and fetched several pages with PowerShell to confirm they returned HTTP 200 with real content. Checks included:
- Homepage has the hero text
- Architecture page has the diagram alt text
- Concepts page has the OAuth section
- All 6 sampled pages returned 200

---

## 13. Deployment Configuration

### Azure Static Web Apps config (`public/staticwebapp.config.json`)
A small JSON file that tells Azure how to serve the static site:
- **Navigation fallback** — shows the 404 page instead of crashing for unknown routes
- **MIME types** — teaches Azure that `.svg` files are images
- **Security headers** — adds three HTTP headers to every response:
  - `X-Content-Type-Options: nosniff` — prevents browsers from guessing file types
  - `X-Frame-Options: DENY` — prevents the site from being embedded in an iframe (clickjacking protection)
  - `Referrer-Policy` — controls what URL information is shared when clicking links

### App icon (`src/app/icon.svg`)
A simple blue square with "MCP" text in white — appears as the browser tab favicon.

---

## 14. Writing the README

`README.md` in the website folder explains everything a human needs to use the project:

1. What the site is and what it covers
2. The full feature list
3. The technology stack (table)
4. Prerequisites (Node.js version)
5. Step-by-step Windows PowerShell commands to install, run, build, and preview
6. How to deploy to Azure Static Web Apps (two methods)
7. The project folder structure (annotated)
8. Key reusable components (table)
9. Content principles preserved from the source guide
10. Accessibility notes
11. Known limitations (honest, not hidden)

---

## 15. Feature Checklist

Here is every feature the finished website has:

### Navigation
- [x] Sticky top bar on every page
- [x] Collapsible sidebar on desktop (always visible)
- [x] Mobile hamburger menu (slides in as a drawer)
- [x] Previous / Next chapter navigation at the bottom of every chapter
- [x] "On this page" anchor links at the top of every chapter
- [x] "Skip to content" accessibility link

### Theme
- [x] Dark mode / light mode toggle
- [x] Follows system preference by default
- [x] Persists your choice
- [x] All diagrams, code blocks, and callouts adapt to the theme

### Search
- [x] Ctrl+K / ⌘+K command palette search (opens anywhere)
- [x] Real-time results as you type
- [x] Arrow key navigation through results
- [x] Full `/search/` page with URL query string support
- [x] Chapters, sections, and glossary terms all indexed

### Code
- [x] Syntax highlighting for Python, PowerShell, JSON, YAML, XML, Dockerfile, Bash, plain text
- [x] Copy button on every code block
- [x] Filename/language label in the code title bar
- [x] Works fully offline (no CDN)

### Diagrams
- [x] Architecture diagram (homepage)
- [x] High-level component diagram (architecture chapter)
- [x] Request lifecycle sequence diagram (architecture chapter)
- [x] Identity/OAuth flow diagram (architecture + security chapters)
- [x] Middleware decision tree (implementation chapter)
- [x] Deployment topology diagram (deployment chapter)
- [x] Smoke test decision flowchart (testing chapter)
- [x] Troubleshooting decision tree (troubleshooting chapter)
- [x] CI/CD pipeline diagram (CI/CD chapter)
- [x] First-success path flowchart (quickstart chapter)
- [x] All diagrams have accessible text alternatives
- [x] All diagrams have captions explaining what they teach
- [x] Diagrams switch between light and dark themes

### Learning Scaffolding
- [x] Learning goals on every chapter
- [x] "Before you begin" primer chapter (plain-English jargon definitions)
- [x] Beginner callouts (🧭)
- [x] Security callouts (🔒)
- [x] Warning callouts (⚠️)
- [x] "Why this matters" callouts (🎯)
- [x] Tip callouts (💡)
- [x] Production callouts (🏭)
- [x] "What success looks like" callouts (✅)
- [x] Concept checks (quiz questions with reveal answers)
- [x] Hands-on labs (with time estimates and goals)
- [x] Mini-projects (open-ended design exercises)
- [x] "What this file does" cards with beginner edit guidance
- [x] Expected command output blocks
- [x] Comparison tables (do this / avoid that)
- [x] Chapter summaries
- [x] End-of-chapter review checklists

### Interactive Features
- [x] Expandable "show me the answer" concept checks
- [x] Interactive production checklist (progress saved in browser)
- [x] Glossary hover/focus tooltips (hover any underlined term)
- [x] Reading progress bar (thin blue line at top of page)
- [x] Copy buttons on all code blocks

### Accessibility
- [x] Semantic HTML (correct heading hierarchy, nav, header, footer, article)
- [x] Skip-to-content link
- [x] ARIA labels on buttons and interactive elements
- [x] `aria-current="page"` on the active sidebar link
- [x] `role="alert"` on warning and security callouts
- [x] Keyboard navigable (Tab key works through all controls)
- [x] Focus rings visible for keyboard users
- [x] Meaningful alt text on all diagrams
- [x] Color contrast designed for accessibility in both themes

### Pages / Routes (21 total)
Home, Before You Begin, Quickstart, Core Concepts, Architecture, Dev Environment, Repo & Python, Implementation, Local Dev, Build Your Own, Copilot Studio & OAuth, Deployment, Security, Testing, CI/CD, Troubleshooting, Extending, Production Checklist, Glossary, Search, 404

---

## 16. Key Lessons — How to Repeat This Yourself

If you want to build a similar documentation website in the future, here are the most important things to know:

### Lesson 1: Plan before you code
Spend time upfront deciding:
- How many pages?
- What order?
- What reusable components will you need?

A good plan prevents you from rewriting things later.

### Lesson 2: One source of truth for structure
Put your navigation/chapter list in **one data file**. Every other part of the site (sidebar, prev/next, homepage, search) reads from it. This means you change one file, everything updates.

### Lesson 3: Build components, not pages
The most valuable time I spent was on the reusable components — `Callout`, `CodeBlock`, `ChapterShell`, `Checklist`, etc. Once those existed, writing the actual chapter content was fast and consistent.

### Lesson 4: Validate early and often
I ran `npm run build` after writing the first 3 pages, long before all 19 were done. This caught configuration errors early when they're cheap to fix — not at the end when you have 19 pages to check.

### Lesson 5: Static export is the right choice for docs sites
Don't build a server-side app when a static site will do. Static = faster, cheaper, simpler to deploy, works offline, no server to manage.

### Lesson 6: Be honest about what you don't have
The video cards show placeholder messages instead of invented YouTube links. Honesty is more useful than fake content. Design your site to be complete and useful without the optional extras.

### Lesson 7: Accessibility isn't optional
A few small things — skip links, ARIA labels, focus rings, alt text — make the site usable for keyboard users and screen reader users. These take very little time and make a big difference.

### Lesson 8: The command sequence to build any similar site
```powershell
# 1. Create a new Next.js project
npx create-next-app@latest my-docs-site --typescript --tailwind --app --no-src-dir

# 2. Install extra packages
cd my-docs-site
npm install next-themes mermaid highlight.js

# 3. Build and check
npm run dev       # develop
npm run typecheck # check types
npm run lint      # check code quality
npm run build     # produce the static site in out/
npx serve out     # preview the production build
```

### The full technology recipe
| You want to... | Tool to use |
|---|---|
| Build pages | Next.js (App Router) |
| Style things | Tailwind CSS |
| Add dark mode | next-themes |
| Show diagrams | Mermaid |
| Highlight code | highlight.js |
| Add types/safety | TypeScript |
| Check code quality | ESLint |
| Deploy to Azure | Azure Static Web Apps |

---

*This document was written to help you understand exactly what was built and why, so you can recreate it. The website itself lives at `MCP Tutorial Website/` — all the source code is in `src/`, all the built output is in `out/`.*
