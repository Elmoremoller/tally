"use client";

import Link from "next/link";
import { useActionState, type ReactNode } from "react";
import { startCheckout } from "@/app/start/checkout";
import { BlackWeekPill, useBlackWeek } from "@/components/BlackWeek";
import { ArrowRight } from "@/components/icons";
import { paywallConsent as consent } from "@/lib/legal";
import { paywallCopy } from "@/lib/plan-copy";
import { Dock } from "./Dock";

/**
 * Get my plan, under her free result: the headline, a look at her plan built from her answers (`children`),
 * the price and the refund line, and the button to Stripe's page. The beginner version passes its own headline.
 * While the Black Week offer runs, the price shows struck from the usual one with its end date under the button.
 */
export function Paywall({
  title = paywallCopy.title,
  lead = paywallCopy.lead,
  children,
}: {
  title?: string;
  lead?: string;
  children: ReactNode;
}) {
  const [state, action, pending] = useActionState(startCheckout, null);
  const deal = useBlackWeek();
  const { deal: d } = paywallCopy;

  return (
    <section className="paywall" aria-labelledby="paywall-title" data-deal={deal || undefined}>
      <BlackWeekPill className="paywall-pill" />
      <h2 id="paywall-title" className="paywall-title">
        {title}
      </h2>
      <p className="paywall-lead">{lead}</p>
      {children}

      {/* On a phone the price and the button stay pinned while she reads the cards, and the error shows with them. */}
      <form action={action} className="paywall-form">
        <Dock className="paywall-dock">
          {deal ? (
            <div className="paywall-deal">
              <p className="paywall-deal-row">
                <span className="sr-only">{d.wasLabel} </span>
                <s className="paywall-was">{d.was}</s>
                <span className="sr-only">, {d.nowLabel} </span>
                <span className="paywall-now">{d.now}</span>
                <span className="paywall-off">{d.off}</span>
              </p>
              <p className="paywall-terms">{d.terms}</p>
            </div>
          ) : (
            <p className="paywall-price">{paywallCopy.price}</p>
          )}
          <button type="submit" className="btn btn-lg paywall-cta" disabled={pending}>
            {pending ? paywallCopy.pending : paywallCopy.cta}
            {pending ? null : <ArrowRight />}
          </button>
          {deal ? <p className="paywall-ends">{d.ends}</p> : null}
          {state?.error ? (
            <p className="quiz-error" role="alert">
              {state.error}
            </p>
          ) : null}
        </Dock>
        <p className="paywall-fine">
          {paywallCopy.refund} {paywallCopy.secure}
        </p>
        {/* In a new tab, so reading them doesn't lose the result she just got. */}
        <p className="paywall-fine paywall-consent">
          {consent.before}
          <Link href="/terms" target="_blank" rel="noopener noreferrer">
            {consent.terms}
          </Link>
          {consent.and}
          <Link href="/privacy" target="_blank" rel="noopener noreferrer">
            {consent.privacy}
          </Link>
          {consent.after}
        </p>
      </form>
    </section>
  );
}
