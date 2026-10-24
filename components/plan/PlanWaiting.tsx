import { Backdrop } from "@/components/Backdrop";
import { planCopy } from "@/lib/plan-copy";
import { AutoRefresh } from "./AutoRefresh";
import { PlanWelcome, type WelcomeNote } from "./PlanPage";

/**
 * While her plan is being written: a calm moment that opens the plan by itself. If writing it failed four
 * times, it says so plainly and keeps checking, slowly, in case the plan is fixed by hand.
 */
export function PlanWaiting({ failed, welcome }: { failed: boolean; welcome?: WelcomeNote | null }) {
  return (
    <main id="main" className="page-narrow">
      <Backdrop progress={0.9} />
      <div className="quiz-making" role="status">
        {failed ? null : <span className="quiz-spinner" aria-hidden="true" />}
        <h1 className="quiz-title">{failed ? planCopy.failedTitle : planCopy.pendingTitle}</h1>
        <p className="page-text">{failed ? planCopy.failedText : planCopy.pendingText}</p>
      </div>
      {welcome ? <PlanWelcome welcome={welcome} /> : null}
      <AutoRefresh seconds={failed ? 30 : 4} />
    </main>
  );
}
