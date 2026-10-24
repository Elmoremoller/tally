"use client";

import Link from "next/link";
import { useId } from "react";
import { checkInCopy as copy, type CheckInId } from "@/lib/check-ins";
import type { HelpNames } from "@/lib/fight-help";
import { putOff, usePutOff } from "./store";

/** Under Today's step while a check in is due: what it is, Answer now, and Not now until tomorrow. */
export function CheckInCard({ id, names, href }: { id: CheckInId; names: HelpNames; href: string }) {
  const hidden = usePutOff(id);
  const titleId = useId();
  if (hidden) return null;
  const card = copy.card[id];
  return (
    <section className="plan-checkin" aria-labelledby={titleId}>
      <h2 id={titleId} className="plan-checkin-title">
        {card.title}
      </h2>
      <p className="plan-checkin-text">{card.text(names)}</p>
      <div className="plan-checkin-actions">
        <Link href={href} className="btn btn-lg">
          {copy.answer}
        </Link>
        <button type="button" className="link-button" onClick={() => putOff(id)}>
          {copy.later}
        </button>
      </div>
    </section>
  );
}
