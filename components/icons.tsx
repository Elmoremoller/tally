import type { ReactNode, SVGProps } from "react";

// Line icons on a 24px grid. Stroke, fill and size come from the surrounding CSS.
type IconProps = SVGProps<SVGSVGElement>;

function Icon({ children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
      {children}
    </svg>
  );
}

/** The forward arrow. Inside a button it sits in its own light circle (the icon-arrow class). */
export const ArrowRight = (props: IconProps) => (
  <Icon className="icon-arrow" {...props}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Icon>
);

export const ArrowLeft = (props: IconProps) => (
  <Icon {...props}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </Icon>
);

export const Plus = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 6v12M6 12h12" />
  </Icon>
);

export const Check = (props: IconProps) => (
  <Icon {...props}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Icon>
);

/** A padlock: written for her after checkout. */
export const Lock = (props: IconProps) => (
  <Icon {...props}>
    <rect x="5.5" y="10.5" width="13" height="9.5" rx="2" />
    <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
  </Icon>
);

/** AI: a four point sparkle, filled. */
export const Sparkle = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 2.5c.5 3.9 1.6 6.1 3.2 7.5 1.5 1.3 3.6 2 6.3 2.5-2.7.5-4.8 1.2-6.3 2.5-1.6 1.4-2.7 3.6-3.2 7.5-.5-3.9-1.6-6.1-3.2-7.5-1.5-1.3-3.6-2-6.3-2.5 2.7-.5 4.8-1.2 6.3-2.5 1.6-1.4 2.7-3.6 3.2-7.5z" />
  </Icon>
);

/** Hours: a clock. */
export const Clock = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </Icon>
);

/** A speech bubble: a chat message. */
export const Chat = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4.5 6.5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H10l-4 3.5v-3.5h0.5a2 2 0 0 1-2-2z" />
  </Icon>
);

/** An envelope: an email. */
export const Mail = (props: IconProps) => (
  <Icon {...props}>
    <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
    <path d="M4 7l8 6 8-6" />
  </Icon>
);

/** A calendar page: a meeting. */
export const Calendar = (props: IconProps) => (
  <Icon {...props}>
    <rect x="3.5" y="5" width="17" height="15" rx="2" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </Icon>
);

/** A bell: a reminder. */
export const Bell = (props: IconProps) => (
  <Icon {...props}>
    <path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.5h-15z" />
    <path d="M10 20.5a2 2 0 0 0 4 0" />
  </Icon>
);

/** Copy: two sheets, one over the other. */
export const Copy = (props: IconProps) => (
  <Icon {...props}>
    <rect x="8.5" y="8.5" width="11" height="11" rx="2.2" />
    <path d="M15.5 8.5V6.7a2.2 2.2 0 0 0-2.2-2.2H6.7a2.2 2.2 0 0 0-2.2 2.2v6.6a2.2 2.2 0 0 0 2.2 2.2h1.8" />
  </Icon>
);

/** Talking instead of typing: a microphone. */
export const Mic = (props: IconProps) => (
  <Icon {...props}>
    <rect x="9" y="3.5" width="6" height="11" rx="3" />
    <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v2.5" />
  </Icon>
);

/* Media controls, filled */
export const PauseBars = (props: IconProps) => (
  <Icon {...props}>
    <rect x="6" y="5" width="4" height="14" rx="1.2" />
    <rect x="14" y="5" width="4" height="14" rx="1.2" />
  </Icon>
);

export const Play = (props: IconProps) => (
  <Icon {...props}>
    <path d="M8 5.6c0-.9 1-1.4 1.7-.9l9 6.1c.6.4.6 1.4 0 1.8l-9 6.1c-.7.5-1.7 0-1.7-.9z" />
  </Icon>
);

/* Phone status bar */
export const Signal = (props: IconProps) => (
  <svg viewBox="0 0 18 12" aria-hidden="true" focusable="false" {...props}>
    <rect x="0" y="8" width="3" height="4" rx="1" />
    <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
    <rect x="10" y="3" width="3" height="9" rx="1" />
    <rect x="15" y="0" width="3" height="12" rx="1" />
  </svg>
);

export const Wifi = (props: IconProps) => (
  <svg viewBox="0 0 16 12" aria-hidden="true" focusable="false" {...props}>
    <path d="M8 2.2c2.3 0 4.4.9 6 2.4l1.2-1.3A10.4 10.4 0 0 0 8 .4 10.4 10.4 0 0 0 .8 3.3L2 4.6a8.6 8.6 0 0 1 6-2.4z" />
    <path d="M8 5.7c1.4 0 2.6.5 3.6 1.4l1.2-1.3A7 7 0 0 0 8 3.9a7 7 0 0 0-4.8 1.9l1.2 1.3A5.2 5.2 0 0 1 8 5.7z" />
    <path d="M8 11.6 10.3 9.1a3.4 3.4 0 0 0-4.6 0z" />
  </svg>
);

export const Battery = (props: IconProps) => (
  <svg viewBox="0 0 27 12" aria-hidden="true" focusable="false" {...props}>
    <rect x="0.6" y="0.6" width="22.8" height="10.8" rx="3.2" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.4" />
    <rect x="2.4" y="2.4" width="19.2" height="7.2" rx="1.8" />
    <path d="M25 4.1c.9.3 1.4 1 1.4 1.9s-.5 1.6-1.4 1.9z" opacity="0.4" />
  </svg>
);
