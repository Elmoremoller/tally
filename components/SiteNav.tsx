import Link from "next/link";
import { offer } from "@/lib/offer";
import { Lockup } from "./brand/Logo";
import { GetStarted } from "./GetStarted";

/**
 * Sticky, translucent nav. With an action: the logo on the left, Get started on the right. Without one
 * (every page, the landing page included, where the Get started bar carries the action), the logo sits in
 * the middle, bigger, like the quiz's header. With `login`, Log in sits at the right end of the bar for
 * someone coming back to her plan, and the logo stays in the middle. Pages where she's already in her plan,
 * and Open your plan itself, leave it out. The logo and Log in carry `data-dots-clear`: at the top of the
 * landing page the bar is clear and the hero's moving dots run up behind it, keeping away from them.
 */
export function SiteNav({ cta = true, login = false }: { cta?: boolean; login?: boolean }) {
  return (
    <header className={cta ? "nav" : "nav nav-centered"} data-section="nav">
      <div className="wrap nav-inner">
        <Link href="/" className="nav-brand" aria-label={`${offer.name}, home`} data-dots-clear="">
          <Lockup />
        </Link>
        {cta ? <GetStarted /> : null}
        {login ? (
          <Link href="/login" className="nav-login" data-dots-clear="">
            {offer.login}
          </Link>
        ) : null}
      </div>
    </header>
  );
}
