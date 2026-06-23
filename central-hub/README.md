# Uzonian Dev Tutorials — Central Hub

The landing site that ties every tutorial **module** together under one domain
(`https://uzoniandev.com/`). The hub serves the domain root, introduces the
tutorial library, and routes visitors into each module.

It is a self-contained **Next.js 15** app (App Router, static export) and lives
in its own top-level directory so it can later be extracted into a standalone
repository without touching any module.

> **This is the hub, not a tutorial.** The actual tutorial content (e.g. the MCP
> server guide) lives in separate module apps. The hub only lists modules and
> links into them.

---

## Architecture — Next.js Multi-Zones, path-mounted modules (Option A)

Each tutorial is a **standalone static site**. The hub serves `/`; every module
is mounted under a path prefix and deployed independently:

```
https://uzoniandev.com/                ← this hub (domain root)
https://uzoniandev.com/mcp-server/     ← MCP module (separate static site)
https://uzoniandev.com/<next-module>/  ← future modules
```

A single front door (Azure Front Door, or one Static Web App that fronts the
others) stitches them into one origin. Because moving between the hub and a
module crosses a deployment boundary, those links are **cross-zone**: plain
`<a>` anchors that trigger a full document load — never `next/link`, which would
resolve within the hub's own zone.

```
                       ┌─────────────────────────────┐
   visitor ──────────► │   Azure Front Door (uzoniandev.com)  │
                       └───────────────┬─────────────┘
                          /mcp-server/* │  /*
                 ┌──────────────────────┘ └───────────────────┐
                 ▼                                             ▼
        MCP module SWA                                  Central hub SWA
   (NEXT_PUBLIC_BASE_PATH=/mcp-server)                  (this app, root)
```

---

## Run & build

All commands run from **inside `central-hub/`**:

```bash
npm install        # install dependencies
npm run dev        # local dev server at http://localhost:3000
npm run build      # static export to ./out
npm run typecheck  # tsc --noEmit
npm run lint       # next lint
```

`npm run build` produces a fully static site in `central-hub/out/`
(`output: "export"`). Deploy the `out/` folder to the hub's Static Web App.
`out/`, `.next/`, and `node_modules/` are git-ignored.

---

## Module registry

The hub's source of truth is [`src/lib/modules.ts`](src/lib/modules.ts). It
mirrors the per-module manifest contract (`id`, `title`, `shortTitle`,
`summary`, `href`) and adds hub-only presentation fields (`status`, `tags`) used
to render the landing grid.

```ts
export interface HubModule {
  id: string;          // matches the module's own moduleId
  title: string;       // full title on the card
  shortTitle: string;  // compact label
  summary: string;     // one-liner
  href?: string;       // absolute mounted path, e.g. "/mcp-server/"
  status: "published" | "coming-soon";
  tags: string[];      // topic chips
}
```

- **Published** entries render as clickable cards linking to their mounted path.
- **Coming-soon** entries render disabled (dimmed, non-interactive) so the grid
  advertises what's next.

---

## Front Door routing

Route by path prefix, **preserving the path** so each module's internal asset
URLs (which already include its base path) resolve correctly.

| Route pattern     | Origin / backend                         | Notes                                        |
| ----------------- | ---------------------------------------- | -------------------------------------------- |
| `/mcp-server/*`   | MCP module Static Web App                | Path preserved; module built with `NEXT_PUBLIC_BASE_PATH=/mcp-server`. |
| `/*` (catch-all)  | This hub's Static Web App                | Serves the domain root and the landing page. |

Order matters: list the specific module prefixes **before** the `/*` catch-all
so they win. Add one row per new module.

The hub ships its own [`public/staticwebapp.config.json`](public/staticwebapp.config.json)
with a `/404.html` navigation fallback and the same security headers the modules
use (`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`,
`Referrer-Policy: strict-origin-when-cross-origin`).

---

## Adding a new module

1. **Build the module** as its own standalone static site. It sets its own
   `NEXT_PUBLIC_BASE_PATH` (e.g. `/rag-azure-ai-search`) and exports with its
   module build (the MCP module uses `npm run build:module`). Deploy it to its
   own Static Web App.
2. **Register it here** — add an entry to `src/lib/modules.ts` with the matching
   `href` (`/rag-azure-ai-search/`), a `summary`, `tags`, and
   `status: "published"` (or `"coming-soon"` to tease it first).
3. **Add a Front Door route** — a new row `/<base-path>/*` → that module's SWA,
   above the `/*` catch-all (see the routing table above).
4. Rebuild and redeploy the hub so the new card appears.

No hub code changes are needed beyond the registry entry — the landing grid is
generated from `modules`.
