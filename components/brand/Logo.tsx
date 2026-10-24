import type { SVGProps } from "react";
import { lockup, mark, wordmark } from "./paths";

type LogoProps = Omit<SVGProps<SVGSVGElement>, "viewBox" | "children"> & {
  /** Accessible name. Leave it out when the logo sits next to text that already names the brand. */
  title?: string;
};

// The artwork is drawn in currentColor, so it is deep red on warm white and warm white on red.
function labelled(title?: string) {
  return title
    ? ({ role: "img", "aria-label": title } as const)
    : ({ "aria-hidden": true, focusable: false } as const);
}

/** Mark and wordmark side by side, as in the horizontal logo file. */
export function Lockup({ title, ...props }: LogoProps) {
  return (
    <svg viewBox={`0 0 ${lockup.width} ${lockup.height}`} fill="currentColor" {...labelled(title)} {...props}>
      <path fillRule="evenodd" transform={`translate(${lockup.mark.x} ${lockup.mark.y})`} d={mark.d} />
      <path fillRule="evenodd" transform={`translate(${lockup.wordmark.x} ${lockup.wordmark.y})`} d={wordmark.d} />
    </svg>
  );
}

/** The words "The Couple Standard" on their own. */
export function Wordmark({ title, ...props }: LogoProps) {
  return (
    <svg viewBox={`0 0 ${wordmark.width} ${wordmark.height}`} fill="currentColor" {...labelled(title)} {...props}>
      <path fillRule="evenodd" d={wordmark.d} />
    </svg>
  );
}

/** The two heads and the smile. */
export function Mark({ title, ...props }: LogoProps) {
  return (
    <svg viewBox={`0 0 ${mark.width} ${mark.height}`} fill="currentColor" {...labelled(title)} {...props}>
      <path fillRule="evenodd" d={mark.d} />
    </svg>
  );
}
