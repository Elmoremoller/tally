-- SQL files 6 to 9, together, for the project that already has files 1 to 5. Paste all of it into a new
-- query in the SQL Editor and click Run. If Supabase warns about a destructive operation, run it anyway:
-- some parts replace a rule or a function, and none of it deletes anything that's saved. It runs as one,
-- so it either all lands or none of it does, and it's safe to run again. The last line it shows says
-- whether the daily cleanup is on. Once it has landed, you can delete this file: the same SQL is in
-- supabase/migrations.


-- ==== 20261022150000_repair_agreement.sql ====

-- Step 9: the 10 minute repair. What a couple agree on at the end of it is saved with their other
-- agreements, for their Couple Standard, even straight after paying, before they've opened their email
-- link. Run it after the other files. It only widens one rule and adds one function, so nothing saved
-- changes, and it is safe to run again.

-- Agreements can now also come from the 10 minute repair.
alter table public.agreements drop constraint if exists agreements_step_id_check;
alter table public.agreements add constraint agreements_step_id_check
  check (step_id in ('check_in', 'running_on_empty', 'agree_pause', 'coming_back', 'first_move', 'ten_minute'));

-- The same as save_agreement, for the page people land on right after paying, where nobody is signed in
-- yet. The site checks the payment with Stripe first and passes the address that paid, so only the server
-- can call this.
create or replace function public.save_agreement_after_paying(p_email text, p_step_id text, p_text text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_email text := lower(trim(p_email));
begin
  if not exists (select 1 from public.people where email = v_email and paid_at is not null) then
    raise exception 'no plan';
  end if;
  insert into public.agreements (plan_email, step_id, text, author_email)
  values (v_email, p_step_id, trim(p_text), v_email)
  on conflict (plan_email, step_id) do update set
    text = excluded.text,
    author_email = excluded.author_email,
    updated_at = now();
end;
$$;
revoke all on function public.save_agreement_after_paying from public, anon, authenticated;
grant execute on function public.save_agreement_after_paying to service_role;


-- ==== 20261022160000_couple_standard.sql ====

-- Step 10: their Couple Standard. An agreement waits for the other person to agree once they use the plan,
-- the practical part about their main topic can be saved too, and each person keeps their own way of
-- bringing up something hard. Run it after the other files. It only adds columns, a table and functions,
-- and widens one rule, so nothing saved changes, and it is safe to run again.

-- Who agreed to the words as they stand, and when. Empty while it's still a proposal.
alter table public.agreements add column if not exists agreed_by text;
alter table public.agreements add column if not exists agreed_at timestamptz;

-- Agreements can also hold the practical part about their main topic.
alter table public.agreements drop constraint if exists agreements_step_id_check;
alter table public.agreements add constraint agreements_step_id_check
  check (step_id in ('check_in', 'running_on_empty', 'agree_pause', 'coming_back', 'first_move', 'ten_minute', 'practical'));

-- Saving new words makes it a proposal again, from whoever wrote them, so both still agree to what it says
-- now. Saving the same words again changes nothing.
create or replace function public.save_agreement(p_step_id text, p_text text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_email text := lower(auth.jwt() ->> 'email');
  v_plan text := public.my_plan_email();
begin
  if v_email is null then
    raise exception 'not signed in';
  end if;
  if v_plan is null then
    raise exception 'no plan';
  end if;
  insert into public.agreements (plan_email, step_id, text, author_email)
  values (v_plan, p_step_id, trim(p_text), v_email)
  on conflict (plan_email, step_id) do update set
    text = excluded.text,
    author_email = case when public.agreements.text = excluded.text then public.agreements.author_email else excluded.author_email end,
    agreed_by = case when public.agreements.text = excluded.text then public.agreements.agreed_by end,
    agreed_at = case when public.agreements.text = excluded.text then public.agreements.agreed_at end,
    updated_at = case when public.agreements.text = excluded.text then public.agreements.updated_at else now() end;
end;
$$;
revoke all on function public.save_agreement from public, anon;
grant execute on function public.save_agreement to authenticated;

-- The same, for the page people land on right after paying.
create or replace function public.save_agreement_after_paying(p_email text, p_step_id text, p_text text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_email text := lower(trim(p_email));
begin
  if not exists (select 1 from public.people where email = v_email and paid_at is not null) then
    raise exception 'no plan';
  end if;
  insert into public.agreements (plan_email, step_id, text, author_email)
  values (v_email, p_step_id, trim(p_text), v_email)
  on conflict (plan_email, step_id) do update set
    text = excluded.text,
    author_email = case when public.agreements.text = excluded.text then public.agreements.author_email else excluded.author_email end,
    agreed_by = case when public.agreements.text = excluded.text then public.agreements.agreed_by end,
    agreed_at = case when public.agreements.text = excluded.text then public.agreements.agreed_at end,
    updated_at = case when public.agreements.text = excluded.text then public.agreements.updated_at else now() end;
end;
$$;
revoke all on function public.save_agreement_after_paying from public, anon, authenticated;
grant execute on function public.save_agreement_after_paying to service_role;

-- Whether the other person on the caller's plan has opened it yet. False when there is nobody else.
create or replace function public.other_opened_plan()
returns boolean
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_email text := lower(auth.jwt() ->> 'email');
  v_plan text := public.my_plan_email();
  v_other text;
begin
  if v_email is null or v_plan is null then
    return false;
  end if;
  select case when p.email = v_email then p.partner_email else p.email end into v_other
  from public.people p
  where p.email = v_plan;
  return v_other is not null and exists (select 1 from public.plan_progress where email = lower(v_other));
end;
$$;
revoke all on function public.other_opened_plan from public, anon;
grant execute on function public.other_opened_plan to authenticated;

-- Agrees to a line as it stands. The other person agrees to what one of them wrote. Until the other person
-- has opened the plan, whoever wrote it can mark it agreed after the two of them talk.
create or replace function public.agree_to(p_step_id text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_email text := lower(auth.jwt() ->> 'email');
  v_plan text := public.my_plan_email();
  v_author text;
begin
  if v_email is null then
    raise exception 'not signed in';
  end if;
  if v_plan is null then
    raise exception 'no plan';
  end if;
  select author_email into v_author from public.agreements where plan_email = v_plan and step_id = p_step_id;
  if not found then
    raise exception 'nothing to agree to';
  end if;
  if v_author = v_email and public.other_opened_plan() then
    raise exception 'waiting for the other person';
  end if;
  update public.agreements set agreed_by = v_email, agreed_at = now()
  where plan_email = v_plan and step_id = p_step_id;
end;
$$;
revoke all on function public.agree_to from public, anon;
grant execute on function public.agree_to to authenticated;

-- How each person brings up something hard, in their own words. Both of them can read it; only its owner
-- can change it.
create table if not exists public.intentions (
  plan_email text not null references public.people (email) on delete cascade,
  email text not null check (email = lower(email)),
  text text not null check (char_length(text) between 1 and 200),
  updated_at timestamptz not null default now(),
  primary key (plan_email, email)
);
alter table public.intentions enable row level security;
revoke all on table public.intentions from anon, authenticated;
grant select on table public.intentions to authenticated;
do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'intentions') then
    create policy "Read your plan's ways in" on public.intentions
      for select to authenticated
      using (plan_email = (select public.my_plan_email()));
  end if;
end;
$$;

create or replace function public.save_intention(p_text text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_email text := lower(auth.jwt() ->> 'email');
  v_plan text := public.my_plan_email();
begin
  if v_email is null then
    raise exception 'not signed in';
  end if;
  if v_plan is null then
    raise exception 'no plan';
  end if;
  insert into public.intentions (plan_email, email, text)
  values (v_plan, v_email, trim(p_text))
  on conflict (plan_email, email) do update set text = excluded.text, updated_at = now();
end;
$$;
revoke all on function public.save_intention from public, anon;
grant execute on function public.save_intention to authenticated;


-- ==== 20261022170000_check_ins.sql ====

-- Step 11: the check ins. A few quick questions at the start of each person's plan, two weeks in and a month
-- in, private to whoever answers, and one row per person for following the pilot. Run it after the other
-- files. It only adds a column, a table, functions and a view, so nothing saved changes, and it is safe to
-- run again.

-- When each person last opened their plan, so you can see where people stop.
alter table public.plan_progress add column if not exists last_seen_at timestamptz;

-- Starts their plan the first time they open it, notes every visit after that, and returns when it started.
create or replace function public.start_plan()
returns timestamptz
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_email text := lower(auth.jwt() ->> 'email');
begin
  if v_email is null then
    raise exception 'not signed in';
  end if;
  if public.my_plan_email() is null then
    raise exception 'no plan';
  end if;
  insert into public.plan_progress (email, last_seen_at) values (v_email, now())
  on conflict (email) do update set last_seen_at = now();
  return (select started_at from public.plan_progress where email = v_email);
end;
$$;
revoke all on function public.start_plan from public, anon;
grant execute on function public.start_plan to authenticated;

-- Each person's answers, one row per check in. Only the person who answered can read them, and you can in
-- the Table Editor. Their partner never can.
create table if not exists public.check_ins (
  email text not null check (email = lower(email)),
  plan_email text not null references public.people (email) on delete cascade,
  check_in text not null check (check_in in ('start', 'day_14', 'day_30')),
  -- How many days into their plan they answered.
  plan_day integer not null check (plan_day >= 0),
  -- At the start: how heard they feel when they disagree, and how disagreements usually end.
  heard text check (heard in ('not_at_all', 'a_little', 'mostly', 'really')),
  usual_ending text check (usual_ending in ('talk_it_through', 'one_gives_in', 'drop_it', 'blows_up')),
  -- Two weeks in and a month in: what they've used for real (empty for Not yet), whether they feel more heard,
  -- whether they kept to something they agreed, how their last disagreement went, and whether they'd pay to
  -- practice a hard conversation first. Then anything else they want to say.
  used text[] check (used <@ array['today', 'moment', 'pause', 'repair', 'look_back', 'words', 'message_check']),
  more_heard text check (more_heard in ('more', 'same', 'less')),
  kept_agreement text check (kept_agreement in ('yes', 'partly', 'not_really', 'none_yet')),
  last_disagreement text check (last_disagreement in ('better', 'same', 'worse', 'avoided', 'none_yet')),
  would_pay_for_practice text check (would_pay_for_practice in ('yes', 'maybe', 'no')),
  note text check (char_length(note) between 1 and 500),
  created_at timestamptz not null default now(),
  primary key (email, check_in),
  constraint check_ins_answers check (
    case when check_in = 'start'
      then heard is not null and usual_ending is not null and used is null and more_heard is null
        and kept_agreement is null and last_disagreement is null and would_pay_for_practice is null and note is null
      else heard is null and usual_ending is null and used is not null and more_heard is not null
        and kept_agreement is not null and last_disagreement is not null and would_pay_for_practice is not null
    end
  )
);
alter table public.check_ins enable row level security;
revoke all on table public.check_ins from anon, authenticated;
grant select on table public.check_ins to authenticated;
do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'check_ins') then
    create policy "Read your own check ins" on public.check_ins
      for select to authenticated
      using (email = lower((select auth.jwt() ->> 'email')));
  end if;
end;
$$;

-- Saves one check in, the first time it's answered. Two weeks in and a month in can't be answered early.
create or replace function public.save_check_in(
  p_check_in text,
  p_heard text default null,
  p_usual_ending text default null,
  p_used text[] default null,
  p_more_heard text default null,
  p_kept_agreement text default null,
  p_last_disagreement text default null,
  p_would_pay_for_practice text default null,
  p_note text default null
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_email text := lower(auth.jwt() ->> 'email');
  v_plan text := public.my_plan_email();
  v_day integer;
begin
  if v_email is null then
    raise exception 'not signed in';
  end if;
  if v_plan is null then
    raise exception 'no plan';
  end if;
  select floor(extract(epoch from now() - started_at) / 86400)::integer into v_day
  from public.plan_progress where email = v_email;
  if v_day is null then
    raise exception 'plan not started';
  end if;
  if (p_check_in = 'day_14' and v_day < 14) or (p_check_in = 'day_30' and v_day < 30) then
    raise exception 'not due yet';
  end if;
  insert into public.check_ins (
    email, plan_email, check_in, plan_day, heard, usual_ending, used, more_heard, kept_agreement,
    last_disagreement, would_pay_for_practice, note
  )
  values (
    v_email, v_plan, p_check_in, v_day, p_heard, p_usual_ending, p_used, p_more_heard, p_kept_agreement,
    p_last_disagreement, p_would_pay_for_practice, nullif(trim(p_note), '')
  )
  on conflict (email, check_in) do nothing;
  return found;
end;
$$;
revoke all on function public.save_check_in from public, anon;
grant execute on function public.save_check_in to authenticated;

-- One row per person with a plan, for following the pilot: when they paid, when they first and last opened
-- the plan, how many steps they answered, and which check ins they did. Open it in the Table Editor. Nobody
-- signed in to the site can read it.
create or replace view public.pilot_overview with (security_invoker = on) as
  with members as (
    select p.email, 'paid'::text as role, p.email as plan_email, p.paid_at
    from public.people p
    where p.paid_at is not null
    union all
    select p.partner_email, 'partner'::text, p.email, p.paid_at
    from public.people p
    where p.paid_at is not null and p.partner_email is not null
  )
  select
    m.email,
    m.role,
    m.plan_email,
    m.paid_at,
    pp.started_at as first_opened_plan,
    coalesce(pp.last_seen_at, pp.started_at) as last_opened_plan,
    (select count(*) from public.step_reviews r where r.email = m.email)::integer as steps_answered,
    (select max(r.created_at) from public.step_reviews r where r.email = m.email) as last_step_answered,
    (select array_agg(c.check_in order by c.created_at) from public.check_ins c where c.email = m.email) as check_ins_done
  from members m
  left join public.plan_progress pp on pp.email = m.email
  order by m.paid_at, m.plan_email, m.role;
revoke all on table public.pilot_overview from anon, authenticated;


-- ==== 20261022180000_privacy.sql ====

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
