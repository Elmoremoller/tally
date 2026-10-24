import { SLOT_IDS, type SlotId, type StandardLine, type StandardState } from "./standard";
import type { loadViewer, Viewer } from "./viewer";

type Supabase = Awaited<ReturnType<typeof loadViewer>>["supabase"];
type AgreementRow = { step_id: string; text: string; author_email: string; agreed_by?: string | null };

const isSlot = (value: string): value is SlotId => (SLOT_IDS as readonly string[]).includes(value);

/**
 * Their Couple Standard as the person reading sees it: the shared lines from both of them, each person's own
 * way in, whether the other person has opened the plan yet, and their own quiz summary. Before the Couple
 * Standard's SQL has run, what can't be read yet comes back empty and every line reads as a proposal.
 */
export async function loadStandard(supabase: Supabase, viewer: Viewer): Promise<StandardState> {
  const [agreements, ways, opened, reflection] = await Promise.all([
    supabase.from("agreements").select("*"),
    supabase.from("intentions").select("email, text"),
    supabase.rpc("other_opened_plan"),
    // Only the person who took the quiz has a summary, and only they can read it.
    viewer.role === "owner"
      ? supabase.from("reflections").select("bullets").eq("email", viewer.email).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const lines: Partial<Record<SlotId, StandardLine>> = {};
  for (const row of (agreements.data ?? []) as AgreementRow[]) {
    if (!isSlot(row.step_id)) continue;
    lines[row.step_id] = { text: row.text, mine: row.author_email === viewer.email, agreed: Boolean(row.agreed_by) };
  }
  const wayRows = (ways.data ?? []) as { email: string; text: string }[];
  const bullets = (reflection.data as { bullets?: string[] } | null)?.bullets;
  return {
    lines,
    myWayIn: wayRows.find((w) => w.email === viewer.email)?.text ?? null,
    theirWayIn: wayRows.find((w) => w.email !== viewer.email)?.text ?? null,
    otherOpened: opened.data === true,
    started: Array.isArray(bullets) && bullets.length ? bullets : null,
  };
}
