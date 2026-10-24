import type { SVGProps } from "react";
import { ICON, WORDMARK } from "./paths";

// The Tally logo, traced from the supplied artwork in brand/. The wordmark is drawn in currentColor, so its
// colour comes from where it sits (dusty blue on off white). The mark is the app icon: a dusty blue tile
// with an off white T, the same on any background.

type LogoProps = Omit<SVGProps<SVGSVGElement>, "viewBox" | "children"> & {
  /** Accessible name. Leave it out when the logo sits next to text that already names the brand. */
  title?: string;
};

function labelled(title?: string) {
  return title
    ? ({ role: "img", "aria-label": title } as const)
    : ({ "aria-hidden": true, focusable: false } as const);
}

/** The wordmark: in the nav, the quiz header and across the footer. */
export function Wordmark({ title, ...props }: LogoProps) {
  return (
    <svg viewBox={WORDMARK.viewBox} fill="currentColor" {...labelled(title)} {...props}>
      <path fillRule="evenodd" d={WORDMARK.d} />
    </svg>
  );
}

/** The wordmark, where the old logo put the mark beside it. */
export const Lockup = Wordmark;

/** The T on its tile, for small spaces where the wordmark won't fit. */
export function Mark({ title, ...props }: LogoProps) {
  return (
    <svg viewBox={ICON.viewBox} {...labelled(title)} {...props}>
      <path fill="var(--dusty-blue)" d={ICON.tile} />
      <path fill="var(--off-white)" fillRule="evenodd" d={ICON.t} />
    </svg>
  );
}
