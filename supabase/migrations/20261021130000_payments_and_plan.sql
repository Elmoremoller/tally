-- Steps 3 to 5: who has paid, partner access, and who may read which plan.

alter table public.people
  add column paid_at timestamptz,
  add column partner_paid boolean not null default false,
  add column partner_email text
    check (
      partner_email is null
      or (partner_email = lower(partner_email) and partner_email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' and partner_email <> email)
    );

create unique index people_partner_email_key on public.people (partner_email) where partner_email is not null;

-- One row per paid Stripe Checkout, so every payment can be traced.
create table public.payments (
  stripe_session_id text primary key,
  email text not null,
  kind text not null check (kind in ('plan', 'partner')),
  amount_total integer not null,
  currency text not null,
  created_at timestamptz not null default now()
);
comment on table public.payments is 'Every paid Stripe Checkout: the plan, and adding a partner.';
alter table public.payments enable row level security;
revoke all on table public.payments from anon, authenticated;

-- Records a paid Checkout and opens the plan. Both the Stripe webhook and the page people land on after
-- paying call this, so it is safe to call twice: it returns true only the first time.
create function public.record_payment(
  p_session_id text,
  p_email text,
  p_kind text,
  p_with_partner boolean,
  p_amount_total integer,
  p_currency text
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.payments (stripe_session_id, email, kind, amount_total, currency)
  values (p_session_id, lower(p_email), p_kind, p_amount_total, p_currency)
  on conflict (stripe_session_id) do nothing;
  if not found then
    return false;
  end if;

  update public.people set
    paid_at = case when p_kind = 'plan' then coalesce(paid_at, now()) else paid_at end,
    partner_paid = partner_paid or p_with_partner or p_kind = 'partner',
    updated_at = now()
  where email = lower(p_email);
  -- No quiz answers for this email means no plan to open. Undo the payment row and fail, so Stripe
  -- retries and the failure shows up in its webhook log instead of passing quietly.
  if not found then
    raise exception 'No quiz answers for %, so there is no plan to open', p_email;
  end if;
  return true;
end;
$$;
-- Only the server, with the secret key, may record payments.
revoke all on function public.record_payment from public, anon, authenticated;
grant execute on function public.record_payment to service_role;

-- Once someone has paid, taking the quiz again no longer changes their plan, and save_quiz says so, so
-- the site can send them back to their plan instead of asking them to pay twice.
drop function public.save_quiz(text, text, text[], text, text, text, text, text, text, text);
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
returns boolean
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
    updated_at = now()
  where public.people.paid_at is null;
  return exists (select 1 from public.people where email = lower(trim(p_email)) and paid_at is not null);
end;
$$;
revoke all on function public.save_quiz from public;
grant execute on function public.save_quiz to anon, authenticated;

-- Signed in people can read their own plan, and the plan they were invited to as a partner. Nothing else.
grant select on table public.people to authenticated;
create policy "Read your own plan or your partner's" on public.people
  for select to authenticated
  using (
    email = lower((select auth.jwt() ->> 'email'))
    or partner_email = lower((select auth.jwt() ->> 'email'))
  );

-- Gives a partner access to the plan. Only the person who paid can do this, and only once the partner
-- is paid for. Calling it again changes the partner's email, in case of a typo.
create function public.invite_partner(p_partner_email text)
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
  update public.people
  set partner_email = lower(trim(p_partner_email)), updated_at = now()
  where email = v_email and paid_at is not null and partner_paid;
  if not found then
    raise exception 'no partner access to give';
  end if;
end;
$$;
revoke all on function public.invite_partner from public, anon;
grant execute on function public.invite_partner to authenticated;

-- The message check calls an AI model, so each person gets a daily allowance.
create table public.message_checks (
  id bigint generated always as identity primary key,
  email text not null,
  created_at timestamptz not null default now()
);
create index message_checks_email_created_at on public.message_checks (email, created_at);
alter table public.message_checks enable row level security;
revoke all on table public.message_checks from anon, authenticated;

-- Uses one message check. Returns how many are left today, or -1 when today's allowance is used up.
create function public.use_message_check()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_email text := lower(auth.jwt() ->> 'email');
  v_limit integer := 40;
  v_used integer;
begin
  if v_email is null then
    raise exception 'not signed in';
  end if;
  -- One check at a time per person, so many requests at once can't all slip under the limit.
  perform pg_advisory_xact_lock(hashtext(v_email));
  if not exists (
    select 1 from public.people
    where (email = v_email or partner_email = v_email) and paid_at is not null
  ) then
    raise exception 'no plan';
  end if;
  select count(*) into v_used
  from public.message_checks
  where email = v_email and created_at > now() - interval '1 day';
  if v_used >= v_limit then
    return -1;
  end if;
  insert into public.message_checks (email) values (v_email);
  return v_limit - v_used - 1;
end;
$$;
revoke all on function public.use_message_check from public, anon;
grant execute on function public.use_message_check to authenticated;
