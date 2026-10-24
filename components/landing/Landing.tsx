import { Mark } from "@/components/brand/Logo";
import { Faq } from "@/components/Faq";
import { GetStarted } from "@/components/GetStarted";
import { GetStartedBar } from "@/components/GetStartedBar";
import { previews } from "@/components/GetPreviews";
import { MotionToggle } from "@/components/MotionToggle";
import { PhoneMockup } from "@/components/PhoneMockup";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";
import { faqs, planParts, problem, steps, why, whyThis } from "@/lib/landing";
import { angles, offer, type AngleId } from "@/lib/offer";

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

/**
 * The landing page, for one ad angle: only the hero headline changes. Section order follows the brief, and
 * the bands alternate warm white and tint as before. LAYOUT.md has the details.
 */
export function Landing({ angle }: { angle: AngleId }) {
  return (
    <>
      {/* No action in the nav: once the hero's button scrolls away, the Get started bar carries it. */}
      <SiteNav cta={false} />

      <main id="main">
        {/* Hero: one centered column on phones, copy beside the phone on desktop, in a band shorter than the screen */}
        <section className="hero" aria-labelledby="hero-title" data-section="hero" data-motion="running">
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <h1 id="hero-title" className="hero-title">
                <Headline angle={angle} />
              </h1>
              <p className="hero-lead text-lead text-balance text-muted">{offer.sentence}</p>
              <div className="hero-cta">
                <GetStarted size="lg" label={offer.cta} />
                <p className="text-body font-medium text-balance text-muted lg:text-lead">{offer.ctaNote}</p>
              </div>
            </div>
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
          </div>
          <MotionToggle />
        </section>

        {/* The problem: moments she'll recognise */}
        <section className="band bg-tint" aria-labelledby="problem-title" data-section="problem">
          <div className="wrap">
            <div className="center-head">
              <h2 id="problem-title" className="heading">
                {problem.title}
              </h2>
            </div>
            <ul className="topics">
              {problem.moments.map((moment) => (
                <li key={moment} className="topic">
                  {moment}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Why it happens: three findings, each with its source */}
        <section className="band" aria-labelledby="why-title" data-section="why">
          <div className="wrap">
            <div className="center-head">
              <h2 id="why-title" className="heading">
                {why.title}
              </h2>
            </div>
            <ul className="method">
              {why.stats.map(({ text, source, Icon, ...stat }) => (
                <li key={text} className="method-card">
                  <span className="method-icon" data-filled={"filled" in stat || undefined} aria-hidden="true">
                    <Icon />
                  </span>
                  <p className="method-text">{text}</p>
                  <p className="method-source">
                    <span>Source</span> {source}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* How it works */}
        <section className="band bg-tint" aria-labelledby="how-title" data-section="how">
          <div className="wrap">
            <div className="center-head">
              <h2 id="how-title" className="heading">
                How it works
              </h2>
            </div>
            <ol className="steps">
              {steps.map((step, i) => (
                <li key={step} className="step">
                  <span className="step-num" aria-hidden="true">
                    {i + 1}
                  </span>
                  <p className="step-text">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* What's in your plan: the five parts, each with a small copy of its screen */}
        <section className="band" aria-labelledby="plan-title" data-section="plan">
          <div className="wrap">
            <div className="center-head">
              <h2 id="plan-title" className="heading">
                {planParts.title}
              </h2>
            </div>
            <ul className="gets">
              {planParts.parts.map(({ id, title, text }) => {
                const Preview = previews[id];
                return (
                  <li key={id} className="get">
                    <div className="get-visual" aria-hidden="true">
                      <Preview />
                    </div>
                    <div className="get-text">
                      <h3 className="get-title">{title}</h3>
                      <p className="get-desc">{text}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
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
