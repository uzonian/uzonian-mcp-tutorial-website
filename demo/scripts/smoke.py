#!/usr/bin/env python3
"""Smoke test — hit the local MCP server and list available tools."""

from __future__ import annotations

import json
import sys

import httpx

BASE = "http://127.0.0.1:8000"
MCP_ENDPOINT = f"{BASE}/mcp"


def main() -> None:
    # Initialize
    init_payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "initialize",
        "params": {
            "protocolVersion": "2025-03-26",
            "capabilities": {},
            "clientInfo": {"name": "smoke-test", "version": "0.1.0"},
        },
    }
    resp = httpx.post(MCP_ENDPOINT, json=init_payload, timeout=10)
    if resp.status_code != 200:
        print(f"FAIL: initialize returned {resp.status_code}")
        sys.exit(1)
    print("✓ initialize OK")

    # Get session ID from response header
    session_id = resp.headers.get("mcp-session-id", "")

    # List tools
    list_payload = {"jsonrpc": "2.0", "id": 2, "method": "tools/list", "params": {}}
    headers = {}
    if session_id:
        headers["mcp-session-id"] = session_id
    resp = httpx.post(MCP_ENDPOINT, json=list_payload, headers=headers, timeout=10)
    if resp.status_code != 200:
        print(f"FAIL: tools/list returned {resp.status_code}")
        sys.exit(1)

    data = resp.json()
    tools = data.get("result", {}).get("tools", [])
    print(f"✓ tools/list OK — {len(tools)} tools registered:")
    for t in tools:
        print(f"  • {t['name']}: {t.get('description', '')[:60]}")

    print("\n🎉 Smoke test passed!")


if __name__ == "__main__":
    main()
