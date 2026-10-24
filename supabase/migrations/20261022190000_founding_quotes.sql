-- Step 13: founding couple quotes. Two weeks in and a month in, the check in asks what someone would tell
-- another couple about it, with a box to tick if we may show it on the website with their first name. Run it
-- after the other files. It only adds two columns, a rule, a view and a new version of save_check_in, so
-- nothing saved changes, and it is safe to run again. Until it has run, the check ins don't ask.

-- What they'd tell another couple, and whether they ticked the box. The tick only counts with a quote.
alter table public.check_ins add column if not exists quote text check (char_length(quote) between 1 and 300);
alter table public.check_ins add column if not exists show_quote boolean not null default false;
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'check_ins_quote') then
    alter table public.check_ins add constraint check_ins_quote check (
      (check_in <> 'start' or quote is null) and (quote is not null or not show_quote)
    );
  end if;
end;
$$;

-- The same as before, plus the quote and the tick. The old version is dropped first, because a function
-- with more inputs would otherwise sit beside it instead of replacing it.
drop function if exists public.save_check_in(text, text, text, text[], text, text, text, text, text);
create or replace function public.save_check_in(
  p_check_in text,
  p_heard text default null,
  p_usual_ending text default null,
  p_used text[] default null,
  p_more_heard text default null,
  p_kept_agreement text default null,
  p_last_disagreement text default null,
  p_would_pay_for_practice text default null,
  p_note text default null,
  p_quote text default null,
  p_show_quote boolean default false
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
  v_quote text := nullif(trim(p_quote), '');
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
    last_disagreement, would_pay_for_practice, note, quote, show_quote
  )
  values (
    v_email, v_plan, p_check_in, v_day, p_heard, p_usual_ending, p_used, p_more_heard, p_kept_agreement,
    p_last_disagreement, p_would_pay_for_practice, nullif(trim(p_note), ''), v_quote,
    v_quote is not null and coalesce(p_show_quote, false)
  )
  on conflict (email, check_in) do nothing;
  return found;
end;
$$;
revoke all on function public.save_check_in from public, anon;
grant execute on function public.save_check_in to authenticated;

-- The quotes people said we may show, newest first, with the first name they gave in the quiz (or the one
-- their partner gave for them). Open it in the Table Editor. Nobody signed in to the site can read it. A
-- quote reaches the website only when you copy it into lib/quotes.ts, word for word.
create or replace view public.founding_quotes with (security_invoker = on) as
  select
    c.created_at,
    case when c.email = p.email then p.your_name else p.partner_name end as first_name,
    c.quote,
    c.check_in,
    c.email
  from public.check_ins c
  join public.people p on p.email = c.plan_email
  where c.show_quote
  order by c.created_at desc;
revoke all on table public.founding_quotes from anon, authenticated;
