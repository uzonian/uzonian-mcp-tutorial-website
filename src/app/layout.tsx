import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AppShell } from "@/components/AppShell";

export const metadata: Metadata = {
  title: {
    default: "Building Plug-ins for Copilot Cowork",
    template: "%s · Copilot Cowork Plug-ins Guide",
  },
  description:
    "A beginner-friendly, extensibility-first learning path for building Microsoft Copilot Cowork plug-ins: the components of an MCP connection, the connection types Cowork supports, and worked example plug-ins for Salesforce, ServiceNow, and Jira Cloud — built with Python, FastMCP, Azure, and the Microsoft 365 Agents Toolkit.",
  applicationName: "Copilot Cowork Plug-ins Guide",
  keywords: [
    "Copilot Cowork",
    "Microsoft 365 Copilot",
    "plug-in",
    "MCP",
    "Model Context Protocol",
    "declarative agent",
    "Agents Toolkit",
    "Salesforce",
    "ServiceNow",
    "Jira Cloud",
    "Azure",
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
