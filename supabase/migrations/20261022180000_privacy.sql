-- Step 12: privacy. Every day, the quiz answers of people who took the quiz more than 30 days ago and never
-- bought are deleted, with anything they wrote. And one call deletes everything about someone who asks. Run
-- it after the other files. It is safe to run again. The last line it shows says whether the daily cleanup
-- is on: if it asks you to, switch on Cron in Supabase (Integrations, then Cron) and run this file again.

-- When someone last went to pay, so a quiz that turns 30 days old isn't deleted while they're paying.
alter table public.people add column if not exists checkout_started_at timestamptz;

create or replace function public.note_checkout(p_email text)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.people set checkout_started_at = now() where email = lower(trim(p_email)) and paid_at is null;
$$;
revoke all on function public.note_checkout from public, anon, authenticated;
grant execute on function public.note_checkout to service_role;

-- Deletes the quiz answers of people who took the quiz more than 30 days ago and never bought, unless they
-- started paying in the last day. What they wrote goes with them. Returns how many people it deleted.
create or replace function public.delete_unpaid_quizzes()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_count integer;
begin
  delete from public.people
  where paid_at is null
    and updated_at < now() - interval '30 days'
    and (checkout_started_at is null or checkout_started_at < now() - interval '1 day');
  get diagnostics v_count = row_count;
  return v_count;
end;
$$;
revoke all on function public.delete_unpaid_quizzes from public, anon, authenticated;

-- Deletes everything about one person, when they ask: in the SQL Editor, run
--   select public.delete_person('their@email.com');
-- then delete their login under Authentication, then Users. For someone who paid, their whole plan goes,
-- so their partner loses it too. For an invited partner, they leave the plan, and the lines they wrote on
-- the Couple Standard go with them. It returns what it deleted, and names a partner who keeps their own
-- answers until they ask too.
create or replace function public.delete_person(p_email text)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_email text := lower(trim(p_email));
  v_partner text;
  v_plan integer;
  v_left integer;
  v_lines integer;
  v_answers integer;
  v_check_ins integer;
  v_checks integer;
  v_payments integer;
begin
  select partner_email into v_partner from public.people where email = v_email;
  delete from public.agreements where author_email = v_email;
  get diagnostics v_lines = row_count;
  delete from public.intentions where email = v_email;
  delete from public.check_ins where email = v_email;
  get diagnostics v_check_ins = row_count;
  delete from public.step_reviews where email = v_email;
  get diagnostics v_answers = row_count;
  delete from public.plan_progress where email = v_email;
  delete from public.message_checks where email = v_email;
  get diagnostics v_checks = row_count;
  delete from public.payments where email = v_email;
  get diagnostics v_payments = row_count;
  -- Their own quiz and plan. What they wrote in the quiz, and everything shared on their plan, goes with it.
  delete from public.people where email = v_email;
  get diagnostics v_plan = row_count;
  -- An invited partner leaves the plan they were invited to.
  update public.people set partner_email = null where partner_email = v_email;
  get diagnostics v_left = row_count;
  return format(
    '%s: quiz and plan %s, left a partner''s plan %s, step answers %s, Couple Standard lines %s, check ins %s, message checks %s, payments %s. Now delete their login under Authentication, then Users.%s',
    v_email, v_plan, v_left, v_answers, v_lines, v_check_ins, v_checks, v_payments,
    case when v_partner is not null
      then format(' Their partner %s has lost the plan and keeps their own answers; if they ask, run this for them too.', v_partner)
      else '' end
  );
end;
$$;
revoke all on function public.delete_person from public, anon, authenticated;

-- The daily cleanup, at 9 in the morning UTC, once Cron is on. Turning Cron on here works on most projects;
-- where it doesn't, switch it on in Supabase (Integrations, then Cron) and run this file again.
do $$
begin
  create extension if not exists pg_cron with schema pg_catalog;
exception when others then
  null;
end;
$$;
do $$
begin
  if to_regnamespace('cron') is not null then
    perform cron.unschedule(jobid) from cron.job where jobname = 'delete-unpaid-quizzes';
    perform cron.schedule('delete-unpaid-quizzes', '0 9 * * *', 'select public.delete_unpaid_quizzes()');
  end if;
end;
$$;

select case
  when to_regnamespace('cron') is null
    then 'Almost done: switch on Cron in Supabase (Integrations, then Cron), then run this file again.'
  else 'Done. Quizzes from people who never bought are deleted every day after 30 days.'
end as daily_cleanup;
