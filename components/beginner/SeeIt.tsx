"use client";

import { useId, useState } from "react";
import { firstWinCopy } from "@/lib/beginner/copy";
import type { FirstWin } from "@/lib/beginner/types";
import { CopyButton } from "./CopyButton";

/**
 * Her finished result, inside the top row of her map, behind a See it tap: the line on what it is, the result
 * itself with a big Copy button, and where it came from. Tapping again hides it.
 */
export function SeeIt({ firstWin }: { firstWin: FirstWin }) {
  const [open, setOpen] = useState(false);
  const panel = useId();

  return (
    <div className="win-see">
      <button
        type="button"
        className="btn btn-lg win-see-toggle"
        aria-expanded={open}
        aria-controls={panel}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? firstWinCopy.hideIt : firstWinCopy.seeIt}
      </button>
      <div id={panel} className="win-see-panel" hidden={!open}>
        <p className="win-see-intro">{firstWin.intro}</p>
        <blockquote className="win-draft">{firstWin.draft}</blockquote>
        <CopyButton words={firstWin.draft} />
        <p className="win-made">{firstWinCopy.made}</p>
      </div>
    </div>
  );
}
