import type { CSSProperties } from "react";
import { Mark } from "@/components/brand/Logo";
import { DotField } from "@/components/DotField";
import { Faq } from "@/components/Faq";
import { GetStarted } from "@/components/GetStarted";
import { GetStartedBar } from "@/components/GetStartedBar";
import { previews } from "@/components/GetPreviews";
import { MotionToggle } from "@/components/MotionToggle";
import { PhoneMockup } from "@/components/PhoneMockup";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";
import { BeforeAfter } from "@/components/beginner/BeforeAfter";
import { BeginnerSections } from "@/components/beginner/Sections";
import { beginnerFeelingVisuals, beginnerStepVisuals } from "@/components/beginner/Shots";
import { DayOfAsks } from "./DayOfAsks";
import { Reviews } from "./Reviews";
import { stepVisuals } from "./StepVisuals";
import { faqs, planParts, problem, steps, why } from "@/lib/landing";
import { beginnerFaqs, beginnerOffer, beginnerProblem, beginnerSteps, beginnerWhy } from "@/lib/beginner/copy";
import { angleFit, angles, isBeginner, offer, type AngleId } from "@/lib/offer";
import { beginnerLandingTestimonials, landingTestimonials, reviewsMinimum, type Testimonial } from "@/lib/testimonials";

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

/** A sentence with non-breaking spaces, so a line can only break before or after it. */
const whole = (sentence: string) => sentence.replaceAll(" ", "\u00a0");

/**
 * The page's words and small pictures for an angle. The beginner angles (lib/offer.ts) get the beginner
 * version's, and their buttons open its quiz; every other angle gets the first version's.
 */
function pageFor(angle: AngleId) {
  if (!isBeginner(angle)) {
    return {
      lead: offer.lead,
      cta: offer.cta,
      ctaNote: offer.ctaNote,
      quizTime: offer.quizTime,
      adLine: offer.adLine,
      href: undefined,
      beginner: false,
      problem,
      day: problem,
      why,
      feelingVisuals: null,
      steps: steps.map((step, i) => ({ step, Visual: stepVisuals[i] })),
      plan: { title: planParts.title, parts: planParts.parts.map((part) => ({ ...part, Preview: previews[part.id] })) },
      reviews: landingTestimonials,
      faqs,
    };
  }
  return {
    lead: beginnerOffer.lead,
    cta: beginnerOffer.cta,
    ctaNote: beginnerOffer.ctaNote.map(whole).join(" "),
    quizTime: beginnerOffer.quizTime,
    adLine: beginnerOffer.adLine,
    href: beginnerOffer.startHref,
    beginner: true,
    problem: beginnerProblem,
    day: undefined,
    why: beginnerWhy,
    feelingVisuals: beginnerFeelingVisuals,
    steps: beginnerSteps.map((step, i) => ({ step, Visual: beginnerStepVisuals[i] })),
    // No What's in your plan here: it said what How it works already shows, so those three pictures carry the plan.
    plan: null,
    reviews: beginnerLandingTestimonials,
    faqs: [...beginnerFaqs, { q: "Can I get a refund?", a: offer.refund }],
  };
}

/** The hero's phone is off for now, so the hero is its copy alone. Set this to true to bring it back. */
const heroPhone = false;

/**
 * The landing page, for one ad angle. Among the first version's angles only the hero headline changes; a
 * beginner angle changes every section's words (pageFor above). Section order follows the brief, and
 * the bands alternate off white and tint as before. LAYOUT.md has the details. `reviews` is only passed by
 * the local preview; otherwise lib/testimonials.ts decides, and the live site only ever shows real ones.
 */
export function Landing({ angle, reviews: given }: { angle: AngleId; reviews?: readonly Testimonial[] }) {
  const fit = angleFit(angle);
  const page = pageFor(angle);
  const reviews = given ?? page.reviews;
  const { problem, why } = page;
  // Running on empty (It's not you on the beginner page): each feeling named big, then what it's like, then
  // what Tally does about it. The beginner page draws each feeling above its name.
  const whySection = (
    <section className={page.beginner ? "band bg-tint" : "band"} aria-labelledby="why-title" data-section="why">
      <div className="wrap">
        <div className="center-head">
          <h2 id="why-title" className="heading">
            {why.title}
          </h2>
          <p className="text-lead text-balance text-muted">{why.lead}</p>
        </div>
        <ul className="feelings" data-long={page.beginner || undefined}>
          {why.cards.map(({ feeling, text, outcome }, i) => (
            <li key={feeling} className="feeling">
              {page.feelingVisuals ? (
                <div className="feeling-visual" aria-hidden="true">
                  {page.feelingVisuals[i]()}
                </div>
              ) : null}
              <p className="feeling-word">{feeling}</p>
              <p className="feeling-text">{text}</p>
              <p className="feeling-outcome">
                <span>With Tally</span> {outcome}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
  // How it works: each step with a small picture of what it looks like.
  const howSection = (
    <section className={page.beginner ? "band" : "band bg-tint"} aria-labelledby="how-title" data-section="how">
      <div className="wrap">
        <div className="center-head">
          <h2 id="how-title" className="heading">
            How it works
          </h2>
        </div>
        <ol className="flow" data-rich={page.beginner || undefined}>
          {page.steps.map(({ step, Visual }, i) => {
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
  );
  return (
    <>
      {/* No action in the nav: once the hero's button scrolls away, the Get started bar carries it. */}
      <SiteNav cta={false} login />

      <main id="main">
        {/* Hero: one centered column. With the phone, copy beside it on desktop, in a band shorter than the screen */}
        <section className="hero" aria-labelledby="hero-title" data-section="hero" data-motion="running">
          {heroPhone ? null : <DotField />}
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <h1
                id="hero-title"
                className="hero-title"
                data-fit={fit ? "" : undefined}
                style={fit ? ({ "--key-em": fit } as CSSProperties) : undefined}
              >
                <Headline angle={angle} />
              </h1>
              <p className="hero-lead text-lead text-balance text-muted">{page.lead}</p>
              <div className="hero-cta">
                <GetStarted size="lg" label={page.cta} href={page.href} />
                <p className="text-body text-balance text-muted">{page.ctaNote}</p>
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
          {/* No pause button on the hero's dots (the user's call, 2026-11-12): they always play, rest while the
              hero is off screen, and hold still for anyone whose device asks for less motion. */}
          <MotionToggle name="background" control={false} />
        </section>

        {/* Between the hero and the closing band, the beginner page has its own sections (the work she hates,
            which one she is, her job, what changes). The first version's follow. */}
        {page.beginner ? (
          <>
            <BeginnerSections />
            {/* The same placeholder reviews as the first version until this one has its own; never on the live site. */}
            {reviews.length >= reviewsMinimum ? <Reviews reviews={reviews} /> : null}
          </>
        ) : (
          <>
            {/* The problem: her day of asks, the words beside it on desktop. On the beginner page it is one chat asked
                twice, under the words. */}
            <section className="band bg-tint" aria-labelledby="problem-title" data-section="problem">
              <div className={page.beginner ? "wrap problem problem-wide" : "wrap problem"}>
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
                {page.beginner ? <BeforeAfter /> : <DayOfAsks problem={page.day} />}
              </div>
            </section>

            {/* The first version names the feelings, then shows how it works. The beginner page shows how it works
                first, right after the day she recognizes, and the feelings after it answer what still holds her back.
                The two bands swap their backgrounds with their places, so off white and tint still alternate. */}
            {page.beginner ? howSection : whySection}
            {page.beginner ? whySection : howSection}

            {/* What's in your plan: the five parts on a deep slate band. The way in is the closing band's button right
                below it (they read as one slate block until the reviews show). The landing page never shows the price.
                The beginner page has no such section. */}
            {page.plan ? (
              <section className="band band-deep" aria-labelledby="plan-title" data-section="plan">
                <div className="wrap">
                  <div className="center-head">
                    <h2 id="plan-title" className="heading">
                      {page.plan.title}
                    </h2>
                  </div>
                  <ul className="parts">
                    {page.plan.parts.map(({ id, title, text, Preview }) => {
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
                </div>
              </section>
            ) : null}

            {/* Reviews drifting sideways: placeholders until there are enough real ones, and never placeholders on the live site. */}
            {reviews.length >= reviewsMinimum ? <Reviews reviews={reviews} /> : null}
          </>
        )}

        {/* Final call to action */}
        <section className="closing" aria-labelledby="closing-title" data-section="closing">
          <div className="wrap grid justify-items-center gap-6">
            <Mark className="closing-mark" />
            <h2 id="closing-title" className="closing-title">
              {page.adLine}
            </h2>
            <GetStarted size="lg" tone="invert" label={page.cta} href={page.href} className="mt-2" />
            <p className="text-body font-medium lg:text-lead">{page.quizTime}</p>
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
            <Faq items={page.faqs} />
          </div>
        </section>
      </main>

      <GetStartedBar href={page.href} />

      <SiteFooter />
    </>
  );
}
