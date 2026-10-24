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
