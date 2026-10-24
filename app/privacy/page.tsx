import type { Metadata } from "next";
import { Backdrop } from "@/components/Backdrop";
import { LegalDocument } from "@/components/LegalDocument";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";
import { offer } from "@/lib/offer";
import { privacyPage } from "@/lib/legal";

// What we keep, why, who else sees it, and what people can ask us to do. The words are in lib/legal.ts.
export const metadata: Metadata = { title: `${privacyPage.title} · ${offer.name}` };

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
