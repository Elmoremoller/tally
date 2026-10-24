import Link from "next/link";
import { ArrowRight } from "./icons";

/** Where every Get started goes. The questions live here once they are built. */
export const START_HREF = "/start";

type GetStartedProps = {
  size?: "md" | "lg";
  /** "invert" is off white on a slate band. */
  tone?: "slate" | "invert";
  className?: string;
  /** Get started, unless the button says something more specific. */
  label?: string;
};

/** The page's one action. Every Get started button on the site is this component, apart from the GetStartedBar. */
export function GetStarted({ size = "md", tone = "slate", className, label = "Get started" }: GetStartedProps) {
  const classes = ["btn", size === "lg" && "btn-lg", tone === "invert" && "btn-invert", className]
    .filter(Boolean)
    .join(" ");
  return (
    <Link href={START_HREF} className={classes} data-cta="get-started">
      {label}
      {size === "lg" ? <ArrowRight /> : null}
    </Link>
  );
}
