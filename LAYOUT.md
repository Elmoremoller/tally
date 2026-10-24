# Layout

The section order and layout for the Worth Her Time landing page.

**Source.** The page keeps the layout, components and design system of the page it was copied from, which follows the Headroom landing page in `../headroom/` (one centered column, one offer, one action always in reach). The content and section order follow `WORTH_HER_TIME_BRIEF.md`. Words live in `lib/offer.ts` (name, price, the sentence, buttons, the angles) and `lib/landing.ts` (every section).

## Sections, top to bottom

Each section carries a `data-section` attribute in `components/landing/Landing.tsx`, so the order can be checked in the browser.

| # | `data-section` | Section | Component it reuses | Layout |
|---|---|---|---|---|
| 1 | `nav` | Nav | Nav | Sticky translucent bar with the name in the middle. Take the free quiz lives in the bottom bar. |
| 2 | `hero` | Hero | Hero | Warm white. The angle's headline with its key phrase in bold and the underline under it, the sentence, Take the free quiz and the line under it, and the phone playing through the product in front of the moving blush glow. Copy left and phone right on desktop; one centered column on phones and tablets. |
| 3 | `problem` | Sound familiar? | The tappable topic chips | Tinted band. The brief's moments as a wrapped row of chips. The chips no longer open a card. |
| 4 | `why` | Why it happens | Method cards | Warm white band. Three tinted cards, each an icon tile, a finding word for word, and its source under it. |
| 5 | `how` | How it works | How it works | Tinted band. Three numbered steps joined by a line: across on tablets and up, stacked on phones. |
| 6 | `plan` | What’s in your plan | Everything you get | Warm white band. Five tinted cards, each with a small copy of its plan screen, a title and one line. Three then two, centered, on desktop; two per row with the fifth centered on tablets; one column on phones. |
| 7 | `why-this` | Why this and not another AI course | What’s inside your plan | Tinted band. Four warm white cards, each an icon tile and one sentence starting with a bold lead. |
| 8 | `closing` | Final call to action | Closing band | Full bleed deep red band. The mark, the short ad line, Take the free quiz in inverted colours, and Takes about 2 minutes. |
| 9 | `faq` | Questions | FAQ | Warm white band. Six collapsible questions. |
| 10 | `footer` | Footer | Footer | The Privacy and Terms links, then the name across the full width. |

The bands still alternate warm white and tint after the hero. Cards follow the band they sit on: tinted on warm white, warm white on tint.

## What changed from the page it was copied from, and why

1. **Angles.** `?angle=` swaps the hero headline only. `proxy.ts` serves `/?angle=note_taker` from a copy of the page built ahead of time for that angle (`app/angle/[angle]`), so the address stays the same and the headline never flickers. A missing or unknown angle gets the default. The angle and any UTM values go in a 30 day cookie for the quiz to put on her session.
2. **The logo is the name in text.** The old logo was drawn artwork of the old name. Until there's new artwork, `components/brand/Logo.tsx` sets the name from `lib/offer.ts` in the display face, and the mark is its first letter in a ring. The favicon, the home screen icon and the share image are drawn from the config too.
3. **Removed, with no counterpart in the brief:** the hero eyebrow, the trust row under the hero, the two style cards, the hidden quotes section, the card under the chips, and the line in the footer.
4. **Five plan cards in a grid made for four.** The desktop grid now has six columns, each card spans two, and the last two sit in the middle.
5. **The bottom bar on phones.** Take the free quiz is longer than Get started was, so the arrow is dropped below 480px wide (it used to be below 360px), and on the smallest phones the label goes to two lines like the chip beside it.
6. **Order.** The brief lists the questions before the final call to action. The page keeps the house order, the red band before the questions.

## Layout rules

- Content width 68rem, side gutter `clamp(1rem, 4.5vw, 2rem)`, section padding `clamp(4.5rem, 2.75rem + 6vw, 8.5rem)`.
- Breakpoints at 735px (tablet) and 1069px (desktop). Mobile first.
- Section heads are centered, max width about 42rem.
- Cards: radius 24px, tinted on warm white sections and warm white on tinted sections.
- Light only. Backgrounds: hero on warm white, then tinted and warm white bands alternating, the closing band in deep red, the footer on warm white.
