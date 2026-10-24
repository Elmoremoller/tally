import { fightStyles } from "@/lib/content";
import { Check } from "../icons";

// A tiny chat for each card. Decorative: the card's title and line carry the meaning.
function LoudChat() {
  return (
    <span className="chat chat-loud">
      <span className="chat-bubble is-them" style={{ width: "62%" }} />
      <span className="chat-bubble is-me" style={{ width: "74%" }} />
      <span className="chat-bubble is-them" style={{ width: "56%" }} />
      <span className="chat-bubble is-me" style={{ width: "68%" }} />
    </span>
  );
}

function QuietChat() {
  return (
    <span className="chat chat-quiet">
      <span className="chat-bubble is-me" style={{ width: "64%" }} />
      <span className="chat-seen">Seen</span>
      <span className="chat-typing">
        <i />
        <i />
        <i />
      </span>
    </span>
  );
}

const chats = { loud: LoudChat, quiet: QuietChat } as const;

/** Two cards, one for fights that get loud and one for fights that go quiet, with what the plan gives each. */
export function FightStyles() {
  return (
    <>
      <ul className="styles">
        {fightStyles.cards.map(({ id, title, text, gets }) => {
          const Chat = chats[id];
          return (
            <li key={id} className="style-card">
              <div className="style-visual" aria-hidden="true">
                <Chat />
              </div>
              <h3 className="style-title">{title}</h3>
              <p className="style-text">{text}</p>
              <ul className="style-gets">
                {gets.map((line) => (
                  <li key={line}>
                    <Check />
                    {line}
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
      <p className="mx-auto mt-9 max-w-[28em] text-center text-lead text-balance text-muted">{fightStyles.note}</p>
    </>
  );
}
