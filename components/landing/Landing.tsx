import { Mark } from "@/components/brand/Logo";
import { Faq } from "@/components/Faq";
import { GetStarted } from "@/components/GetStarted";
import { GetStartedBar } from "@/components/GetStartedBar";
import { previews } from "@/components/GetPreviews";
import { MotionToggle } from "@/components/MotionToggle";
import { PhoneMockup } from "@/components/PhoneMockup";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";
import { DayOfAsks } from "./DayOfAsks";
import { Reviews } from "./Reviews";
import { stepVisuals } from "./StepVisuals";
import { faqs, planParts, problem, steps, why, whyThis } from "@/lib/landing";
import { angles, offer, type AngleId } from "@/lib/offer";
import { reviewsMinimum, testimonials, type Testimonial } from "@/lib/testimonials";

/**
 * The headline with its key phrase in bold and the underline drawn under it. Punctuation right after the
 * phrase stays on its line, so a full stop never wraps on its own.
 */
function Headline({ angle }: { angle: AngleId }) {
  const { headline, key } = angles[angle];
  const at = headline.indexOf(key);
  if (at < 0) return <>{headline}</>;
  const end = at + key.length;
  const stuck = headline.slice(end).match(/^[.,?!”’]*/)?.[0] ?? "";
  return (
    <>
      {headline.slice(0, at)}
      <span className="whitespace-nowrap">
        <strong className="smile">{key}</strong>
        {stuck}
      </span>
      {headline.slice(end + stuck.length)}
    </>
  );
}

/** The hero's phone is off for now, so the hero is its copy alone. Set this to true to bring it back. */
const heroPhone = false;

/**
 * The landing page, for one ad angle: only the hero headline changes. Section order follows the brief, and
 * the bands alternate off white and tint as before. LAYOUT.md has the details. `reviews` is only passed by
 * the local preview; the live page shows the real ones from lib/testimonials.ts.
 */
export function Landing({ angle, reviews = testimonials }: { angle: AngleId; reviews?: readonly Testimonial[] }) {
  return (
    <>
      {/* No action in the nav: once the hero's button scrolls away, the Get started bar carries it. */}
      <SiteNav cta={false} login />

      <main id="main">
        {/* Hero: one centered column. With the phone, copy beside it on desktop, in a band shorter than the screen */}
        <section className="hero" aria-labelledby="hero-title" data-section="hero" data-motion={heroPhone ? "running" : undefined}>
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <h1 id="hero-title" className="hero-title">
                <Headline angle={angle} />
              </h1>
              <p className="hero-lead text-lead text-balance text-muted">{offer.sentence}</p>
              <div className="hero-cta">
                <GetStarted size="lg" label={offer.cta} />
                <p className="text-body text-balance text-muted">{offer.ctaNote}</p>
              </div>
            </div>
            {heroPhone ? (
              <div className="hero-visual">
                <div className="aura" aria-hidden="true">
                  <span className="aura-base aura-glow" />
                  <span className="aura-orbit aura-orbit-a aura-glow">
                    <span className="aura-blob" />
                  </span>
                  <span className="aura-orbit aura-orbit-b aura-glow">
                    <span className="aura-blob" />
                  </span>
                  <span className="aura-light aura-glow" />
                </div>
                <PhoneMockup />
              </div>
            ) : null}
          </div>
          {heroPhone ? <MotionToggle /> : null}
        </section>

        {/* The problem: her day of asks, the words beside it on desktop */}
        <section className="band bg-tint" aria-labelledby="problem-title" data-section="problem">
          <div className="wrap problem">
            <div className="problem-copy">
              <h2 id="problem-title" className="heading">
                {problem.title}
              </h2>
              {problem.lines.map((line) => (
                <p key={line} className="text-lead text-balance text-muted">
                  {line}
                </p>
              ))}
            </div>
            <DayOfAsks />
          </div>
        </section>

        {/* Why it happens: each finding led by its figure, then its words and its source */}
        <section className="band" aria-labelledby="why-title" data-section="why">
          <div className="wrap">
            <div className="center-head">
              <h2 id="why-title" className="heading">
                {why.title}
              </h2>
              <p className="text-lead text-balance text-muted">{why.lead}</p>
            </div>
            <ul className="stats">
              {why.stats.map(({ figure, text, source }) => (
                <li key={figure} className="stat">
                  <p className="stat-figure">{figure}</p>
                  <p className="stat-text">{text}</p>
                  <p className="stat-source">
                    <span>Source</span> {source}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* How it works: each step with a small picture of what it looks like */}
        <section className="band bg-tint" aria-labelledby="how-title" data-section="how">
          <div className="wrap">
            <div className="center-head">
              <h2 id="how-title" className="heading">
                How it works
              </h2>
            </div>
            <ol className="flow">
              {steps.map((step, i) => {
                const Visual = stepVisuals[i];
                return (
                  <li key={step} className="flow-step">
                    <div className="flow-visual" aria-hidden="true">
                      <Visual />
                    </div>
                    <div className="flow-text">
                      <span className="flow-num" aria-hidden="true">
                        {i + 1}
                      </span>
                      <p className="flow-title">{step}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* What's in your plan: the five parts on a deep slate band, then the way in. The landing page never shows the price. */}
        <section className="band band-deep" aria-labelledby="plan-title" data-section="plan">
          <div className="wrap">
            <div className="center-head">
              <h2 id="plan-title" className="heading">
                {planParts.title}
              </h2>
            </div>
            <ul className="parts">
              {planParts.parts.map(({ id, title, text }) => {
                const Preview = previews[id];
                return (
                  <li key={id} className="part">
                    <div className="part-visual" aria-hidden="true">
                      <Preview />
                    </div>
                    <div className="part-text">
                      <h3 className="part-title">{title}</h3>
                      <p className="part-desc">{text}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="plan-cta">
              <GetStarted size="lg" tone="invert" label={offer.cta} />
            </div>
          </div>
        </section>

        {/* Why this and not another AI course */}
        <section className="band bg-tint" aria-labelledby="why-this-title" data-section="why-this">
          <div className="wrap">
            <div className="center-head">
              <h2 id="why-this-title" className="heading">
                {whyThis.title}
              </h2>
            </div>
            <ul className="inside">
              {whyThis.items.map(({ lead, text, Icon, ...item }) => (
                <li key={lead} className="inside-card">
                  <span className="inside-icon" data-filled={"filled" in item || undefined} aria-hidden="true">
                    <Icon />
                  </span>
                  <p className="inside-text">
                    <strong>{lead}</strong> {text}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Reviews from real buyers, drifting sideways. Hidden until there are enough. */}
        {reviews.length >= reviewsMinimum ? <Reviews reviews={reviews} /> : null}

        {/* Final call to action */}
        <section className="closing" aria-labelledby="closing-title" data-section="closing">
          <div className="wrap grid justify-items-center gap-6">
            <Mark className="closing-mark" />
            <h2 id="closing-title" className="closing-title">
              {offer.adLine}
            </h2>
            <GetStarted size="lg" tone="invert" label={offer.cta} className="mt-2" />
            <p className="text-body font-medium lg:text-lead">{offer.quizTime}</p>
          </div>
        </section>

        {/* Questions */}
        <section className="band" aria-labelledby="faq-title" data-section="faq">
          <div className="wrap">
            <div className="center-head">
              <h2 id="faq-title" className="heading">
                Questions
              </h2>
            </div>
            <Faq items={faqs} />
          </div>
        </section>
      </main>

      <GetStartedBar />

      <SiteFooter />
    </>
  );
}
