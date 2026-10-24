import { answeredCheckIns, checkInFor } from "./check-in-state";
import { oneOf } from "./clean";
import { momentIndex, OUTCOMES, pathFor, replay, reviewDue, STEP_IDS, VERSIONS, type ReviewRow } from "./progress";
import type { loadViewer, Viewer } from "./viewer";

type Supabase = Awaited<ReturnType<typeof loadViewer>>["supabase"];

/**
 * Where a signed in person is in their plan: started the first time they open it, then moved on by their
 * own answers. Their partner's answers never come into it. When the plan loop's tables aren't there yet,
 * it starts from the day they paid, with no answers.
 */
export async function loadPlanState(supabase: Supabase, viewer: Viewer, now = new Date()) {
  const [started, reviews, labels, answered] = await Promise.all([
    supabase.rpc("start_plan"),
    supabase.from("step_reviews").select("step_id, version, outcome, created_at").order("created_at"),
    // Only the person who took the quiz has a reflection, and only they can read it.
    viewer.role === "owner"
      ? supabase.from("reflections").select("heat, wants_more_of").maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    answeredCheckIns(supabase),
  ]);
  if (started.error) console.error("start_plan failed", started.error.message);
  if (reviews.error) console.error("Reading step_reviews failed", reviews.error.message);

  const rows: ReviewRow[] = (reviews.data ?? []).flatMap((r) =>
    oneOf(STEP_IDS, r.step_id) && oneOf(VERSIONS, r.version) && oneOf(OUTCOMES, r.outcome)
      ? [{ stepId: r.step_id, version: r.version, outcome: r.outcome, at: new Date(r.created_at) }]
      : [],
  );
  const heat: string | null = labels.data?.heat ?? null;
  const wantsMoreOf: string | null = labels.data?.wants_more_of ?? null;
  const startedAt = new Date(started.data ?? viewer.row.paid_at ?? now);
  const path = pathFor(viewer.ctx.coupleType, viewer.ctx.you, heat);
  const { progress, counted } = replay(path, startedAt, rows);
  return {
    progress,
    counted,
    reviewDue: reviewDue(progress, now),
    moment: momentIndex(startedAt, now, wantsMoreOf),
    checkIn: checkInFor(startedAt, now, answered),
  };
}
