export interface GlossaryTerm {
  term: string;
  short: string;
  /** Longer beginner-friendly explanation. */
  detail?: string;
}

export const glossary: GlossaryTerm[] = [
  {
    term: "Copilot Cowork",
    short:
      "The agentic experience in Microsoft 365 Copilot that carries out multi-step tasks, not just chat.",
    detail:
      "Cowork 'does the work' — it plans and executes tasks across your tools. You extend what it can do by installing plug-ins that add skills and connectors.",
  },
  {
    term: "Plug-in",
    short:
      "A packaged extension that adds skills and/or connectors to Copilot Cowork.",
    detail:
      "A plug-in is built with the Microsoft 365 app model (the same manifest model as Teams apps and declarative agents), so an admin can deploy and govern it centrally. It bundles a declarative agent, optional skills, and connectors/actions.",
  },
  {
    term: "Declarative agent",
    short:
      "The agent definition inside a plug-in: instructions, conversation starters, and the actions it can take.",
    detail:
      "Described declaratively (in JSON) rather than coded. It references one or more actions — including MCP server actions — that give the agent reach into external systems.",
  },
  {
    term: "Skill",
    short:
      "A reusable, instruction-based recipe (a SKILL.md) that tells Cowork how to accomplish a task.",
    detail:
      "Skills are the 'know-how'. They describe stable, repeatable workflows in plain language. A skill often relies on a connector's MCP connection to supply the live data it works on.",
  },
  {
    term: "Connector",
    short: "How an agent reaches an external system — the 'reach'.",
    detail:
      "The modern connector is an MCP server action: the plug-in points at a remote MCP server, and Cowork discovers and calls its tools.",
  },
  {
    term: "MCP",
    short:
      "Model Context Protocol — a standard way for an agent to discover and call tools.",
    detail:
      "Instead of hand-coding one connector operation per API call, the plug-in points at an MCP server. The agent asks 'what tools do you expose?', 'what arguments does each take?', and 'call this tool with these arguments.'",
  },
  {
    term: "MCP connection",
    short:
      "The link between a Cowork plug-in and a remote MCP server that supplies tools.",
    detail:
      "Its components are the action descriptor (ai-plugin.json), the remote /mcp server URL, the discovered tools, optional UI widgets, and the authentication binding.",
  },
  {
    term: "MCP server",
    short:
      "A service that speaks MCP and exposes tools to agents over streamable HTTP.",
    detail:
      "In this guide it is a Python app built with FastMCP, hosted on Azure, exposing a single /mcp endpoint. It is the thing a plug-in's MCP connection talks to.",
  },
  {
    term: "FastMCP",
    short: "The Python SDK helper used to build MCP servers quickly.",
    detail:
      "FastMCP (from the official Python MCP SDK) handles the protocol details so you write tools as plain async functions with typed arguments and docstrings.",
  },
  {
    term: "Tool",
    short: "A callable function the MCP server exposes for the agent to call.",
    detail:
      "A tool's name, typed arguments, and description are part of what Cowork discovers. Good tools do one clear thing and return a small, predictable object.",
  },
  {
    term: "Streamable HTTP",
    short:
      "The MCP transport that uses HTTPS requests to a single server endpoint.",
    detail:
      "The server exposes one HTTPS endpoint, /mcp, and the client sends JSON-RPC-style requests through it. Using stateless_http=True and json_response=True keeps it friendly to gateways and load balancers. Cowork plug-ins connect to remote streamable-HTTP servers (not local stdio servers).",
  },
  {
    term: "UI widget (MCP app)",
    short:
      "An interactive card an MCP server can render inside Copilot, beyond plain text.",
    detail:
      "Built with the MCP Apps extension or the OpenAI Apps SDK. Widgets need a newer Agents Toolkit (6.6.1+) and OAuth 2.1 or Entra SSO. Add them after the text experience works.",
  },
  {
    term: "Microsoft 365 Agents Toolkit",
    short:
      "The VS Code extension used to scaffold, fetch tools for, provision, and sideload plug-ins.",
    detail:
      "Formerly the Teams Toolkit. It creates the declarative agent, adds an MCP server action, fetches the tool list into ai-plugin.json, and provisions/sideloads the plug-in for testing.",
  },
  {
    term: "ai-plugin.json",
    short:
      "The action descriptor that declares the MCP runtime: server URL, selected tools, and auth.",
    detail:
      "Generated and updated by the Agents Toolkit's 'Fetch action from MCP'. Its runtimes block points at the /mcp endpoint and references the authentication the connection uses.",
  },
  {
    term: "mcp.json",
    short:
      "A dev-only file (.vscode/mcp.json) the Agents Toolkit uses to start and fetch tools locally.",
    detail:
      "It points at your local or remote MCP server during development. It is part of the developer loop, not the shipped plug-in.",
  },
  {
    term: "Manifest",
    short:
      "The plug-in package identity (manifest.json) in the Microsoft 365 app model.",
    detail:
      "Holds the app name, icons, and the reference to the declarative agent. Admins deploy and govern the plug-in based on this package.",
  },
  {
    term: "Connection type",
    short:
      "The authentication mode an MCP connection uses: anonymous, API key, OAuth 2.1, or Entra SSO.",
    detail:
      "Anonymous is dev/read-only; API key is machine-to-machine; OAuth 2.1 with static registration is the recommended per-user delegated pattern; Entra SSO uses the user's M365 identity.",
  },
  {
    term: "OAuth 2.1 (static registration)",
    short:
      "The recommended connection type: the user signs in to the resource and consents.",
    detail:
      "The connection receives a short-lived delegated token for that user, so the agent acts as the user with their permissions. Redirect URI for Copilot is https://teams.microsoft.com/api/platform/v1.0/oAuthRedirect.",
  },
  {
    term: "Delegated token",
    short:
      "A short-lived access token issued for the signed-in user, not a shared account.",
    detail:
      "If the user can see a record, the tool can; if not, the backend rejects the call. The MCP server forwards the user's token and never recreates the backend's permission logic.",
  },
  {
    term: "Entra SSO",
    short:
      "Single sign-on using the user's Microsoft Entra (M365) identity.",
    detail:
      "Best when the backend trusts Entra. The consent redirect for Copilot is https://teams.microsoft.com/api/platform/v1.0/oAuthConsentRedirect.",
  },
  {
    term: "3LO",
    short:
      "Three-legged OAuth: user, client app, and resource provider each take part.",
    detail:
      "Atlassian (Jira Cloud) uses 3LO. The user signs in and consents; the connection gets a delegated token scoped to read:jira-work, read:jira-user, write:jira-work, and offline_access.",
  },
  {
    term: "Payload trimming",
    short:
      "Shrinking tool responses to stay within the agent's response-size limit.",
    detail:
      "Request only the fields you need, convert records into small models, clip long text, and enforce a byte budget before returning data to Copilot.",
  },
  {
    term: "APIM",
    short: "Azure API Management — the gateway placed in front of the MCP server.",
    detail:
      "Provides an HTTPS endpoint, CORS and IP filtering, rate limits, header checks, and a Key Vault-backed gateway secret so the app can prove traffic came through the gateway.",
  },
  {
    term: "Azure Key Vault",
    short: "Where the MCP server's secrets (gateway secret, client secret) live.",
    detail:
      "Secrets are stored in Key Vault and referenced at runtime — never hardcoded in code or committed to source.",
  },
  {
    term: "Azure Container Apps",
    short: "A serverless container host used to run the remote MCP server.",
    detail:
      "A good default for hosting the FastMCP server image. App Service is an alternative; both sit behind APIM.",
  },
  {
    term: "SOQL",
    short: "Salesforce Object Query Language — used to query Salesforce records.",
    detail:
      "The salesforce_query tool runs SOQL against the Salesforce REST API to read accounts, opportunities, and cases for the signed-in user.",
  },
  {
    term: "Sideloading",
    short: "Uploading a plug-in to your own tenant for testing before publishing.",
    detail:
      "Requires Custom App Upload and Copilot Access to be enabled. The sideloaded agent appears in Copilot with 'dev' appended to its name.",
  },
];

export function findTerm(term: string): GlossaryTerm | undefined {
  const key = term.trim().toLowerCase();
  return glossary.find((g) => g.term.toLowerCase() === key);
}
