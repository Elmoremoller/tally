# Layout

The section order and layout for the Tally landing page.

**Source.** The page keeps the layout, components and design system of the page it was copied from, which follows the Headroom landing page in `../headroom/` (one centered column, one offer, one action always in reach). The content and section order follow `WORTH_HER_TIME_BRIEF.md`. Words live in `lib/offer.ts` (name, price, the sentence, buttons, the angles) and `lib/landing.ts` (every section).

## Sections, top to bottom

Each section carries a `data-section` attribute in `components/landing/Landing.tsx`, so the order can be checked in the browser.

| # | `data-section` | Section | Component it reuses | Layout |
|---|---|---|---|---|
| 1 | `nav` | Nav | Nav | Sticky translucent bar with the name in the middle and Log in at the right end, quiet like the footer links, for someone coming back to her plan (it opens Open your plan). Take the free quiz lives in the bottom bar. The quiz, the paywall, the plan pages and Open your plan itself have no Log in. |
| 2 | `hero` | Hero | Hero | Off white. The angle's headline with its key phrase in italic and the underline under it (a key too wide for a small phone, like the default's, has a `fit` in `lib/offer.ts` that shrinks the headline on narrow phones just enough for it to fit), the sentence, and Take the free quiz with the line under it, in one centered column at every width. The phone playing through the product in front of the moving sky blue glow is off for now: set `heroPhone` in `components/landing/Landing.tsx` to true to bring it back, with the copy left and the phone right on desktop. |
| 3 | `problem` | Sound familiar? | (new) | Tinted band. The brief's ten moments told as one day of hers: a deep slate lock screen wallpaper (no phone) showing Thursday 7:48, and six frosted notifications from her manager, a coworker, HR, a director, the all hands and an overdue reminder. They arrive one by one the first time the panel comes into view; all at once with reduced motion. Two lines beside it carry the rest. Words left and panel right on desktop; one centred column on phones and tablets. |
| 4 | `why` | Why it happens | (new, after Saidwell) | Off white band, with a short lead line under the heading. Three tinted cards, each led by the finding's own figure set large (200 hours, Almost 50%, 13% vs 6%), then the finding word for word, then its source under a hairline. Stacked on phones, three across from tablets up. |
| 5 | `how` | How it works | (new, after Saidwell) | Tinted band. An off white card per step: a small picture of what the step looks like on top (her answer being typed, her hours, her plan), then the step's number and line. Stacked on phones, three across from tablets up. |
| 6 | `plan` | What’s in your plan | Everything you get, after Saidwell | Deep slate band. Five off white cards, each a tinted panel with a small copy of its plan screen, then a slate title and one line. Two columns on phones and tablets with the first card across the top; on desktop two wide cards over three. Then Take the free quiz in inverted colours, centred. The landing page never shows the price (the user's rule, 2026-10-24); the paywall shows it after the free result. The bottom bar steps aside while this band is on screen. |
| 7 | `why-this` | Why this and not another AI course | What’s inside your plan | Tinted band. Four off white cards, each an icon tile and one sentence starting with a bold lead. |
| 8 | `reviews` | In their own words | (new, after Saidwell) | Off white band. Until lib/testimonials.ts holds three real reviews, invented placeholders fill it everywhere except the live Vercel production site, where it stays hidden. Tinted cards (her words in muted slate with one phrase in bold ink, then an initial, her name and a detail line) in two full width rows drifting sideways in opposite directions, the edges fading out; one row while there are fewer than six. A row rests under the pointer, the pause button under the rows stops both, and they rest off screen. With reduced motion nothing moves and each row scrolls by hand. Local preview with placeholders: /preview/reviews. |
| 9 | `closing` | Final call to action | Closing band | Full bleed deep slate band. The mark (the T tile from the favicon), the short ad line, Take the free quiz in inverted colours, and Takes about 2 minutes. |
| 10 | `faq` | Questions | FAQ | Off white band. Six collapsible questions. |
| 11 | `footer` | Footer | Footer | The Log in, Privacy and Terms links, then the wordmark under them, both centred. |

After the hero the bands go off white, tint, off white, tint, then the deep slate plan band, tint again, off white for the reviews once they show, and the deep slate closing band. Cards follow the band they sit on: tinted on off white, off white on tint and on slate.

## What changed from the page it was copied from, and why

1. **Angles.** `?angle=` swaps the hero headline only. `proxy.ts` serves `/?angle=note_taker` from a copy of the page built ahead of time for that angle (`app/angle/[angle]`), so the address stays the same and the headline never flickers. A missing or unknown angle gets the default. The angle and any UTM values go in a 30 day cookie for the quiz to put on her session.
2. **The Tally logo.** On 2026-10-24 the offer was renamed Tally, with its own logo and colours. The supplied artwork is in `brand/`: the wordmark in dusty blue for light backgrounds, the wordmark in off white for dark ones, and the app icon. `components/brand/paths.ts` holds them traced to SVG, `components/brand/Logo.tsx` draws the wordmark in dusty blue and the mark as the icon's tile, `app/icon.svg` is the supplied favicon (with `app/favicon.ico` made from it), and the home screen icon and the share image are drawn from the same paths.
3. **Removed, with no counterpart in the brief:** the hero eyebrow, the trust row under the hero, the two style cards, the hidden quotes section, the card under the chips, and the line in the footer.
4. **Why it happens, How it works and What’s in your plan, reworked after Saidwell (go.saidwell.com) on 2026-10-24.** The user asked for them to be easier to read through. Each finding now leads with its figure, each step shows what it looks like, and the plan's parts sit on a deep coloured band (slate since the Tally colours) like Saidwell's Everything you get, compact two columns on phones, with the price and the button straight after them.
5. **The bottom bar on phones.** Take the free quiz is longer than Get started was, so the arrow is dropped below 480px wide (it used to be below 360px), and on the smallest phones the label goes to two lines like the chip beside it.
6. **Order.** The brief lists the questions before the final call to action. The page keeps the house order, the slate band before the questions.
7. **Tighter sections, and the hero without its phone, on 2026-10-24.** The user found every section too big, especially on desktop. The band padding went from at most 136px a side to at most 88px (130px to 83px at 1440px wide), section headings from at most 62px to 54px, the space under a section head from 64px to 48px, and the closing band and its line came down to match. The user also asked for the hero's phone to come out for now, so the hero is its copy alone, centred.

## Layout rules

- Content width 68rem, side gutter `clamp(1rem, 4.5vw, 2rem)`, section padding `clamp(3.5rem, 2.5rem + 3vw, 5.5rem)`.
- Breakpoints at 735px (tablet) and 1069px (desktop). Mobile first.
- Section heads are centered, max width about 42rem.
- Cards: radius 24px, tinted on off white sections and off white on tinted sections.
- Light only. Backgrounds: hero on off white, then tinted and off white bands alternating, the plan and closing bands in deep slate, the footer on off white.
- Colours: only the five Tally colours, plus tones of them. Off white `#EFEAE4` is the page. Deep slate blue `#48596B` carries text, headings, buttons and the two strong bands (6:1 on off white). Light sky blue `#AECAE8` makes the tint (40% on off white, `#D5DDE6`) and the glows. Dusty blue `#7A90A8` is the logo and its tile. Warm tan `#A68A69` is the line under a key phrase. Dusty blue and tan are under 3:1 on off white, so they never carry text.
- Type: headings in a condensed serif and everything else in a grotesk, after the brand board's Times New Roman Condensed and Neue Montreal. Both of those need a paid web licence, so `app/fonts.ts` loads free stand-ins until there is one: Instrument Serif (one weight, so headings are regular and the hero's key phrase is italic, not bold) and Hanken Grotesk. Labels under about 20px, like card titles and the questions, use the grotesk at semibold. The one exception is the large buttons, the main actions on every page, and the bottom bar's Take the free quiz: their label is the serif at 24px, in the same voice as the headlines, while the bar's time chip stays in the grotesk (since 2026-10-24).
