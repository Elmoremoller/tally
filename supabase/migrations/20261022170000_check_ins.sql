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
