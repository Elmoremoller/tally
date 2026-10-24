import Link from "next/link";
import { offer } from "@/lib/offer";
import { Lockup } from "./brand/Logo";
import { GetStarted } from "./GetStarted";

/**
 * Sticky, translucent nav. With an action: the logo on the left, Get started on the right. Without one
 * (every page, the landing page included, where the Get started bar carries the action), the logo sits in
 * the middle, bigger, like the quiz's header.
 */
export function SiteNav({ cta = true }: { cta?: boolean }) {
  return (
    <header className={cta ? "nav" : "nav nav-centered"} data-section="nav">
      <div className="wrap nav-inner">
        <Link href="/" className="nav-brand" aria-label={`${offer.name}, home`}>
          <Lockup />
        </Link>
        {cta ? <GetStarted /> : null}
      </div>
    </header>
  );
}
