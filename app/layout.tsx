import type { Metadata, Viewport } from "next";
import { PageBehavior } from "@/components/PageBehavior";
import { offer } from "@/lib/offer";
import { siteUrl } from "@/lib/site";
import "./globals.css";

// The title, description and link preview words come from lib/offer.ts, like the share image and the icons.
const title = `${offer.name} · ${offer.meta.title}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title,
  description: offer.meta.description,
  openGraph: {
    title,
    description: offer.meta.description,
    siteName: offer.name,
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
