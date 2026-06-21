import { ChapterShell } from "@/components/ChapterShell";
import { Callout } from "@/components/Callout";
import { CodeBlock } from "@/components/CodeBlock";
import { ConceptCheck } from "@/components/ConceptCheck";
import { Mermaid } from "@/components/Mermaid";
import { Table, Code, Compare } from "@/components/content";

export const metadata = { title: "Azure Deployment" };

const DEPLOY = `flowchart LR
    ACR[Azure Container Registry] --> Host[App Service or Container Apps]
    Host --> APIM[API Management]
    KeyVault[(Key Vault)] --> APIM
    KeyVault --> Host
    Host --> Insights[(Application Insights)]
    APIM --> Connector[Copilot Studio connector]`;

export default function Page() {
  return (
    <ChapterShell
      slug="deployment"
      eyebrow="Chapter 9 · Integrate & Ship"
      title="Azure Deployment"
      intro="Ship the server to Azure with one script. Bicep provisions everything, the image is built in ACR, and APIM fronts the app. You choose App Service or Container Apps."
      learningGoals={[
        "Run the deployment script for App Service or Container Apps",
        "Identify the Azure resources each Bicep file creates",
        "Understand the APIM policy and replace its placeholder IP ranges",
        "Choose between App Service and Container Apps",
      ]}
      toc={[
        { id: "deploy", label: "Primary deployment command" },
        { id: "topology", label: "Deployment topology" },
        { id: "appservice", label: "App Service resources" },
        { id: "containerapps", label: "Container Apps resources" },
        { id: "apim-policy", label: "APIM policy & IP ranges" },
        { id: "choose", label: "App Service vs Container Apps" },
      ]}
      summary={
        <ul>
          <li>
            <Code>deploy.ps1</Code> creates the resource group, builds the image
            in ACR, deploys Bicep, and prints the MCP endpoint and connector
            host.
          </li>
          <li>
            Both hosting options put APIM in front and use a Key Vault-backed
            gateway secret.
          </li>
          <li>
            Replace placeholder IP ranges in the APIM policy with connector
            egress / service tags before production.
          </li>
        </ul>
      }
      reviewItems={[
        { id: "deploy", label: "I ran az login and the deploy script" },
        { id: "resources", label: "I can list the resources Bicep creates" },
        { id: "ip", label: "I replaced the placeholder IP ranges (or waived formally)" },
        { id: "choose", label: "I chose App Service or Container Apps deliberately" },
      ]}
    >
      <h2 id="deploy">Primary deployment command</h2>
      <p>From the project root:</p>
      <CodeBlock
        language="powershell"
        code={`az login
.\\scripts\\deploy.ps1 \`
    -ResourceGroup rg-jira-mcp \`
    -Location eastus \`
    -Acr myacr \`
    -PublisherEmail you@example.com`}
      />
      <p>The script:</p>
      <ol>
        <li>Creates the resource group.</li>
        <li>Builds the image in Azure Container Registry.</li>
        <li>Deploys Azure resources with Bicep.</li>
        <li>Prints the MCP endpoint.</li>
        <li>Prints the connector host.</li>
      </ol>
      <p>
        Use Container Apps instead of App Service with the{" "}
        <Code>-Hosting</Code> switch:
      </p>
      <CodeBlock
        language="powershell"
        code={`.\\scripts\\deploy.ps1 \`
    -ResourceGroup rg-jira-mcp \`
    -Location eastus \`
    -Acr myacr \`
    -PublisherEmail you@example.com \`
    -Hosting ContainerApps`}
      />

      <h2 id="topology">Deployment topology</h2>
      <Mermaid
        chart={DEPLOY}
        alt="Azure Container Registry provides the image to the host (App Service or Container Apps). The host sits behind API Management. Key Vault provides secrets to both API Management and the host. The host sends telemetry to Application Insights. API Management is consumed by the Copilot Studio connector."
        caption="Both hosting options share this shape: ACR → host → APIM → connector, with Key Vault and App Insights alongside."
      />

      <h2 id="appservice">App Service deployment resources</h2>
      <p>
        <Code>infra\\main.bicep</Code> creates:
      </p>
      <Table
        headers={["Resource", "Purpose"]}
        rows={[
          ["Log Analytics workspace", "Stores logs."],
          ["Application Insights", "App telemetry."],
          ["Key Vault", "Gateway secret."],
          ["Linux App Service plan", "Hosts the container."],
          ["Linux Web App", "Runs the MCP container."],
          ["Autoscale setting", "Scales the App Service plan."],
          ["API Management", "Public gateway."],
          ["APIM named value", "Secret reference to Key Vault."],
          ["APIM API and operation", "Exposes /jira-mcp/mcp."],
          ["APIM policy", "Security and routing policy."],
        ]}
      />

      <h2 id="containerapps">Container Apps deployment resources</h2>
      <p>
        <Code>infra\\containerapp.bicep</Code> creates:
      </p>
      <Table
        headers={["Resource", "Purpose"]}
        rows={[
          ["User-assigned managed identity", "Pulls the ACR image and reads the Key Vault secret."],
          ["Log Analytics workspace", "Container logs."],
          ["Application Insights", "App telemetry."],
          ["Key Vault", "Gateway secret."],
          ["Container Apps environment", "Hosting environment."],
          ["Container App", "Runs the MCP container."],
          ["API Management", "Public gateway."],
          ["APIM policy", "Security and routing."],
        ]}
      />

      <h2 id="apim-policy">APIM policy & IP ranges</h2>
      <p>
        The policy in <Code>infra\\apim-policy.xml</Code> restricts origins via
        CORS, includes placeholder IP allow-list ranges, rate limits and applies
        a daily quota by IP, requires an Authorization header, injects{" "}
        <Code>X-Gateway-Token</Code>, adds hardening headers, and deletes
        sensitive headers on error paths.
      </p>
      <Callout variant="warning" title="Replace the placeholder IP ranges">
        Before production, replace the placeholder range:
        <CodeBlock
          language="xml"
          code={`<address-range from="REPLACE_START_IP" to="REPLACE_END_IP" />`}
        />
        with the Power Platform / Azure connector egress ranges for your region,
        or manage equivalent restrictions through service tags or approved
        networking controls.
      </Callout>
      <p>Find the service tag ranges for your region:</p>
      <CodeBlock
        language="powershell"
        code={`az network list-service-tags --location eastus \`
  --query "values[?name=='AzureConnectors.EastUS'].properties.addressPrefixes" -o json`}
      />

      <h2 id="choose">App Service vs Container Apps</h2>
      <Compare
        betterLabel="App Service — choose when"
        worseLabel="Container Apps — choose when"
        rows={[
          {
            better: "You want a familiar web-app hosting model",
            worse: "You want container-native scaling and revisions",
          },
          {
            better: "You value built-in health checks and simple ops",
            worse: "You want HTTP-concurrency-based scaling",
          },
        ]}
      />
      <Callout variant="production">
        Both can be production-ready. Keep APIM in front either way — the gateway
        is part of the security model, not an optional extra.
      </Callout>

      <ConceptCheck
        question={
          <p>
            Deployment succeeds, the app&apos;s own <Code>/healthz</Code> works,
            but calls through APIM fail. The APIM policy still has{" "}
            <Code>REPLACE_START_IP</Code>. What&apos;s happening?
          </p>
        }
        answer={
          <p>
            The placeholder IP allow-list is still active, so APIM rejects
            traffic that doesn&apos;t fall in the (nonsensical) placeholder
            range. Replace the range with your connector egress / service-tag
            ranges, or temporarily remove the IP filter while you validate, then
            restore a real restriction before production.
          </p>
        }
      />
    </ChapterShell>
  );
}
