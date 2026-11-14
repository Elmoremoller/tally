# Setting it up

Tally needs three accounts connected: Supabase (saves answers and handles logins), Stripe (takes payment) and Anthropic (reads the quiz and writes the plan). All the settings go in one file called `.env.local` in this folder; `.env.example` lists every name. Its name starts with a dot, so Finder hides it: press Command, Shift and the full stop together in Finder to show it. Never paste the secret values into a chat or an email.

Until the accounts are connected, you can still look at everything on this computer with `npm run dev`:

- The quiz: http://localhost:3000/start
- The free result and the paywall for a sample week: http://localhost:3000/start/preview. Add `?sample=law_firm` for the executive assistant's.
- A sample plan: http://localhost:3000/plan/preview. Add `?sample=law_firm` for the executive assistant's, `?sample=dental`, `salon` or `nurse` for a beginner plan, `&state=pending` or `&state=failed` for the waiting page, and `&welcome=1` for the note shown right after paying.
- The beginner version's free result and paywall: http://localhost:3000/begin/preview, with `?sample=salon` or `?sample=nurse`.
- The landing page with the placeholder reviews: http://localhost:3000/preview/reviews

Nothing on the preview pages is saved or sent. They only exist on a local setup; never set `PLAN_PREVIEW` on Vercel.

## 1. Supabase

1. **Set up the database.** Open SQL Editor and start a new query. Run each file in `supabase/migrations/` in order, one at a time, waiting for "Success" before the next. Every file is safe to run again.
2. **Add the keys.** Open Project Settings, then API Keys. Copy the Project URL into `NEXT_PUBLIC_SUPABASE_URL`, the Publishable key (`sb_publishable_`) into `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and the Secret key (`sb_secret_`) into `SUPABASE_SECRET_KEY`. The secret key never goes anywhere else.
3. **Tell Supabase where the site is.** Open Authentication, then URL Configuration. Site URL: `http://localhost:3000` while you test, your real address once live. Redirect URLs: add `http://localhost:3000/**`, and later your real address with `/**` on the end.
4. **Change the login email.** Open Authentication, then Emails, then Magic Link. Subject: `Your plan is ready`. Message: everything in `supabase/email-templates/magic-link.html` after the comment at the top.
5. **Before real customers: connect an email service.** Supabase's own email only sends a few emails an hour. Before launch, sign up for one such as Resend and enter its details under Authentication, then Emails, then SMTP Settings.

## 2. Stripe, in test mode

1. On [dashboard.stripe.com](https://dashboard.stripe.com), switch on Test mode.
2. Open Developers, then API keys. Copy the Secret key (`sk_test_`) into `STRIPE_SECRET_KEY`.
3. To pay in test mode, use the card number `4242 4242 4242 4242`, any date in the future, and any three numbers for the security code.

The price is set in `lib/offer.ts`. Nothing needs setting up in Stripe for it.

## 3. Anthropic

1. On [console.anthropic.com](https://console.anthropic.com), open API Keys and create a key.
2. Paste it into `ANTHROPIC_API_KEY`.

A fast model (Claude Haiku 5.5 unless `ANTHROPIC_MODEL_INTAKE` says otherwise) reads the quiz answers, and Claude Sonnet 5.5 (or `ANTHROPIC_MODEL_PLAN`) writes the plan. Anyone can take the quiz, so each visitor may make 20 AI calls an hour and the whole site 5,000 a day; those numbers are in `supabase/migrations/20261024110000_ai_allowance.sql`. Each quiz session also has its own small allowance. In the Anthropic Console you can set a monthly spend limit as a backstop.

## 4. Try the whole thing

Restart `npm run dev` after changing `.env.local`, then:

1. Open http://localhost:3000/start and take the quiz.
2. In Supabase, open Table Editor: `sessions`, `intake` and `tasks` have your answers.
3. On the paywall, tap Get my plan and pay with the test card.
4. You land on the page after paying while your plan is written. It opens by itself. `orders` and `plans` now have your purchase and plan.
5. Open the email and tap Open my plan: it opens the same private page.

## 5. Running it

- **Purchases and refunds.** Purchases are in `orders`. Refunds are in Stripe's dashboard.
- **A plan that failed.** After four tries a plan is marked failed in `plans`, to be looked at by hand.
- **Someone asks you to delete their data.** In SQL Editor run `select public.delete_by_email('her@email.com');`. Then open Authentication, then Users, and delete her login.

## 6. Going live on Vercel

1. In Vercel, open the project's Settings, then Environment Variables, and add every line from `.env.local`. Add `NEXT_PUBLIC_SITE_URL` with your real address. Don't add `PLAN_PREVIEW`.
2. In Stripe, switch off Test mode and use the live Secret key.
3. In Stripe, open Developers, then Webhooks, and add an endpoint: `https://your-address/api/stripe/webhook`, listening for `checkout.session.completed` and `checkout.session.async_payment_succeeded`. Copy its Signing secret (`whsec_`) into `STRIPE_WEBHOOK_SECRET` in Vercel.
4. In Supabase, change the Site URL and Redirect URLs to your real address.
5. Make sure the email service is connected, and listed on the privacy page in `lib/legal.ts`.
6. Fill in the blanks at the top of `lib/legal.ts`, confirm the refund line in `lib/offer.ts` (still marked DRAFT), and make sure the support inbox in `lib/offer.ts` receives email. Have a lawyer check the privacy and terms pages.
7. If you add analytics, an ad pixel or another company that handles people's data, change the privacy page first.
