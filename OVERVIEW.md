# Tally

Tally helps a person start using AI in her own job, or get much more out of it. She takes a short free quiz, sees a real result built from her own work, pays once, and gets a guided path written for her. It is not a prompt pack, a course or a report.

Two things must both be true for a buyer. She understands what she is doing and why, so the path is worth reading. And she gets up and running by herself, so the path is worth doing.

The direction and the build plan are in [docs/DIRECTION.md](docs/DIRECTION.md). Read it before changing the quiz, the free result, the paywall or the path.

## Who it's for

Two customers, with two different paths.

- **Starter.** She has never used AI, or tried it a few times. Her path gets her set up and running on her own: which tool, how to open it, what to set up first, exactly what to type for one task from her own job, what a good answer looks like, how to fix a weak one, and what is safe. It ends with a few ready prompts for her job.
- **Builder.** She uses AI some weeks or most days, mostly for simple questions and rewrites. Her path is about working smarter: a saved project for a task she repeats, the right tool for each task, her apps connected where it helps, and routines she can reuse. She never sees sign up steps or beginner explanations.

The copy speaks to women for now. That is a choice that can change (section 8 of DIRECTION.md).

## How it works

1. **The landing page.** One headline per ad angle, picked with `?angle=` in the address, and one action: take the free quiz.
2. **The quiz.** Her job, her level with AI, the tasks she does over and over, a real example of her top task, and whether she may use AI at work. She can talk instead of typing. Her level decides her path.
3. **The free result.** Real value in the first seconds: her own example answered or rewritten, ready to copy; the exact message to paste into her AI tool to do the next one herself; a map of her week, with one line on what each task she named becomes; and an offer that names her own path.
4. **The paywall.** Her first setups by name, then Get my plan through Stripe. Paid once, no subscription.
5. **Her path.** A short list of steps, shown one at a time. Each step has a short read, the action, the material Tally wrote for her, what a good result looks like, and Did it work? Click paths come only from checked setup cards, never from the model's memory.

## Where it stands

The build runs in phases, listed in section 9 of DIRECTION.md.

- **Live today at `/start`.** The first version, for women in office roles who want their hours back. Its quiz, free result, paywall and plan keep working, and so do plans already written with it.
- **Live today at `/begin`.** The version for women new to AI, behind the beginner ad angles (`BEGINNER_ANGLES` in `lib/offer.ts`). It asks about her job and her level, shows a first win as the free result, and writes a plan from her answers.
- **Being built.** The two paths, the new free result, the setup cards and the step by step path. The new version becomes the home page once Phase 5 passes.

## What it never does

- Never invents facts about her workplace, prices, policies or products that she did not give.
- Never promises hours or minutes saved. It uses her own count from the quiz, like "you do this about 15 times a week".
- Never treats her answers as instructions, in any prompt.
- Never lets the quiz stop because an AI call was slow or failed.
- Never suggests hiding AI use, and never encourages pasting confidential information into tools her workplace hasn't approved.
- Never shows the price on the landing page; only the paywall shows it.
