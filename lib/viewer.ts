import type { PlanContext } from "./plan";
import type { CoupleTypeId, FightMove } from "./quiz";
import { supabaseWithSession } from "./supabase";

/** A row of the people table, as the plan page reads it. */
export type PersonRow = {
  email: string;
  couple_type: CoupleTypeId;
  fight_topics: string[];
  you_in_a_fight: FightMove;
  partner_in_a_fight: FightMove;
  how_fights_start: string;
  how_you_make_up: string;
  your_name: string | null;
  partner_name: string | null;
  paid_at: string | null;
  partner_email: string | null;
};

export type Viewer = {
  email: string;
  /** "owner" took the quiz and paid. "partner" was invited to their plan. */
  role: "owner" | "partner";
  row: PersonRow;
  ctx: PlanContext;
  /** The name of the person reading, when we know it. */
  name: string | null;
};

/**
 * The plan as the person reading it sees it. A partner reads the same plan from their own side, so
 * "you" and "your partner" swap round for them.
 */
export function planFor(row: PersonRow, role: Viewer["role"]): { ctx: PlanContext; name: string | null } {
  const owner = role === "owner";
  return {
    ctx: {
      coupleType: row.couple_type,
      topics: row.fight_topics,
      you: owner ? row.you_in_a_fight : row.partner_in_a_fight,
      partner: owner ? row.partner_in_a_fight : row.you_in_a_fight,
      partnerName: owner ? row.partner_name : row.your_name,
      start: row.how_fights_start,
      makeUp: row.how_you_make_up,
    },
    name: owner ? row.your_name : row.partner_name,
  };
}

/** Who is signed in, and which plan is theirs. Null when nobody is signed in. */
export async function loadViewer() {
  const supabase = await supabaseWithSession();
  const { data } = await supabase.auth.getClaims();
  const email = typeof data?.claims?.email === "string" ? data.claims.email.toLowerCase() : null;
  if (!email) return { supabase, viewer: null };

  // The database only returns the plans this person may read: their own, and one they were invited to.
  // Someone invited as a partner may also have taken the quiz themselves without paying, so a paid plan
  // wins: their own if they paid for it, otherwise the one they were invited to.
  const { data: found } = await supabase.from("people").select("*").limit(2);
  const rows = (found ?? []) as PersonRow[];
  const own = rows.find((r) => r.email === email);
  const invited = rows.find((r) => r.partner_email === email && r.paid_at);
  const row = own?.paid_at ? own : (invited ?? own ?? null);
  if (!row) return { supabase, viewer: null, email };

  const role = row.email === email ? "owner" : "partner";
  const viewer: Viewer = { email, role, row, ...planFor(row, role) };
  return { supabase, viewer, email };
}
