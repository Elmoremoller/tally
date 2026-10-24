-- Step 1: one row per person, keyed by email, with their quiz answers and couple type.
-- Answers are stored as ids (see lib/quiz.ts), so the wording can change without breaking saved rows.

create table public.people (
  id uuid primary key default gen_random_uuid(),
  email text not null unique
    check (email = lower(email) and char_length(email) <= 254 and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  couple_type text not null
    check (couple_type in ('push_and_pull', 'quick_sparks', 'slow_simmer')),
  fight_topics text[] not null
    check (
      cardinality(fight_topics) between 1 and 7
      and fight_topics <@ array['chores', 'money', 'phones_and_trust', 'time_with_friends', 'family', 'sharing_space', 'texts_that_land_wrong']
    ),
  you_in_a_fight text not null
    check (you_in_a_fight in ('sort_it_out_now', 'go_quiet', 'get_sharp', 'say_sorry_fast')),
  partner_in_a_fight text not null
    check (partner_in_a_fight in ('sort_it_out_now', 'go_quiet', 'get_sharp', 'say_sorry_fast')),
  how_fights_start text not null
    check (how_fights_start in ('said_the_wrong_way', 'building_up', 'tired_or_stressed', 'old_fight')),
  okay_again_after text not null
    check (okay_again_after in ('few_hours', 'about_a_day', 'few_days', 'week_or_more')),
  how_you_make_up text not null
    check (how_you_make_up in ('talk_it_through', 'one_says_sorry', 'move_on', 'wait_it_out')),
  your_name text check (char_length(your_name) <= 40),
  partner_name text check (char_length(partner_name) <= 40),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.people is 'Everyone who finished the quiz: their answers, couple type and email.';

-- Row level security on, with no policies: the publishable key the website uses cannot read or change
-- this table directly. The website only saves through save_quiz below.
alter table public.people enable row level security;
revoke all on table public.people from anon, authenticated;

-- Saves a finished quiz. Taking the quiz again with the same email replaces the earlier answers.
create function public.save_quiz(
  p_email text,
  p_couple_type text,
  p_fight_topics text[],
  p_you_in_a_fight text,
  p_partner_in_a_fight text,
  p_how_fights_start text,
  p_okay_again_after text,
  p_how_you_make_up text,
  p_your_name text default null,
  p_partner_name text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.people (
    email, couple_type, fight_topics, you_in_a_fight, partner_in_a_fight,
    how_fights_start, okay_again_after, how_you_make_up, your_name, partner_name
  )
  values (
    lower(trim(p_email)), p_couple_type, p_fight_topics, p_you_in_a_fight, p_partner_in_a_fight,
    p_how_fights_start, p_okay_again_after, p_how_you_make_up, nullif(trim(p_your_name), ''), nullif(trim(p_partner_name), '')
  )
  on conflict (email) do update set
    couple_type = excluded.couple_type,
    fight_topics = excluded.fight_topics,
    you_in_a_fight = excluded.you_in_a_fight,
    partner_in_a_fight = excluded.partner_in_a_fight,
    how_fights_start = excluded.how_fights_start,
    okay_again_after = excluded.okay_again_after,
    how_you_make_up = excluded.how_you_make_up,
    your_name = excluded.your_name,
    partner_name = excluded.partner_name,
    updated_at = now();
end;
$$;

revoke all on function public.save_quiz from public;
grant execute on function public.save_quiz to anon, authenticated;
