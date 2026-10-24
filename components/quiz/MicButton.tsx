import { Mic } from "@/components/icons";
import { micCopy } from "@/lib/questions";

/**
 * Talk instead of typing, inside the answer box. While listening it turns slate, with three bars moving in
 * place of the mic, and reads Done: tapping it again stops.
 */
export function MicButton({ listening, onToggle }: { listening: boolean; onToggle: () => void }) {
  return (
    <button type="button" className="quiz-mic" data-listening={listening || undefined} onClick={onToggle}>
      {listening ? (
        <span className="quiz-mic-bars" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      ) : (
        <Mic />
      )}
      {listening ? micCopy.stop : micCopy.start}
    </button>
  );
}
