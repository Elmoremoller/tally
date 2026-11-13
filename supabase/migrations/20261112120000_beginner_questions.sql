-- Tally, the beginner quiz asks the AI two things while she answers: it reads her job, and it writes a few
-- questions for her. Each of those counts here, so one session can't run up the bill. A session gets four
-- (one reading, one set of questions, and room for a retry of each). Only the server, with the secret key,
-- may call this. Safe to run again.

alter table public.sessions add column if not exists question_calls smallint not null default 0
  check (question_calls between 0 and 4);

-- Counts one of those calls. False once the session has used its four, or has paid.
create or replace function public.use_question_call(p_session_id uuid)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.sessions set question_calls = question_calls + 1, updated_at = now()
  where id = p_session_id and status <> 'paid' and question_calls < 4;
  return found;
end;
$$;

revoke all on function public.use_question_call(uuid) from public, anon, authenticated;
grant execute on function public.use_question_call(uuid) to service_role;

-- Her answers to the asked questions make the beginner column bigger, so its size limit goes from 8000 to
-- 24000 bytes. The old limit is found by what it checks, then dropped, as the extra work migration does.
do $$
declare
  c record;
begin
  for c in
    select conname from pg_constraint
    where conrelid = 'public.intake'::regclass and contype = 'c' and pg_get_constraintdef(oid) like '%beginner%'
  loop
    execute format('alter table public.intake drop constraint %I', c.conname);
  end loop;
end;
$$;
alter table public.intake add constraint intake_beginner_check check (
  beginner is null or (jsonb_typeof(beginner) = 'object' and pg_column_size(beginner) <= 24000)
);
