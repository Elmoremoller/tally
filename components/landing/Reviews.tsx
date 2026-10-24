import type { CSSProperties } from "react";
import { MotionToggle } from "@/components/MotionToggle";
import { reviewsTitle, type Testimonial } from "@/lib/testimonials";

// On phones the reviews are one row she swipes by hand, a card at a time with the next one peeking in: two rows
// drifting in opposite directions were unreadable at that width. From tablets up they drift sideways, the top
// row left and the bottom row right, after Saidwell. Each row is
// repeated enough to fill the widest screens, then drawn twice so it can loop without a seam; screen readers
// get each review once. A row stops while the pointer is on it, the button below stops both, and they rest
// while off screen. When the visitor prefers less motion nothing moves and each row scrolls by hand.

/** Cards in one pass of a row, so a pass is wider than the widest screen. */
const PASS = 8;
/** Seconds each card takes to move its own width, slow enough to read while it moves. */
const PACE = 9;

/** Her words, with the parts between **two stars** in bold. */
function Quote({ text }: { text: string }) {
  return text.split(/\*\*(.+?)\*\*/).map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : part));
}

function Card({ review }: { review: Testimonial }) {
  return (
    <figure className="review">
      <blockquote className="review-quote">
        <p>
          <Quote text={review.quote} />
        </p>
      </blockquote>
      <figcaption className="review-by">
        <span className="review-initial" aria-hidden="true">
          {review.name.trim().charAt(0)}
        </span>
        <span>
          <span className="review-name">{review.name}</span>
          {review.detail ? <span className="review-detail">{review.detail}</span> : null}
        </span>
      </figcaption>
    </figure>
  );
}

function Row({ reviews, reverse }: { reviews: readonly Testimonial[]; reverse?: boolean }) {
  const pass = Array.from({ length: Math.max(PASS, reviews.length) }, (_, i) => reviews[i % reviews.length]);
  const time = { "--reviews-time": `${pass.length * PACE * (reverse ? 1.15 : 1)}s` } as CSSProperties;
  return (
    <div className="reviews-row" data-reverse={reverse || undefined}>
      <div className="reviews-track" style={time}>
        <ul className="reviews-pass">
          {pass.map((review, i) => (
            <li key={i} aria-hidden={i >= reviews.length || undefined} data-repeat={i >= reviews.length || undefined}>
              <Card review={review} />
            </li>
          ))}
        </ul>
        <ul className="reviews-pass" aria-hidden="true" data-repeat>
          {pass.map((review, i) => (
            <li key={i}>
              <Card review={review} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Reviews({ reviews }: { reviews: readonly Testimonial[] }) {
  // Two rows once there are enough to tell apart, alternating between them; one row before that.
  const rows = reviews.length >= 6 ? [reviews.filter((_, i) => i % 2 === 0), reviews.filter((_, i) => i % 2 === 1)] : [reviews];
  return (
    <section className="band reviews" aria-labelledby="reviews-title" data-section="reviews" data-motion="running">
      <div className="wrap">
        <div className="center-head">
          <h2 id="reviews-title" className="heading">
            {reviewsTitle}
          </h2>
        </div>
      </div>
      {/* Phones: one row, swiped by hand. Tablets and up: the drifting rows. CSS shows one and hides the other. */}
      <div className="reviews-swipe" role="region" aria-label={reviewsTitle} tabIndex={0}>
        <ul>
          {reviews.map((review, i) => (
            <li key={i}>
              <Card review={review} />
            </li>
          ))}
        </ul>
      </div>
      <div className="reviews-rows">
        {rows.map((row, i) => (
          <Row key={i} reviews={row} reverse={i === 1} />
        ))}
      </div>
      <div className="wrap reviews-foot">
        <MotionToggle name="reviews" />
      </div>
    </section>
  );
}
