import { ChapterShell } from "@/components/ChapterShell";
import { Callout } from "@/components/Callout";
import { CodeBlock } from "@/components/CodeBlock";
import { ConceptCheck } from "@/components/ConceptCheck";
import { Mermaid } from "@/components/Mermaid";
import { Table, Code, Compare } from "@/components/content";
import { VideoCard } from "@/components/VideoCard";

export const metadata = { title: "Deployment" };

export default function Page() {
  return (
    <ChapterShell
      slug="deployment"
      eyebrow="Chapter 9 · Ship"
      title="Deploy the MCP Server to Azure"
      intro="Your MCP server runs locally — now it needs a production home. This chapter shows how to host it on Azure with Bicep infrastructure-as-code, put API Management in front, store secrets in Key Vault, and deploy with azd or the Azure CLI."
      learningGoals={[
        "Choose between Container Apps and App Service for hosting",
        "Write Bicep to provision the MCP server infrastructure",
        "Place API Management in front of the MCP endpoint",
        "Store and reference secrets in Azure Key Vault",
        "Deploy with azd up or az CLI commands",
      ]}
      toc={[
        { id: "targets", label: "Hosting targets" },
        { id: "bicep", label: "Bicep IaC" },
        { id: "apim", label: "API Management" },
        { id: "key-vault", label: "Key Vault" },
        { id: "deploy", label: "Deploy" },
        { id: "verify", label: "Verify" },
      ]}
      summary={
        <ul>
          <li>
            <strong>Container Apps</strong> is the default choice for MCP servers
            (scale-to-zero, container-native).
          </li>
          <li>
            <strong>Bicep</strong> defines the infrastructure declaratively and
            reproducibly.
          </li>
          <li>
            <strong>API Management</strong> adds rate-limiting, observability,
            and a stable public URL.
          </li>
          <li>
            <strong>Key Vault</strong> stores secrets; the app reads them at
            runtime via managed identity.
          </li>
          <li>
            <Code>azd up</Code> provisions and deploys in one command.
          </li>
        </ul>
      }
      reviewItems={[
        { id: "target", label: "I can choose the right hosting target" },
        { id: "bicep", label: "I can read and extend the Bicep template" },
        { id: "apim", label: "I understand why APIM sits in front" },
        { id: "kv", label: "I know how secrets flow from Key Vault to the app" },
        { id: "dep", label: "I can deploy with azd up" },
      ]}
    >
      <h2 id="targets">Hosting targets</h2>
      <p>
        Azure offers several compute options, but for a stateless MCP server
        exposed over streamable HTTP, two stand out: Azure Container Apps and
        Azure App Service. Both support HTTPS, custom domains, and managed
        identity.
      </p>
      <Compare
        betterLabel="Container Apps (recommended)"
        worseLabel="App Service"
        rows={[
          {
            better: "Scale-to-zero: no traffic, no cost",
            worse: "Always-on by default (B1+ plan)",
          },
          {
            better: "Container-native: ship a Dockerfile, no runtime config",
            worse: "Requires selecting a Python runtime stack",
          },
          {
            better: "Built-in Dapr, KEDA, and revision-based traffic splitting",
            worse: "Deployment slots for traffic splitting (fewer options)",
          },
          {
            better: "Ideal for event-driven, stateless workloads",
            worse: "Better for long-running web apps with persistent connections",
          },
        ]}
      />
      <Callout variant="tip" title="When to choose App Service">
        If your organization already manages App Service Plans and wants to
        consolidate billing, App Service is perfectly fine. The MCP server is
        stateless either way.
      </Callout>

      <h2 id="bicep">Bicep infrastructure-as-code</h2>
      <p>
        Bicep lets you declare the Azure resources your server needs in a single
        file. The template below provisions a Container Apps Environment, a
        Container App for the MCP server, an API Management instance, and a Key
        Vault — all wired together with managed identity.
      </p>
      <CodeBlock
        language="bash"
        filename="infra/main.bicep (skeleton)"
        code={`// main.bicep — core resources for the MCP server
param location string = resourceGroup().location
param envName string

resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2022-10-01' = {
  name: '\${envName}-logs'
  location: location
  properties: { retentionInDays: 30 }
}

resource containerEnv 'Microsoft.App/managedEnvironments@2023-05-01' = {
  name: '\${envName}-env'
  location: location
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logAnalytics.properties.customerId
        sharedKey: logAnalytics.listKeys().primarySharedKey
      }
    }
  }
}

resource mcpApp 'Microsoft.App/containerApps@2023-05-01' = {
  name: '\${envName}-mcp'
  location: location
  identity: { type: 'SystemAssigned' }
  properties: {
    managedEnvironmentId: containerEnv.id
    configuration: {
      ingress: { external: true, targetPort: 8000, transport: 'http' }
    }
    template: {
      containers: [
        {
          name: 'mcp-server'
          image: 'ghcr.io/your-org/cowork-mcp:latest'
          resources: { cpu: '0.5', memory: '1Gi' }
        }
      ]
      scale: { minReplicas: 0, maxReplicas: 5 }
    }
  }
}`}
      />
      <Callout variant="beginner" title="New to Bicep?">
        Bicep is Azure&apos;s domain-specific language for infrastructure. It
        compiles to ARM JSON but is far more readable. Run{" "}
        <Code>az bicep build -f main.bicep</Code> to see the generated template.
      </Callout>

      <h2 id="apim">API Management in front</h2>
      <p>
        Never expose the raw Container App URL to the internet. Place Azure API
        Management (APIM) in front. APIM gives you rate-limiting, request
        validation, usage analytics, and a stable public endpoint that
        doesn&apos;t change when you redeploy.
      </p>
      <CodeBlock
        language="bash"
        filename="infra/apim.bicep (excerpt)"
        code={`resource apim 'Microsoft.ApiManagement/service@2022-08-01' = {
  name: '\${envName}-apim'
  location: location
  sku: { name: 'Consumption', capacity: 0 }
  properties: { publisherEmail: 'admin@contoso.com', publisherName: 'Contoso' }
}

resource mcpApi 'Microsoft.ApiManagement/service/apis@2022-08-01' = {
  parent: apim
  name: 'mcp-server'
  properties: {
    displayName: 'Cowork MCP Server'
    path: 'mcp'
    protocols: [ 'https' ]
    serviceUrl: 'https://\${mcpApp.properties.configuration.ingress.fqdn}'
  }
}`}
      />
      <Table
        headers={["APIM feature", "Why it matters"]}
        rows={[
          [<strong key="a">Rate limiting</strong>, "Prevents abuse; protects your backend from runaway agents"],
          [<strong key="b">Request validation</strong>, "Rejects malformed payloads before they reach your server"],
          [<strong key="c">Usage analytics</strong>, "Shows who calls which tools and how often"],
          [<strong key="d">Stable URL</strong>, "The plug-in references this URL — it never changes on redeploy"],
        ]}
      />

      <h2 id="key-vault">Secrets in Key Vault</h2>
      <p>
        OAuth client secrets, API keys, and database connection strings belong in
        Azure Key Vault — not in environment variables or config files. The
        Container App reads them at runtime through its system-assigned managed
        identity.
      </p>
      <CodeBlock
        language="bash"
        filename="infra/keyvault.bicep (excerpt)"
        code={`resource kv 'Microsoft.KeyVault/vaults@2023-02-01' = {
  name: '\${envName}-kv'
  location: location
  properties: {
    sku: { family: 'A', name: 'standard' }
    tenantId: subscription().tenantId
    enableRbacAuthorization: true
  }
}

// Grant the Container App read access
resource kvRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  scope: kv
  name: guid(kv.id, mcpApp.id, 'Key Vault Secrets User')
  properties: {
    roleDefinitionId: subscriptionResourceId(
      'Microsoft.Authorization/roleDefinitions',
      '4633458b-17de-408a-b874-0445c86b69e6' // Key Vault Secrets User
    )
    principalId: mcpApp.identity.principalId
    principalType: 'ServicePrincipal'
  }
}`}
      />
      <Callout variant="security" title="Never log secrets">
        Even at debug level, never log token values or Key Vault secret
        contents. Log the secret <em>name</em> and whether retrieval succeeded,
        but not the value.
      </Callout>

      <h2 id="deploy">Deploy with azd</h2>
      <p>
        The Azure Developer CLI (<Code>azd</Code>) wraps provisioning and
        deployment into a single command. Point it at your <Code>azure.yaml</Code>{" "}
        and the Bicep templates, then run:
      </p>
      <CodeBlock
        language="bash"
        filename="Terminal"
        code={`# First time: initialize the project
azd init

# Provision infrastructure + deploy application
azd up

# Subsequent deploys (code only, no infra changes)
azd deploy`}
      />
      <p>
        If you prefer the Azure CLI directly:
      </p>
      <CodeBlock
        language="bash"
        filename="Terminal (az CLI alternative)"
        code={`# Deploy Bicep
az deployment group create \\
  --resource-group rg-cowork-mcp \\
  --template-file infra/main.bicep \\
  --parameters envName=prod

# Update container image
az containerapp update \\
  --name prod-mcp \\
  --resource-group rg-cowork-mcp \\
  --image ghcr.io/your-org/cowork-mcp:v1.2.0`}
      />

      <h2 id="verify">Verify the deployment</h2>
      <p>
        After deploying, confirm the MCP server is healthy and reachable through
        APIM. A simple health check and a tool listing call are enough:
      </p>
      <CodeBlock
        language="bash"
        filename="Terminal"
        code={`# Health check (expects 200)
curl -s -o /dev/null -w "%{http_code}" \\
  https://prod-apim.azure-api.net/mcp/health

# List tools via MCP (JSON-RPC)
curl -X POST https://prod-apim.azure-api.net/mcp \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","method":"tools/list","id":1}'`}
      />
      <Mermaid
        alt="Deployment verification flow: curl health check then tool listing"
        chart={`flowchart LR
    A[Developer] -->|curl /health| B[APIM]
    B --> C[Container App]
    C -->|200 OK| B
    B -->|200| A
    A -->|POST /mcp tools/list| B
    B --> C
    C -->|tool list JSON| B
    B -->|response| A`}
        caption="Verify deployment by hitting health and tools/list through APIM"
      />
      <ConceptCheck
        question={
          <p>
            Why place API Management in front of the Container App instead of
            exposing it directly?
          </p>
        }
        answer={
          <p>
            APIM provides rate limiting, request validation, analytics, and a
            stable URL that survives redeployments. Without it, every redeploy
            could change the endpoint, and there&apos;s no protection against
            abuse or malformed requests.
          </p>
        }
      />
      <VideoCard
        verified={false}
        concept="Deploying containerized apps to Azure Container Apps with Bicep"
        level="intermediate"
        searchQuery="Azure Container Apps Bicep deployment tutorial (official Microsoft)"
        why="A walkthrough of the Bicep + azd workflow makes the deploy step feel routine rather than daunting."
      />
    </ChapterShell>
  );
}
