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
    title: "Building Plug-ins for Copilot Cowork — Learn by Building",
    navTitle: "Home",
    group: "Get Started",
    summary:
      "A beginner-friendly path to extending Microsoft Copilot Cowork with plug-ins that connect to enterprise systems through MCP.",
    keywords: ["home", "overview", "introduction", "start", "cowork", "plugin"],
  },
  {
    slug: "before-you-begin",
    title: "Before You Begin",
    navTitle: "Before You Begin",
    group: "Get Started",
    summary:
      "A plain-English primer on plug-ins, skills, connectors, MCP, and the words you'll meet so nothing feels like jargon later.",
    keywords: [
      "prerequisites",
      "primer",
      "beginner",
      "plugin",
      "skill",
      "connector",
      "mcp",
      "oauth",
      "cowork",
    ],
  },
  {
    slug: "quickstart",
    title: "Quickstart: Your First Plug-in",
    navTitle: "Quickstart",
    group: "Get Started",
    summary:
      "Use the Microsoft 365 Agents Toolkit to scaffold a declarative agent, attach an MCP server action, fetch a tool, and run it in Copilot.",
    keywords: [
      "quickstart",
      "first success",
      "agents toolkit",
      "declarative agent",
      "mcp server",
      "ai-plugin.json",
      "sideload",
      "vs code",
    ],
  },
  {
    slug: "concepts",
    title: "Core Concepts: Plug-ins, Skills & MCP Connections",
    navTitle: "Core Concepts",
    group: "Understand",
    summary:
      "Plug-ins vs skills vs connectors, the components of an MCP connection, streamable HTTP, tools, UI widgets, and how Cowork discovers them.",
    keywords: [
      "plugin",
      "skill",
      "connector",
      "mcp connection",
      "components",
      "tool",
      "streamable http",
      "widget",
      "declarative agent",
    ],
  },
  {
    slug: "architecture",
    title: "Architecture & Request Lifecycle",
    navTitle: "Architecture",
    group: "Understand",
    summary:
      "How a user's ask travels from Copilot Cowork through the plug-in's MCP connection to Salesforce, ServiceNow, or Jira — and back.",
    keywords: [
      "architecture",
      "request lifecycle",
      "sequence diagram",
      "data flow",
      "identity",
      "mcp connection",
      "cowork",
    ],
  },
  {
    slug: "environment",
    title: "Development Environment",
    navTitle: "Dev Environment",
    group: "Build",
    summary:
      "Required software — VS Code, the Microsoft 365 Agents Toolkit, Python, Azure CLI, Node.js — and the tenant access a plug-in builder needs.",
    keywords: [
      "vs code",
      "agents toolkit",
      "python",
      "azure cli",
      "node",
      "m365",
      "extensions",
      "setup",
    ],
  },
  {
    slug: "anatomy",
    title: "Anatomy of a Cowork Plug-in & Its MCP Connection",
    navTitle: "Plug-in Anatomy",
    group: "Build",
    summary:
      "The deep dive: every component of a plug-in package and the MCP connection inside it — manifest, declarative agent, action, MCP server, tools, widgets, and auth binding.",
    keywords: [
      "anatomy",
      "manifest",
      "declarative agent",
      "ai-plugin.json",
      "mcp.json",
      "action",
      "mcp server",
      "components",
      "auth binding",
    ],
  },
  {
    slug: "implementation",
    title: "Implementation: Build the MCP Server & Plug-in",
    navTitle: "Implementation",
    group: "Build",
    summary:
      "Build a Python MCP server with FastMCP, define tools, wire delegated auth, trim payloads, and package it as a Cowork plug-in.",
    keywords: [
      "server.py",
      "fastmcp",
      "config",
      "tool",
      "delegated token",
      "trim",
      "ai-plugin.json",
      "manifest",
      "python",
    ],
  },
  {
    slug: "local-dev",
    title: "Local Development & Testing the Connection",
    navTitle: "Local Development",
    group: "Build",
    summary:
      "Run the MCP server locally, inspect tools with MCP Inspector, fetch the action in the Agents Toolkit, and sideload into Copilot.",
    keywords: [
      "run_local",
      "mcp inspector",
      "fetch action",
      "sideload",
      "healthz",
      "pytest",
      "smoke test",
    ],
  },
  {
    slug: "build-your-own",
    title: "Build Your Own Plug-in for Any System",
    navTitle: "Build Your Own",
    group: "Build",
    summary:
      "A repeatable method to design tools, choose an MCP connection type, pick an auth mode, and ship a plug-in for any enterprise system.",
    keywords: [
      "method",
      "steps",
      "tool design",
      "connection type",
      "authentication model",
      "scaffold",
    ],
  },
  {
    slug: "copilot-studio",
    title: "Register & Publish the Plug-in in Copilot Cowork",
    navTitle: "Register & Publish",
    group: "Integrate & Ship",
    summary:
      "Provision the plug-in with the Agents Toolkit, register the OAuth app, sideload for testing, then publish and govern it for your tenant.",
    keywords: [
      "cowork",
      "publish",
      "provision",
      "oauth app",
      "static registration",
      "sideload",
      "admin center",
      "governance",
    ],
  },
  {
    slug: "deployment",
    title: "Azure Deployment of the MCP Server",
    navTitle: "Deployment",
    group: "Integrate & Ship",
    summary:
      "Host the remote MCP server on Azure with Bicep — Container Apps or App Service — fronted by APIM, with secrets in Key Vault.",
    keywords: [
      "azure",
      "bicep",
      "container apps",
      "app service",
      "apim",
      "key vault",
      "remote mcp",
      "deploy",
    ],
  },
  {
    slug: "security",
    title: "MCP Connection Types & Authentication",
    navTitle: "Connection Types & Auth",
    group: "Operate",
    summary:
      "The connection types Cowork plug-ins support — anonymous, API key, OAuth 2.1, and Entra SSO — when to use each, and how to set them up safely.",
    keywords: [
      "connection type",
      "authentication",
      "anonymous",
      "api key",
      "oauth",
      "entra sso",
      "delegated",
      "security",
      "remote mcp",
    ],
  },
  {
    slug: "testing",
    title: "Testing Strategy",
    navTitle: "Testing",
    group: "Operate",
    summary:
      "Unit-test tools, integration-test the MCP connection, and run a deploy-time smoke sequence before publishing the plug-in.",
    keywords: [
      "testing",
      "unit tests",
      "integration tests",
      "smoke",
      "pytest",
      "mcp inspector",
    ],
  },
  {
    slug: "cicd",
    title: "CI/CD",
    navTitle: "CI/CD",
    group: "Operate",
    summary:
      "A GitHub Actions pipeline that tests the MCP server, deploys it to Azure, and packages the plug-in for publishing.",
    keywords: [
      "ci/cd",
      "github actions",
      "pipeline",
      "oidc",
      "package",
      "deployment gates",
    ],
  },
  {
    slug: "troubleshooting",
    title: "Troubleshooting",
    navTitle: "Troubleshooting",
    group: "Operate",
    summary:
      "Decision trees and a symptom-cause-fix table for the most common plug-in and MCP connection failures.",
    keywords: [
      "troubleshooting",
      "401",
      "no tools",
      "consent",
      "cors",
      "payload too large",
      "debug",
    ],
  },
  {
    slug: "extending",
    title: "Example Assets: Salesforce, ServiceNow & Jira Cloud",
    navTitle: "Salesforce · ServiceNow · Jira",
    group: "Operate",
    summary:
      "Three worked example plug-ins — Salesforce, ServiceNow, and Jira Cloud — each with an MCP connection, tools, a skill, and auth setup.",
    keywords: [
      "salesforce",
      "servicenow",
      "jira cloud",
      "example",
      "skill",
      "connection",
      "tools",
      "oauth",
    ],
  },
  {
    slug: "checklist",
    title: "Production Readiness Checklist",
    navTitle: "Production Checklist",
    group: "Reference",
    summary:
      "An interactive checklist across the plug-in package, MCP connection, auth, security, Azure hosting, and publishing.",
    keywords: ["checklist", "production", "readiness", "go-live", "review"],
  },
  {
    slug: "glossary",
    title: "Glossary & Principles",
    navTitle: "Glossary",
    group: "Reference",
    summary:
      "Plain-English definitions of every key term, plus the final principles for building extensible Cowork plug-ins.",
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
