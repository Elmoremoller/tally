import { Backdrop } from "@/components/Backdrop";
import { PlanWelcome, type WelcomeNote } from "@/components/plan/PlanPage";
import type { PathPlan } from "@/lib/beginner/path";
import { PathSteps, type SavedPath } from "./PathSteps";

/**
 * Her paid path's page (Phase 6 of docs/DIRECTION.md): the note shown right after paying, then her path one step
 * at a time. `token` is null on a preview, where nothing is saved.
 */
export function PathPlanPage({
  content,
  token,
  saved,
  welcome,
}: {
  content: PathPlan;
  token: string | null;
  saved: SavedPath;
  welcome?: WelcomeNote | null;
}) {
  return (
    <main id="main" className="plan path-main">
      <Backdrop progress={1} />
      {welcome ? <PlanWelcome welcome={welcome} /> : null}
      <PathSteps content={content} token={token} saved={saved} />
    </main>
  );
}
