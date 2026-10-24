# Layout

The section order and layout for the Worth Her Time landing page.

**Source.** The page keeps the layout, components and design system of the page it was copied from, which follows the Headroom landing page in `../headroom/` (one centered column, one offer, one action always in reach). The content and section order follow `WORTH_HER_TIME_BRIEF.md`. Words live in `lib/offer.ts` (name, price, the sentence, buttons, the angles) and `lib/landing.ts` (every section).

## Sections, top to bottom

Each section carries a `data-section` attribute in `components/landing/Landing.tsx`, so the order can be checked in the browser.

| # | `data-section` | Section | Component it reuses | Layout |
|---|---|---|---|---|
| 1 | `nav` | Nav | Nav | Sticky translucent bar with the name in the middle. Take the free quiz lives in the bottom bar. |
| 2 | `hero` | Hero | Hero | Warm white. The angle's headline with its key phrase in bold and the underline under it, the sentence, Take the free quiz and the line under it, and the phone playing through the product in front of the moving blush glow. Copy left and phone right on desktop; one centered column on phones and tablets. |
| 3 | `problem` | Sound familiar? | (new) | Tinted band. The brief's ten moments told as one day of hers: a deep red lock screen wallpaper (no phone) showing Thursday 7:48, and six frosted notifications from her manager, a sales lead, the head of people, a director, the all hands and an overdue reminder. They arrive one by one the first time the panel comes into view; all at once with reduced motion. Two lines beside it carry the rest. Words left and panel right on desktop; one centred column on phones and tablets. |
| 4 | `why` | Why it happens | (new, after Saidwell) | Warm white band, with a short lead line under the heading. Three tinted cards, each led by the finding's own figure set large (200 hours, Almost 50%, 13% vs 6%), then the finding word for word, then its source under a hairline. Stacked on phones, three across from tablets up. |
| 5 | `how` | How it works | (new, after Saidwell) | Tinted band. A warm white card per step: a small picture of what the step looks like on top (her answer being typed, her hours, her plan), then the step's number and line. Stacked on phones, three across from tablets up. |
| 6 | `plan` | What’s in your plan | Everything you get, after Saidwell | Deep red band. Five warm white cards, each a tinted panel with a small copy of its plan screen, then a red title and one line. Two columns on phones and tablets with the first card across the top; on desktop two wide cards over three. Then the price row: $19.99, a short note and Take the free quiz in inverted colours. The bottom bar steps aside while this band is on screen. |
| 7 | `why-this` | Why this and not another AI course | What’s inside your plan | Tinted band. Four warm white cards, each an icon tile and one sentence starting with a bold lead. |
| 8 | `reviews` | In their own words | (new, after Saidwell) | Warm white band, shown only once lib/testimonials.ts holds three real reviews. Tinted cards (her words in grey with one phrase in bold ink, then an initial, her name and a detail line) in two full width rows drifting sideways in opposite directions, the edges fading out; one row while there are fewer than six. A row rests under the pointer, the pause button under the rows stops both, and they rest off screen. With reduced motion nothing moves and each row scrolls by hand. Local preview with placeholders: /preview/reviews. |
| 9 | `closing` | Final call to action | Closing band | Full bleed deep red band. The mark, the short ad line, Take the free quiz in inverted colours, and Takes about 2 minutes. |
| 10 | `faq` | Questions | FAQ | Warm white band. Six collapsible questions. |
| 11 | `footer` | Footer | Footer | The Privacy and Terms links, then the name across the full width. |

After the hero the bands go warm white, tint, warm white, tint, then the deep red plan band, tint again, warm white for the reviews once they show, and the deep red closing band. Cards follow the band they sit on: tinted on warm white, warm white on tint and on red.

## What changed from the page it was copied from, and why

1. **Angles.** `?angle=` swaps the hero headline only. `proxy.ts` serves `/?angle=note_taker` from a copy of the page built ahead of time for that angle (`app/angle/[angle]`), so the address stays the same and the headline never flickers. A missing or unknown angle gets the default. The angle and any UTM values go in a 30 day cookie for the quiz to put on her session.
2. **The logo is the name in text.** The old logo was drawn artwork of the old name. Until there's new artwork, `components/brand/Logo.tsx` sets the name from `lib/offer.ts` in the display face, and the mark is its first letter in a ring. The favicon, the home screen icon and the share image are drawn from the config too.
3. **Removed, with no counterpart in the brief:** the hero eyebrow, the trust row under the hero, the two style cards, the hidden quotes section, the card under the chips, and the line in the footer.
4. **Why it happens, How it works and What’s in your plan, reworked after Saidwell (go.saidwell.com) on 2026-10-24.** The user asked for them to be easier to read through. Each finding now leads with its figure, each step shows what it looks like, and the plan's parts sit on a deep red band like Saidwell's Everything you get, compact two columns on phones, with the price and the button straight after them.
5. **The bottom bar on phones.** Take the free quiz is longer than Get started was, so the arrow is dropped below 480px wide (it used to be below 360px), and on the smallest phones the label goes to two lines like the chip beside it.
6. **Order.** The brief lists the questions before the final call to action. The page keeps the house order, the red band before the questions.

## Layout rules

- Content width 68rem, side gutter `clamp(1rem, 4.5vw, 2rem)`, section padding `clamp(4.5rem, 2.75rem + 6vw, 8.5rem)`.
- Breakpoints at 735px (tablet) and 1069px (desktop). Mobile first.
- Section heads are centered, max width about 42rem.
- Cards: radius 24px, tinted on warm white sections and warm white on tinted sections.
- Light only. Backgrounds: hero on warm white, then tinted and warm white bands alternating, the closing band in deep red, the footer on warm white.
