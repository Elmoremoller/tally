import type { CSSProperties } from "react";
import type { Part } from "@/lib/plan";

/** Where the light sits for each part of the plan, on the same 0 to 1 scale as the quiz's progress. */
const partStage: Record<Part, number> = { prevent: 0.15, pause: 0.55, repair: 0.9 };

/**
 * The blush aura behind every page after the landing page: the hero's glow, brought inside. Soft blooms
 * in the brand reds sit behind frosted cards, with a fine grain over them. It never moves on its own;
 * the light shifts a little as you move through the quiz, and settles differently for each part of the
 * plan, so the background answers to what you do.
 */
export function Backdrop({ progress, part }: { progress?: number; part?: Part }) {
  const stage = part ? partStage[part] : (progress ?? 0);
  return (
    <div className="backdrop" aria-hidden="true" style={{ "--stage": stage } as CSSProperties}>
      <span className="bloom bloom-red" />
      <span className="bloom bloom-coral" />
      <span className="bloom bloom-rose" />
      <span className="bloom bloom-light" />
    </div>
  );
}
