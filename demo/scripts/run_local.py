#!/usr/bin/env python3
"""Start the Cowork MCP server locally using uvicorn."""

import subprocess
import sys


def main() -> None:
    cmd = [
        sys.executable, "-m", "mcp", "run",
        "--transport", "streamable-http",
        "--host", "127.0.0.1",
        "--port", "8000",
        "src/cowork_mcp/server.py:mcp",
    ]
    print(f"Starting server: {' '.join(cmd)}")
    subprocess.run(cmd, check=True)


if __name__ == "__main__":
    main()
