import type { CSSProperties } from "react";

/**
 * The aura behind every page after the landing page: the hero's glow, brought inside. Soft blooms in
 * sky blue, dusty blue and warm tan sit behind frosted cards, with a fine grain over them. It never moves
 * on its own; the light shifts a little as she moves through the quiz (`progress`, 0 to 1), so the
 * background answers to what she does.
 */
export function Backdrop({ progress = 0 }: { progress?: number }) {
  return (
    <div className="backdrop" aria-hidden="true" style={{ "--stage": progress } as CSSProperties}>
      <span className="bloom bloom-sky" />
      <span className="bloom bloom-tan" />
      <span className="bloom bloom-dusty" />
      <span className="bloom bloom-light" />
    </div>
  );
}
