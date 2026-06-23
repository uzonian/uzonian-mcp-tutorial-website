# Uzonian Dev Tutorials — Central Hub

The landing site for **uzoniandev.com**. It introduces the tutorial program and
routes visitors into individual, standalone tutorial **modules** that are
stitched together under one domain using the **Next.js Multi-Zones** pattern
(Option A — path-mounted modules).

- The **hub** (this app) serves the domain **root** (`https://uzoniandev.com/`).
- Each **module** is its own static site mounted at a path prefix, e.g. the MCP
  module at `https://uzoniandev.com/mcp-server/`.
- A front-door router (Azure Front Door, or a single Static Web App with routes)
  sends `/<module>/*` to that module's deployment and everything else to the hub.

This app is intentionally **self-contained and extractable** — it has its own
`package.json`, build config, and `src/`, so it can be moved into its own
repository later without touching the tutorial modules.

---

## Tech stack

Matches the modules so the hub and every module read as one product:

- **Next.js 15** App Router, `output: "export"` (static export), `trailingSlash`,
  `images.unoptimized`, `reactStrictMode`.
- **React 18** + **TypeScript**.
- **Tailwind CSS 3.4** with the shared `azure` color palette and font tokens.
- **next-themes** for class-based dark/light mode.

---

## Run and build

```powershell
cd central-hub
npm install

npm run dev        # local dev server (http://localhost:3000)
npm run build      # static export to ./out
npm run typecheck  # tsc --noEmit
npm run lint       # next lint
```

`npm run build` produces a fully static site in `central-hub/out/` (including
`index.html`, `404.html`, and `staticwebapp.config.json`). Deploy that folder as
the hub's Static Web App / origin.

> `node_modules`, `.next`, and `out` are git-ignored (see `central-hub/.gitignore`).

---

## Module registry

`src/lib/modules.ts` is the hub's **single source of truth** for the modules it
lists. Each entry mirrors a module's own manifest shape (`id`, `title`,
`shortTitle`, `summary`, `href`) and adds two hub-specific fields:

| Field        | Purpose                                                              |
| ------------ | ------------------------------------------------------------------- |
| `id`         | Stable id, also the path segment (e.g. `mcp-server`).               |
| `title`      | Full title shown on the card.                                       |
| `shortTitle` | Compact label for tight spaces.                                     |
| `summary`    | One-line description shown on the card.                             |
| `href`       | Absolute mounted path, e.g. `/mcp-server/` (cross-zone, see below). |
| `status`     | `"published"` (links out) or `"coming-soon"` (renders disabled).    |
| `tags`       | Topic chips shown on the card.                                      |

### Cross-zone navigation (important)

Modules live in **separate deployment zones**, so links into them are rendered as
plain `<a href="/mcp-server/">` anchors — a **full document load**, never
`next/link`. Using `next/link` would treat the path as an internal hub route and
break cross-zone navigation. Only the hub's own internal links (e.g. the brand
mark → `/`) use `next/link`.

---

## Front Door routing

Put one router in front of the hub and every module so they share a single
domain. With **Azure Front Door** (or an equivalent reverse proxy / SWA routes):

| Route pattern   | Origin                                            |
| --------------- | ------------------------------------------------- |
| `/mcp-server/*` | MCP module Static Web App (path **preserved**)    |
| `/*` (default)  | this hub                                          |

The path must be **preserved** when forwarding to a module, because each module
is built with `NEXT_PUBLIC_BASE_PATH` set to its mount point, so its asset and
page URLs already include the prefix (e.g. `/mcp-server/_next/...`).

The hub's `public/staticwebapp.config.json` adds a root navigation fallback
(`/404.html`) and the same security headers the modules use:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`

---

## Add a new module

1. **Register it here.** Add an entry to the `modules` array in
   `src/lib/modules.ts`:

   ```ts
   {
     id: "rag-azure-openai",
     title: "Build a RAG App with Azure OpenAI",
     shortTitle: "RAG on Azure",
     summary: "Ground an LLM in your own data with retrieval-augmented generation.",
     href: "/rag-azure-openai/",
     status: "published", // or "coming-soon" while it's not live yet
     tags: ["RAG", "Azure OpenAI", "Python"],
   }
   ```

2. **Build the module for its mount point.** In the module's repo, set
   `NEXT_PUBLIC_BASE_PATH=/rag-azure-openai` and run its `build:module` script so
   its static files and asset URLs line up at that prefix.

3. **Add a front-door route.** Point `/<module-id>/*` at that module's origin with
   the path preserved (see the routing table above).

4. **Deploy.** Re-deploy the hub (so the new card appears) and the new module.

---

## Project structure

```
central-hub/
|-- public/
|   `-- staticwebapp.config.json   # root-served nav fallback + security headers
|-- src/
|   |-- app/
|   |   |-- globals.css            # Tailwind + shared design tokens
|   |   |-- icon.svg               # favicon (UD brand mark)
|   |   |-- layout.tsx             # root layout: theme provider, skip link, shell
|   |   |-- not-found.tsx          # 404 page
|   |   `-- page.tsx               # landing page: hero + module grid
|   |-- components/
|   |   |-- BrandMark.tsx          # shared "UD" brand mark
|   |   |-- HubShell.tsx           # top bar (brand + theme toggle) + footer
|   |   |-- ModuleCard.tsx         # module card (anchor / disabled)
|   |   |-- ThemeProvider.tsx      # next-themes provider (class dark mode)
|   |   `-- ThemeToggle.tsx        # accessible dark/light toggle
|   `-- lib/
|       `-- modules.ts             # module registry (hub source of truth)
|-- next.config.mjs                # static export config
|-- tailwind.config.ts             # azure palette + font tokens
|-- tsconfig.json
`-- package.json
```
