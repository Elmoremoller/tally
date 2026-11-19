import { Backdrop } from "@/components/Backdrop";
import { PlanWelcome, type WelcomeNote } from "@/components/plan/PlanPage";
import type { PathPlan } from "@/lib/beginner/path";
import type { PathV4 } from "@/lib/beginner/workflow";
import { PathFlow } from "./PathFlow";
import { PathSteps, type SavedPath } from "./PathSteps";

/**
 * Her paid path's page (Phase 6 of docs/DIRECTION.md, and from Phase 10 the path with follow up questions): the note shown right after paying, then her path one step
 * at a time. `token` is null on a preview, where nothing is saved.
 */
export function PathPlanPage({
  content,
  token,
  saved,
  welcome,
  sample = null,
}: {
  content: PathPlan | PathV4;
  token: string | null;
  saved: SavedPath;
  welcome?: WelcomeNote | null;
  /** A preview's sample, for writing a workflow from that sample's answers. */
  sample?: string | null;
}) {
  return (
    <main id="main" className="plan path-main">
      <Backdrop progress={1} />
      {welcome ? <PlanWelcome welcome={welcome} /> : null}
      {content.version === 4 ? (
        <PathFlow content={content} token={token} saved={saved} sample={sample} />
      ) : (
        <PathSteps content={content} token={token} saved={saved} />
      )}
    </main>
  );
}
