-- Tally, Phase 6 of docs/DIRECTION.md: the paid path saves two new events.
--   path_answer  her answer to "Did it work?" on one step of her path, with her few words when she sent them
--   path_phone   the phone she picked on the first step whose setup differs by phone
-- Only the list of allowed names changes. Nothing else in the events table, and no rows, are touched.
-- Safe to run more than once.

alter table public.events drop constraint if exists events_name_check;
alter table public.events add constraint events_name_check check (name in (
  'landing_view', 'quiz_start', 'quiz_step_complete', 'quiz_complete', 'result_view',
  'paywall_view', 'checkout_start', 'purchase', 'plan_view', 'wins_log_click',
  'path_answer', 'path_phone'
));
