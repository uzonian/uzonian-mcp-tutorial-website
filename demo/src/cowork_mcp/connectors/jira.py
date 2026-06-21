"""Jira Cloud connector — REST v3 client and MCP tools.

Tools: jira_whoami, jira_search, jira_get_issue, jira_create_issue,
       jira_add_comment, jira_transition_issue.
"""

from __future__ import annotations

import httpx

from ..auth import get_token
from ..config import settings
from ..trim import trim_dict, trim_list


async def _client() -> httpx.AsyncClient:
    return httpx.AsyncClient(
        base_url=settings.jira_base_url,
        headers={
            "Authorization": f"******",
            "Accept": "application/json",
        },
        timeout=30,
    )


def register(mcp) -> None:  # noqa: ANN001
    """Register Jira tools on the FastMCP instance."""

    @mcp.tool()
    async def jira_whoami() -> dict:
        """Return the current Jira user's display name, email, and account ID."""
        async with await _client() as client:
            resp = await client.get("/rest/api/3/myself")
            resp.raise_for_status()
            data = resp.json()
            return trim_dict({"displayName": data.get("displayName"), "emailAddress": data.get("emailAddress"), "accountId": data.get("accountId")})

    @mcp.tool()
    async def jira_search(jql: str, max_results: int = 25) -> list[dict]:
        """Search for issues using JQL and return trimmed results."""
        limit = min(max_results, settings.max_results)
        async with await _client() as client:
            resp = await client.get("/rest/api/3/search", params={"jql": jql, "maxResults": str(limit)})
            resp.raise_for_status()
            issues = resp.json().get("issues", [])
            return trim_list([{"key": i["key"], "summary": i["fields"]["summary"], "status": i["fields"]["status"]["name"]} for i in issues])

    @mcp.tool()
    async def jira_get_issue(issue_key: str) -> dict:
        """Retrieve a single Jira issue by key (e.g. PROJ-123)."""
        async with await _client() as client:
            resp = await client.get(f"/rest/api/3/issue/{issue_key}")
            resp.raise_for_status()
            data = resp.json()
            fields = data.get("fields", {})
            return trim_dict({
                "key": data.get("key"),
                "summary": fields.get("summary"),
                "status": fields.get("status", {}).get("name"),
                "assignee": (fields.get("assignee") or {}).get("displayName"),
                "description": str(fields.get("description", ""))[:500],
            })

    @mcp.tool()
    async def jira_create_issue(project_key: str, summary: str, issue_type: str = "Task", description: str = "") -> dict:
        """Create a new Jira issue and return its key and ID."""
        async with await _client() as client:
            resp = await client.post(
                "/rest/api/3/issue",
                json={
                    "fields": {
                        "project": {"key": project_key},
                        "summary": summary,
                        "issuetype": {"name": issue_type},
                        "description": {"type": "doc", "version": 1, "content": [{"type": "paragraph", "content": [{"type": "text", "text": description}]}]} if description else None,
                    }
                },
            )
            resp.raise_for_status()
            return trim_dict(resp.json())

    @mcp.tool()
    async def jira_add_comment(issue_key: str, body: str) -> dict:
        """Add a comment to a Jira issue."""
        async with await _client() as client:
            resp = await client.post(
                f"/rest/api/3/issue/{issue_key}/comment",
                json={"body": {"type": "doc", "version": 1, "content": [{"type": "paragraph", "content": [{"type": "text", "text": body}]}]}},
            )
            resp.raise_for_status()
            return {"success": True, "issue_key": issue_key}

    @mcp.tool()
    async def jira_transition_issue(issue_key: str, transition_id: str) -> dict:
        """Transition a Jira issue to a new status by transition ID."""
        async with await _client() as client:
            resp = await client.post(
                f"/rest/api/3/issue/{issue_key}/transitions",
                json={"transition": {"id": transition_id}},
            )
            resp.raise_for_status()
            return {"success": True, "issue_key": issue_key, "transition_id": transition_id}
