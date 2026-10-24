import { CHECK_INS, type CheckInId } from "./check-ins";
import { ACKS, pathFor, REVIEW_AFTER_MS, type Ack, type Progress, type Version } from "./progress";
import type { CoupleTypeId } from "./quiz";
import type { StandardState } from "./standard";
import { planFor, type PersonRow } from "./viewer";

// Sample couples for /plan/preview, which only exists on a local setup (or with PLAN_PREVIEW=1 for a local
// production build). Lets the plan page be seen and tested before Supabase, Stripe and the login are connected.
// Never set PLAN_PREVIEW on Vercel.
export const previewAllowed = process.env.NODE_ENV === "development" || process.env.PLAN_PREVIEW === "1";

const samples: Record<CoupleTypeId, PersonRow> = {
  push_and_pull: {
    email: "sam@example.com",
    couple_type: "push_and_pull",
    fight_topics: ["chores", "money", "texts_that_land_wrong"],
    you_in_a_fight: "go_quiet",
    partner_in_a_fight: "sort_it_out_now",
    how_fights_start: "building_up",
    how_you_make_up: "move_on",
    your_name: "Sam",
    partner_name: "Alex",
    paid_at: new Date(Date.UTC(2026, 0, 1)).toISOString(),
    partner_email: null,
  },
  quick_sparks: {
    email: "jo@example.com",
    couple_type: "quick_sparks",
    fight_topics: ["family", "time_with_friends"],
    you_in_a_fight: "get_sharp",
    partner_in_a_fight: "sort_it_out_now",
    how_fights_start: "tired_or_stressed",
    how_you_make_up: "one_says_sorry",
    your_name: null,
    partner_name: null,
    paid_at: new Date(Date.UTC(2026, 0, 1)).toISOString(),
    partner_email: null,
  },
  slow_simmer: {
    email: "kim@example.com",
    couple_type: "slow_simmer",
    fight_topics: ["sharing_space", "phones_and_trust"],
    you_in_a_fight: "say_sorry_fast",
    partner_in_a_fight: "go_quiet",
    how_fights_start: "old_fight",
    how_you_make_up: "wait_it_out",
    your_name: "Kim",
    partner_name: "Robin",
    paid_at: new Date(Date.UTC(2026, 0, 1)).toISOString(),
    partner_email: "robin@example.com",
  },
};

export const isCoupleType = (value: unknown): value is CoupleTypeId =>
  typeof value === "string" && value in samples;

export function sampleViewer(type: CoupleTypeId, role: "owner" | "partner" = "owner") {
  const row = samples[type];
  return { email: role === "owner" ? row.email : (row.partner_email ?? "partner@example.com"), role, row, ...planFor(row, role) };
}

/**
 * Where a sample plan is, from the preview's address, so every screen of the plan loop can be seen without
 * saving anything: /plan/preview?type=quick_sparks&as=partner&day=3&version=alone&worse=1&notyet=1&review=1
 * &heat=high&wants=closeness&after=helped. `day` is the place in their path, and also picks the small moment.
 */
export type PreviewPlan = {
  type: CoupleTypeId;
  as: "owner" | "partner";
  day: number;
  version: Version;
  worse: boolean;
  notYet: number;
  review: boolean;
  heat: string | null;
  wants: string | null;
  after: Ack | null;
};

const first = (value: unknown) => String(Array.isArray(value) ? value[0] : (value ?? ""));

export function previewPlan(params: Record<string, unknown>): PreviewPlan {
  const after = first(params.after);
  return {
    type: isCoupleType(first(params.type)) ? (first(params.type) as CoupleTypeId) : "push_and_pull",
    as: first(params.as) === "partner" ? "partner" : "owner",
    day: Math.min(Math.max(Math.floor(Number(first(params.day))) || 0, 0), 20),
    version: first(params.version) === "alone" ? "alone" : "main",
    worse: ["1", "true"].includes(first(params.worse)),
    notYet: first(params.notyet) === "1" || first(params.notYet) === "1" ? 1 : 0,
    review: ["1", "true"].includes(first(params.review)),
    heat: first(params.heat) === "high" ? "high" : null,
    wants: /^[a-z_]{1,20}$/.test(first(params.wants)) ? first(params.wants) : null,
    after: (ACKS as readonly string[]).includes(after) ? (after as Ack) : null,
  };
}

/** The sample plan's place in its path, as the plan page would have worked it out from saved answers. */
export function previewProgress(plan: PreviewPlan, now = new Date()): Progress {
  const viewer = sampleViewer(plan.type, plan.as);
  const path = pathFor(plan.type, viewer.ctx.you, plan.heat);
  const index = Math.min(plan.day, path.length);
  return {
    path,
    index,
    current:
      index >= path.length
        ? null
        : plan.worse
          ? { stepId: "made_worse", version: "main" }
          : { stepId: path[index], version: plan.version },
    // Asked about straight away when review is on, the way it is 8 hours after a step shows.
    since: plan.review ? new Date(now.getTime() - REVIEW_AFTER_MS) : now,
    notYet: plan.notYet,
  };
}

/** The sample plan as it stands, for links between the preview pages. */
export function previewQuery(plan: PreviewPlan) {
  const query = new URLSearchParams({ type: plan.type });
  if (plan.as === "partner") query.set("as", "partner");
  if (plan.day) query.set("day", String(plan.day));
  if (plan.version === "alone") query.set("version", "alone");
  if (plan.worse) query.set("worse", "1");
  if (plan.notYet) query.set("notyet", "1");
  if (plan.heat) query.set("heat", plan.heat);
  if (plan.wants) query.set("wants", plan.wants);
  return query.toString();
}

/**
 * A sample Couple Standard: empty, or with `lines=1` some lines in each state. `opened=1` or `opened=0` says
 * whether the other person has opened the plan (by default they have when there is one), and `started=0`
 * leaves out the quiz summary.
 */
export function previewStandard(params: Record<string, unknown>, viewer: ReturnType<typeof sampleViewer>): StandardState {
  const hasPartner = viewer.role === "partner" || Boolean(viewer.row.partner_email);
  const filled = first(params.lines) === "1";
  const opened = first(params.opened);
  return {
    lines: filled
      ? {
          agree_pause: { text: "Pineapple, then 20 minutes apart.", mine: true, agreed: true },
          check_in: { text: "Sundays at 7, on the couch.", mine: true, agreed: false },
          ...(hasPartner
            ? { coming_back: { text: "Back in the kitchen at the time we said. Whoever asked for space starts.", mine: false, agreed: false } }
            : {}),
        }
      : {},
    myWayIn: null,
    theirWayIn: filled && hasPartner ? "I’ll ask if now is a good time first." : null,
    otherOpened: opened === "1" ? true : opened === "0" ? false : hasPartner,
    started:
      viewer.role === "owner" && first(params.started) !== "0"
        ? ["You want to sort out who does what at home.", "When it gets loud, you go quiet and need some space.", "You said it felt like you were doing it alone."]
        : null,
  };
}

/** The check in a sample plan shows under Today's step: `checkin=start`, `day_14` or `day_30`. None without it. */
export function previewCheckIn(params: Record<string, unknown>): CheckInId | null {
  const value = first(params.checkin);
  return (CHECK_INS as readonly string[]).includes(value) ? (value as CheckInId) : null;
}

/** The preview's address for where an answer led, with the line to show above the next step. */
export function previewHref(plan: PreviewPlan, progress: Progress, ack: Ack | null) {
  const query = new URLSearchParams({ type: plan.type });
  if (plan.as === "partner") query.set("as", "partner");
  query.set("day", String(progress.index));
  if (progress.current?.version === "alone") query.set("version", "alone");
  if (progress.current?.stepId === "made_worse") query.set("worse", "1");
  if (progress.notYet) query.set("notyet", "1");
  if (plan.heat) query.set("heat", plan.heat);
  if (plan.wants) query.set("wants", plan.wants);
  if (ack) query.set("after", ack);
  return `/plan/preview?${query}`;
}
