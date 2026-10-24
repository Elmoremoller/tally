import type { SVGProps } from "react";
import { offer } from "@/lib/offer";

// The logo until there is real artwork: the offer's name from lib/offer.ts, set in the display face. It is
// drawn in currentColor, so it is deep red on warm white and warm white on red, and a rename is one edit.

type LogoProps = Omit<SVGProps<SVGSVGElement>, "viewBox" | "children"> & {
  /** Accessible name. Leave it out when the logo sits next to text that already names the brand. */
  title?: string;
};

function labelled(title?: string) {
  return title
    ? ({ role: "img", "aria-label": title } as const)
    : ({ "aria-hidden": true, focusable: false } as const);
}

/** Units per character at a font size of 100: about how wide the display face sets a name. */
const PER_CHAR = 49;
const WIDTH = Math.round(offer.name.length * PER_CHAR);
const HEIGHT = 104;
/** The name is stretched or squeezed to exactly this width, so the box fits it in any face. */
const nameStyle = { fontFamily: "var(--stack-display)", fontWeight: 700, fontSize: 100, letterSpacing: "-0.02em" };

/** The name on its own: in the nav, the quiz header and across the footer. */
export function Wordmark({ title, ...props }: LogoProps) {
  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} fill="currentColor" {...labelled(title)} {...props}>
      <text x="0" y="80" textLength={WIDTH} lengthAdjust="spacingAndGlyphs" style={nameStyle}>
        {offer.name}
      </text>
    </svg>
  );
}

/** The name, where the old logo put the mark beside it. */
export const Lockup = Wordmark;

/** The first letter of the name in a ring, for small spaces where the name won't fit. */
export function Mark({ title, ...props }: LogoProps) {
  return (
    <svg viewBox="0 0 48 48" fill="currentColor" {...labelled(title)} {...props}>
      <circle cx="24" cy="24" r="21.5" fill="none" stroke="currentColor" strokeWidth="3" />
      <text x="24" y="32.5" textAnchor="middle" style={{ ...nameStyle, fontSize: 24, letterSpacing: 0 }}>
        {offer.name.charAt(0)}
      </text>
    </svg>
  );
}
