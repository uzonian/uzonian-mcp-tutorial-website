# Skill: Pipeline Triage

## Goal
Summarize at-risk opportunities and log next steps for the sales team.

## Trigger
"Triage my pipeline" or "Which opportunities are at risk?"

## Steps
1. Call `salesforce_query` with SOQL: `SELECT Id, Name, StageName, CloseDate, Amount FROM Opportunity WHERE IsClosed = false AND CloseDate <= NEXT_QUARTER ORDER BY Amount DESC LIMIT 10`
2. For each opportunity returned, assess risk based on stage and close date proximity.
3. Summarize findings in a concise table: Name | Stage | Close Date | Amount | Risk Level.
4. For high-risk items, suggest a next step (e.g., "Schedule exec sponsor call", "Send updated proposal").
5. Offer to call `salesforce_update_opportunity` to log the next step in the Description field.

## Guardrails
- Never update a record without user confirmation.
- Limit output to the top 10 opportunities.
- Redact financial amounts if the user doesn't have appropriate access.
