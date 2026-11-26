import type { Metadata, ResolvingMetadata } from "next";
import { Backdrop } from "@/components/Backdrop";
import { LegalDocument } from "@/components/LegalDocument";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";
import { offer } from "@/lib/offer";
import { termsPage } from "@/lib/legal";

// The agreement between people who use the site and the company that runs it. The words are in
// lib/legal.ts.
// Its own address, description and link preview words, so search results and shared links describe this page
// instead of repeating the landing page's. The description is the page's opening paragraph. Setting openGraph
// and twitter here replaces the site's, so the share image from app/opengraph-image.tsx is carried over by hand.
export async function generateMetadata(_: PageProps<"/terms">, parent: ResolvingMetadata): Promise<Metadata> {
  const title = `${termsPage.title} · ${offer.name}`;
  const description = termsPage.intro;
  const { openGraph, twitter } = await parent;
  return {
    title,
    description,
    alternates: { canonical: "/terms" },
    openGraph: { title, description, url: "/terms", siteName: offer.name, type: "website", images: openGraph?.images },
    twitter: { card: "summary_large_image", title, description, images: twitter?.images },
  };
}

export default function Page() {
  return (
    <>
      <Backdrop progress={0.15} />
      <SiteNav cta={false} login />
      <main id="main" className="legal-page">
        <LegalDocument page={termsPage} />
      </main>
      <SiteFooter />
    </>
  );
}
