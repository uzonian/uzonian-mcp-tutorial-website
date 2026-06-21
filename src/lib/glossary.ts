export interface GlossaryTerm {
  term: string;
  short: string;
  /** Longer beginner-friendly explanation. */
  detail?: string;
}

export const glossary: GlossaryTerm[] = [
  {
    term: "MCP",
    short:
      "Model Context Protocol — a standard way for AI clients to discover and call tools.",
    detail:
      "Instead of teaching a model to call a random API, an MCP server describes its tools in a standard shape. A client can ask 'what tools do you expose?', 'what parameters does each take?', and 'call this tool with these arguments.'",
  },
  {
    term: "FastMCP",
    short: "The Python SDK helper used to build MCP servers quickly.",
    detail:
      "FastMCP (from the Python MCP SDK) handles the MCP protocol details so you focus on writing tools as plain async functions.",
  },
  {
    term: "Streamable HTTP",
    short: "The MCP transport that uses HTTP requests to a single server endpoint.",
    detail:
      "The server exposes one HTTP endpoint, /mcp, and the MCP client sends JSON-RPC-style requests through it. The reference server uses stateless_http=True and json_response=True so it works cleanly behind gateways and load balancers.",
  },
  {
    term: "Tool",
    short: "A callable function exposed by the MCP server for an AI client to call.",
    detail:
      "A tool's name, typed arguments, and docstring are all part of what the MCP client discovers. Good tools do one clear thing and return a small, predictable object.",
  },
  {
    term: "Copilot Studio",
    short: "Microsoft platform for building agents and connecting tools.",
    detail:
      "Copilot Studio consumes the MCP server through a Power Platform custom connector and lets users chat with an agent that calls your tools.",
  },
  {
    term: "Power Platform custom connector",
    short: "The connector layer Copilot Studio uses to call external services.",
    detail:
      "For MCP, the connector exposes a single /mcp POST operation and must carry the x-ms-agentic-protocol extension so Copilot Studio treats it as an MCP tool source.",
  },
  {
    term: "x-ms-agentic-protocol",
    short:
      "The connector extension that marks a connector as an agentic MCP connector.",
    detail:
      'The critical line is "x-ms-agentic-protocol": "mcp-streamable-1.0". Without it, Copilot Studio may treat the connector like a normal REST API instead of an MCP endpoint.',
  },
  {
    term: "OAuth 2.0 3LO",
    short: "Three-legged OAuth, where the user grants delegated access.",
    detail:
      "The three legs are the user, the client application (the Power Platform/Copilot Studio connector), and the resource provider (Atlassian). The user signs in and the server receives a short-lived access token for that user.",
  },
  {
    term: "Delegated token",
    short: "An access token representing the signed-in user.",
    detail:
      "The MCP server forwards the user's delegated token to Jira, so Jira enforces that user's permissions. The server never owns a Jira identity.",
  },
  {
    term: "PAT",
    short: "Personal access token — a standing credential, avoided here for Jira access.",
    detail:
      "PATs and service accounts are shared standing credentials. This design avoids them in favor of per-request delegated tokens.",
  },
  {
    term: "APIM",
    short: "Azure API Management — the public gateway in front of the MCP server.",
    detail:
      "APIM provides the HTTPS endpoint, CORS, IP filtering, rate limits, quotas, header checks, and injects the gateway integrity secret. The app still validates security itself; APIM is not the only line of defense.",
  },
  {
    term: "Key Vault",
    short: "Azure service for storing secrets securely.",
    detail:
      "Key Vault stores the gateway shared secret. APIM reads it as a named value and the app verifies it, proving a request came through APIM.",
  },
  {
    term: "Application Insights",
    short: "Azure telemetry service for logs and traces.",
    detail:
      "When APPLICATIONINSIGHTS_CONNECTION_STRING is set, the app exports logs and traces to Azure Monitor. Tokens and secrets are redacted before logging.",
  },
  {
    term: "ACR",
    short: "Azure Container Registry — stores the built container image.",
    detail:
      "The deploy script builds the image in ACR, so you do not need local Docker to deploy.",
  },
  {
    term: "App Service",
    short: "Azure web app hosting service.",
    detail:
      "A familiar web-app hosting model with built-in health checks. One of two supported hosting options (the other is Container Apps).",
  },
  {
    term: "Container Apps",
    short: "Azure container-native application hosting service.",
    detail:
      "Offers container-native scaling, revisions, and HTTP-concurrency scaling. The other supported hosting option.",
  },
  {
    term: "Bicep",
    short: "Azure infrastructure-as-code language.",
    detail:
      "The reference implementation defines all Azure resources in Bicep files under infra/, so deployments are repeatable.",
  },
  {
    term: "JQL",
    short: "Jira Query Language — the search syntax for Jira issues.",
    detail:
      "The jira_search tool accepts JQL such as 'assignee = currentUser() AND statusCategory != Done'.",
  },
  {
    term: "cloudId",
    short: "Atlassian identifier for a specific Jira Cloud site.",
    detail:
      "Atlassian's Jira Cloud API uses the cloudId in the URL: https://api.atlassian.com/ex/jira/{cloudId}/rest/api/3. The server resolves it from the user's accessible resources.",
  },
  {
    term: "ADF",
    short: "Atlassian Document Format, required for rich-text fields in Jira REST v3.",
    detail:
      "Comments and descriptions must be sent as ADF, not plain strings. A small helper, text_to_adf, wraps plain text into a minimal ADF document.",
  },
  {
    term: "Payload trimming",
    short:
      "Reducing responses to safe, compact shapes before returning them to the agent.",
    detail:
      "Agent platforms have response-size limits. Trimming requests only needed fields, converts to small models, clips long text, and enforces a byte budget to avoid AsyncResponsePayloadTooLarge.",
  },
  {
    term: "Byte budget",
    short: "The maximum serialized response size the server will return.",
    detail:
      "Controlled by MAX_RESPONSE_BYTES (default 90000). If a result is too big, the trimmer clips summaries, then drops trailing issues, and reports how many were omitted.",
  },
  {
    term: "Smoke test",
    short:
      "A small end-to-end test that verifies essential behavior after startup or deploy.",
    detail:
      "scripts/smoke.py checks /healthz, that /mcp without a bearer returns 401, and that MCP initialize works with a bearer token.",
  },
  {
    term: "ContextVar",
    short:
      "A Python construct that isolates per-request state across concurrent async requests.",
    detail:
      "The user's bearer token is stored in a ContextVar so concurrent requests from different users never overlap. Middleware sets it per request and resets it in a finally block.",
  },
  {
    term: "Gateway shared secret",
    short:
      "A secret APIM injects (X-Gateway-Token) so the app can prove a request came through APIM.",
    detail:
      "Stored in Key Vault, injected by APIM, and verified by the app. This blocks direct access to the app host that bypasses the gateway.",
  },
];

export function findTerm(term: string): GlossaryTerm | undefined {
  const key = term.trim().toLowerCase();
  return glossary.find((g) => g.term.toLowerCase() === key);
}
