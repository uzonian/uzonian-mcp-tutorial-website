import { ChapterShell } from "@/components/ChapterShell";
import { Callout } from "@/components/Callout";
import { CodeBlock } from "@/components/CodeBlock";
import { Table, Code } from "@/components/content";
import { Mermaid } from "@/components/Mermaid";
import { VideoCard } from "@/components/VideoCard";

export const metadata = { title: "CI/CD Pipeline" };

export default function Page() {
  return (
    <ChapterShell
      slug="cicd"
      eyebrow="Chapter 13 · Ship"
      title="CI/CD Pipeline for Cowork Plug-ins"
      intro="A reliable pipeline tests your MCP server, deploys it to Azure using OIDC (no stored secrets), and packages the plug-in for publishing — all from a single push to main."
      learningGoals={[
        "Set up a GitHub Actions workflow that tests, deploys, and packages a Cowork plug-in",
        "Use OIDC federated credentials instead of stored Azure secrets",
        "Understand the stages a plug-in passes through on its way to production",
        "Package the plug-in manifest for Teams Admin Center publishing",
      ]}
      toc={[
        { id: "pipeline", label: "Pipeline overview" },
        { id: "stages", label: "Stages" },
        { id: "secrets", label: "Secrets & OIDC" },
        { id: "package-step", label: "Package step" },
      ]}
      summary={
        <ul>
          <li key="s1">
            The pipeline has four stages: <strong>lint &amp; test</strong>,{" "}
            <strong>build &amp; push image</strong>, <strong>deploy to Azure</strong>,
            and <strong>package plug-in</strong>.
          </li>
          <li key="s2">
            OIDC federated credentials eliminate stored secrets for Azure
            deployments.
          </li>
          <li key="s3">
            The package step zips the manifest for Teams Admin Center upload.
          </li>
        </ul>
      }
    >
      <h2 id="pipeline">Pipeline overview</h2>
      <p>
        Every push to <Code>main</Code> triggers a workflow that validates code
        quality, runs unit and smoke tests against the MCP server, deploys the
        container to Azure Container Apps, and finally zips the plug-in manifest
        for publishing through Teams Admin Center.
      </p>
      <Mermaid
        chart={`graph LR
  A[Push to main] --> B[Lint & Test]
  B --> C[Build & Push Image]
  C --> D[Deploy to Azure]
  D --> E[Package Plug-in]`}
        alt="Pipeline flows from push to main through lint and test, build and push image, deploy to Azure, and package plug-in stages."
        caption="End-to-end CI/CD pipeline for a Cowork plug-in"
      />

      <h2 id="stages">Stages</h2>
      <p>
        Each stage is a separate job in the workflow so failures are isolated and
        the pipeline can fan out where dependencies allow. Here is what each
        stage does and which tools it uses.
      </p>
      <Table
        headers={["Stage", "What it does", "Key tools"]}
        rows={[
          [
            <strong key="a">Lint &amp; Test</strong>,
            "Runs ruff lint, mypy type checks, pytest unit tests, and the MCP smoke sequence.",
            <Code key="a2">ruff, mypy, pytest</Code>,
          ],
          [
            <strong key="b">Build &amp; Push Image</strong>,
            "Builds the Docker image and pushes to Azure Container Registry.",
            <Code key="b2">docker/build-push-action</Code>,
          ],
          [
            <strong key="c">Deploy to Azure</strong>,
            "Deploys the new image to Azure Container Apps using az containerapp update.",
            <Code key="c2">az containerapp update</Code>,
          ],
          [
            <strong key="d">Package Plug-in</strong>,
            "Zips manifest.json, declarativeAgent.json, ai-plugin.json, and icons into a .zip for publishing.",
            <Code key="d2">zip</Code>,
          ],
        ]}
      />
      <CodeBlock
        language="yaml"
        filename=".github/workflows/deploy.yml"
        code={`name: Deploy Cowork MCP Plug-in

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  id-token: write
  contents: read

jobs:
  lint-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - run: pip install -r requirements.txt -r requirements-dev.txt
      - run: ruff check .
      - run: mypy src/
      - run: pytest tests/ -v

  build-push:
    needs: lint-test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: azure/login@v2
        with:
          client-id: \${{ secrets.AZURE_CLIENT_ID }}
          tenant-id: \${{ secrets.AZURE_TENANT_ID }}
          subscription-id: \${{ secrets.AZURE_SUBSCRIPTION_ID }}
      - run: az acr login --name \${{ vars.ACR_NAME }}
      - uses: docker/build-push-action@v6
        with:
          push: true
          tags: \${{ vars.ACR_NAME }}.azurecr.io/cowork-mcp:latest

  deploy:
    needs: build-push
    runs-on: ubuntu-latest
    steps:
      - uses: azure/login@v2
        with:
          client-id: \${{ secrets.AZURE_CLIENT_ID }}
          tenant-id: \${{ secrets.AZURE_TENANT_ID }}
          subscription-id: \${{ secrets.AZURE_SUBSCRIPTION_ID }}
      - run: |
          az containerapp update \\
            --name \${{ vars.APP_NAME }} \\
            --resource-group \${{ vars.RESOURCE_GROUP }} \\
            --image \${{ vars.ACR_NAME }}.azurecr.io/cowork-mcp:latest

  package:
    needs: deploy
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: |
          mkdir -p dist
          zip -j dist/plugin.zip \\
            plugins/\${{ vars.PLUGIN_SYSTEM }}/manifest.json \\
            plugins/\${{ vars.PLUGIN_SYSTEM }}/declarativeAgent.json \\
            plugins/\${{ vars.PLUGIN_SYSTEM }}/ai-plugin.json \\
            plugins/\${{ vars.PLUGIN_SYSTEM }}/color.png \\
            plugins/\${{ vars.PLUGIN_SYSTEM }}/outline.png
      - uses: actions/upload-artifact@v4
        with:
          name: plugin-package
          path: dist/plugin.zip`}
      />

      <h2 id="secrets">Secrets &amp; OIDC</h2>
      <p>
        The pipeline authenticates to Azure using <strong>OIDC federated
        credentials</strong> — no client secret is stored in GitHub. You set up a
        federated identity credential on an Entra ID app registration that trusts
        your repository&apos;s GitHub Actions identity token.
      </p>
      <Callout variant="security" title="No stored secrets for Azure">
        OIDC means no long-lived credentials exist in your repository settings.
        The token is short-lived and scoped to the specific workflow run. Store
        only <Code>AZURE_CLIENT_ID</Code>, <Code>AZURE_TENANT_ID</Code>, and{" "}
        <Code>AZURE_SUBSCRIPTION_ID</Code> as repository secrets — none of these
        are sensitive on their own.
      </Callout>
      <Table
        headers={["Secret / Variable", "Purpose", "Sensitive?"]}
        rows={[
          [<Code key="1">AZURE_CLIENT_ID</Code>, "Entra app registration client ID", "Low — not a credential alone"],
          [<Code key="2">AZURE_TENANT_ID</Code>, "Your Entra tenant ID", "Low"],
          [<Code key="3">AZURE_SUBSCRIPTION_ID</Code>, "Azure subscription hosting the resources", "Low"],
          [<Code key="4">ACR_NAME</Code>, "Container registry name (variable, not secret)", "No"],
          [<Code key="5">APP_NAME</Code>, "Container App name (variable)", "No"],
          [<Code key="6">RESOURCE_GROUP</Code>, "Azure resource group (variable)", "No"],
        ]}
      />
      <CodeBlock
        language="bash"
        filename="Setup OIDC trust (run once)"
        code={`# Create federated credential on the app registration
az ad app federated-credential create \\
  --id <APP_OBJECT_ID> \\
  --parameters '{
    "name": "github-actions-main",
    "issuer": "https://token.actions.githubusercontent.com",
    "subject": "repo:YOUR_ORG/YOUR_REPO:ref:refs/heads/main",
    "audiences": ["api://AzureADTokenExchange"]
  }'`}
      />

      <h2 id="package-step">Package step</h2>
      <p>
        After a successful deploy, the pipeline zips the plug-in manifest files
        into a single archive ready for upload to the Teams Admin Center. This
        package includes the app manifest, declarative agent definition, action
        descriptor, and icons.
      </p>
      <Callout variant="tip" title="Validate before upload">
        Use the <Code>teamsapp validate</Code> command from the Teams Toolkit CLI
        to catch manifest issues before uploading to the Admin Center.
      </Callout>
      <CodeBlock
        language="bash"
        code={`# Validate the package locally before upload
npx @microsoft/teamsapp-cli validate --app-package-file dist/plugin.zip`}
      />
      <VideoCard
        verified={false}
        concept="GitHub Actions OIDC with Azure for zero-secret deployments"
        searchQuery="GitHub Actions OIDC Azure federated credentials deploy (Microsoft official)"
        why="Seeing the OIDC flow end-to-end demystifies the zero-secret deployment model."
      />
    </ChapterShell>
  );
}
