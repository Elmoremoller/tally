# Setting it up

Everything after the landing page is built: the quiz, the paywall, payment, the login email, and each person's plan. To make it work for real it needs three accounts connected: Supabase (saves answers and handles logins), Stripe (takes payment) and Anthropic (the message check). This page walks through each one. Do them in order.

All the settings go in one file called `.env.local` in this folder. It's already there, with a blank after each name for you to fill in. Its name starts with a dot, so Finder hides it: press Command, Shift and the full stop together in Finder to show it, then open it with TextEdit. Never paste the secret values into a chat or an email.

Until then, you can still look at everything on this computer:

- The quiz and paywall: `npm run dev`, then open http://localhost:3000/start
- A sample plan: http://localhost:3000/plan/preview. Add `?type=quick_sparks` or `?type=slow_simmer` to see the other couple types, `&day=6` to jump ahead, and `&as=partner` to see it from the partner's side. The partner's side starts with the safety question, once per browser. Add `&review=1` to be asked "Did you try it?" straight away; answering moves the sample plan on without saving anything.
- Their Couple Standard: http://localhost:3000/plan/preview/standard, with the same options. Add `&lines=1` to fill in a few lines: one agreed, one not agreed yet, and, when there's a partner (`?type=slow_simmer`, or `&as=partner`), one the partner suggested. `&opened=0` or `&opened=1` shows it before or after the other person has opened the plan, and `&started=0` leaves out where they started. Nothing is saved.
- The check ins: add `&checkin=start`, `&checkin=day_14` or `&checkin=day_30` to a sample plan to see a check in's card under Today's step. The check in itself is at http://localhost:3000/plan/preview/check-in, with the same options; `checkin=none` shows the page with nothing to answer. Nothing is saved.
- The help after a fight: http://localhost:3000/plan/preview/now, with the same options. The page people land on after paying, with "Did you just have a fight?": http://localhost:3000/welcome?preview=1. Neither saves anything.

## 1. Supabase

The Couple Standard has its own Supabase account, separate from your usual one. Do all of this signed in to that account.

1. **Create the project.** On [supabase.com/dashboard](https://supabase.com/dashboard), check the account in the corner is the separate one. If it asks you to make an organization first, name it The Couple Standard and pick the Free plan. Then click New project. Name: The Couple Standard. Region: East US (North Virginia). Click Generate a password and save it in your password manager. Wait a couple of minutes until the project says it's ready.
2. **Set up the database.** Open SQL Editor and start a new query. Open `supabase/migrations/20261021120000_people.sql` from this folder, copy all of it, paste it in, and click Run. You should see "Success. No rows returned". Then do the same with `supabase/migrations/20261021130000_payments_and_plan.sql`. If Supabase warns that the second one has a destructive operation, run it anyway: it only replaces something the first file made. Then do the same with `supabase/migrations/20261022120000_free_partner_and_check_limit.sql`, which makes adding a partner free and allows 10 message checks a day, then `supabase/migrations/20261022130000_quiz_reflection.sql`, which keeps what people write in the quiz private and limits how often the AI reads it, then `supabase/migrations/20261022140000_plan_loop.sql`, which saves where each person is in their plan, their answers after each step (only they can read those) and what a couple agreed on, then `supabase/migrations/20261022150000_repair_agreement.sql`, which also saves what a couple agrees at the end of the 10 minute repair, even right after paying, then `supabase/migrations/20261022160000_couple_standard.sql`, which lets you agree to each other's lines on your Couple Standard and saves how each of you brings up something hard, then `supabase/migrations/20261022170000_check_ins.sql`, which saves the check ins and adds `pilot_overview`, one row per person for following the pilot, then `supabase/migrations/20261022180000_privacy.sql`, which deletes the quizzes of people who never bought once they're 30 days old, every day, and adds a call for deleting someone who asks. The last line it shows says whether that daily cleanup is on. If it asks you to, switch on Cron (Integrations, then Cron) and run the file again. Last, run `supabase/migrations/20261022190000_founding_quotes.sql`, which lets the two weeks in and month in check ins ask what someone would tell another couple, and adds the `founding_quotes` view. Until it has run, the check ins skip that question. Run one file at a time and wait for "Success" before the next. Supabase may warn that a file has a destructive operation, because some of them replace a rule or a function: run it anyway, since none of them deletes anything that's saved. If you already ran some of the files, just run the ones after them, in order. Open Table Editor afterwards: you should see `people`, `payments`, `message_checks`, `reflections`, `ai_calls`, `plan_progress`, `step_reviews`, `agreements`, `intentions` and `check_ins`, plus the `pilot_overview` and `founding_quotes` views.
3. **Add the keys.** Open Project Settings, then API Keys.
   - Copy the Project URL (it looks like `https://abcd1234.supabase.co`; if it isn't on this page, it's under Data API) and paste it after `NEXT_PUBLIC_SUPABASE_URL=` in `.env.local`.
   - Copy the Publishable key (it starts with `sb_publishable_`) and paste it after `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=`.
   - Copy the Secret key (it starts with `sb_secret_`) and paste it after `SUPABASE_SECRET_KEY=`. This one is secret: never paste it anywhere else.
4. **Tell Supabase where the site is.** Open Authentication, then URL Configuration.
   - Site URL: `http://localhost:3000` while you test. Change it to your real address when you launch.
   - Redirect URLs: add `http://localhost:3000/**`, and later your real address with `/**` on the end.
5. **Change the login email.** Open Authentication, then Emails, then Magic Link. This step matters: without it the link in the email doesn't sign people in. Replace the subject and the message with:

   Subject:

   ```
   Your plan is ready
   ```

   Message:

   ```html
   <h2>Your plan is ready</h2>
   <p>Tap the link below to open it. It works once, for the next hour.</p>
   <p><a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email">Open my plan</a></p>
   <p>The Couple Standard</p>
   ```

6. **Before real customers: connect an email service.** Supabase's own email only sends a few emails an hour, and only to people in your Supabase team. While testing, use the email address you signed up to this Supabase account with (or add another address of yours under Organization, then Team). Before launch, sign up for an email service such as Resend and enter its details under Authentication, then Emails, then SMTP Settings.

## 2. Stripe, in test mode

Test mode works exactly like the real thing, but no real money moves.

1. Log in to [dashboard.stripe.com](https://dashboard.stripe.com) and switch on Test mode (top right).
2. Open Developers, then API keys. Copy the Secret key (it starts with `sk_test_`) and paste it after `STRIPE_SECRET_KEY=` in `.env.local`.
3. That's all you need to test on your own computer. The page people land on after paying opens their plan by itself.
4. To pay in test mode, use the card number `4242 4242 4242 4242`, any date in the future, and any three numbers for the security code.

The price is set in `lib/prices.ts`: $19.99 for the plan. Adding a partner is free. Nothing needs setting up in Stripe for it.

## 3. The message check and the quiz reflection

1. On [console.anthropic.com](https://console.anthropic.com), open API Keys and create a key.
2. Paste it after `ANTHROPIC_API_KEY=` in `.env.local`.

The same key does two things.

- **The message check** uses Claude Opus 5.5, set to answer quickly. Each person can check up to 10 messages a day, so a single account can't run up a big bill. You can change that number in `supabase/migrations/20261022120000_free_partner_and_check_limit.sql` (`v_limit`), then run that file again in the SQL Editor.
- **The quiz reflection** reads what people write about their last fight and gives it back in a few short bullets. The plan does the same with the line people can add after a step. It uses Claude Haiku 5.5, a small, fast model that costs a tiny fraction of a cent each time. Anyone can take the quiz, so each visitor can use it 20 times an hour, and the whole site 5,000 times a day. Those numbers are in `supabase/migrations/20261022130000_quiz_reflection.sql`. If it is slow or that allowance runs out, the quiz carries on without the reflection.

If a message or a quiz answer mentions fear, threats, violence or self-harm, the hotline shows instead. In the Anthropic Console you can also set a monthly spend limit, as a backstop.

## 4. Try the whole thing

Stop the site if it's running, start it again with `npm run dev` (it only reads `.env.local` when it starts), then:

1. Open http://localhost:3000/start and take the quiz with your own email. Answer No to the safety question to reach the paywall; Yes or Not sure shows the hotline page instead, with the back arrow to change your answer. Then write a few lines about your last fight to see the reflection, or skip it.
2. In Supabase, open Table Editor, then `people`. Your answers and couple type are there. If you kept a reflection, it is in `reflections`.
3. On the paywall, tap Get my plan. Pay with the test card.
4. You land on "Your plan is ready", which asks "Did you just have a fight?". No shows where your plan link went; Yes opens the help for right now. In Supabase, `people` now shows `paid_at`, and `payments` has the payment.
5. Open the email and tap Open my plan. Your plan opens, with Today's step, today's small moment, all your steps, the words for your fight topics, and the message check. Tap "Tried it? Tell us how it went" to answer, and the plan moves on to the step your answer leads to. In Supabase, `step_reviews` now has your answer. "Just had a fight?" at the top opens the help for right now; what you save at the end of the 10 minute repair shows up in `agreements`.
6. Under Today's step, tap Open your Couple Standard. Anything you agreed in your plan's steps is already there. Write a line and tap We agreed on this: in Supabase, `agreements` has it, with `agreed_by` and `agreed_at` filled in. What you write under How I bring up something hard is in `intentions`.
7. To try the partner's side, enter a second email address of yours under Add my partner. That address gets its own link to the same plan, seen from the partner's side. The first time it opens, it asks the safety question. On the partner's Couple Standard, your lines show as suggested, with I agree. Once the partner has opened the plan, a new line waits for the other person to agree.
8. Under Today's step, "Two quick questions" shows during the first week. Answer them: in Supabase, `check_ins` has your answers, and `pilot_overview` has a row for you. "Two weeks in" and "A month in" show up on day 14 and day 30, counted from each person's first visit to their plan.

## 5. Following the pilot

- **The answers.** Open Table Editor, then `check_ins` for each answer, or `pilot_overview` for one row per person: when they paid, when they first and last opened the plan, how many steps they answered, and which check ins they did. The site never shows anyone the answers, and a partner can never read the other person's.
- **Founding couple quotes.** Two weeks in and a month in, the check in asks "What would you tell another couple about it?", with a box to tick for "You can show this on the website with my first name". Open `founding_quotes` in Table Editor to see every answer whose writer ticked it, newest first, with the first name to show it with. Nothing reaches the website by itself. To show one, copy it word for word into `lib/quotes.ts` with that first name (the file lists the rules) and deploy. The landing page's quotes section stays hidden until there are three.
- **Purchases and refunds.** Purchases are in `payments`. Refunds are in Stripe's dashboard.
- **Someone asks you to delete their data.** Open SQL Editor and run `select public.delete_person('their@email.com');` with their email. It shows what it deleted. Then open Authentication, then Users, and delete their login. If they paid, their partner loses the plan too, and the line it shows names the partner, who keeps their own answers until they ask for the same. If they have a quote on the website, take it out of `lib/quotes.ts` too.
- **Someone who stopped opening the plan** won't see a check in there, and the site doesn't send reminders. Email them the link yourself: your address with `/plan/check-in` on the end, like `https://thecouplestandard.com/plan/check-in`. It opens whichever check in is due, after they sign in if they need to.

## 6. Going live on Vercel

1. In Vercel, open the project's Settings, then Environment Variables, and add every line from `.env.local`. Add `NEXT_PUBLIC_SITE_URL` with your real address, like `https://thecouplestandard.com`. Don't add `PLAN_PREVIEW`.
2. In Stripe, switch off Test mode and use the live Secret key instead.
3. In Stripe, open Developers, then Webhooks, and add an endpoint: `https://your-address/api/stripe/webhook`, listening for `checkout.session.completed` and `checkout.session.async_payment_succeeded`. Copy its Signing secret (it starts with `whsec_`) into `STRIPE_WEBHOOK_SECRET` in Vercel. This makes sure the plan opens even if someone closes the page right after paying.
4. In Supabase, change the Site URL and Redirect URLs to your real address.
5. Make sure the email service from step 1.6 is connected, and add it to the list of companies on the privacy page ("Who else handles it" in `lib/legal.ts`).
6. Fill in the three blanks at the top of `lib/legal.ts`: your company's legal name, the email for privacy and refund requests, and the state whose laws apply. Have a lawyer check the privacy and terms pages.
7. If you ever add analytics, an ad pixel or another company that handles people's data, change the privacy page first.
