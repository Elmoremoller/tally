"use client";

import { useState } from "react";
import { Check, Copy } from "@/components/icons";
import { firstWinCopy } from "@/lib/beginner/copy";

/**
 * A big Copy button for words on her free result. It says Copied for two seconds once the words are on her
 * clipboard, and a screen reader hears the change. `quiet` is the lighter button, for the second one down.
 */
export function CopyButton({ words, quiet = false }: { words: string; quiet?: boolean }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(words);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <button
      type="button"
      className={`btn btn-lg win-copy${quiet ? " btn-quiet" : ""}`}
      onClick={copy}
    >
      {copied ? <Check /> : <Copy />}
      <span aria-live="polite">{copied ? firstWinCopy.copied : firstWinCopy.copy}</span>
    </button>
  );
}
