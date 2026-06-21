import { ChapterShell } from "@/components/ChapterShell";
import { Callout } from "@/components/Callout";
import { CodeBlock } from "@/components/CodeBlock";
import { ConceptCheck } from "@/components/ConceptCheck";
import { Mermaid } from "@/components/Mermaid";
import { Code } from "@/components/content";
import { Lab } from "@/components/Lab";
import { VideoCard } from "@/components/VideoCard";

export const metadata = { title: "Testing" };

export default function Page() {
  return (
    <ChapterShell
      slug="testing"
      eyebrow="Chapter 11 · Quality"
      title="Testing Your MCP Server & Plug-in"
      intro="A plug-in that works on your machine is not enough. This chapter covers three testing layers: unit tests for individual tools and helpers, integration tests with the MCP Inspector, and a deploy-time smoke sequence that confirms the live server is healthy."
      learningGoals={[
        "Unit-test tools and trim logic with pytest",
        "Integration-test the MCP connection with MCP Inspector",
        "Run a deploy-time smoke sequence to verify the live server",
        "Inspect tool responses for correctness and size",
      ]}
      toc={[
        { id: "unit", label: "Unit tests" },
        { id: "integration", label: "Integration tests" },
        { id: "smoke-sequence", label: "Smoke sequence" },
        { id: "inspector", label: "MCP Inspector" },
      ]}
      summary={
        <ul>
          <li>
            <strong>Unit tests</strong> validate individual tools and the trim
            helper in isolation with pytest.
          </li>
          <li>
            <strong>Integration tests</strong> exercise the full MCP protocol
            using MCP Inspector against a locally running server.
          </li>
          <li>
            The <strong>smoke sequence</strong> runs post-deploy to confirm
            health, tool listing, and a sample tool call through APIM.
          </li>
          <li>
            <strong>MCP Inspector</strong> is your interactive debugging tool
            for inspecting tool schemas and responses.
          </li>
        </ul>
      }
      reviewItems={[
        { id: "unit", label: "I can write a pytest unit test for a tool" },
        { id: "integ", label: "I can run MCP Inspector against my server" },
        { id: "smoke", label: "I understand the deploy-time smoke sequence" },
        { id: "inspect", label: "I can inspect tool responses for issues" },
      ]}
    >
      <h2 id="unit">Unit tests</h2>
      <p>
        Unit tests run fast, need no network, and catch logic bugs early. For an
        MCP server built with FastMCP, the units under test are your tool
        functions and the payload trimming helper. Use <Code>pytest</Code> with
        standard mocking — no MCP protocol machinery needed.
      </p>
      <CodeBlock
        language="python"
        filename="tests/test_trim.py"
        code={`"""Unit tests for the payload trimming helper."""
import pytest
from cowork_mcp.trim import trim_payload


def test_trim_within_budget():
    """Payloads under the byte budget pass through unchanged."""
    data = {"key": "short value"}
    result = trim_payload(data, max_bytes=1024)
    assert result == data


def test_trim_exceeds_budget():
    """Payloads over budget are truncated with an indicator."""
    data = {"description": "x" * 5000}
    result = trim_payload(data, max_bytes=256)
    serialized = str(result)
    assert len(serialized.encode()) <= 256


def test_trim_preserves_critical_fields():
    """The 'id' and 'key' fields survive trimming."""
    data = {"id": "PROJ-1", "key": "PROJ-1", "description": "x" * 5000}
    result = trim_payload(data, max_bytes=256)
    assert result["id"] == "PROJ-1"
    assert result["key"] == "PROJ-1"`}
      />
      <CodeBlock
        language="python"
        filename="tests/test_tools.py"
        code={`"""Unit tests for Jira tools (mocked HTTP)."""
import pytest
from unittest.mock import AsyncMock, patch
from cowork_mcp.connectors.jira import jira_whoami


@pytest.mark.asyncio
@patch("cowork_mcp.connectors.jira.httpx.AsyncClient.get")
async def test_jira_whoami(mock_get):
    """jira_whoami returns the display name."""
    mock_get.return_value = AsyncMock(
        status_code=200,
        json=lambda: {"displayName": "Ada Lovelace", "accountId": "abc123"},
    )
    result = await jira_whoami()
    assert result["displayName"] == "Ada Lovelace"`}
      />
      <Callout variant="tip" title="Run tests often">
        Add <Code>pytest tests/</Code> to your pre-commit hook or CI pipeline.
        Fast unit tests should run on every push.
      </Callout>

      <h2 id="integration">Integration tests</h2>
      <p>
        Integration tests verify the full MCP protocol flow — the server starts,
        advertises tools, and responds correctly to <Code>tools/list</Code> and{" "}
        <Code>tools/call</Code> requests. Run these against a locally started
        server instance.
      </p>
      <CodeBlock
        language="python"
        filename="tests/test_integration.py"
        code={`"""Integration test: MCP protocol over HTTP."""
import httpx
import pytest

MCP_URL = "http://localhost:8000/mcp"


@pytest.mark.asyncio
async def test_tools_list():
    """The server responds to tools/list with at least one tool."""
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            MCP_URL,
            json={"jsonrpc": "2.0", "method": "tools/list", "id": 1},
        )
    assert resp.status_code == 200
    body = resp.json()
    assert "result" in body
    tools = body["result"]["tools"]
    assert len(tools) > 0
    # Every tool must have a name and description
    for tool in tools:
        assert "name" in tool
        assert "description" in tool`}
      />
      <Callout variant="beginner" title="Start the server first">
        Integration tests need the server running. Use{" "}
        <Code>python -m cowork_mcp.server</Code> in a separate terminal, or
        add a pytest fixture that starts/stops it automatically.
      </Callout>

      <h2 id="smoke-sequence">Deploy-time smoke sequence</h2>
      <p>
        After every deployment, run a short automated sequence that confirms the
        live server is reachable, lists tools, and successfully executes a
        read-only tool. This catches misconfigured secrets, broken networking,
        and failed container starts.
      </p>
      <Mermaid
        alt="Flowchart of the deploy-time smoke test sequence: health, tool list, sample call, report"
        chart={`flowchart TD
    A[Start smoke sequence] --> B[GET /health]
    B -->|200 OK| C[POST tools/list]
    B -->|non-200| X[FAIL: server unreachable]
    C -->|tools returned| D[POST tools/call jira_whoami]
    C -->|empty or error| Y[FAIL: no tools discovered]
    D -->|valid response| E[PASS: smoke OK]
    D -->|error| Z[FAIL: tool execution error]`}
        caption="Deploy-time smoke sequence: health → list → call → report"
      />
      <CodeBlock
        language="python"
        filename="scripts/smoke.py"
        code={`"""Post-deploy smoke test for the MCP server."""
import httpx
import sys

BASE = "https://prod-apim.azure-api.net/mcp"


def smoke():
    # Step 1: Health check
    r = httpx.get(f"{BASE}/health")
    assert r.status_code == 200, f"Health failed: {r.status_code}"

    # Step 2: List tools
    r = httpx.post(BASE, json={"jsonrpc": "2.0", "method": "tools/list", "id": 1})
    assert r.status_code == 200
    tools = r.json()["result"]["tools"]
    assert len(tools) > 0, "No tools returned"

    # Step 3: Call a read-only tool
    r = httpx.post(
        BASE,
        json={
            "jsonrpc": "2.0",
            "method": "tools/call",
            "params": {"name": "jira_whoami", "arguments": {}},
            "id": 2,
        },
        headers={"Authorization": "******"},
    )
    assert r.status_code == 200, f"Tool call failed: {r.status_code}"
    print("✓ Smoke sequence passed")


if __name__ == "__main__":
    try:
        smoke()
    except AssertionError as e:
        print(f"✗ Smoke FAILED: {e}", file=sys.stderr)
        sys.exit(1)`}
      />

      <h2 id="inspector">MCP Inspector</h2>
      <p>
        The <strong>MCP Inspector</strong> is an interactive browser tool for
        exploring your server&apos;s capabilities. Point it at your local (or
        remote) MCP URL and it shows you the full tool list, argument schemas,
        and lets you invoke tools interactively — invaluable for debugging
        schema mismatches and oversized responses.
      </p>
      <CodeBlock
        language="bash"
        filename="Terminal"
        code={`# Launch MCP Inspector against local server
npx @modelcontextprotocol/inspector http://localhost:8000/mcp`}
      />
      <Lab
        title="Inspect and validate your tools"
        time="10 minutes"
        goal="Confirm every tool has a description, typed arguments, and a response under 4 KB."
      >
        <ol>
          <li>
            Start your MCP server locally:{" "}
            <Code>python -m cowork_mcp.server</Code>
          </li>
          <li>
            Launch the Inspector:{" "}
            <Code>npx @modelcontextprotocol/inspector http://localhost:8000/mcp</Code>
          </li>
          <li>
            Click each tool — verify it has a clear description and typed
            arguments.
          </li>
          <li>
            Call a tool (e.g., <Code>jira_whoami</Code>) and check that the
            response is valid JSON and under 4 KB.
          </li>
          <li>
            If any tool returns more than 4 KB, revisit your{" "}
            <Code>trim_payload</Code> logic.
          </li>
        </ol>
      </Lab>
      <ConceptCheck
        question={
          <p>
            Why is the smoke sequence important even if unit and integration
            tests pass?
          </p>
        }
        answer={
          <p>
            Unit and integration tests run against local code and mock
            dependencies. The smoke sequence tests the <em>deployed</em>{" "}
            environment — real networking, real secrets from Key Vault, real APIM
            routing. It catches infrastructure issues that local tests cannot.
          </p>
        }
      />
      <VideoCard
        verified={false}
        concept="Using MCP Inspector to debug and test MCP server tools"
        level="beginner"
        searchQuery="MCP Inspector tool testing Model Context Protocol (official demo)"
        why="Seeing the Inspector in action makes it clear how to validate tool schemas and catch response-size issues before they reach production."
      />
    </ChapterShell>
  );
}
