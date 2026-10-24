-- Tally, step 3: the quiz's third question is now the extra work she ends up doing ("What do you end up doing
-- that isn’t really your job?"), and the AI tools question gains Other (with what she typed), None yet and
-- Not sure. Her tasks from that question are marked, so the summary and her plan can tell them apart.
--
-- Nothing is deleted: known_for_text and known_for_summary keep the answers already saved, and save_answers
-- stays for any copy of the site still running the old quiz. New answers go through save_quiz_answers.
-- Safe to run again.

-- Her answer to the third question, and what she typed under Other.
alter table public.intake add column if not exists extra_work_text text
  check (char_length(extra_work_text) between 1 and 1500);
alter table public.intake add column if not exists ai_tools_other text
  check (char_length(ai_tools_other) between 1 and 200);

-- The tools she can pick: the four chat tools, Other, None yet and Not sure. None yet and Not sure go on
-- their own. Replaces the first migration's list of five.
do $$
declare
  c record;
begin
  for c in
    select conname from pg_constraint
    where conrelid = 'public.intake'::regclass and contype = 'c' and pg_get_constraintdef(oid) like '%not_sure%'
  loop
    execute format('alter table public.intake drop constraint %I', c.conname);
  end loop;
end;
$$;
alter table public.intake add constraint intake_ai_tools_check check (
  cardinality(ai_tools) between 1 and 7
  and ai_tools <@ array['chatgpt', 'copilot', 'gemini', 'claude', 'other', 'none_yet', 'not_sure']
  and (cardinality(ai_tools) = 1 or not ai_tools && array['none_yet', 'not_sure'])
);

-- True for a task that came from the extra work she got pulled into.
alter table public.tasks add column if not exists extra boolean not null default false;

-- Saves her three answers, her AI tools (and what she typed under Other) and her company's view on AI.
-- Answering again replaces them, until she has paid.
create or replace function public.save_quiz_answers(
  p_session_id uuid,
  p_job_text text,
  p_week_text text,
  p_extra_work_text text,
  p_ai_tools text[],
  p_ai_tools_other text,
  p_ai_policy text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (select 1 from public.sessions where id = p_session_id and status <> 'paid') then
    raise exception 'no open session';
  end if;
  if ('other' = any (p_ai_tools)) is distinct from (p_ai_tools_other is not null) then
    raise exception 'Other needs what she typed, and only Other';
  end if;
  insert into public.intake (session_id, job_text, week_text, extra_work_text, ai_tools, ai_tools_other, ai_policy)
  values (p_session_id, p_job_text, p_week_text, p_extra_work_text, p_ai_tools, p_ai_tools_other, p_ai_policy)
  on conflict (session_id) do update set
    job_text = excluded.job_text,
    week_text = excluded.week_text,
    extra_work_text = excluded.extra_work_text,
    ai_tools = excluded.ai_tools,
    ai_tools_other = excluded.ai_tools_other,
    ai_policy = excluded.ai_policy,
    updated_at = now();
end;
$$;

-- As in the first migration, and now also keeps whether each task came from her extra work. p_tasks is a
-- list of { name, pile, estimated_hours, extra }, in order; a task without extra counts as from her week.
-- p_known_for_summary is null for answers to the new third question.
create or replace function public.save_intake_result(
  p_session_id uuid,
  p_role_summary text,
  p_known_for_summary text,
  p_follow_up_question text,
  p_prompt_version text,
  p_model text,
  p_tasks jsonb
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if jsonb_typeof(p_tasks) <> 'array' or jsonb_array_length(p_tasks) not between 1 and 7 then
    raise exception 'between 1 and 7 tasks';
  end if;
  update public.intake i set
    role_summary = p_role_summary,
    known_for_summary = p_known_for_summary,
    follow_up_question = coalesce(i.follow_up_question, p_follow_up_question),
    prompt_version = p_prompt_version,
    model = p_model,
    updated_at = now()
  from public.sessions s
  where i.session_id = p_session_id and s.id = p_session_id and s.status <> 'paid';
  if not found then
    raise exception 'no answers for this session';
  end if;
  delete from public.tasks where session_id = p_session_id;
  insert into public.tasks (session_id, name, pile, estimated_hours, extra, position)
  select
    p_session_id,
    t.value ->> 'name',
    t.value ->> 'pile',
    (t.value ->> 'estimated_hours')::numeric,
    coalesce((t.value ->> 'extra')::boolean, false),
    (t.n - 1)::smallint
  from jsonb_array_elements(p_tasks) with ordinality as t(value, n);
end;
$$;

-- Only the server, with the secret key, may call these.
revoke all on function public.save_quiz_answers(uuid, text, text, text, text[], text, text) from public, anon, authenticated;
revoke all on function public.save_intake_result(uuid, text, text, text, text, text, jsonb) from public, anon, authenticated;
grant execute on function public.save_quiz_answers(uuid, text, text, text, text[], text, text) to service_role;
grant execute on function public.save_intake_result(uuid, text, text, text, text, text, jsonb) to service_role;
