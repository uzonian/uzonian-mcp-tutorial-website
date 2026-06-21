# Demo / Reference Implementation Guide (Asset 3 — optional, Stage C)

This is the optional step that builds the **actual working project the tutorial
teaches** — so learners can clone, run, and deploy real code, not just read about
it. Only run this when the user explicitly opts in.

## Guardrails

- **Opt-in only.** Skip unless the user asked for the demo/reference assets.
- **Isolated folder.** Put everything under `demo/` at the repo root. The website
  is a static export of `src/` + `public/` only, so a sibling `demo/` folder
  cannot break `npm run build`.
- **Same content conventions as the source doc:**
  - **Python-first** for application code, tests, and scripts.
  - **Azure** for infrastructure (Bicep IaC; App Service / Container Apps /
    Functions; APIM; Key Vault; Azure CLI / `azd`).
  - **Microsoft Copilot** for the AI layer (Copilot Studio agent + connector,
    agentic protocol).
- **Lockstep with the tutorial.** File names, folder layout, commands, and
  architecture in `demo/` must match what the chapters describe — especially
  `quickstart`, `anatomy`, `implementation`, `deployment`, and `testing`, and the
  "What this file does" cards. If the demo changes, update the doc/site to match.
- **No secrets.** Provide `.env.example` placeholders and Key Vault references;
  never commit real credentials. Scan changed files before committing.

## Use scaffolding tools, don't hand-write boilerplate

Prefer ecosystem tooling to reduce mistakes:

- Python project: `python -m venv .venv`, `pip install ...`, `requirements.txt`
  or `pyproject.toml`.
- Azure scaffolding: `azd init`, `az` CLI; author infra as `infra/*.bicep`.
- Containers (if used): a `Dockerfile`.
- CI: a GitHub Actions workflow under `demo/.github/` or documented for the user.

## Recommended `demo/` layout (adapt to the topic)

```text
demo/
├── README.md              # prerequisites + exact run/test/deploy commands
├── .env.example           # placeholder config (no real secrets)
├── requirements.txt       # or pyproject.toml
├── src/                   # Python application code
│   └── <package>/...
├── tests/                 # pytest unit + integration tests
├── infra/                 # Bicep IaC for the Azure resources
│   └── main.bicep
├── scripts/               # run_local / smoke-test helpers
└── azure.yaml             # optional: azd service definition
```

## Build checklist

1. Confirm scope with the user; restate language, Azure services, and Copilot
   integration to be built.
2. Scaffold the project skeleton with ecosystem tools.
3. Implement the core code the tutorial walks through, matching the chapter
   structure and naming.
4. Add the Azure infra (`infra/*.bicep`) and, if relevant, the Copilot Studio
   connector definition the `copilot-studio` chapter describes.
5. Add tests (`pytest`) and a smoke/health check matching the `testing` chapter.
6. Write `demo/README.md` with prerequisites and copy-pasteable commands.
7. Add `.env.example`; ensure no secrets are committed.

## Validate (independent of the website)

Run the demo's own tooling — these are **separate** from the website's
`typecheck`/`lint`/`build` and must not be mixed with them:

```bash
cd demo
python -m venv .venv && . .venv/bin/activate   # PowerShell: .venv\Scripts\Activate.ps1
pip install -r requirements.txt
pytest
# plus a local run / smoke test as documented in demo/README.md
```

The demo passes when its tests succeed and the documented smoke test returns a
healthy response.
