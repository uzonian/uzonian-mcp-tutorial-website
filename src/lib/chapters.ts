export type ChapterGroup =
  | "Get Started"
  | "Understand"
  | "Build"
  | "Integrate & Ship"
  | "Operate"
  | "Reference";

export interface Chapter {
  slug: string;
  title: string;
  /** Short label used in the sidebar. */
  navTitle: string;
  group: ChapterGroup;
  /** One-line description for cards and search. */
  summary: string;
  /** Keywords to boost local search. */
  keywords: string[];
}

/**
 * Ordered learning path. The order of this array drives the sidebar order
 * and the previous/next navigation on every chapter.
 */
export const chapters: Chapter[] = [
  {
    slug: "",
    title: "MCP Server Implementation — Learn by Building",
    navTitle: "Home",
    group: "Get Started",
    summary:
      "A beginner-friendly path to building production-ready MCP servers for Microsoft Copilot Studio.",
    keywords: ["home", "overview", "introduction", "start"],
  },
  {
    slug: "before-you-begin",
    title: "Before You Begin",
    navTitle: "Before You Begin",
    group: "Get Started",
    summary:
      "A plain-English primer on the words and ideas you'll meet, so nothing feels like jargon later.",
    keywords: [
      "prerequisites",
      "primer",
      "beginner",
      "api",
      "oauth",
      "token",
      "json",
      "terminal",
    ],
  },
  {
    slug: "quickstart",
    title: "Quickstart: Your First Success",
    navTitle: "Quickstart",
    group: "Get Started",
    summary:
      "Install prerequisites, open the project in VS Code, create a virtual environment, run the server, and pass the smoke test.",
    keywords: [
      "quickstart",
      "first success",
      "venv",
      "virtual environment",
      "run_local",
      "smoke test",
      "healthz",
      "vs code",
    ],
  },
  {
    slug: "concepts",
    title: "Core Concepts",
    navTitle: "Core Concepts",
    group: "Understand",
    summary:
      "MCP, tools, streamable HTTP, native MCP vs REST, delegated OAuth 3LO, APIM, Key Vault, and payload trimming.",
    keywords: [
      "mcp",
      "tool",
      "streamable http",
      "native mcp",
      "rest",
      "oauth 3lo",
      "apim",
      "key vault",
      "payload trimming",
      "fastmcp",
    ],
  },
  {
    slug: "architecture",
    title: "Architecture & Request Lifecycle",
    navTitle: "Architecture",
    group: "Understand",
    summary:
      "How a user's question travels from Copilot Studio through APIM to the MCP server and Jira — and back.",
    keywords: [
      "architecture",
      "request lifecycle",
      "sequence diagram",
      "data flow",
      "identity",
      "gateway",
    ],
  },
  {
    slug: "environment",
    title: "Development Environment",
    navTitle: "Dev Environment",
    group: "Build",
    summary:
      "Required software and VS Code extensions for Windows, plus how to open and run the reference project.",
    keywords: [
      "windows",
      "vs code",
      "python",
      "azure cli",
      "node",
      "docker",
      "extensions",
      "setup",
    ],
  },
  {
    slug: "anatomy",
    title: "Repository Anatomy & Python Basics",
    navTitle: "Repo & Python",
    group: "Build",
    summary:
      "A guided tour of the project folders and the handful of Python ideas you need to read the code.",
    keywords: [
      "repository",
      "folder structure",
      "module",
      "package",
      "async",
      "pydantic",
      "context manager",
      "environment variable",
    ],
  },
  {
    slug: "implementation",
    title: "Implementation Walkthrough",
    navTitle: "Implementation",
    group: "Build",
    summary:
      "Layer by layer: server entry point, config, request-scoped tokens, middleware, auth, Jira client, trimming, tools.",
    keywords: [
      "server.py",
      "config",
      "contextvar",
      "middleware",
      "bearer",
      "jira client",
      "trim",
      "tool registration",
      "telemetry",
      "error envelope",
    ],
  },
  {
    slug: "local-dev",
    title: "Local Development Workflow",
    navTitle: "Local Development",
    group: "Build",
    summary:
      "Start the server, validate health, run the smoke test, use MCP Inspector, and run tests and lint.",
    keywords: [
      "run_local",
      "healthz",
      "readyz",
      "smoke",
      "mcp inspector",
      "pytest",
      "ruff",
    ],
  },
  {
    slug: "build-your-own",
    title: "Build Your Own MCP Server",
    navTitle: "Build Your Own",
    group: "Build",
    summary:
      "The repeatable 15-step method to design tools, auth, trimming, tests, and a connector for any system.",
    keywords: [
      "scaffold",
      "method",
      "steps",
      "tool design",
      "authentication model",
      "dependencies",
    ],
  },
  {
    slug: "copilot-studio",
    title: "Copilot Studio & Atlassian OAuth",
    navTitle: "Copilot Studio & OAuth",
    group: "Integrate & Ship",
    summary:
      "Create the Atlassian OAuth app, import the MCP connector, and add it to a Copilot Studio agent.",
    keywords: [
      "copilot studio",
      "atlassian",
      "oauth app",
      "connector",
      "swagger",
      "x-ms-agentic-protocol",
      "offline_access",
      "scopes",
    ],
  },
  {
    slug: "deployment",
    title: "Azure Deployment",
    navTitle: "Deployment",
    group: "Integrate & Ship",
    summary:
      "Deploy with Bicep to App Service or Container Apps, front it with APIM, and configure the gateway policy.",
    keywords: [
      "azure",
      "bicep",
      "app service",
      "container apps",
      "apim policy",
      "deploy.ps1",
      "acr",
      "service tags",
    ],
  },
  {
    slug: "security",
    title: "Security Model",
    navTitle: "Security",
    group: "Operate",
    summary:
      "Non-negotiable rules, the identity flow, a threat model, and how to run a safe read-only deployment.",
    keywords: [
      "security",
      "threat model",
      "delegated token",
      "service account",
      "pat",
      "cors",
      "read-only",
    ],
  },
  {
    slug: "testing",
    title: "Testing Strategy",
    navTitle: "Testing",
    group: "Operate",
    summary:
      "Existing unit tests, the tests to add before production, and a deploy-time smoke sequence.",
    keywords: [
      "testing",
      "unit tests",
      "integration tests",
      "smoke",
      "pytest",
      "coverage",
    ],
  },
  {
    slug: "cicd",
    title: "CI/CD",
    navTitle: "CI/CD",
    group: "Operate",
    summary:
      "The current GitHub Actions workflow and a recommended production pipeline with deployment gates.",
    keywords: [
      "ci/cd",
      "github actions",
      "pipeline",
      "oidc",
      "gitleaks",
      "deployment gates",
    ],
  },
  {
    slug: "troubleshooting",
    title: "Troubleshooting",
    navTitle: "Troubleshooting",
    group: "Operate",
    summary:
      "Decision trees and a symptom-cause-fix table for the most common failures.",
    keywords: [
      "troubleshooting",
      "401",
      "403",
      "origin blocked",
      "payload too large",
      "connector",
      "debug",
    ],
  },
  {
    slug: "extending",
    title: "Extending the Server",
    navTitle: "Extending",
    group: "Operate",
    summary:
      "Add new read and write tools safely, and port the whole pattern to another enterprise system.",
    keywords: [
      "extending",
      "new tool",
      "read tool",
      "write tool",
      "port",
      "salesforce",
      "servicenow",
    ],
  },
  {
    slug: "checklist",
    title: "Production Readiness Checklist",
    navTitle: "Production Checklist",
    group: "Reference",
    summary:
      "An interactive checklist across MCP, OAuth, security, payload, Azure, and CI/CD.",
    keywords: ["checklist", "production", "readiness", "go-live", "review"],
  },
  {
    slug: "glossary",
    title: "Glossary & Principles",
    navTitle: "Glossary",
    group: "Reference",
    summary:
      "Plain-English definitions of every key term, plus the final implementation principles.",
    keywords: ["glossary", "definitions", "terms", "principles"],
  },
  {
    slug: "search",
    title: "Search",
    navTitle: "Search",
    group: "Reference",
    summary: "Search every chapter, concept, and glossary term locally.",
    keywords: ["search", "find", "lookup"],
  },
];

export const learningPath = chapters.filter(
  (c) => c.slug !== "search" && c.slug !== ""
);

export function chapterBySlug(slug: string): Chapter | undefined {
  return chapters.find((c) => c.slug === slug);
}

/** Returns the previous and next chapters for a given slug (skips Search). */
export function siblings(slug: string): {
  prev?: Chapter;
  next?: Chapter;
} {
  const path = chapters.filter((c) => c.slug !== "search");
  const index = path.findIndex((c) => c.slug === slug);
  if (index === -1) return {};
  return {
    prev: index > 0 ? path[index - 1] : undefined,
    next: index < path.length - 1 ? path[index + 1] : undefined,
  };
}

export const groupOrder: ChapterGroup[] = [
  "Get Started",
  "Understand",
  "Build",
  "Integrate & Ship",
  "Operate",
  "Reference",
];
