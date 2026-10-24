import Link from "next/link";
import { checkInCopy } from "@/lib/check-ins";
import { helpCopy } from "@/lib/fight-help";

/** The check in's page when there's nothing to answer, like after a link opened twice. */
export function NothingDue({ planHref }: { planHref: string }) {
  return (
    <div className="checkin checkin-done">
      <h1 className="quiz-title">{checkInCopy.nothing}</h1>
      <Link href={planHref} className="btn btn-lg checkin-back">
        {helpCopy.backToPlan}
      </Link>
    </div>
  );
}
