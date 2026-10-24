"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Mic } from "@/components/icons";
import { micCopy } from "@/lib/questions";

// The browser's own speech recognition: Chrome, Edge and Safari have it, Firefox doesn't, so the button only
// shows where it works. What she says becomes text in her browser (or her browser maker's service) and
// lands in the box, where she can read and fix it before going on.

type Recognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: { resultIndex: number; results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
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

/** Talk instead of typing. Each finished phrase is handed to `onText`; tap again to stop. */
export function MicButton({ onText }: { onText: (text: string) => void }) {
  const supported = useSyncExternalStore(noSubscription, () => recognitionConstructor() !== null, () => false);
  const [listening, setListening] = useState(false);
  const recognition = useRef<Recognition | null>(null);
  const handOn = useRef(onText);

  useEffect(() => {
    handOn.current = onText;
  }, [onText]);
  // Leaving the screen stops listening.
  useEffect(() => () => recognition.current?.abort(), []);

  if (!supported) return null;

  const toggle = () => {
    if (listening) {
      recognition.current?.stop();
      return;
    }
    const Constructor = recognitionConstructor();
    if (!Constructor) return;
    const r = new Constructor();
    r.lang = "en-US";
    r.continuous = true;
    r.interimResults = false;
    r.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) handOn.current(result[0].transcript.trim());
      }
    };
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    recognition.current = r;
    try {
      r.start();
      setListening(true);
    } catch {
      setListening(false);
    }
  };

  return (
    <button type="button" className="quiz-mic" aria-pressed={listening} onClick={toggle}>
      <Mic />
      {listening ? micCopy.stop : micCopy.start}
      {listening ? <span className="sr-only">. {micCopy.listening}</span> : null}
    </button>
  );
}
