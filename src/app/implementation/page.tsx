import { ChapterShell } from "@/components/ChapterShell";
import { Callout } from "@/components/Callout";
import { CodeBlock } from "@/components/CodeBlock";
import { Code } from "@/components/content";
import { WhatThisFileDoes } from "@/components/WhatThisFileDoes";
import { VideoCard } from "@/components/VideoCard";

export const metadata = { title: "Implementation" };

export default function Page() {
  return (
    <ChapterShell
      slug="implementation"
      eyebrow="Chapter 5 · Build"
      title="Implementation: Building the MCP Server"
      intro="File-by-file construction of the Python MCP server that powers a Cowork plug-in. You will build the FastMCP application, configure settings, handle delegated auth, implement payload trimming, write a connector client, register tools, author the manifest files, and package everything for deployment."
      learningGoals={[
        "Build a FastMCP server with streamable HTTP transport",
        "Implement request-scoped delegated auth with a ContextVar",
        "Add payload trimming to stay within Cowork response limits",
        "Register tools that call an external API through a connector client",
        "Author the manifest and ai-plugin.json files for the plug-in package",
      ]}
      toc={[
        { id: "server", label: "server.py" },
        { id: "config", label: "config.py" },
        { id: "auth", label: "auth.py" },
        { id: "trim", label: "trim.py" },
        { id: "connector-client", label: "Connector client" },
        { id: "tools", label: "Tool registration" },
        { id: "manifest-files", label: "Manifest files" },
        { id: "package", label: "Packaging" },
      ]}
      summary={
        <ul>
          <li>
            <Code>server.py</Code> creates a FastMCP app with{" "}
            <Code>stateless_http=True</Code> and <Code>json_response=True</Code>.
          </li>
          <li>
            <Code>auth.py</Code> stores the delegated bearer token in a{" "}
            <Code>ContextVar</Code> so every tool in the request can use it
            without passing it around.
          </li>
          <li>
            <Code>trim.py</Code> enforces a byte budget on tool responses to
            prevent oversized payloads.
          </li>
          <li>
            The connector client wraps the external API; tools call it and
            return trimmed results.
          </li>
        </ul>
      }
      reviewItems={[
        { id: "server", label: "I can create a FastMCP server with streamable HTTP" },
        { id: "auth", label: "I understand request-scoped delegated auth" },
        { id: "trim", label: "I know why payload trimming matters" },
        { id: "tools", label: "I can register tools that call an external API" },
      ]}
    >
      <h2 id="server">server.py — the FastMCP application</h2>
      <p>
        The server module is the entry point. It creates a FastMCP instance
        configured for production use behind an API gateway: stateless (no
        session affinity required) and returning buffered JSON instead of a
        long-lived stream.
      </p>
      <WhatThisFileDoes
        path="src/cowork_mcp/server.py"
        does={
          <span>
            Instantiates the FastMCP app, configures transport, and imports
            connector modules that register tools.
          </span>
        }
        edit={<span>Server name and connector imports.</span>}
        dontEdit={
          <span>
            The <Code>stateless_http</Code> and <Code>json_response</Code> flags.
          </span>
        }
      />
      <CodeBlock
        language="python"
        filename="src/cowork_mcp/server.py"
        code={`"""FastMCP server for Copilot Cowork plug-in."""
from mcp.server.fastmcp import FastMCP
from .config import settings

mcp = FastMCP(
    settings.server_name,
    stateless_http=True,
    json_response=True,
)

# Import connectors to register their tools with the mcp instance
from .connectors import salesforce  # noqa: E402, F401

if __name__ == "__main__":
    mcp.run(transport="http", host="0.0.0.0", port=settings.port)`}
      />
      <Callout variant="why" title="Why stateless_http?">
        Azure Container Apps and APIM can route any request to any replica. A
        stateless server means no session stickiness is needed — each HTTP
        request carries everything the server needs to respond.
      </Callout>

      <h2 id="config">config.py — Pydantic settings</h2>
      <p>
        Configuration lives in one place: a Pydantic{" "}
        <Code>BaseSettings</Code> class that reads from environment variables
        (and optionally a <Code>.env</Code> file). This keeps secrets out of
        source control and makes local / cloud config trivial to swap.
      </p>
      <WhatThisFileDoes
        path="src/cowork_mcp/config.py"
        does={
          <span>
            Defines all configuration (URLs, secrets, limits) as typed Pydantic
            settings loaded from environment variables.
          </span>
        }
        edit={<span>Add new config fields as you add connectors.</span>}
        dontEdit={
          <span>
            The <Code>model_config</Code> block — it controls <Code>.env</Code>{" "}
            loading.
          </span>
        }
      />
      <CodeBlock
        language="python"
        filename="src/cowork_mcp/config.py"
        code={`"""Centralised configuration via Pydantic settings."""
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    server_name: str = "cowork-mcp"
    port: int = 8000

    # Salesforce
    sf_instance_url: str = "https://myorg.my.salesforce.com"
    sf_client_id: str = ""
    sf_client_secret: str = ""

    # Payload trimming
    max_response_bytes: int = 8192

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}

settings = Settings()`}
      />

      <h2 id="auth">auth.py — request-scoped delegated bearer token</h2>
      <p>
        When Cowork calls a tool, the request carries a delegated bearer token
        that represents the signed-in user. Your server must use <em>that</em>{" "}
        token — not a service account — when calling the external API. A{" "}
        <Code>ContextVar</Code> stores the token for the duration of one
        request so every function in the call stack can access it without
        passing it as an argument.
      </p>
      <WhatThisFileDoes
        path="src/cowork_mcp/auth.py"
        does={
          <span>
            Stores the per-request delegated bearer token in a{" "}
            <Code>ContextVar</Code> and provides a <Code>get_token()</Code>{" "}
            accessor.
          </span>
        }
        edit={<span>Token extraction logic if your gateway changes headers.</span>}
        dontEdit={
          <span>
            The ContextVar pattern itself — it ensures request isolation.
          </span>
        }
      />
      <CodeBlock
        language="python"
        filename="src/cowork_mcp/auth.py"
        code={`"""Request-scoped delegated bearer token."""
from contextvars import ContextVar

_current_token: ContextVar[str] = ContextVar("_current_token", default="")

def set_token(token: str) -> None:
    """Set the delegated bearer token for the current request."""
    _current_token.set(token)

def get_token() -> str:
    """Retrieve the delegated bearer token for the current request."""
    token = _current_token.get()
    if not token:
        raise RuntimeError("No delegated token set for this request")
    return token`}
      />
      <Callout variant="security" title="Never log the token">
        The delegated token is the user&apos;s credential. Never log it, store
        it in a database, or return it in a tool response. It is valid only for
        this request.
      </Callout>

      <h2 id="trim">trim.py — payload trimming and byte budget</h2>
      <p>
        Cowork enforces limits on how large a tool response can be. If your tool
        returns a huge JSON blob, the response will be truncated or rejected.{" "}
        <Code>trim.py</Code> gives you a <Code>trim_payload</Code> function that
        keeps the response within a byte budget by removing low-priority fields
        and truncating large text values.
      </p>
      <WhatThisFileDoes
        path="src/cowork_mcp/trim.py"
        does={
          <span>
            Provides <Code>trim_payload()</Code> that serialises a dict to JSON,
            checks byte size, and trims fields until it fits.
          </span>
        }
        edit={<span>Priority rules for which fields to drop first.</span>}
        dontEdit={
          <span>
            The byte-counting logic — it must match UTF-8 encoded size.
          </span>
        }
      />
      <CodeBlock
        language="python"
        filename="src/cowork_mcp/trim.py"
        code={`"""Payload trimming to stay within Cowork's byte budget."""
import json
from .config import settings

def trim_payload(data: dict, max_bytes: int | None = None) -> dict:
    """Trim a response dict to fit within max_bytes (UTF-8)."""
    budget = max_bytes or settings.max_response_bytes
    encoded = json.dumps(data, default=str).encode()
    if len(encoded) <= budget:
        return data

    # Strategy: remove known large fields, then truncate string values
    drop_fields = ["description", "body", "comments", "changelog"]
    trimmed = {k: v for k, v in data.items() if k not in drop_fields}
    encoded = json.dumps(trimmed, default=str).encode()
    if len(encoded) <= budget:
        return trimmed

    # Truncate remaining long strings
    for key, value in list(trimmed.items()):
        if isinstance(value, str) and len(value) > 200:
            trimmed[key] = value[:200] + "…"
    return trimmed`}
      />

      <h2 id="connector-client">Connector client</h2>
      <p>
        The connector client is a thin wrapper around the external system&apos;s
        REST API. It uses <Code>httpx.AsyncClient</Code>, attaches the delegated
        bearer token from <Code>auth.py</Code>, and returns raw response data.
        Tools call the client and post-process with <Code>trim_payload</Code>.
      </p>
      <WhatThisFileDoes
        path="src/cowork_mcp/connectors/salesforce.py"
        does={
          <span>
            Implements the Salesforce REST client and registers all
            Salesforce-specific MCP tools.
          </span>
        }
        edit={<span>API version, endpoints, and tool parameter schemas.</span>}
        dontEdit={
          <span>
            The token-injection pattern via <Code>get_token()</Code>.
          </span>
        }
      />
      <CodeBlock
        language="python"
        filename="src/cowork_mcp/connectors/salesforce.py"
        code={`"""Salesforce connector — REST client and MCP tools."""
import httpx
from ..server import mcp
from ..auth import get_token
from ..config import settings
from ..trim import trim_payload

API = f"{settings.sf_instance_url}/services/data/v60.0"

async def _sf_get(path: str) -> dict:
    """Authenticated GET to Salesforce REST API."""
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{API}{path}",
            headers={"Authorization": f"******"},
        )
        resp.raise_for_status()
    return resp.json()

async def _sf_post(path: str, body: dict) -> dict:
    """Authenticated POST to Salesforce REST API."""
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{API}{path}",
            headers={"Authorization": f"******"},
            json=body,
        )
        resp.raise_for_status()
    return resp.json()`}
      />

      <h2 id="tools">Tool registration</h2>
      <p>
        Tools are plain <Code>async</Code> functions decorated with{" "}
        <Code>@mcp.tool()</Code>. FastMCP reads the function name, docstring,
        and type hints to build the tool schema that Cowork discovers. Each tool
        calls the connector client and returns a trimmed payload.
      </p>
      <CodeBlock
        language="python"
        filename="src/cowork_mcp/connectors/salesforce.py (tools)"
        code={`@mcp.tool()
async def salesforce_whoami() -> dict:
    """Return the currently signed-in Salesforce user."""
    data = await _sf_get("/chatter/users/me")
    return trim_payload(data)

@mcp.tool()
async def salesforce_query(soql: str) -> dict:
    """Execute a SOQL query against Salesforce."""
    data = await _sf_get(f"/query?q={soql}")
    return trim_payload(data)

@mcp.tool()
async def salesforce_get_record(sobject: str, record_id: str) -> dict:
    """Retrieve a single Salesforce record by type and ID."""
    data = await _sf_get(f"/sobjects/{sobject}/{record_id}")
    return trim_payload(data)

@mcp.tool()
async def salesforce_create_case(subject: str, description: str, account_id: str) -> dict:
    """Create a new Salesforce Case."""
    body = {"Subject": subject, "Description": description, "AccountId": account_id}
    data = await _sf_post("/sobjects/Case", body)
    return trim_payload(data)

@mcp.tool()
async def salesforce_update_opportunity(opportunity_id: str, stage: str) -> dict:
    """Update an Opportunity's stage."""
    async with httpx.AsyncClient() as client:
        resp = await client.patch(
            f"{API}/sobjects/Opportunity/{opportunity_id}",
            headers={"Authorization": f"******"},
            json={"StageName": stage},
        )
        resp.raise_for_status()
    return {"id": opportunity_id, "stage": stage, "updated": True}`}
      />
      <Callout variant="tip" title="One function = one tool">
        Keep tools focused. If a workflow needs multiple API calls, make them
        separate tools and let the agent orchestrate. This gives Cowork maximum
        flexibility in multi-step tasks.
      </Callout>

      <h2 id="manifest-files">Manifest files</h2>
      <p>
        With the server built, you create the plug-in package files. The Agents
        Toolkit generates most of this, but understanding the structure helps you
        debug and customise.
      </p>
      <CodeBlock
        language="json"
        filename="plugins/salesforce/manifest.json"
        code={`{
  "$schema": "https://developer.microsoft.com/json-schemas/copilot/plugin/v2.2/schema.json",
  "version": "1.0.0",
  "name": { "short": "Salesforce Cowork", "full": "Salesforce Cowork Plug-in" },
  "description": { "short": "Connect Copilot Cowork to Salesforce CRM" },
  "icons": { "color": "color.png", "outline": "outline.png" },
  "copilotAgents": {
    "declarativeAgents": [
      { "id": "salesforceAgent", "file": "declarativeAgent.json" }
    ]
  }
}`}
      />
      <CodeBlock
        language="json"
        filename="plugins/salesforce/ai-plugin.json"
        code={`{
  "schema_version": "v2.2",
  "name_for_human": "Salesforce MCP",
  "runtimes": [
    {
      "type": "OpenApi",
      "auth": { "type": "OAuthPluginVault" },
      "spec": { "url": "https://my-mcp.azurecontainerapps.io/mcp" },
      "run_for_functions": [
        "salesforce_whoami",
        "salesforce_query",
        "salesforce_get_record",
        "salesforce_create_case",
        "salesforce_update_opportunity"
      ]
    }
  ],
  "functions": [
    { "name": "salesforce_whoami", "description": "Return the signed-in user." },
    { "name": "salesforce_query", "description": "Execute a SOQL query.", "parameters": { "type": "object", "properties": { "soql": { "type": "string" } }, "required": ["soql"] } },
    { "name": "salesforce_get_record", "description": "Get a record by type and ID.", "parameters": { "type": "object", "properties": { "sobject": { "type": "string" }, "record_id": { "type": "string" } }, "required": ["sobject", "record_id"] } },
    { "name": "salesforce_create_case", "description": "Create a Case.", "parameters": { "type": "object", "properties": { "subject": { "type": "string" }, "description": { "type": "string" }, "account_id": { "type": "string" } }, "required": ["subject", "description", "account_id"] } },
    { "name": "salesforce_update_opportunity", "description": "Update an Opportunity stage.", "parameters": { "type": "object", "properties": { "opportunity_id": { "type": "string" }, "stage": { "type": "string" } }, "required": ["opportunity_id", "stage"] } }
  ]
}`}
      />

      <h2 id="package">Packaging</h2>
      <p>
        The server is a standard Python package with a{" "}
        <Code>pyproject.toml</Code> or <Code>requirements.txt</Code>. For Azure
        Container Apps you add a <Code>Dockerfile</Code>; for App Service a
        startup command suffices. The plug-in folder is uploaded via the Agents
        Toolkit or Teams Admin Center.
      </p>
      <CodeBlock
        language="text"
        filename="requirements.txt"
        code={`mcp[cli]>=1.9.0
pydantic-settings>=2.0
httpx>=0.27
uvicorn>=0.30`}
      />
      <CodeBlock
        language="bash"
        filename="Dockerfile (Container Apps)"
        code={`FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY src/ src/
CMD ["python", "-m", "src.cowork_mcp.server"]`}
      />
      <Callout variant="production" title="Pin your dependencies">
        Always pin exact versions in production. Use{" "}
        <Code>pip-compile</Code> or <Code>uv lock</Code> to generate a
        lockfile.
      </Callout>
      <VideoCard
        verified={false}
        concept="Building an MCP server with FastMCP for Copilot Cowork"
        level="intermediate"
        searchQuery="FastMCP Python MCP server tutorial Copilot Cowork plug-in build"
        why="Seeing the server come together on screen reinforces the file-by-file progression."
      />
    </ChapterShell>
  );
}
