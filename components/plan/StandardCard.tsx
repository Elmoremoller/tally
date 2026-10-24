import Link from "next/link";
import { Mark } from "@/components/brand/Logo";
import { standardCopy } from "@/lib/standard";

/** Under Today's step: their Couple Standard, the outcome the plan builds toward, one tap away. */
export function StandardCard({ href }: { href: string }) {
  return (
    <section className="plan-standard" aria-labelledby="standard-card-title">
      <Mark className="plan-standard-mark" />
      <h2 id="standard-card-title" className="plan-standard-title">
        {standardCopy.card.title}
      </h2>
      <p className="plan-standard-text">{standardCopy.card.text}</p>
      <Link href={href} className="btn btn-lg plan-standard-open">
        {standardCopy.card.open}
      </Link>
    </section>
  );
}
