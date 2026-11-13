import { Mic } from "@/components/icons";
import { micCopy } from "@/lib/questions";

/**
 * Talk instead of typing, inside the answer box. Tapping it turns it slate at once and it reads Getting ready
 * until the browser really is listening. Then three bars move in place of the mic and it reads Done: tapping
 * it again stops.
 */
export function MicButton({ listening, ready, onToggle }: { listening: boolean; ready: boolean; onToggle: () => void }) {
  return (
    <button type="button" className="quiz-mic" data-listening={listening || undefined} onClick={onToggle}>
      {listening && ready ? (
        <span className="quiz-mic-bars" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      ) : (
        <Mic />
      )}
      {!listening ? micCopy.start : ready ? micCopy.stop : micCopy.starting}
    </button>
  );
}
