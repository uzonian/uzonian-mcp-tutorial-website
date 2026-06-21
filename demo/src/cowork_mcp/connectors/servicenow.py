"""ServiceNow connector — Table API REST client and MCP tools.

Tools: servicenow_whoami, servicenow_search_incidents, servicenow_get_incident,
       servicenow_create_incident, servicenow_update_incident, servicenow_search_kb.
"""

from __future__ import annotations

import httpx

from ..auth import get_token
from ..config import settings
from ..trim import trim_dict, trim_list


async def _client() -> httpx.AsyncClient:
    return httpx.AsyncClient(
        base_url=settings.servicenow_base_url,
        headers={
            "Authorization": f"******",
            "Accept": "application/json",
        },
        timeout=30,
    )


def register(mcp) -> None:  # noqa: ANN001
    """Register ServiceNow tools on the FastMCP instance."""

    @mcp.tool()
    async def servicenow_whoami() -> dict:
        """Return the current ServiceNow user profile."""
        async with await _client() as client:
            resp = await client.get("/api/now/table/sys_user", params={"sysparm_limit": "1", "sysparm_query": "user_name=javascript:gs.getUserName()"})
            resp.raise_for_status()
            records = resp.json().get("result", [])
            return trim_dict(records[0]) if records else {"error": "user not found"}

    @mcp.tool()
    async def servicenow_search_incidents(query: str) -> list[dict]:
        """Search incidents using an encoded query string."""
        async with await _client() as client:
            resp = await client.get(
                "/api/now/table/incident",
                params={"sysparm_query": query, "sysparm_limit": str(settings.max_results)},
            )
            resp.raise_for_status()
            return trim_list(resp.json().get("result", []))

    @mcp.tool()
    async def servicenow_get_incident(sys_id: str) -> dict:
        """Retrieve a single incident by sys_id."""
        async with await _client() as client:
            resp = await client.get(f"/api/now/table/incident/{sys_id}")
            resp.raise_for_status()
            return trim_dict(resp.json().get("result", {}))

    @mcp.tool()
    async def servicenow_create_incident(short_description: str, description: str = "", urgency: str = "2") -> dict:
        """Create a new incident and return its number and sys_id."""
        async with await _client() as client:
            resp = await client.post(
                "/api/now/table/incident",
                json={"short_description": short_description, "description": description, "urgency": urgency},
            )
            resp.raise_for_status()
            result = resp.json().get("result", {})
            return trim_dict({"sys_id": result.get("sys_id"), "number": result.get("number")})

    @mcp.tool()
    async def servicenow_update_incident(sys_id: str, fields: dict) -> dict:
        """Update an incident by sys_id with the given fields."""
        async with await _client() as client:
            resp = await client.patch(f"/api/now/table/incident/{sys_id}", json=fields)
            resp.raise_for_status()
            return {"success": True, "sys_id": sys_id}

    @mcp.tool()
    async def servicenow_search_kb(query: str) -> list[dict]:
        """Search the knowledge base for articles matching a query."""
        async with await _client() as client:
            resp = await client.get(
                "/api/now/table/kb_knowledge",
                params={"sysparm_query": f"short_descriptionLIKE{query}", "sysparm_limit": str(settings.max_results)},
            )
            resp.raise_for_status()
            return trim_list(resp.json().get("result", []))
