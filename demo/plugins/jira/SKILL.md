# Skill: Sprint Standup Prep

## Goal
Gather a user's open issues and draft a concise standup summary.

## Trigger
"Prepare my standup" or "What should I report in standup?"

## Steps
1. Call `jira_whoami` to get the current user's account ID.
2. Call `jira_search` with JQL: `assignee = currentUser() AND sprint in openSprints() AND status != Done ORDER BY priority DESC`
3. Group issues by status (In Progress, To Do, Blocked).
4. For each issue, summarize: Key | Summary | Status | Priority.
5. Draft a standup update in the format:
   - **Done yesterday**: (issues transitioned to Done in last 24h)
   - **Working on today**: (In Progress items)
   - **Blockers**: (any blocked items or items with blocker flag)
6. Offer to call `jira_add_comment` on blocked issues to request help.

## Guardrails
- Only show issues assigned to the current user.
- Limit to the current sprint's open issues.
- Do not transition issues without explicit confirmation.
