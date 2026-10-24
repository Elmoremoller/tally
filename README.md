# The Couple Standard

The Couple Standard: the landing page, the quiz, the paywall, each couple's plan, their Couple Standard, and the check ins for the pilot. It is built with Next.js 16 (App Router) and Tailwind CSS 4, with Supabase for answers and logins, Stripe for payment, and Claude for the message check. Every Get started button links to the quiz at `/start`. `/privacy` and `/terms` are plain language drafts: before launch, fill in the three blanks at the top of `lib/legal.ts` and have a lawyer check them. To connect the accounts, follow [SETUP.md](SETUP.md).

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

## Deploy to Vercel

**From the dashboard.** Push this folder to a Git repository, then on vercel.com choose Add New, then Project, and import it. Vercel detects Next.js, so the defaults are right. If the repository also contains other folders, set Root Directory to `couple-standard`. Every push to the main branch deploys to production, and every other branch gets a preview URL.

**From the terminal.** Run these from this folder:

```bash
npx vercel        # first run links the project and makes a preview deployment
npx vercel --prod # deploys to production
```

**Optional:** once the site has its own domain, set the environment variable `NEXT_PUBLIC_SITE_URL` (for example `https://thecouplestandard.com`) in the Vercel project settings, so link previews use that domain. Without it, Vercel's production URL is used.

## Where things live

| Path | What it is |
|---|---|
| `app/page.tsx` | The landing page, section by section, in the order set in `LAYOUT.md` |
| `lib/content.tsx` | The page copy (topics, steps, method, everything you get, questions) |
| `app/globals.css` | Colour, type and motion tokens as CSS variables, the Tailwind theme, component styles, and the reduced motion and reduced transparency rules |
| `components/` | Nav, footer, Get started button, phone mockup, card previews and questions |
| `components/brand/` | The logo as SVG, traced from the supplied artwork so it can be deep red or warm white |
| `app/icon.svg`, `app/favicon.ico`, `app/apple-icon.png`, `app/opengraph-image.png` | Browser icons and the link preview image |
| `SETUP.md` | How to connect Supabase, Stripe and the message check, test it all, and go live |
| `app/start/` | The quiz at `/start`, saving the answers (`actions.ts`), and Get my plan (`checkout.ts`). `result/` shows the couple type and paywall again after a trip to Stripe |
| `components/quiz/` | The quiz screens, the safety question, the open question and its reflection, the couple type reveal and the paywall |
| `lib/reflection.ts` | The quiz reflection: a small, fast model reads what someone wrote about their last fight and gives it back in their own words, plus labels for their plan. Checks after the answer drop anything they didn't write |
| `lib/safety.ts` | The safety question, the calm page's words and the hotline's details |
| `components/SafetyHelp.tsx` | The calm page: the hotline, nothing to buy, and a quick way out. Shown after Yes or Not sure, and instead of a verdict when a message mentions fear or harm |
| `lib/quiz.ts` | The quiz copy, the answer ids that get saved, and the three couple types |
| `app/api/stripe/webhook/` | Where Stripe reports payments. Marks the person as paid and sends their login email |
| `app/welcome/` | Where people land after paying, with "Did you just have a fight?" |
| `app/login/`, `app/auth/confirm/`, `proxy.ts` | Logging in with an email link, and staying logged in |
| `app/plan/` | Their plan, for paid people and invited partners. `now/` is the help after a fight, `standard/` is their Couple Standard, and `check-in/` is the check in that's due. `preview/` shows sample plans on a local setup |
| `components/fight-help/` | Help right after a fight: calming down with the 20 minutes, starting to make up, the guided 10 minute repair, and looking back on your own. Only the timers and where a repair stopped are kept, on that phone |
| `lib/fight-help.ts` | The words for the help after a fight, exactly as approved |
| `components/plan/` | Today's step and Did you try it?, today's small moment, all the steps under Prevent, Pause and Repair, the scripts for each fight topic, the message check, Add my partner, and the safety question an invited partner sees first |
| `components/standard/` | Their Couple Standard: where they started, how each of them brings up something hard, and the lines they share. A line one of them writes waits for the other to agree. Until the other person has opened the plan, whoever wrote it can mark it agreed once they've talked |
| `lib/standard.ts`, `lib/standard-state.ts` | The Couple Standard's words, exactly as approved, and how it's read from the database |
| `components/check-in/` | The check ins at the start, two weeks in and a month in: the card under Today's step, with Not now kept on that phone until the next day, and the questions, one at a time like the quiz. The answers are only ever for us, never the partner |
| `lib/check-ins.ts`, `lib/check-in-state.ts` | The check ins' words, exactly as approved, when each one is due, counted from each person's first visit to their plan, and which ones they've answered |
| `app/privacy/`, `app/terms/` | The privacy and terms pages, linked from the footer and from the line under Get my plan |
| `lib/legal.ts` | Their words, exactly as approved, with the three blanks to fill in before launch at the top: your company's legal name, the email for privacy and refund requests, and the state whose laws apply |
| `components/LegalDocument.tsx` | Lays out either page, and makes the hotline's numbers, 988, the Privacy page and the contact email into links |
| `lib/after-sign-in.ts` | Brings someone who opened the check in while signed out back to it after they sign in from the email link |
| `lib/steps.ts` | The plan's steps (Notice, Try and On your own), the review's words, and the daily small moments |
| `lib/progress.ts` | Which step comes when: the four paths, and where each answer to Did you try it? leads |
| `lib/plan.ts` | The plan's other words: the tips for each couple type, and the scripts. Tone and Not feeling heard come first for everyone, then their own topics, each with a way to bring it up, a line for when it heats up, and one to make up after |
| `lib/message-check.ts` | The message check, which asks Claude how a text might read before it's sent: words that could sound like blame, what they're asking for underneath, and a version that keeps their point. It never says how the partner will react. Its words are in `lib/message-check-copy.ts` |
| `lib/prices.ts` | What things cost |
| `supabase/migrations/` | The database: the `people`, `payments` and private `reflections` tables, each person's answers after each step, a couple's agreements and who agreed to them, how each person brings up something hard, the check ins and an overview of the pilot, the AI allowances, who may read what, a daily cleanup of quizzes from people who never bought, and a call that deletes everything about one person. Run the files in order |
| `.env.example` | The settings the site needs. Copy it to `.env.local` |

## Copy rules

Copy is used exactly as approved. Keep it free of dashes used as punctuation, and add no testimonials, press logos, ratings, user counts or statistics until real ones exist.
