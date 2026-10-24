import type { Metadata } from "next";
import { Backdrop } from "@/components/Backdrop";
import { LegalDocument } from "@/components/LegalDocument";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";
import { termsPage } from "@/lib/legal";

// The agreement between people who use The Couple Standard and the company that runs it. The words are in
// lib/legal.ts.
export const metadata: Metadata = { title: `${termsPage.title} · The Couple Standard` };

export default function Page() {
  return (
    <>
      <Backdrop progress={0.15} />
      <SiteNav cta={false} />
      <main id="main" className="legal-page">
        <LegalDocument page={termsPage} />
      </main>
      <SiteFooter />
    </>
  );
}
