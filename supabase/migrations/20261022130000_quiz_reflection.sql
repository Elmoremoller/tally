-- Step 7: what people write about their last fight in the quiz, kept private, and a limit on how often the
-- AI reads it. Run it after the other files. It only adds tables and functions, so nothing saved changes,
-- and it is safe to run again.

-- One row per person who wrote something in the quiz's open question and kept the reflection. It lives
-- outside people on purpose: an invited partner can read people, but never this.
create table if not exists public.reflections (
  email text primary key references public.people (email) on delete cascade,
  story text not null check (char_length(story) between 1 and 1000),
  correction text check (char_length(correction) between 1 and 200),
  bullets text[] not null check (cardinality(bullets) between 1 and 3 and char_length(array_to_string(bullets, '')) <= 900),
  -- true when they tapped Not quite and fixed it, false when they tapped Yes, that's us
  fixed boolean not null default false,
  main_topic text
    check (main_topic in ('chores', 'money', 'phones_and_trust', 'time_with_friends', 'family', 'sharing_space', 'texts_that_land_wrong')),
  role text check (role in ('talks_now', 'pulls_away', 'both')),
  heat text check (heat in ('low', 'medium', 'high')),
  wants_more_of text
    check (wants_more_of in ('feeling_heard', 'calm', 'fairness', 'closeness', 'trust', 'respect', 'time_together')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.reflections is 'What someone wrote about their last fight, the reflection they kept, and labels for their plan. Only they can read it.';

-- Signed in people can read what they wrote themselves. Nobody else can, partners included.
alter table public.reflections enable row level security;
revoke all on table public.reflections from anon, authenticated;
grant select on table public.reflections to authenticated;
do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'reflections') then
    create policy "Read only what you wrote" on public.reflections
      for select to authenticated
      using (email = lower((select auth.jwt() ->> 'email')));
  end if;
end;
$$;

-- Saves or replaces someone's reflection, or removes it when there is no story. Only the server calls it,
-- after save_quiz, and only while they haven't paid, the same as their quiz answers. It also deletes what
-- people who never bought wrote more than 30 days ago.
create or replace function public.save_reflection(
  p_email text,
  p_story text default null,
  p_correction text default null,
  p_bullets text[] default null,
  p_fixed boolean default false,
  p_main_topic text default null,
  p_role text default null,
  p_heat text default null,
  p_wants_more_of text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_email text := lower(trim(p_email));
begin
  delete from public.reflections r
  using public.people p
  where p.email = r.email and p.paid_at is null and r.updated_at < now() - interval '30 days';

  if exists (select 1 from public.people where email = v_email and paid_at is not null) then
    return;
  end if;

  if p_story is null then
    delete from public.reflections where email = v_email;
    return;
  end if;

  insert into public.reflections (email, story, correction, bullets, fixed, main_topic, role, heat, wants_more_of)
  values (v_email, p_story, p_correction, p_bullets, p_fixed, p_main_topic, p_role, p_heat, p_wants_more_of)
  on conflict (email) do update set
    story = excluded.story,
    correction = excluded.correction,
    bullets = excluded.bullets,
    fixed = excluded.fixed,
    main_topic = excluded.main_topic,
    role = excluded.role,
    heat = excluded.heat,
    wants_more_of = excluded.wants_more_of,
    updated_at = now();
end;
$$;
revoke all on function public.save_reflection from public, anon, authenticated;
grant execute on function public.save_reflection to service_role;

-- How often the AI reads quiz answers. Anyone can reach the quiz, so each caller gets 20 an hour and the
-- whole site 5,000 a day. A caller is kept only as a keyed hash of their address, and only for a day.
create table if not exists public.ai_calls (
  id bigint generated always as identity primary key,
  caller text not null,
  created_at timestamptz not null default now()
);
create index if not exists ai_calls_caller_created_at on public.ai_calls (caller, created_at);
create index if not exists ai_calls_created_at on public.ai_calls (created_at);
alter table public.ai_calls enable row level security;
revoke all on table public.ai_calls from anon, authenticated;

-- Counts one call and returns true, or returns false when the caller or the site has used its allowance.
create or replace function public.use_ai_call(p_caller text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform pg_advisory_xact_lock(hashtext('ai_calls'));
  delete from public.ai_calls where created_at < now() - interval '1 day';
  if (select count(*) from public.ai_calls) >= 5000 then
    return false;
  end if;
  if (select count(*) from public.ai_calls where caller = p_caller and created_at > now() - interval '1 hour') >= 20 then
    return false;
  end if;
  insert into public.ai_calls (caller) values (p_caller);
  return true;
end;
$$;
revoke all on function public.use_ai_call from public, anon, authenticated;
grant execute on function public.use_ai_call to service_role;
