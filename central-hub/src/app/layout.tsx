import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";

const HUB_URL = "https://uzoniandev.com";

export const metadata: Metadata = {
  metadataBase: new URL(HUB_URL),
  title: {
    default: "Uzonian Dev Tutorials",
    template: "%s · Uzonian Dev Tutorials",
  },
  description:
    "Hands-on, production-grade tutorial modules for developers — from building MCP servers for Copilot Studio to RAG pipelines and AI agents on Azure.",
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
      "A growing library of hands-on, production-grade tutorial modules for developers.",
  },
  keywords: [
    "tutorials",
    "MCP",
    "Copilot Studio",
    "Azure",
    "RAG",
    "AI agents",
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
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
