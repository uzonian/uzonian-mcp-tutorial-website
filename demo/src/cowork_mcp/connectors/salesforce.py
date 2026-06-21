"""Salesforce connector — REST client and MCP tools.

Tools: salesforce_whoami, salesforce_query, salesforce_get_record,
       salesforce_create_case, salesforce_update_opportunity.
"""

from __future__ import annotations

import httpx

from ..auth import get_token
from ..config import settings
from ..trim import trim_dict, trim_list


async def _client() -> httpx.AsyncClient:
    return httpx.AsyncClient(
        base_url=settings.salesforce_base_url,
        headers={"Authorization": f"******"},
        timeout=30,
    )


def register(mcp) -> None:  # noqa: ANN001
    """Register Salesforce tools on the FastMCP instance."""

    @mcp.tool()
    async def salesforce_whoami() -> dict:
        """Return the current Salesforce user's identity (name, email, org)."""
        async with await _client() as client:
            resp = await client.get("/services/oauth2/userinfo")
            resp.raise_for_status()
            return trim_dict(resp.json())

    @mcp.tool()
    async def salesforce_query(soql: str) -> list[dict]:
        """Execute a SOQL query and return trimmed records."""
        async with await _client() as client:
            resp = await client.get("/services/data/v60.0/query", params={"q": soql})
            resp.raise_for_status()
            records = resp.json().get("records", [])[:settings.max_results]
            return trim_list(records)

    @mcp.tool()
    async def salesforce_get_record(sobject: str, record_id: str) -> dict:
        """Retrieve a single Salesforce record by sObject type and ID."""
        async with await _client() as client:
            resp = await client.get(f"/services/data/v60.0/sobjects/{sobject}/{record_id}")
            resp.raise_for_status()
            return trim_dict(resp.json())

    @mcp.tool()
    async def salesforce_create_case(subject: str, description: str, priority: str = "Medium") -> dict:
        """Create a new Salesforce Case and return its ID."""
        async with await _client() as client:
            resp = await client.post(
                "/services/data/v60.0/sobjects/Case",
                json={"Subject": subject, "Description": description, "Priority": priority},
            )
            resp.raise_for_status()
            return trim_dict(resp.json())

    @mcp.tool()
    async def salesforce_update_opportunity(opportunity_id: str, fields: dict) -> dict:
        """Update fields on an existing Opportunity record."""
        async with await _client() as client:
            resp = await client.patch(
                f"/services/data/v60.0/sobjects/Opportunity/{opportunity_id}",
                json=fields,
            )
            resp.raise_for_status()
            return {"success": True, "id": opportunity_id}
