import { trust } from "@/lib/content";
import { Check } from "./icons";

/** Three true things, in a slim row under the hero: what a new product can say before it has press or quotes. */
export function TrustRow() {
  return (
    <div className="trust" data-section="trust">
      <div className="wrap">
        <ul className="trust-list">
          {trust.map((line) => (
            <li key={line} className="trust-item">
              <span className="trust-icon" aria-hidden="true">
                <Check />
              </span>
              {line}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
