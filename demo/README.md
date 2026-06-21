# Cowork MCP Server — Reference Implementation

A Python MCP server that powers Copilot Cowork plug-ins for **Salesforce**, **ServiceNow**, and **Jira Cloud**.

## Architecture

```
┌─────────────────────┐      ┌──────────────────┐
│  Copilot Cowork     │─────▶│  APIM Gateway    │
│  (plug-in package)  │      └────────┬─────────┘
└─────────────────────┘               │
                                      ▼
                            ┌──────────────────┐
                            │  MCP Server      │
                            │  /mcp endpoint   │
                            │  (Container App) │
                            └──┬─────┬─────┬───┘
                               │     │     │
                    ┌──────────┘     │     └──────────┐
                    ▼                ▼                 ▼
              Salesforce       ServiceNow          Jira Cloud
```

Each plug-in package (in `plugins/`) references this single MCP server. The server authenticates requests using delegated per-user OAuth tokens passed in the Authorization header.

## Prerequisites

- Python 3.11+
- Azure CLI + Azure Developer CLI (`azd`) for deployment
- A Microsoft 365 developer tenant with Copilot Cowork access
- OAuth app credentials for Salesforce / ServiceNow / Jira (see `.env.example`)

## Quick Start

```bash
# 1. Clone and enter the demo
cd demo

# 2. Create a virtual environment
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\Activate.ps1

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure environment
cp .env.example .env
# Edit .env with your system URLs (no secrets needed for local dev)

# 5. Run the server locally
python scripts/run_local.py

# 6. (In another terminal) Run the smoke test
python scripts/smoke.py

# 7. Run unit tests
pytest -q
```

## Project Structure

| Path | Purpose |
|------|---------|
| `src/cowork_mcp/server.py` | FastMCP app — streamable HTTP on `/mcp` |
| `src/cowork_mcp/config.py` | Pydantic settings from env vars |
| `src/cowork_mcp/auth.py` | Request-scoped delegated bearer token (ContextVar) |
| `src/cowork_mcp/trim.py` | Payload trimming to stay within byte budgets |
| `src/cowork_mcp/connectors/` | Salesforce, ServiceNow, Jira REST clients + tools |
| `plugins/` | Complete Cowork plug-in packages (manifest + agent + action) |
| `infra/` | Azure Bicep IaC (Container Apps + APIM + Key Vault) |
| `scripts/` | Local run and smoke test helpers |
| `tests/` | Pytest unit tests |

## Plug-in Packages

Each folder under `plugins/` is a complete Microsoft 365 app package:

- **manifest.json** — App identity and declarative agent reference
- **declarativeAgent.json** — Agent instructions, conversation starters, actions
- **ai-plugin.json** — MCP runtime config: server URL, selected tools, OAuth auth
- **SKILL.md** — Skill recipe (instructions for multi-step workflows)

To deploy, update the `url` in each `ai-plugin.json` to point to your deployed MCP server host.

## Deployment

```bash
# Deploy with Azure Developer CLI
azd up

# Or manually with Bicep
az deployment group create \
  --resource-group <your-rg> \
  --template-file infra/main.bicep \
  --parameters infra/main.parameters.json

# Verify
curl https://<your-host>/mcp -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-03-26","capabilities":{},"clientInfo":{"name":"curl","version":"1.0"}}}'
```

## Running Tests

```bash
# Unit tests (offline, mocked HTTP)
pytest -q

# Smoke test (requires running server)
python scripts/smoke.py
```

## Security Notes

- Tokens are request-scoped (ContextVar) and never logged
- All responses are trimmed to a configurable byte budget
- Secrets go in Azure Key Vault, referenced by Container App env vars
- APIM gateway sits in front for rate limiting and policy enforcement
- OAuth redirect URI: `https://teams.microsoft.com/api/platform/v1.0/oAuthRedirect`
