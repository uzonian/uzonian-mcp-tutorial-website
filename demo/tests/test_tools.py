"""Unit tests for connector tool helpers — uses respx to mock httpx."""

import pytest
import respx
import httpx

from cowork_mcp import auth
from cowork_mcp.config import settings


@pytest.fixture(autouse=True)
def _set_token():
    """Provide a fake token for all tests."""
    auth.set_token("test-bearer-token")
    yield
    auth.clear_token()


@pytest.mark.asyncio
async def test_jira_whoami():
    """jira_whoami returns trimmed user info."""
    from cowork_mcp.connectors.jira import register
    from mcp.server.fastmcp import FastMCP

    mcp = FastMCP("test")
    register(mcp)

    mock_response = {
        "displayName": "Alice",
        "emailAddress": "alice@example.com",
        "accountId": "abc123",
    }

    with respx.mock:
        respx.get(f"{settings.jira_base_url}/rest/api/3/myself").mock(
            return_value=httpx.Response(200, json=mock_response)
        )
        # Call the tool function directly
        tool_fn = None
        for name, fn in mcp._tool_manager._tools.items():
            if name == "jira_whoami":
                tool_fn = fn.fn
                break
        assert tool_fn is not None
        result = await tool_fn()
        assert result["displayName"] == "Alice"
        assert result["accountId"] == "abc123"


@pytest.mark.asyncio
async def test_salesforce_whoami():
    """salesforce_whoami returns trimmed user identity."""
    from cowork_mcp.connectors.salesforce import register
    from mcp.server.fastmcp import FastMCP

    mcp = FastMCP("test")
    register(mcp)

    mock_response = {"sub": "user123", "name": "Bob", "email": "bob@example.com"}

    with respx.mock:
        respx.get(f"{settings.salesforce_base_url}/services/oauth2/userinfo").mock(
            return_value=httpx.Response(200, json=mock_response)
        )
        tool_fn = None
        for name, fn in mcp._tool_manager._tools.items():
            if name == "salesforce_whoami":
                tool_fn = fn.fn
                break
        assert tool_fn is not None
        result = await tool_fn()
        assert result["name"] == "Bob"


@pytest.mark.asyncio
async def test_servicenow_search_incidents():
    """servicenow_search_incidents returns list of trimmed incidents."""
    from cowork_mcp.connectors.servicenow import register
    from mcp.server.fastmcp import FastMCP

    mcp = FastMCP("test")
    register(mcp)

    mock_response = {"result": [{"number": "INC001", "short_description": "Test incident"}]}

    with respx.mock:
        respx.get(f"{settings.servicenow_base_url}/api/now/table/incident").mock(
            return_value=httpx.Response(200, json=mock_response)
        )
        tool_fn = None
        for name, fn in mcp._tool_manager._tools.items():
            if name == "servicenow_search_incidents":
                tool_fn = fn.fn
                break
        assert tool_fn is not None
        result = await tool_fn(query="active=true")
        assert len(result) == 1
        assert result[0]["number"] == "INC001"
