"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { afterSession, heardText, newTalk, speechLanguage, withSpoken, type MicProblem, type SpeechResult, type Talk } from "@/lib/dictation";

// The browser's own speech recognition: Chrome, Edge and Safari have it, Firefox doesn't, so talking is only
// offered where it exists. What she says becomes text in her browser (or her browser maker's service) and
// lands in the box as she speaks, where she can read and fix it before going on.

type Recognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onstart: (() => void) | null;
  onaudiostart: (() => void) | null;
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

/** After Done, the browser gets this long to hand over its last words before listening is cut off. */
const DONE_WAIT_MS = 2000;

/** One go at talking: what was in the box before it, what has been said so far, and whether she has tapped Done. */
type Going = { before: string; talk: Talk; stopped: boolean };

/**
 * One listening session, set up but not started. `live` says whether its talk is still the one going on; once
 * it isn't, the session reports nothing. It reports when the browser is really listening, the words so far each
 * time they change, and how it ended: its words, the browser's error code if any, and how long it ran.
 */
function session(
  Constructor: RecognitionConstructor,
  on: {
    live: () => boolean;
    onReady: () => void;
    onWords: (heard: string) => void;
    onEnd: (end: { heard: string; error: string | null; ms: number }) => void;
  },
): Recognition {
  const r = new Constructor();
  const began = Date.now();
  let heard = "";
  let error: string | null = null;
  const ready = () => {
    if (on.live()) on.onReady();
  };
  r.lang = speechLanguage(navigator.language);
  r.continuous = true;
  r.interimResults = true;
  r.onstart = ready;
  r.onaudiostart = ready;
  r.onresult = (event) => {
    if (!on.live()) return;
    heard = heardText(event.results);
    on.onWords(heard);
  };
  r.onerror = (event) => {
    error = event.error;
  };
  r.onend = () => {
    if (on.live()) on.onEnd({ heard, error, ms: Date.now() - began });
  };
  return r;
}

/**
 * Talking into one answer box. While listening, the box holds what she had typed followed by what she has said
 * so far, words still being worked out included. `ready` turns true once the browser really is listening, so
 * the screen doesn't ask her to talk before it can hear her. The browser stops listening on its own after a
 * pause; then her words are kept and listening starts again, until she taps Done or has plainly finished.
 * When it stops for a reason she should know, `problem` says why.
 */
export function useDictation({ value, setValue, max }: { value: string; setValue: (text: string) => void; max: number }) {
  const supported = useSyncExternalStore(noSubscription, () => recognitionConstructor() !== null, () => false);
  const [phase, setPhase] = useState<"off" | "starting" | "on">("off");
  const [problem, setProblem] = useState<MicProblem | null>(null);
  const recognition = useRef<Recognition | null>(null);
  const going = useRef<Going | null>(null);
  const doneWait = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const update = useRef(setValue);

  useEffect(() => {
    update.current = setValue;
  }, [setValue]);
  // Leaving the screen stops listening, and nothing starts it again.
  useEffect(
    () => () => {
      going.current = null;
      clearTimeout(doneWait.current);
      recognition.current?.abort();
    },
    [],
  );

  const finish = (why: MicProblem | null) => {
    going.current = null;
    recognition.current = null;
    clearTimeout(doneWait.current);
    setPhase("off");
    if (why) setProblem(why);
  };

  // One listening session after another, until the talk is over.
  const listen = (Constructor: RecognitionConstructor, go: Going) => {
    const r = session(Constructor, {
      live: () => going.current === go,
      onReady: () => setPhase("on"),
      onWords: (heard) => {
        setPhase("on");
        update.current(withSpoken(go.before, [go.talk.kept, heard].filter(Boolean).join(" "), max));
      },
      onEnd: (end) => {
        if (recognition.current !== r) return;
        const step = afterSession(go.talk, { ...end, stopped: go.stopped });
        go.talk = step.talk;
        if (step.restart) listen(Constructor, go);
        else finish(step.problem);
      },
    });
    recognition.current = r;
    try {
      r.start();
    } catch {
      // A browser that refuses to start again keeps what she said; one that never started says so.
      finish(go.talk.sessions === 0 ? "failed" : null);
    }
  };

  const start = () => {
    setProblem(null);
    const Constructor = recognitionConstructor();
    if (!Constructor) return setProblem("failed");
    const go: Going = { before: value, talk: newTalk(), stopped: false };
    going.current = go;
    setPhase("starting");
    listen(Constructor, go);
  };

  const stop = () => {
    const go = going.current;
    if (!go || go.stopped) return;
    go.stopped = true;
    recognition.current?.stop();
    doneWait.current = setTimeout(() => {
      if (going.current !== go) return;
      const r = recognition.current;
      finish(null);
      r?.abort();
    }, DONE_WAIT_MS);
  };

  const listening = phase !== "off";
  return { supported, listening, ready: phase === "on", problem, toggle: listening ? stop : start };
}
