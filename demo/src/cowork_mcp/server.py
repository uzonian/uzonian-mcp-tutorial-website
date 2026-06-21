"""FastMCP server entry point — streamable HTTP on /mcp."""

from mcp.server.fastmcp import FastMCP

from .config import settings
from .connectors import jira, salesforce, servicenow

mcp = FastMCP(
    settings.mcp_server_name,
    stateless_http=True,
    json_response=True,
)

# Register tools from each connector module
salesforce.register(mcp)
servicenow.register(mcp)
jira.register(mcp)
