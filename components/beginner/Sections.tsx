import { GetStarted } from "@/components/GetStarted";
import {
  beginnerOffer,
  beginnerPage as copy,
  beginnerPaths as paths,
  beginnerSteps,
  beginnerStepsAfter,
} from "@/lib/beginner/copy";
import { JobPicker } from "./JobPicker";
import { Check } from "@/components/icons";
import { beginnerStepVisuals, beginnerWhichVisuals } from "./Shots";

/**
 * The beginner landing page between the hero and the closing band: which of two women she is, what AI could
 * take off her plate in her job, how it works, the two paths, and what changes. The bands alternate with off
 * white: blue tint, then warm sand for How it works, then tint again, and every button opens the beginner quiz. Each card carries a small
 * picture, drawn like the ones in How it works.
 */
export function BeginnerSections() {
  const { which, jobs, changes } = copy;
  const href = beginnerOffer.startHref;
  return (
    <>
      {/* Which one she is: never opened it, or uses it a little. Both go to the same quiz. */}
      <section className="band bg-tint" aria-labelledby="which-title" data-section="which">
        <div className="wrap">
          <div className="center-head">
            <h2 id="which-title" className="heading">
              {which.title}
            </h2>
          </div>
          <ul className="which">
            {which.cards.map((card, i) => (
              <li key={card.title} className="which-card">
                <div className="feeling-visual" aria-hidden="true">
                  {beginnerWhichVisuals[i]()}
                </div>
                <h3 className="which-title">{card.title}</h3>
                <ul className="which-lines">
                  {card.lines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <GetStarted label={which.button} href={href} className="which-cta" />
              </li>
            ))}
          </ul>
          <p className="section-after text-lead text-balance">{which.after}</p>
        </div>
      </section>

      {/* Her job: tap one, see what AI could do in it */}
      <section className="band" aria-labelledby="jobs-title" data-section="jobs">
        <div className="wrap">
          <div className="center-head">
            <h2 id="jobs-title" className="heading">
              {jobs.title}
            </h2>
            <p className="text-lead text-balance text-muted">{jobs.lead}</p>
          </div>
          <JobPicker />
          <div className="jobs-foot">
            <p className="text-lead text-balance text-muted">{jobs.after}</p>
            <GetStarted size="lg" label={beginnerOffer.cta} href={href} />
          </div>
        </div>
      </section>

      {/* How it works: the quiz, her first win and her plan, each as a small copy of the real screen */}
      <section className="band band-sand" aria-labelledby="how-title" data-section="how">
        <div className="wrap">
          <div className="center-head">
            <h2 id="how-title" className="heading">
              How it works
            </h2>
          </div>
          <ol className="flow" data-rich>
            {beginnerSteps.map((step, i) => (
              <li key={step} className="flow-step">
                <div className="flow-visual" aria-hidden="true">
                  {beginnerStepVisuals[i]()}
                </div>
                <div className="flow-text">
                  <span className="flow-num" aria-hidden="true">
                    {i + 1}
                  </span>
                  <p className="flow-title">{step}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="section-after text-lead text-balance">{beginnerStepsAfter}</p>
        </div>
      </section>

      {/* Two paths: where she starts decides what Tally walks her through */}
      <section className="band" aria-labelledby="paths-title" data-section="paths">
        <div className="wrap">
          <div className="center-head">
            <h2 id="paths-title" className="heading">
              {paths.title}
            </h2>
            <p className="text-lead text-balance text-muted">{paths.lead}</p>
          </div>
          <ul className="paths">
            {paths.paths.map((path) => (
              <li key={path.label} className="path">
                <h3 className="path-label">{path.label}</h3>
                <ol className="path-steps">
                  {path.steps.map((step, i) => (
                    <li key={step}>
                      <span className="path-num" aria-hidden="true">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </li>
            ))}
          </ul>
          <p className="section-after text-lead text-balance">{paths.after}</p>
        </div>
      </section>

      {/* What changes: her week, the way it goes today beside the way it goes once it is set up */}
      <section className="band bg-tint" aria-labelledby="changes-title" data-section="changes">
        <div className="wrap">
          <div className="center-head">
            <h2 id="changes-title" className="heading">
              {changes.title}
            </h2>
            <p className="text-lead text-balance text-muted">{changes.lead}</p>
          </div>
          <div className="week">
            <div className="week-head" aria-hidden="true">
              <span />
              <span>{changes.before}</span>
              <span>{changes.after}</span>
            </div>
            <ol className="week-rows">
              {changes.days.map((d) => (
                <li key={d.what} className="week-row">
                  <p className="week-day">{d.what}</p>
                  <p className="week-before">
                    <span className="sr-only">{changes.before}: </span>
                    {d.before}
                  </p>
                  <p className="week-after">
                    <span className="sr-only">{changes.after}: </span>
                    <Check aria-hidden="true" />
                    <span>{d.after}</span>
                    {d.kind ? <em>{d.kind}</em> : null}
                  </p>
                </li>
              ))}
            </ol>
          </div>
          <p className="week-close">
            {changes.close.map((line) => (
              <span key={line}>{line} </span>
            ))}
          </p>
        </div>
      </section>
    </>
  );
}
