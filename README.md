# Tally

Tally helps a person start using AI in her own job, or get much more out of it, with a guided path built from a short quiz. This repo is the whole site: the landing page, the free quiz, the free result, the paywall and each buyer's AI written plan. It is built with Next.js 16 (App Router) and Tailwind CSS 4, with Supabase for answers and logins, Stripe for payment, and Claude for reading the quiz and writing the plan.

- What the product is and who it's for: [OVERVIEW.md](OVERVIEW.md).
- Where it is going, the rules that stay, and the build phases: [docs/DIRECTION.md](docs/DIRECTION.md). Read it before changing the quiz, the free result, the paywall or the plan.
- Connecting the accounts: [SETUP.md](SETUP.md).

The first version's Get started buttons open the quiz at `/start`; the beginner ad angles open their own quiz at `/begin`. `/privacy` and `/terms` are plain language drafts: before launch, fill in the blanks at the top of `lib/legal.ts` and have a lawyer check them.

## Run it locally

You need Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000. Edits show up as you save. Inside OneDrive the dev server sometimes misses a save; if a change does not appear, stop it and run `npm run dev` again.

To check the production build the way Vercel will serve it:

```bash
npm run build
npm start
```

The tests run with `npm test`.

## Deploy to Vercel

**From the dashboard.** Push this folder to a Git repository, then on vercel.com choose Add New, then Project, and import it. Vercel detects Next.js, so the defaults are right. If the repository also contains other folders, set Root Directory to `worth-her-time`. Every push to the main branch deploys to production, and every other branch gets a preview URL.

**From the terminal.** Run these from this folder:

```bash
npx vercel        # first run links the project and makes a preview deployment
npx vercel --prod # deploys to production
```

Once the site has its own domain, set `NEXT_PUBLIC_SITE_URL` (for example `https://tallyher.com`) in the Vercel project settings, so link previews and emails use that domain.

## Where things live

| Path | What it is |
|---|---|
| `lib/offer.ts` | The offer in one place: the name, the price, the refund line, the support email, the lead, the buttons and the headline for each ad angle |
| `app/page.tsx`, `app/angle/[angle]/`, `proxy.ts` | The landing page. An ad's `?angle=` is served from the page built for that angle, and `proxy.ts` keeps the angle and UTM values |
| `lib/landing.ts`, `components/landing/` | The landing page's words and sections, in the order set in `LAYOUT.md` |
| `lib/testimonials.ts` | Reviews from real buyers. The section stays hidden until there are real ones |
| `app/globals.css` | Colour, type and motion tokens, the Tailwind theme, component styles, and the reduced motion rules |
| `components/brand/`, `brand/` | The Tally logo, traced from the supplied artwork |
| `app/start/`, `components/quiz/` | The quiz at `/start`: her job, her week, the extra work she got pulled into, her AI tools and her company's view on AI. Then Here's what we heard, the free result and the paywall. `result/` shows them again after a trip to Stripe |
| `lib/questions.ts`, `lib/week.ts` | The quiz's words, and the rules for her week shared by the screens, the server and the AI |
| `lib/intake.ts` | The fast model that reads her answers and sorts her tasks into piles |
| `lib/dictation.ts`, `components/quiz/useDictation.ts`, `MicButton.tsx` | Talking instead of typing in the answer boxes |
| `lib/ai-allowance.ts` | How many AI calls each visitor and the whole site may make |
| `app/start/checkout.ts`, `lib/checkout.ts` | Get my plan: Stripe Checkout for the plan built from this browser's quiz |
| `app/api/stripe/webhook/`, `lib/fulfill.ts` | Where Stripe reports payments. Records the order and starts writing the plan |
| `app/welcome/` | Where Stripe sends her after paying |
| `lib/plan-prompt.ts`, `lib/plan-writer.ts`, `lib/plan-generation.ts` | The versioned master prompt, the model that writes her plan, and the retries |
| `app/plan/[token]/`, `components/plan/` | Her plan's private page, opened with a long random token, and the waiting page while it's written |
| `app/login/`, `app/auth/confirm/`, `app/plan/page.tsx` | Getting back to her plan with an email link |
| `lib/plan-copy.ts` | The words around the plan: the paywall, checkout, the page after paying and the plan page |
| `lib/beginner/`, `components/beginner/`, `app/begin/` | The beginner version, for women new to AI, behind the ad angles in `BEGINNER_ANGLES` in `lib/offer.ts`. Its own quiz at `/begin`, a first win as the free result, and its own plan |
| `lib/funnel-db.ts` | Tally's tables and database calls |
| `supabase/migrations/` | The database: sessions, answers, tasks, orders, plans and funnel events, all locked to the server, the AI allowances, and a call that deletes everything about one email. Run the files in order |
| `supabase/email-templates/` | The login email, which opens her plan directly |
| `app/privacy/`, `app/terms/`, `lib/legal.ts` | The privacy and terms pages and their words |
| `docs/DIRECTION.md` | What Tally is, the rules that stay, and the build phases |
| `docs/audit/`, `docs/superpowers/` | Audits, persona runs, and the specs and plans behind earlier changes |
| `BACKLOG.md`, `CHANGELOG.md` | Work for the daily maintenance run, and one line per change |
| `tests/` | A smoke test, the repo checks and the beginner version's tests. Run them with `npm test` |
| `.env.example` | The settings the site needs. Copy it to `.env.local` |

## Copy rules

The rules are in section 5 of [docs/DIRECTION.md](docs/DIRECTION.md). In short: no dashes used as punctuation, no colons in headlines, no hype words, no emoji, and no price before the paywall. No invented facts, no promised hours or minutes saved, and no testimonials, press logos, ratings, user counts or statistics until real ones exist. Every new line of copy is marked DRAFT until Karl approves it, and every changed prompt gets a new version name.
