import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { HubShell } from "@/components/HubShell";

const hubUrl = (
  process.env.NEXT_PUBLIC_HUB_URL ?? "https://uzoniandev.com"
).replace(/\/+$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(`${hubUrl}/`),
  title: {
    default: "Uzonian Dev Tutorials",
    template: "%s · Uzonian Dev Tutorials",
  },
  description:
    "Hands-on, production-grade tutorial modules for developers — build real systems with Python, Azure, and Microsoft Copilot Studio, one focused module at a time.",
  applicationName: "Uzonian Dev Tutorials",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Uzonian Dev Tutorials",
    title: "Uzonian Dev Tutorials",
    description:
      "A growing hub of hands-on, production-grade tutorial modules for developers.",
  },
  keywords: [
    "tutorials",
    "developer tutorials",
    "MCP",
    "Copilot Studio",
    "Azure",
    "Python",
    "RAG",
    "CI/CD",
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
          <HubShell>{children}</HubShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
