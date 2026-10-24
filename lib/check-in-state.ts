import { CHECK_INS, dueCheckIn, planDay, type CheckInId } from "./check-ins";
import type { loadViewer, Viewer } from "./viewer";

type Supabase = Awaited<ReturnType<typeof loadViewer>>["supabase"];

/**
 * The check ins this person has answered. Null before the check ins' SQL has run, so none are asked until
 * their answers can be saved.
 */
export async function answeredCheckIns(supabase: Supabase): Promise<CheckInId[] | null> {
  const { data, error } = await supabase.from("check_ins").select("check_in");
  if (error) return null;
  return ((data ?? []) as { check_in: string }[]).flatMap((r) =>
    (CHECK_INS as readonly string[]).includes(r.check_in) ? [r.check_in as CheckInId] : [],
  );
}

/** Whether the founding couple quote can be saved: false before its SQL has run, so it isn't asked. */
export async function quoteReady(supabase: Supabase) {
  const { error } = await supabase.from("check_ins").select("quote").limit(0);
  return !error;
}

/** The check in to ask now, for someone whose plan started at `startedAt`. */
export const checkInFor = (startedAt: Date, now: Date, answered: CheckInId[] | null) =>
  answered ? dueCheckIn(planDay(startedAt, now), answered) : null;

/** For the check in's own page: which one is due, starting their plan if this is their first visit. */
export async function loadCheckIn(supabase: Supabase, viewer: Viewer, now = new Date()) {
  const [started, answered] = await Promise.all([supabase.rpc("start_plan"), answeredCheckIns(supabase)]);
  if (started.error) console.error("start_plan failed", started.error.message);
  return checkInFor(new Date(started.data ?? viewer.row.paid_at ?? now), now, answered);
}
