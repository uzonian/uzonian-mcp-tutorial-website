import { ChapterShell } from "@/components/ChapterShell";
import { Callout } from "@/components/Callout";
import { Mermaid } from "@/components/Mermaid";
import { ConceptCheck } from "@/components/ConceptCheck";
import { Code } from "@/components/content";

export const metadata = { title: "CI/CD" };

const PIPELINE = `flowchart LR
    A[Pull request] --> B[Install]
    B --> C[Lint]
    C --> D[Compile]
    D --> E[Unit tests]
    E --> F[Connector schema validation]
    F --> G[Bicep validation]
    G --> H[Docker build]
    H --> I[Secret scan]
    I --> J[Merge]
    J --> K[Deploy dev with OIDC]
    K --> L[Post-deploy smoke]
    L --> M[Manual approval]
    M --> N[Deploy prod]
    N --> O[Prod smoke]`;

export default function Page() {
  return (
    <ChapterShell
      slug="cicd"
      eyebrow="Chapter 12 · Operate"
      title="CI/CD"
      intro="Automate quality and deployment. The existing workflow lints, compiles, tests, and scans for secrets. The recommended production pipeline adds schema and infrastructure validation, image builds, deployment gates, and post-deploy smoke tests."
      learningGoals={[
        "Understand what the existing CI workflow runs",
        "Design a production pipeline with deployment gates",
        "Explain why GitHub Actions OIDC beats long-lived Azure secrets",
      ]}
      toc={[
        { id: "existing", label: "Existing workflow" },
        { id: "recommended", label: "Recommended pipeline" },
        { id: "oidc", label: "Use OIDC, not stored secrets" },
      ]}
      summary={
        <ul>
          <li>
            Current CI: install, ruff lint, compileall, pytest, gitleaks secret
            scan.
          </li>
          <li>
            Production pipeline adds connector-schema and Bicep validation,
            Docker build, deployment to dev via OIDC, smoke tests, manual
            approval, then prod.
          </li>
          <li>Use OIDC federation instead of storing Azure credentials.</li>
        </ul>
      }
      reviewItems={[
        { id: "existing", label: "I know the seven steps the current CI runs" },
        { id: "gates", label: "I can describe the production pipeline gates" },
        { id: "oidc", label: "I understand why OIDC is preferred" },
      ]}
    >
      <h2 id="existing">The existing workflow</h2>
      <p>
        <Code>.github/workflows/ci.yml</Code> runs, on each change:
      </p>
      <ol>
        <li>checkout</li>
        <li>Python setup</li>
        <li>install the package with dev dependencies</li>
        <li>ruff lint</li>
        <li>compileall syntax check</li>
        <li>pytest</li>
        <li>gitleaks secret scan</li>
      </ol>

      <h2 id="recommended">Recommended production pipeline</h2>
      <Mermaid
        chart={PIPELINE}
        alt="A linear pipeline: pull request triggers install, lint, compile, unit tests, connector schema validation, Bicep validation, Docker build, secret scan, then merge. After merge: deploy to dev with OIDC, run post-deploy smoke tests, require manual approval, deploy to production, then run production smoke tests."
        caption="Every stage is a gate. A failure stops promotion before it reaches production."
      />
      <Callout variant="production">
        The two highest-value additions over basic CI are{" "}
        <strong>connector-schema validation</strong> (catches a broken MCP
        connector before users do) and <strong>post-deploy smoke tests</strong>{" "}
        (catches a bad deploy automatically).
      </Callout>

      <h2 id="oidc">Use OIDC, not stored secrets</h2>
      <Callout variant="security">
        Use <strong>GitHub Actions OIDC</strong> for Azure deployment instead of
        storing Azure credentials as long-lived secrets. OIDC issues short-lived,
        workload-scoped tokens at run time, so there is no standing secret to
        leak or rotate. This mirrors the same principle as the rest of the
        design: avoid standing credentials.
      </Callout>

      <ConceptCheck
        question={
          <p>
            Why place <strong>Bicep validation</strong> and{" "}
            <strong>connector schema validation</strong> <em>before</em> merge,
            rather than only at deploy time?
          </p>
        }
        answer={
          <p>
            Catching infrastructure and connector errors at pull-request time
            keeps broken changes out of the main branch entirely — the cheapest
            place to fix them. Waiting until deploy means a bad change is already
            merged and may block everyone&apos;s pipeline. Shift-left validation
            reduces both risk and lead time.
          </p>
        }
      />
    </ChapterShell>
  );
}
