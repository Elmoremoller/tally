-- Tally, step 0: the AI allowance per visitor, which every AI call in the quiz counts against
-- (lib/ai-allowance.ts). Anyone can reach the quiz, so each caller gets 20 calls an hour and the whole site
-- 5,000 a day. A caller is kept only as a keyed hash of their address, and only for a day.
--
-- The live database already has this: it was made earlier, word for word, by an older project that shared
-- the database. This file keeps it with Tally so the database can be rebuilt from Tally's files alone. It
-- only adds a table and a function, so it is safe to run again.

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
