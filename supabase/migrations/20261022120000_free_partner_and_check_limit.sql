-- Step 6: adding a partner is free, and the message check allows 10 a day per person.
-- Run it after the first two files. It only replaces two functions, so no saved answers or payments change.

comment on column public.people.partner_paid is 'No longer used. Adding a partner has been free since 2026-10-22.';

-- Gives a partner access to the plan. Only the person who paid can do this. Calling it again changes the
-- partner's email, in case of a typo.
create or replace function public.invite_partner(p_partner_email text)
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
  where email = v_email and paid_at is not null;
  if not found then
    raise exception 'no plan to share';
  end if;
end;
$$;
revoke all on function public.invite_partner from public, anon;
grant execute on function public.invite_partner to authenticated;

-- Uses one message check. Returns how many are left today, or -1 when today's allowance is used up.
-- The message check calls an AI model, so the allowance keeps one person from running up the bill.
create or replace function public.use_message_check()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_email text := lower(auth.jwt() ->> 'email');
  v_limit integer := 10;
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
