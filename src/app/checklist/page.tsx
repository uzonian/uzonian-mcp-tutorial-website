import { ChapterShell } from "@/components/ChapterShell";
import { Callout } from "@/components/Callout";
import { Checklist } from "@/components/Checklist";

export const metadata = { title: "Production Readiness Checklist" };

export default function Page() {
  return (
    <ChapterShell
      slug="checklist"
      eyebrow="Reference"
      title="Production Readiness Checklist"
      intro="Work through these before you call it done. Your progress is saved in your browser, so you can tick items off across multiple sessions. Nothing here is busywork — every item maps to a lesson from an earlier chapter."
      learningGoals={[
        "Verify MCP, OAuth, security, payload, Azure, and CI/CD readiness",
        "Confirm no standing credentials or token logging remain",
        "Confirm the gateway, trimming, and probes all work in production",
      ]}
      summary={
        <p>
          If every box on this page is checked, your deployment honours the
          architecture and security model this guide teaches. Re-run the checklist
          after any significant change.
        </p>
      }
    >
      <Callout variant="production" title="How to use this page">
        Tick items as you verify them. Progress is stored locally in your browser
        (nothing is sent anywhere). Use the reset link under any list to start
        over.
      </Callout>

      <Checklist
        id="prod-mcp"
        title="MCP"
        items={[
          { id: "reach", label: "/mcp reachable through APIM" },
          { id: "init", label: "MCP initialize works" },
          { id: "list", label: "MCP tools/list returns all expected tools" },
          { id: "read", label: "Read tool call works" },
          { id: "write", label: "Write tool call works in a non-production Jira project" },
          { id: "unsupported", label: "Unsupported methods fail safely" },
        ]}
      />

      <Checklist
        id="prod-oauth"
        title="OAuth"
        items={[
          { id: "scopes", label: "Atlassian app has the required scopes" },
          { id: "redirect", label: "Redirect URL matches the connector" },
          { id: "refresh", label: "Power Platform connector can refresh tokens" },
          { id: "no-pat", label: "No server-side Jira PAT exists" },
          { id: "no-svc", label: "No service account exists" },
          { id: "no-token-logs", label: "Logs do not contain tokens" },
        ]}
      />

      <Checklist
        id="prod-security"
        title="Security"
        items={[
          { id: "https", label: "APIM enforces HTTPS" },
          { id: "inject", label: "APIM injects X-Gateway-Token" },
          { id: "reject", label: "App rejects missing or wrong gateway token in production" },
          { id: "origins", label: "Origin allow-list is not wildcard" },
          { id: "ip", label: "APIM IP filtering is configured or formally waived" },
          { id: "kv", label: "Key Vault soft delete and purge protection are enabled" },
          { id: "mi", label: "Managed identity is used for secret access" },
          { id: "nonroot", label: "Container runs as non-root" },
          { id: "scan", label: "CI secret scan is enabled" },
        ]}
      />

      <Checklist
        id="prod-payload"
        title="Payload"
        items={[
          { id: "fields", label: "Jira search requests only required fields" },
          { id: "cap", label: "maxResults is capped" },
          { id: "budget", label: "Serialized response byte budget is enforced" },
          { id: "clip", label: "Large summaries are clipped" },
          { id: "omit", label: "Omitted results are reported with a note" },
          { id: "tested", label: "Large Jira projects have been tested" },
        ]}
      />

      <Checklist
        id="prod-azure"
        title="Azure"
        items={[
          { id: "deploy", label: "App Service or Container Apps deployment validated" },
          { id: "policy", label: "APIM policy deployed with real values" },
          { id: "insights", label: "App Insights receives logs" },
          { id: "probes", label: "Health probes work" },
          { id: "autoscale", label: "Autoscale rules are appropriate" },
          { id: "sku", label: "Production SKU is selected" },
          { id: "zone", label: "Zone redundancy decision is documented" },
        ]}
      />

      <Checklist
        id="prod-cicd"
        title="CI/CD"
        items={[
          { id: "lint", label: "Lint passes" },
          { id: "unit", label: "Unit tests pass" },
          { id: "smoke", label: "MCP smoke tests pass" },
          { id: "schema", label: "Connector schema is checked" },
          { id: "bicep", label: "Bicep validates" },
          { id: "docker", label: "Docker image builds" },
          { id: "secretscan", label: "Secret scan runs" },
          { id: "devauto", label: "Dev deployment is automated" },
          { id: "approval", label: "Production deployment requires approval" },
          { id: "postdeploy", label: "Post-deploy smoke tests run" },
        ]}
      />
    </ChapterShell>
  );
}
