import type { CSSProperties } from "react";
import { DotField } from "@/components/DotField";

/**
 * The aura behind every page after the landing page: the hero's glow, brought inside. Soft blooms in
 * sky blue, dusty blue and warm tan sit behind frosted cards, with a fine grain over them. It never moves
 * on its own; the light shifts a little as she moves through the quiz (`progress`, 0 to 1), so the
 * background answers to what she does. With `still` (the quiz) it holds completely still instead: the
 * light stays where it is, and a faint field of dots, drawn once, sits in the margins.
 */
export function Backdrop({ progress = 0, still = false }: { progress?: number; still?: boolean }) {
  return (
    <div className="backdrop" aria-hidden="true" style={{ "--stage": still ? 0 : progress } as CSSProperties}>
      <span className="bloom bloom-sky" />
      <span className="bloom bloom-tan" />
      <span className="bloom bloom-dusty" />
      <span className="bloom bloom-light" />
      {still ? <DotField still /> : null}
    </div>
  );
}
