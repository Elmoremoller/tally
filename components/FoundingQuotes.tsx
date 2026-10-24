import { foundingQuotes, QUOTES_MIN } from "@/lib/quotes";

/** Real quotes from founding couples, shown only once there are at least three. See lib/quotes.ts. */
export function FoundingQuotes() {
  if (foundingQuotes.length < QUOTES_MIN) return null;
  return (
    <section className="band" aria-labelledby="quotes-title" data-section="quotes">
      <div className="wrap">
        <div className="center-head">
          <h2 id="quotes-title" className="heading">
            From our founding couples
          </h2>
        </div>
        <ul className="quotes">
          {foundingQuotes.map(({ quote, name }) => (
            <li key={quote}>
              <figure className="quote">
                <blockquote className="quote-text">
                  <p>“{quote}”</p>
                </blockquote>
                <figcaption className="quote-by">
                  <span className="quote-name">{name}</span>
                  <span>Founding couple</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
