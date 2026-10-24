"use client";

import { useState } from "react";
import { planCopy } from "@/lib/steps";
import { FitTextarea } from "./FitTextarea";

/**
 * A sentence they can change, then copy to say or send. The words start over when the box is shown for
 * something else, so give it a key that changes with them.
 */
export function SayBox({ words: start, copyLabel = planCopy.copy }: { words: string; copyLabel?: string }) {
  const [words, setWords] = useState(start);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(words);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <>
      <label className="plan-say">
        <span className="plan-say-hint">{planCopy.changeWords}</span>
        <FitTextarea rows={2} value={words} onChange={(e) => setWords(e.target.value)} />
      </label>
      <button type="button" className="link-button plan-say-copy" onClick={copy}>
        {copied ? planCopy.copied : copyLabel}
      </button>
    </>
  );
}
