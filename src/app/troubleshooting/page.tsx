import { ChapterShell } from "@/components/ChapterShell";
import { Callout } from "@/components/Callout";
import { Mermaid } from "@/components/Mermaid";
import { Table, Code } from "@/components/content";
import { CodeBlock } from "@/components/CodeBlock";
import { VideoCard } from "@/components/VideoCard";

export const metadata = { title: "Troubleshooting" };

export default function Page() {
  return (
    <ChapterShell
      slug="troubleshooting"
      eyebrow="Chapter 14 · Fix"
      title="Troubleshooting Plug-in & MCP Connection Failures"
      intro="When your plug-in misbehaves, a structured decision tree and symptom-cause-fix table get you back on track fast. This chapter covers the five most common failures: no tools appearing, consent/redirect errors, 401 Unauthorized, CORS blocks, and payload-too-large rejections."
      learningGoals={[
        "Follow a decision tree to narrow down plug-in connection failures",
        "Identify the root cause from common symptoms",
        "Fix consent/redirect, auth, CORS, and payload issues",
        "Know which tools to reach for at each diagnostic step",
      ]}
      toc={[
        { id: "decision-tree", label: "Decision tree" },
        { id: "table", label: "Symptom–cause–fix table" },
        { id: "no-tools", label: "No tools appear" },
        { id: "consent", label: "Consent & redirect errors" },
        { id: "payload", label: "Payload too large" },
      ]}
      summary={
        <ul>
          <li key="s1">Start with the decision tree to narrow the failure class.</li>
          <li key="s2">Use the symptom table for a quick lookup of cause and fix.</li>
          <li key="s3">Most issues trace back to misconfigured redirect URIs, missing scopes, or oversized responses.</li>
        </ul>
      }
    >
      <h2 id="decision-tree">Decision tree</h2>
      <p>
        When your Cowork plug-in does not behave as expected, start here. The
        tree narrows the problem to one of five buckets so you can jump directly
        to the right section below.
      </p>
      <Mermaid
        chart={`graph TD
  A[Plug-in not working] --> B{Tools visible in Copilot?}
  B -- No --> C[See: No tools appear]
  B -- Yes --> D{Auth prompt shown?}
  D -- No / Error --> E[See: Consent & redirect errors]
  D -- Yes --> F{Call succeeds?}
  F -- 401 --> G[See: 401 Unauthorized]
  F -- CORS error --> H[Check: APIM origin allow-list]
  F -- 413 / truncated --> I[See: Payload too large]
  F -- Yes --> J[Tool logic bug - check server logs]`}
        alt="Decision tree: start at plug-in not working, branch on tools visible, auth prompt, then call result to identify no-tools, consent, 401, CORS, or payload issues."
        caption="Troubleshooting decision tree for Cowork plug-in connections"
      />
      <Callout variant="tip" title="Use the MCP Inspector first">
        The MCP Inspector (<Code>npx @anthropic-ai/mcp-inspector</Code>) lets you
        call your server directly and see raw JSON-RPC responses, bypassing
        Copilot entirely. If the Inspector works but Copilot does not, the
        problem is in the plug-in packaging or auth binding.
      </Callout>

      <h2 id="table">Symptom&ndash;cause&ndash;fix table</h2>
      <p>
        A quick-reference lookup for the most common failures. Match the symptom
        you see to its likely cause and the recommended fix.
      </p>
      <Table
        headers={["Symptom", "Likely cause", "Fix"]}
        rows={[
          [
            "No tools appear in Copilot",
            "MCP server URL unreachable or ai-plugin.json missing runtime block",
            "Verify the server is running and the action descriptor references the correct /mcp URL",
          ],
          [
            "Consent popup fails or loops",
            "Redirect URI mismatch between Entra/OAuth app and ai-plugin.json",
            <span key="r2">Set redirect to <Code>https://teams.microsoft.com/api/platform/v1.0/oAuthRedirect</Code></span>,
          ],
          [
            "401 Unauthorized on tool call",
            "Token expired, wrong audience, or missing scope",
            "Check token claims (aud, scp) and refresh logic; ensure scopes match the resource",
          ],
          [
            "CORS error in browser console",
            "APIM or server origin allow-list does not include the Copilot origin",
            "Add the Copilot origin to APIM CORS policy; never use wildcard in production",
          ],
          [
            "413 / response truncated",
            "Tool response exceeds Copilot payload limit (~100 KB)",
            "Implement payload trimming with a byte budget; cap maxResults; clip large fields",
          ],
        ]}
      />

      <h2 id="no-tools">No tools appear</h2>
      <p>
        When you sideload the plug-in and no tools show up in the Copilot
        experience, the connection between Copilot and your MCP server was never
        established. Walk through these checks in order:
      </p>
      <ol>
        <li>Confirm the server is reachable at its <Code>/mcp</Code> URL (use curl or the Inspector).</li>
        <li>Verify <Code>ai-plugin.json</Code> contains a <Code>runtimes</Code> block with the server URL.</li>
        <li>Re-run &ldquo;ATK: Fetch action from MCP&rdquo; in VS Code to pull the latest tool list.</li>
        <li>Check the Agents Toolkit output panel for connection errors.</li>
      </ol>
      <CodeBlock
        language="bash"
        code={`# Quick reachability check
curl -s -X POST https://YOUR_SERVER/mcp \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","method":"initialize","id":1,"params":{"capabilities":{}}}' | python -m json.tool`}
      />

      <h2 id="consent">Consent &amp; redirect errors</h2>
      <p>
        OAuth consent failures almost always come down to a redirect URI
        mismatch. The URI registered in your identity provider must exactly
        match what the Copilot platform sends.
      </p>
      <Table
        headers={["Context", "Required redirect URI"]}
        rows={[
          [
            "Copilot (production)",
            <Code key="r1">https://teams.microsoft.com/api/platform/v1.0/oAuthRedirect</Code>,
          ],
          [
            "VS Code (dev fetch)",
            <Code key="r2">https://vscode.dev/redirect</Code>,
          ],
          [
            "Entra SSO consent",
            <Code key="r3">https://teams.microsoft.com/api/platform/v1.0/oAuthConsentRedirect</Code>,
          ],
        ]}
      />
      <Callout variant="warning" title="Both URIs are needed">
        Register <em>both</em> the production and VS Code redirect URIs in your
        OAuth app. The VS Code URI is required during development when the Agents
        Toolkit fetches tools on your behalf.
      </Callout>

      <h2 id="payload">Payload too large</h2>
      <p>
        Copilot enforces a response size limit (approximately 100 KB). If your
        tool returns large search results or verbose records, the response is
        truncated or rejected outright. The fix is proactive payload trimming.
      </p>
      <CodeBlock
        language="python"
        filename="demo/src/cowork_mcp/trim.py (pattern)"
        code={`BUDGET_BYTES = 90_000  # stay under ~100 KB limit

def trim_response(items: list[dict], budget: int = BUDGET_BYTES) -> list[dict]:
    """Return as many items as fit within the byte budget."""
    import json
    result: list[dict] = []
    used = 0
    for item in items:
        size = len(json.dumps(item).encode())
        if used + size > budget:
            break
        result.append(item)
        used += size
    return result`}
      />
      <Callout variant="production" title="Always trim server-side">
        Never rely on the client to handle oversized responses gracefully. Cap{" "}
        <Code>maxResults</Code> in searches, select only required fields, and
        enforce a byte budget before serialising.
      </Callout>
      <VideoCard
        verified={false}
        concept="Debugging MCP server connections with the MCP Inspector"
        searchQuery="MCP Inspector debugging Model Context Protocol server connections"
        why="Watching someone step through a failing MCP connection in the Inspector builds the muscle memory for real incidents."
      />
    </ChapterShell>
  );
}
