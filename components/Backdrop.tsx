import type { CSSProperties } from "react";

/**
 * The blush aura behind every page after the landing page: the hero's glow, brought inside. Soft blooms
 * in the brand reds sit behind frosted cards, with a fine grain over them. It never moves on its own;
 * the light shifts a little as she moves through the quiz (`progress`, 0 to 1), so the background answers
 * to what she does.
 */
export function Backdrop({ progress = 0 }: { progress?: number }) {
  return (
    <div className="backdrop" aria-hidden="true" style={{ "--stage": progress } as CSSProperties}>
      <span className="bloom bloom-red" />
      <span className="bloom bloom-coral" />
      <span className="bloom bloom-rose" />
      <span className="bloom bloom-light" />
    </div>
  );
}
