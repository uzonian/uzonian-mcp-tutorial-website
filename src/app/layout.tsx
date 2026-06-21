import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AppShell } from "@/components/AppShell";
import { moduleHomeUrl } from "@/lib/module";

export const metadata: Metadata = {
  // Resolves relative canonical/OpenGraph URLs against this module's mount
  // point inside the hub (e.g. https://uzoniandev.com/mcp-server/).
  metadataBase: new URL(moduleHomeUrl),
  title: {
    default: "Build an MCP Server for Copilot Studio",
    template: "%s · MCP Server Guide",
  },
  description:
    "A beginner-friendly, production-grade learning path for building Model Context Protocol (MCP) servers with Python, VS Code on Windows, Azure, APIM, Key Vault, Atlassian OAuth, and Microsoft Copilot Studio.",
  applicationName: "MCP Server Implementation Guide",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Uzonian Dev Tutorials",
    title: "Build an MCP Server for Copilot Studio",
    description:
      "Design, build, secure, test, deploy, and operate a production-ready MCP server in Python and connect it to Microsoft Copilot Studio.",
  },
  keywords: [
    "MCP",
    "Model Context Protocol",
    "Copilot Studio",
    "Azure",
    "APIM",
    "Key Vault",
    "Atlassian OAuth",
    "FastMCP",
    "Python",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-azure-600 focus:px-4 focus:py-2 focus:text-white"
          >
            Skip to content
          </a>
          <AppShell>
            <div id="main-content">{children}</div>
          </AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
