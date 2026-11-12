"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { offer } from "@/lib/offer";
import { START_HREF } from "./GetStarted";
import { ArrowRight } from "./icons";

/** "Takes about 2 minutes", in two lines on phones: the last two words go on the second. */
const time = offer.quizTime.split(" ");
const timeLines = [time.slice(0, -2).join(" "), time.slice(-2).join(" ")];

/** `href` is the quiz it opens: the first version's, unless the page is the beginner version's. */
type GetStartedBarProps = { href?: string };

/**
 * The landing page's action, pinned to the bottom of the screen. The whole bar is the button. It rises
 * once the hero's Get started has scrolled away under the nav, and steps aside while the closing band or
 * the footer is on screen, so there is only ever one Get started in reach. While hidden it is inert.
 */
export function GetStartedBar({ href = START_HREF }: GetStartedBarProps) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const heroCta = document.querySelector('[data-section="hero"] [data-cta="get-started"]');
    if (!heroCta) return;

    let pastHero = false;
    const blocking = new Set<Element>();
    const update = () => setShown(pastHero && blocking.size === 0);

    // The hero's button counts as gone once it slides under the sticky nav, not once it leaves the screen.
    const navHeight = Math.round(document.querySelector('[data-section="nav"]')?.getBoundingClientRect().height ?? 0);
    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        pastHero = !entry.isIntersecting && entry.boundingClientRect.top < navHeight;
        update();
      },
      { rootMargin: `-${navHeight}px 0px 0px 0px` },
    );
    heroObserver.observe(heroCta);

    // The bar would vanish on the slate of the plan band and the closing band, and the closing band has its own button.
    const blockerObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) blocking.add(entry.target);
        else blocking.delete(entry.target);
      }
      update();
    });
    document
      .querySelectorAll('[data-section="plan"], [data-section="closing"], [data-section="footer"]')
      .forEach((node) => blockerObserver.observe(node));

    return () => {
      heroObserver.disconnect();
      blockerObserver.disconnect();
    };
  }, []);

  return (
    <div className="get-bar" data-shown={shown || undefined} inert={!shown}>
      <Link href={href} className="btn get-bar-link" data-cta="get-started-bar">
        <span className="get-bar-label">
          {offer.cta}
          <ArrowRight />
        </span>
        <span className="get-bar-chip">
          <span>{timeLines[0]}</span>
          <span>{timeLines[1]}</span>
        </span>
      </Link>
    </div>
  );
}
