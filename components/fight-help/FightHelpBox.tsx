"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId } from "react";
import { helpCopy as copy, helpHref } from "@/lib/fight-help";
import { clearRepair, forgetOld, useSavedRepair } from "./store";

/**
 * At the top of the plan, for both of them: help for right after a fight, one tap away. While a 10 minute
 * repair waits where they stopped it on this phone, the box offers to pick it up instead.
 */
export function FightHelpBox({ href }: { href: string }) {
  const saved = useSavedRepair();
  const router = useRouter();
  // Its own id, since the check in can show it while the plan page waits hidden behind it.
  const titleId = useId();

  useEffect(() => {
    forgetOld();
  }, []);

  return (
    <section className="help-box" aria-labelledby={titleId}>
      {saved ? (
        <>
          <h2 id={titleId} className="help-box-title">
            {copy.box.waiting}
          </h2>
          <div className="help-box-actions">
            <Link href={helpHref(href, "resume")} className="btn btn-lg">
              {copy.box.resume}
            </Link>
            <button
              type="button"
              className="link-button"
              onClick={() => {
                clearRepair();
                router.push(href);
              }}
            >
              {copy.box.startOver}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="help-box-words">
            <h2 id={titleId} className="help-box-title">
              {copy.box.title}
            </h2>
            <p className="help-box-text">{copy.box.text}</p>
          </div>
          <Link href={href} className="btn btn-lg">
            {copy.box.start}
          </Link>
        </>
      )}
    </section>
  );
}
