# Skill: Incident First Response

## Goal
Triage a new incident, find related KB articles, and set priority.

## Trigger
"Triage incident INC0012345" or "Help me respond to this new incident"

## Steps
1. Call `servicenow_get_incident` with the provided sys_id or incident number.
2. Analyze the short description and description for keywords.
3. Call `servicenow_search_kb` with extracted keywords to find related knowledge articles.
4. Based on impact, urgency, and category, recommend a priority (P1–P4).
5. Present a summary: Incident details | Suggested priority | Related KB articles.
6. Offer to call `servicenow_update_incident` to set the recommended priority and add a work note referencing the KB articles.

## Guardrails
- Never change priority without user confirmation.
- Always cite KB article numbers in recommendations.
- Escalate to human if the incident mentions security breach or data loss.
