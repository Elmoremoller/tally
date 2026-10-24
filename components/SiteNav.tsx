import Link from "next/link";
import { offer } from "@/lib/offer";
import { Lockup } from "./brand/Logo";
import { GetStarted } from "./GetStarted";

/**
 * Sticky, translucent nav. With an action: the logo on the left, Get started on the right. Without one
 * (every page, the landing page included, where the Get started bar carries the action), the logo sits in
 * the middle, bigger, like the quiz's header. With `login`, Log in sits at the right end of the bar for
 * someone coming back to her plan, and the logo stays in the middle. Pages where she's already in her plan,
 * and Open your plan itself, leave it out.
 */
export function SiteNav({ cta = true, login = false }: { cta?: boolean; login?: boolean }) {
  return (
    <header className={cta ? "nav" : "nav nav-centered"} data-section="nav">
      <div className="wrap nav-inner">
        <Link href="/" className="nav-brand" aria-label={`${offer.name}, home`}>
          <Lockup />
        </Link>
        {cta ? <GetStarted /> : null}
        {login ? (
          <Link href="/login" className="nav-login">
            {offer.login}
          </Link>
        ) : null}
      </div>
    </header>
  );
}
