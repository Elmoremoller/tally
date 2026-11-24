# Backlog

Work for the daily maintenance run. It takes the top unchecked item under "To do", ships it as one pull request, then ticks it.

Write each item as one line with one clear purpose. An item can be up to about 200 changed lines, for example a small new feature or a page that needs to work better on phones.

## To do

- [ ] Make the daily run flag every setup card and every building block card (`setupCards` and `blockCards`) in `lib/beginner/cards.ts`, and every workflow recipe in `lib/beginner/recipes.ts` whose `checked` date is more than 30 days old, by id and with its source links, so Karl rechecks it against the vendor's help pages (a flag only, never a change to the steps).

## Proposed

Ideas the daily run spotted but has not built. Nothing here gets built until you move it up to "To do".

- [ ] Add a "page not found" page in the site's own look with a link back to the home page and the quiz, so a visitor who follows a broken or mistyped link is not left on the plain default page with nowhere to go.

## Needs Karl

Items the daily run found but may not touch: payments, checkout, prices, paywall logic, environment variables, database schema, quiz questions, the plan generator master prompt.
