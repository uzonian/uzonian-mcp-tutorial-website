import { ChapterShell } from "@/components/ChapterShell";
import { Callout } from "@/components/Callout";
import { CodeBlock } from "@/components/CodeBlock";
import { Code, ExpectedOutput } from "@/components/content";
import { Lab } from "@/components/Lab";
import { WhatThisFileDoes } from "@/components/WhatThisFileDoes";
import { VideoCard } from "@/components/VideoCard";

export const metadata = { title: "Local Development" };

export default function Page() {
  return (
    <ChapterShell
      slug="local-dev"
      eyebrow="Chapter 6 · Build"
      title="Local Development: Run, Inspect & Test"
      intro="Get the MCP server running on your machine, inspect it with the MCP Inspector, fetch its tools into the Agents Toolkit, sideload the plug-in into Copilot, and run the test suite — all without deploying to Azure."
      learningGoals={[
        "Start the MCP server locally with scripts/run_local.py",
        "Use the MCP Inspector to verify tool discovery at /mcp",
        "Fetch tools into ai-plugin.json using the Agents Toolkit",
        "Sideload the plug-in into Copilot for end-to-end testing",
        "Run pytest to validate tools and payload trimming",
      ]}
      toc={[
        { id: "run-server", label: "Run the server" },
        { id: "inspector", label: "MCP Inspector" },
        { id: "fetch-action", label: "Fetch action from MCP" },
        { id: "sideload", label: "Sideload into Copilot" },
        { id: "tests", label: "Run tests" },
      ]}
      summary={
        <ul>
          <li>
            <Code>scripts/run_local.py</Code> starts the server at{" "}
            <Code>http://localhost:8000/mcp</Code>.
          </li>
          <li>
            The MCP Inspector lets you call tools interactively and see raw
            JSON-RPC responses.
          </li>
          <li>
            &ldquo;ATK: Fetch action from MCP&rdquo; pulls the live tool list
            into <Code>ai-plugin.json</Code>.
          </li>
          <li>
            Sideloading deploys the plug-in to your M365 tenant with a{" "}
            <Code>dev</Code> suffix for testing.
          </li>
        </ul>
      }
      reviewItems={[
        { id: "run", label: "I can start the server locally" },
        { id: "inspect", label: "I can verify tools with the MCP Inspector" },
        { id: "fetch", label: "I can fetch tools into ai-plugin.json" },
        { id: "sideload", label: "I know how to sideload and test in Copilot" },
      ]}
    >
      <h2 id="run-server">Run the server locally</h2>
      <p>
        The quickest way to start the server is with the helper script{" "}
        <Code>scripts/run_local.py</Code>. It loads your <Code>.env</Code> file,
        sets <Code>PYTHONPATH</Code>, and launches the FastMCP server on port
        8000. You can also run the module directly if you prefer.
      </p>
      <WhatThisFileDoes
        path="scripts/run_local.py"
        does={
          <span>
            Convenience launcher that loads <Code>.env</Code>, sets the Python
            path, and starts the MCP server on localhost.
          </span>
        }
        edit={<span>Port number or extra environment overrides.</span>}
        dontEdit={
          <span>
            The <Code>sys.path</Code> manipulation — it ensures imports work
            from the repo root.
          </span>
        }
      />
      <CodeBlock
        language="python"
        filename="scripts/run_local.py"
        code={`#!/usr/bin/env python3
"""Run the MCP server locally for development."""
import sys
from pathlib import Path

# Ensure repo root is on sys.path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from dotenv import load_dotenv
load_dotenv()

from src.cowork_mcp.server import mcp

if __name__ == "__main__":
    mcp.run(transport="http", host="127.0.0.1", port=8000)`}
      />
      <CodeBlock
        language="bash"
        filename="Terminal"
        code={`# Option 1: helper script
python scripts/run_local.py

# Option 2: run as module
PYTHONPATH=. python -m src.cowork_mcp.server`}
      />
      <ExpectedOutput>
{`INFO:     Started server process
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     MCP endpoint available at /mcp`}
      </ExpectedOutput>
      <Callout variant="tip" title="Create a .env first">
        Copy <Code>.env.example</Code> to <Code>.env</Code> and fill in your
        Salesforce (or other connector) credentials. The server will refuse to
        start if required settings are missing.
      </Callout>

      <h2 id="inspector">MCP Inspector</h2>
      <p>
        The MCP Inspector is a browser-based tool that connects to any MCP
        server and lets you discover tools, call them interactively, and see the
        raw JSON-RPC responses. Point it at your local server to verify
        everything works before involving the Agents Toolkit.
      </p>
      <CodeBlock
        language="bash"
        filename="Terminal"
        code={`# Install and launch the MCP Inspector
npx @anthropic-ai/mcp-inspector

# In the Inspector UI, connect to:
# URL: http://localhost:8000/mcp
# Transport: Streamable HTTP`}
      />
      <p>
        Once connected, the Inspector shows every tool your server exposes. Click
        a tool to see its schema, fill in sample arguments, and execute it. The
        response pane shows the trimmed JSON your server returned.
      </p>
      <Callout variant="beginner" title="No auth needed locally">
        When running locally without a gateway, the server accepts anonymous
        requests. The Inspector does not need a token. (In production, APIM or
        your auth middleware handles token validation.)
      </Callout>

      <h2 id="fetch-action">Fetch action from MCP</h2>
      <p>
        With the server running, open VS Code with the Agents Toolkit (v6.3+).
        Make sure <Code>.vscode/mcp.json</Code> points at{" "}
        <Code>http://localhost:8000/mcp</Code>. Then run the command palette
        action:
      </p>
      <CodeBlock
        language="text"
        filename="VS Code Command Palette"
        code={`ATK: Fetch action from MCP`}
      />
      <p>
        The Toolkit connects to your server, discovers all tools, and writes them
        into <Code>ai-plugin.json</Code>. You can then select which tools to
        expose and choose an authentication type. This is the bridge between your
        Python server and the plug-in package.
      </p>
      <CodeBlock
        language="json"
        filename=".vscode/mcp.json"
        code={`{
  "inputs": [],
  "servers": {
    "cowork-mcp-local": {
      "type": "http",
      "url": "http://localhost:8000/mcp"
    }
  }
}`}
      />

      <h2 id="sideload">Sideload into Copilot</h2>
      <p>
        Sideloading deploys the plug-in to your Microsoft 365 developer tenant so
        you can test it in Copilot Cowork without publishing to the store. The
        agent appears with <Code>dev</Code> appended to its name.
      </p>
      <CodeBlock
        language="text"
        filename="VS Code Command Palette"
        code={`ATK: Provision
ATK: Sideload`}
      />
      <p>
        After sideloading, open{" "}
        <Code>https://m365.cloud.microsoft/chat</Code> and look for your agent
        in the Copilot experience. Try the conversation starters you defined in{" "}
        <Code>declarativeAgent.json</Code>.
      </p>
      <Callout variant="warning" title="Developer tenant required">
        Sideloading requires a Microsoft 365 developer tenant with custom app
        upload enabled. See the{" "}
        <a href="/environment/">Environment Setup</a> chapter for details.
      </Callout>

      <h2 id="tests">Run tests</h2>
      <p>
        The test suite validates tools and trimming logic without needing a live
        external system. Unit tests mock the connector client; integration tests
        hit a local server instance.
      </p>
      <Lab
        title="Run the test suite"
        time="5 minutes"
        goal={<span>Confirm all tools and trim logic pass locally.</span>}
      >
        <CodeBlock
          language="bash"
          filename="Terminal"
          code={`# Install test dependencies
pip install pytest pytest-asyncio httpx-mock

# Run all tests
pytest tests/ -v

# Run just the trim tests
pytest tests/test_trim.py -v

# Run tool tests (mocks external API)
pytest tests/test_tools.py -v`}
        />
        <ExpectedOutput>
{`tests/test_trim.py::test_small_payload_unchanged PASSED
tests/test_trim.py::test_large_payload_trimmed PASSED
tests/test_tools.py::test_salesforce_whoami PASSED
tests/test_tools.py::test_salesforce_query PASSED
====== 4 passed in 0.8s ======`}
        </ExpectedOutput>
      </Lab>
      <CodeBlock
        language="python"
        filename="tests/test_trim.py"
        code={`"""Unit tests for payload trimming."""
import pytest
from src.cowork_mcp.trim import trim_payload

def test_small_payload_unchanged():
    data = {"id": "001", "name": "Acme"}
    assert trim_payload(data, max_bytes=1024) == data

def test_large_payload_trimmed():
    data = {"id": "001", "description": "x" * 10_000}
    result = trim_payload(data, max_bytes=512)
    assert "description" not in result`}
      />
      <VideoCard
        verified={false}
        concept="Local development workflow for Copilot Cowork MCP plug-ins"
        level="beginner"
        searchQuery="Microsoft Agents Toolkit MCP server local development sideload Copilot Cowork"
        why="Watching someone go through the run-inspect-fetch-sideload loop makes the cycle concrete."
      />
    </ChapterShell>
  );
}
