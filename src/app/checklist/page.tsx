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
      intro="Work through these before you call it done. Your progress is saved in your browser, so you can tick items off across multiple sessions. Every item maps to a lesson from an earlier chapter."
      learningGoals={[
        "Verify plug-in package, MCP connection, auth, security, Azure hosting, and publishing readiness",
        "Confirm no standing credentials or token logging remain",
        "Confirm the gateway, trimming, and probes all work in production",
      ]}
      toc={[
        { id: "package", label: "Plug-in package" },
        { id: "connection", label: "MCP connection" },
        { id: "auth", label: "Authentication" },
        { id: "security", label: "Security" },
        { id: "azure", label: "Azure hosting" },
        { id: "publish", label: "Publishing" },
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

      <h2 id="package">Plug-in package</h2>
      <Checklist
        id="cl-package"
        title="Plug-in Package"
        items={[
          { id: "manifest-valid", label: "manifest.json passes teamsapp validate" },
          { id: "agent-ref", label: "declarativeAgent.json references correct actions" },
          { id: "ai-plugin", label: "ai-plugin.json has runtimes block with MCP server URL" },
          { id: "icons", label: "Color and outline icons are present and correct size" },
          { id: "skill-md", label: "SKILL.md recipe is included and tested" },
          { id: "version", label: "Package version is bumped for each release" },
        ]}
      />

      <h2 id="connection">MCP connection</h2>
      <Checklist
        id="cl-connection"
        title="MCP Connection"
        items={[
          { id: "reach", label: "/mcp endpoint is reachable through APIM" },
          { id: "init", label: "MCP initialize handshake works" },
          { id: "tools-list", label: "tools/list returns all expected tools" },
          { id: "read-tool", label: "A read-only tool call succeeds end-to-end" },
          { id: "write-tool", label: "A write tool call succeeds in a test environment" },
          { id: "unsupported", label: "Unsupported methods return clean errors" },
          { id: "streamable", label: "Server uses stateless_http=True and json_response=True" },
        ]}
      />

      <h2 id="auth">Authentication</h2>
      <Checklist
        id="cl-auth"
        title="Authentication"
        items={[
          { id: "oauth-type", label: "OAuth 2.1 delegated flow configured (not service account)" },
          { id: "scopes", label: "Only required scopes are requested" },
          { id: "redirect-prod", label: "Production redirect URI registered: teams.microsoft.com oAuthRedirect" },
          { id: "redirect-dev", label: "VS Code redirect URI registered: vscode.dev/redirect" },
          { id: "refresh", label: "Token refresh works without re-prompting" },
          { id: "no-pat", label: "No personal access tokens or service accounts exist" },
          { id: "no-token-log", label: "Tokens are never logged" },
        ]}
      />

      <h2 id="security">Security</h2>
      <Checklist
        id="cl-security"
        title="Security"
        items={[
          { id: "https", label: "APIM enforces HTTPS only" },
          { id: "gateway-token", label: "APIM injects a gateway secret header" },
          { id: "app-validates", label: "App rejects requests missing the gateway secret" },
          { id: "no-wildcard", label: "Origin allow-list is not wildcard (*)" },
          { id: "kv-secrets", label: "All secrets stored in Key Vault" },
          { id: "mi", label: "Managed identity used for Key Vault access" },
          { id: "nonroot", label: "Container runs as non-root user" },
          { id: "secret-scan", label: "CI secret scanning is enabled" },
          { id: "payload-trim", label: "Payload trimming enforces a byte budget" },
        ]}
      />

      <h2 id="azure">Azure hosting</h2>
      <Checklist
        id="cl-azure"
        title="Azure Hosting"
        items={[
          { id: "deploy-valid", label: "Container Apps or App Service deployment validated" },
          { id: "apim-policy", label: "APIM policy deployed with production values" },
          { id: "insights", label: "Application Insights receives logs and traces" },
          { id: "probes", label: "Health and readiness probes respond correctly" },
          { id: "autoscale", label: "Autoscale rules configured for expected load" },
          { id: "sku", label: "Production SKU selected (not free/dev tier)" },
          { id: "bicep", label: "Bicep templates validate without errors" },
        ]}
      />

      <h2 id="publish">Publishing</h2>
      <Checklist
        id="cl-publish"
        title="Publishing"
        items={[
          { id: "zip", label: "Plugin .zip package built by CI pipeline" },
          { id: "validate-pkg", label: "Package passes teamsapp validate" },
          { id: "admin-upload", label: "Package uploaded to Teams Admin Center" },
          { id: "approval", label: "Admin approval process documented" },
          { id: "smoke-prod", label: "Post-publish smoke test passes in production" },
          { id: "rollback", label: "Rollback procedure documented and tested" },
        ]}
      />
    </ChapterShell>
  );
}
