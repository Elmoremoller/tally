-- Step 8: the plan loop. When each person's plan started, the answers they give after each step (only they
-- can read those), and what a couple agreed on, for their Couple Standard. Run it after the other files. It
-- only adds tables and functions, so nothing saved changes, and it is safe to run again.

-- The plan a signed in person belongs to: their own paid plan, or else the one they were invited to.
create or replace function public.my_plan_email()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select p.email from public.people p
  where p.paid_at is not null
    and (p.email = lower(auth.jwt() ->> 'email') or p.partner_email = lower(auth.jwt() ->> 'email'))
  order by (p.email = lower(auth.jwt() ->> 'email')) desc
  limit 1
$$;
revoke all on function public.my_plan_email from public, anon;
grant execute on function public.my_plan_email to authenticated;

-- When each person first opened their plan. The first step is asked about from here.
create table if not exists public.plan_progress (
  email text primary key check (email = lower(email)),
  started_at timestamptz not null default now()
);
alter table public.plan_progress enable row level security;
revoke all on table public.plan_progress from anon, authenticated;

-- Starts their plan the first time they open it, and returns when that was.
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
  insert into public.plan_progress (email) values (v_email) on conflict (email) do nothing;
  return (select started_at from public.plan_progress where email = v_email);
end;
$$;
revoke all on function public.start_plan from public, anon;
grant execute on function public.start_plan to authenticated;

-- Every answer to Did you try it?, with the line they wrote and what was read back, if they wrote one. Each
-- person's own, so a partner never sees them. Where they are in their plan is worked out from these.
create table if not exists public.step_reviews (
  id bigint generated always as identity primary key,
  email text not null check (email = lower(email)),
  step_id text not null
    check (step_id in (
      'small_thing', 'ask_one_question', 'check_in', 'running_on_empty', 'notice_good', 'one_request', 'one_thing',
      'agree_pause', 'racing_heart', 'coming_back', 'one_minute', 'text_regret', 'soft_start', 'say_when_back',
      'first_move', 'sorry_lands', 'ten_minute', 'after_break', 'first_check_in', 'made_worse'
    )),
  version text not null check (version in ('main', 'alone')),
  outcome text not null check (outcome in ('helped', 'no_engage', 'worse', 'not_yet')),
  line text check (char_length(line) between 1 and 300),
  bullets text[] check (cardinality(bullets) between 1 and 3 and char_length(array_to_string(bullets, '')) <= 900),
  created_at timestamptz not null default now()
);
create index if not exists step_reviews_email_created_at on public.step_reviews (email, created_at);
alter table public.step_reviews enable row level security;
revoke all on table public.step_reviews from anon, authenticated;
grant select on table public.step_reviews to authenticated;
do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'step_reviews') then
    create policy "Read only your own answers" on public.step_reviews
      for select to authenticated
      using (email = lower((select auth.jwt() ->> 'email')));
  end if;
end;
$$;

-- Saves one answer about the step on their screen.
create or replace function public.record_review(
  p_step_id text,
  p_version text,
  p_outcome text,
  p_line text default null,
  p_bullets text[] default null
)
returns void
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
  insert into public.step_reviews (email, step_id, version, outcome, line, bullets)
  values (v_email, p_step_id, p_version, p_outcome, nullif(trim(p_line), ''), p_bullets);
end;
$$;
revoke all on function public.record_review from public, anon;
grant execute on function public.record_review to authenticated;

-- What a couple agreed on, one per agree step, for their Couple Standard. Both of them can read it, and
-- saving it again changes it.
create table if not exists public.agreements (
  plan_email text not null references public.people (email) on delete cascade,
  step_id text not null check (step_id in ('check_in', 'running_on_empty', 'agree_pause', 'coming_back', 'first_move')),
  text text not null check (char_length(text) between 1 and 200),
  author_email text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (plan_email, step_id)
);
alter table public.agreements enable row level security;
revoke all on table public.agreements from anon, authenticated;
grant select on table public.agreements to authenticated;
do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'agreements') then
    create policy "Read your plan's agreements" on public.agreements
      for select to authenticated
      using (plan_email = (select public.my_plan_email()));
  end if;
end;
$$;

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
    author_email = excluded.author_email,
    updated_at = now();
end;
$$;
revoke all on function public.save_agreement from public, anon;
grant execute on function public.save_agreement to authenticated;
