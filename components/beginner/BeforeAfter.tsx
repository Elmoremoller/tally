import { Check } from "@/components/icons";
import { beginnerProblem as copy } from "@/lib/beginner/copy";

// Sound familiar on the beginner page: one chat, asked twice. What she typed and the generic answer it got,
// then what her plan has her paste and the answer she could use. Stacked on phones, side by side from tablets
// up. The words are real text, not a picture, so a screen reader reads both chats in order.

type Side = (typeof copy)["before"] | (typeof copy)["after"];

function Chat({ side, kind }: { side: Side; kind: "before" | "after" }) {
  return (
    <figure className="compare-card" data-kind={kind}>
      <figcaption className="compare-label">{side.label}</figcaption>
      <p className="compare-ask">{side.prompt}</p>
      <div className="compare-answer">
        {side.answer.map((part) => (
          <p key={part}>{part}</p>
        ))}
      </div>
      {side.more ? <p className="compare-more">{side.more}</p> : null}
      <p className="compare-verdict">
        {kind === "after" ? <Check aria-hidden="true" /> : null}
        {side.verdict}
      </p>
    </figure>
  );
}

export function BeforeAfter() {
  return (
    <div className="compare-wrap">
      <div className="compare">
        <Chat side={copy.before} kind="before" />
        <Chat side={copy.after} kind="after" />
      </div>
      <p className="compare-caption">{copy.caption}</p>
    </div>
  );
}
