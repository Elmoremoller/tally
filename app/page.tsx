import { Mark } from "@/components/brand/Logo";
import { Faq } from "@/components/Faq";
import { FoundingQuotes } from "@/components/FoundingQuotes";
import { GetStarted } from "@/components/GetStarted";
import { GetStartedBar } from "@/components/GetStartedBar";
import { previews } from "@/components/GetPreviews";
import { MotionToggle } from "@/components/MotionToggle";
import { PhoneMockup } from "@/components/PhoneMockup";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";
import { TrustRow } from "@/components/TrustRow";
import { FightStyles } from "@/components/landing/FightStyles";
import { TopicTaster, type TasterTopic } from "@/components/landing/TopicTaster";
import { faqs, fightStyles, gets, inside, method, steps } from "@/lib/content";
import { scripts } from "@/lib/plan";
import { fightTopics } from "@/lib/quiz";

// The plan's own words for each topic: a way to bring it up, a line for when it heats up (the one who needs a
// minute says it), and a way to make up after.
const tasterTopics: TasterTopic[] = fightTopics.map(({ id, label }) => ({
  id,
  label,
  lines: [scripts[id].open, scripts[id].awayNow, scripts[id].after],
}));

// Section order follows LAYOUT.md.
export default function Home() {
  return (
    <>
      {/* No action in the nav: once the hero's button scrolls away, the Get started bar carries it. */}
      <SiteNav cta={false} />

      <main id="main">
        {/* Hero: one centered column on phones, copy beside the phone on desktop, in a band shorter than the screen */}
        <section className="hero" aria-labelledby="hero-title" data-section="hero" data-motion="running">
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <p className="text-lead font-semibold text-balance text-ink">For couples going through a hard patch</p>
              <h1 id="hero-title" className="hero-title mt-3.5">
                Know exactly <strong className="smile">what to say</strong> when it starts going wrong.
              </h1>
              <p className="hero-lead text-lead text-balance text-muted">
                Find your couple pattern in 3 minutes. Get a personal plan with the words to use in your hardest
                moments, a 10 minute repair for right after a fight, and one small step a day.
              </p>
              <div className="hero-cta">
                <GetStarted size="lg" label="Find our pattern" />
                <p className="text-body font-medium text-balance text-muted lg:text-lead">
                  Takes 3 minutes. Works even if your partner isn’t on board yet.
                </p>
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

        {/* Three true things, where other pages show press logos */}
        <TrustRow />

        {/* What's inside your plan: the four parts people feel first */}
        <section className="band" aria-labelledby="inside-title" data-section="inside">
          <div className="wrap">
            <div className="center-head">
              <h2 id="inside-title" className="heading">
                {inside.title}
              </h2>
            </div>
            <ul className="inside">
              {inside.items.map(({ lead, text, Icon, ...item }) => (
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

        {/* Topics */}
        <section className="band bg-tint" aria-labelledby="topics-title" data-section="topics">
          <div className="wrap">
            <div className="center-head">
              <h2 id="topics-title" className="heading">
                What do you two fight about most?
              </h2>
              <p className="text-lead text-balance text-muted">Tap one to see the words your plan gives you.</p>
            </div>
            <TopicTaster topics={tasterTopics} />
            <p className="mx-auto mt-9 max-w-[28em] text-center text-lead text-balance text-muted">
              Your plan is built around the ones you pick.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section className="band" aria-labelledby="how-title" data-section="how">
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

        {/* One simple method */}
        <section className="band bg-tint" aria-labelledby="method-title" data-section="method">
          <div className="wrap">
            <div className="center-head">
              <h2 id="method-title" className="heading">
                One simple method
              </h2>
            </div>
            <ul className="method">
              {method.map(({ title, text, Icon }) => (
                <li key={title} className="method-card">
                  <span className="method-icon" aria-hidden="true">
                    <Icon />
                  </span>
                  <h3 className="method-title">{title}</h3>
                  <p className="method-text">{text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Everything you get */}
        <section className="band" aria-labelledby="get-title" data-section="get">
          <div className="wrap">
            <div className="center-head">
              <h2 id="get-title" className="heading">
                Everything you get
              </h2>
            </div>
            <ul className="gets">
              {gets.map(({ id, title, text }) => {
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

        {/* Loud fights or quiet ones */}
        <section className="band bg-tint" aria-labelledby="styles-title" data-section="styles">
          <div className="wrap">
            <div className="center-head">
              <h2 id="styles-title" className="heading">
                {fightStyles.title}
              </h2>
            </div>
            <FightStyles />
          </div>
        </section>

        {/* Founding couple quotes: nothing until there are three real ones (lib/quotes.ts) */}
        <FoundingQuotes />

        {/* Closing band */}
        <section className="closing" aria-labelledby="closing-title" data-section="closing">
          <div className="wrap grid justify-items-center gap-6">
            <Mark className="closing-mark" />
            <h2 id="closing-title" className="closing-title">
              Ready to fight less?
            </h2>
            <GetStarted size="lg" tone="invert" className="mt-2" />
            <p className="text-body font-medium lg:text-lead">Takes under 3 minutes</p>
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
