import type { Metadata, ResolvingMetadata } from "next";
import { Backdrop } from "@/components/Backdrop";
import { LegalDocument } from "@/components/LegalDocument";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";
import { offer } from "@/lib/offer";
import { privacyPage } from "@/lib/legal";

// What we keep, why, who else sees it, and what people can ask us to do. The words are in lib/legal.ts.
// Its own address, description and link preview words, so search results and shared links describe this page
// instead of repeating the landing page's. The description is the page's opening paragraph. Setting openGraph
// and twitter here replaces the site's, so the share image from app/opengraph-image.tsx is carried over by hand.
export async function generateMetadata(_: PageProps<"/privacy">, parent: ResolvingMetadata): Promise<Metadata> {
  const title = `${privacyPage.title} · ${offer.name}`;
  const description = privacyPage.intro;
  const { openGraph, twitter } = await parent;
  return {
    title,
    description,
    alternates: { canonical: "/privacy" },
    openGraph: { title, description, url: "/privacy", siteName: offer.name, type: "website", images: openGraph?.images },
    twitter: { card: "summary_large_image", title, description, images: twitter?.images },
  };
}

export default function Page() {
  return (
    <>
      <Backdrop progress={0.15} />
      <SiteNav cta={false} login />
      <main id="main" className="legal-page">
        <LegalDocument page={privacyPage} />
      </main>
      <SiteFooter />
    </>
  );
}
