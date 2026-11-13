"use client";

import Link from "next/link";
import { useActionState, type ReactNode } from "react";
import { startCheckout } from "@/app/start/checkout";
import { ArrowRight } from "@/components/icons";
import { paywallConsent as consent } from "@/lib/legal";
import { paywallCopy } from "@/lib/plan-copy";
import { Dock } from "./Dock";

/**
 * Get my plan, under her free result: the headline, a look at her plan built from her answers (`children`),
 * the price and the refund line, and the button to Stripe's page. The beginner version passes its own headline.
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

  return (
    <section className="paywall" aria-labelledby="paywall-title">
      <h2 id="paywall-title" className="paywall-title">
        {title}
      </h2>
      <p className="paywall-lead">{lead}</p>
      {children}

      {/* On a phone the price and the button stay pinned while she reads the cards, and the error shows with them. */}
      <form action={action} className="paywall-form">
        <Dock className="paywall-dock">
          <p className="paywall-price">{paywallCopy.price}</p>
          <button type="submit" className="btn btn-lg paywall-cta" disabled={pending}>
            {pending ? paywallCopy.pending : paywallCopy.cta}
            {pending ? null : <ArrowRight />}
          </button>
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
