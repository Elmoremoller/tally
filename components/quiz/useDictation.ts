"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { heardText, problemFor, withSpoken, type MicProblem, type SpeechResult } from "@/lib/dictation";

// The browser's own speech recognition: Chrome, Edge and Safari have it, Firefox doesn't, so talking is only
// offered where it exists. What she says becomes text in her browser (or her browser maker's service) and
// lands in the box as she speaks, where she can read and fix it before going on.

type Recognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: { results: ArrayLike<SpeechResult> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};
type RecognitionConstructor = new () => Recognition;

const recognitionConstructor = () => {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: RecognitionConstructor; webkitSpeechRecognition?: RecognitionConstructor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
};
const noSubscription = () => () => {};

/**
 * Talking into one answer box. While listening, the box holds what she had typed followed by what she has said
 * so far, words still being worked out included. When it stops without her stopping it, `problem` says why, so
 * the screen can tell her instead of the button just switching back.
 */
export function useDictation({ value, setValue, max }: { value: string; setValue: (text: string) => void; max: number }) {
  const supported = useSyncExternalStore(noSubscription, () => recognitionConstructor() !== null, () => false);
  const [listening, setListening] = useState(false);
  const [problem, setProblem] = useState<MicProblem | null>(null);
  const recognition = useRef<Recognition | null>(null);
  const update = useRef(setValue);

  useEffect(() => {
    update.current = setValue;
  }, [setValue]);
  // Leaving the screen stops listening.
  useEffect(() => () => recognition.current?.abort(), []);

  const start = () => {
    setProblem(null);
    const Constructor = recognitionConstructor();
    if (!Constructor) return setProblem("failed");
    const r = new Constructor();
    const before = value;
    r.lang = "en-US";
    r.continuous = true;
    r.interimResults = true;
    r.onresult = (event) => update.current(withSpoken(before, heardText(event.results), max));
    r.onerror = (event) => {
      const why = problemFor(event.error);
      if (why) setProblem(why);
    };
    r.onend = () => {
      if (recognition.current === r) recognition.current = null;
      setListening(false);
    };
    recognition.current = r;
    try {
      r.start();
      setListening(true);
    } catch {
      recognition.current = null;
      setProblem("failed");
    }
  };

  const stop = () => recognition.current?.stop();

  return { supported, listening, problem, toggle: listening ? stop : start };
}
