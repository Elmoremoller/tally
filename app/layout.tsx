import type { Metadata, Viewport } from "next";
import { PageBehavior } from "@/components/PageBehavior";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const description = "A personal plan built around how you two fight, so you know what to do next.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: "The Couple Standard · Fight less, make up faster",
  description,
  openGraph: {
    title: "The Couple Standard · Fight less, make up faster",
    description,
    siteName: "The Couple Standard",
    type: "website",
  },
};

export const viewport: Viewport = {
  // Matches --warm-white, so the browser chrome blends into the page.
  themeColor: "#f9f5ed",
  colorScheme: "light",
};

// Without JavaScript the questions cannot be toggled, so every answer is shown.
const noScriptStyles = ".qa .qa-a{grid-template-rows:1fr}.qa .qa-a>div{visibility:visible}";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // Next pauses smooth scrolling during route changes only when this attribute is present.
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <noscript dangerouslySetInnerHTML={{ __html: `<style>${noScriptStyles}</style>` }} />
      </head>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        {children}
        <PageBehavior />
      </body>
    </html>
  );
}
