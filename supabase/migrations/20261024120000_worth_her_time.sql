-- Worth Her Time, step 1: the funnel's own tables, in the same database as The Couple Standard. Nothing here
-- reads or changes The Couple Standard's tables, and nothing is copied from them.
--
-- sessions: one row per quiz visitor, with the ad angle and UTM values she came in with.
-- intake:   her answers and what the AI made of them. tasks: the tasks it found, with her own hours.
-- orders:   only from a paid Stripe Checkout, once per Checkout however often Stripe reports it.
-- plans:    her generated plan, opened with a long random token.
-- events:   the funnel's steps, for counting.
--
-- Every table is locked: the publishable key the website uses can't read or change any of it. The server
-- writes through the functions below, with the secret key. The AI allowance per visitor (use_ai_call) is
-- The Couple Standard's, from 20261022130000_quiz_reflection.sql. Safe to run again.

-- One row per quiz visitor.
create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  angle text not null default 'default' check (angle ~ '^[a-z_]{1,40}$'),
  utm_source text check (char_length(utm_source) <= 200),
  utm_medium text check (char_length(utm_medium) <= 200),
  utm_campaign text check (char_length(utm_campaign) <= 200),
  utm_content text check (char_length(utm_content) <= 200),
  last_step text check (last_step ~ '^[a-z_]{1,40}$'),
  status text not null default 'started' check (status in ('started', 'completed', 'paid')),
  -- Only once she gives it, at checkout.
  email text check (email = lower(email) and char_length(email) <= 254 and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  -- How many times the AI has read her answers. Three at most, to keep costs and abuse down.
  intake_calls smallint not null default 0 check (intake_calls between 0 and 3),
  -- When she last went to pay, so the privacy cleanup never removes answers while she's paying.
  checkout_started_at timestamptz
);
comment on table public.sessions is 'Worth Her Time: one row per quiz visitor.';
create index if not exists sessions_email on public.sessions (email) where email is not null;
create index if not exists sessions_created_at on public.sessions (created_at);

-- Her answers, and the AI's summary of them. One row per session.
create table if not exists public.intake (
  session_id uuid primary key references public.sessions (id) on delete cascade,
  job_text text check (char_length(job_text) between 1 and 1500),
  week_text text check (char_length(week_text) between 1 and 1500),
  known_for_text text check (char_length(known_for_text) between 1 and 1500),
  follow_up_question text check (char_length(follow_up_question) between 1 and 300),
  follow_up_answer text check (char_length(follow_up_answer) between 1 and 1500),
  ai_tools text[] check (
    cardinality(ai_tools) between 1 and 5
    and ai_tools <@ array['chatgpt', 'copilot', 'gemini', 'claude', 'not_sure']
  ),
  ai_policy text check (ai_policy in ('encouraged', 'unclear', 'restricted', 'no_idea')),
  role_summary text check (char_length(role_summary) between 1 and 300),
  known_for_summary text check (char_length(known_for_summary) between 1 and 300),
  prompt_version text check (char_length(prompt_version) <= 40),
  model text check (char_length(model) <= 80),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.intake is 'Worth Her Time: her quiz answers and the AI summary of them.';

-- The tasks the AI found in her answers. Hours go in half hour steps; the confirmed ones are hers.
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  pile text not null check (pile in ('hand_to_ai', 'hand_back', 'keep_visible')),
  estimated_hours numeric(3, 1) not null check (estimated_hours between 0 and 8 and estimated_hours * 2 = trunc(estimated_hours * 2)),
  confirmed_hours numeric(3, 1) check (confirmed_hours between 0 and 15 and confirmed_hours * 2 = trunc(confirmed_hours * 2)),
  position smallint not null check (position between 0 and 9)
);
comment on table public.tasks is 'Worth Her Time: the tasks from her answers, in three piles, with the hours she confirmed.';
create index if not exists tasks_session_id on public.tasks (session_id, position);

-- Paid Stripe Checkouts. provider_ref is the Checkout's id, so a repeated webhook can't add a second order.
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions (id) on delete cascade,
  product text not null check (product in ('plan', 'wins_log')),
  amount_cents integer not null check (amount_cents > 0),
  currency text not null check (currency ~ '^[a-z]{3}$'),
  status text not null default 'paid' check (status in ('paid', 'refunded')),
  provider_ref text not null unique,
  email text not null check (email = lower(email) and char_length(email) <= 254),
  created_at timestamptz not null default now()
);
comment on table public.orders is 'Worth Her Time: paid Stripe Checkouts. Card details stay with Stripe.';
create index if not exists orders_session_id on public.orders (session_id);
create index if not exists orders_email on public.orders (email);

-- Her plan. The access token is 64 random characters (two random UUIDs), and is the only way to open it.
create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null unique references public.sessions (id) on delete cascade,
  order_id uuid not null unique references public.orders (id) on delete cascade,
  access_token text not null unique
    default replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', '')
    check (char_length(access_token) >= 43),
  status text not null default 'pending' check (status in ('pending', 'ready', 'failed')),
  content jsonb,
  prompt_version text check (char_length(prompt_version) <= 40),
  model text check (char_length(model) <= 80),
  attempts smallint not null default 0 check (attempts between 0 and 10),
  -- Set while one attempt is running, so two can't run at once.
  generating_since timestamptz,
  -- Why the last attempt failed, so failures can be seen in the Table Editor.
  last_error text check (char_length(last_error) <= 1000),
  created_at timestamptz not null default now(),
  ready_at timestamptz,
  check (status <> 'ready' or content is not null)
);
comment on table public.plans is 'Worth Her Time: generated plans. Opened only with access_token.';

-- The funnel's steps. No free text: only which step, the angle, and small details like the UTM values.
create table if not exists public.events (
  id bigint generated always as identity primary key,
  session_id uuid references public.sessions (id) on delete cascade,
  name text not null check (name in (
    'landing_view', 'quiz_start', 'quiz_step_complete', 'quiz_complete', 'result_view',
    'paywall_view', 'checkout_start', 'purchase', 'plan_view', 'wins_log_click'
  )),
  angle text not null default 'default' check (angle ~ '^[a-z_]{1,40}$'),
  props jsonb not null default '{}'::jsonb check (jsonb_typeof(props) = 'object' and pg_column_size(props) <= 2000),
  created_at timestamptz not null default now()
);
comment on table public.events is 'Worth Her Time: funnel events, each with its angle and UTM values.';
create index if not exists events_name_created_at on public.events (name, created_at);
create index if not exists events_session_id on public.events (session_id) where session_id is not null;

-- Locked: no reading or writing with the website's publishable key, and no policies that open anything.
alter table public.sessions enable row level security;
alter table public.intake enable row level security;
alter table public.tasks enable row level security;
alter table public.orders enable row level security;
alter table public.plans enable row level security;
alter table public.events enable row level security;
revoke all on table public.sessions, public.intake, public.tasks, public.orders, public.plans, public.events from anon, authenticated;

-- Starts a session when she opens the quiz, with the angle and UTM values she came in with.
create or replace function public.start_session(
  p_angle text default 'default',
  p_utm_source text default null,
  p_utm_medium text default null,
  p_utm_campaign text default null,
  p_utm_content text default null
)
returns uuid
language sql
security definer
set search_path = ''
as $$
  insert into public.sessions (angle, utm_source, utm_medium, utm_campaign, utm_content)
  values (
    coalesce(nullif(p_angle, ''), 'default'),
    left(nullif(trim(p_utm_source), ''), 200),
    left(nullif(trim(p_utm_medium), ''), 200),
    left(nullif(trim(p_utm_campaign), ''), 200),
    left(nullif(trim(p_utm_content), ''), 200)
  )
  returning id;
$$;

-- Notes the last quiz step she finished.
create or replace function public.note_step(p_session_id uuid, p_step text)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.sessions set last_step = p_step, updated_at = now() where id = p_session_id;
$$;

-- Saves her three answers, her AI tools and her company's view on AI. Answering again replaces them,
-- until she has paid.
create or replace function public.save_answers(
  p_session_id uuid,
  p_job_text text,
  p_week_text text,
  p_known_for_text text,
  p_ai_tools text[],
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
  insert into public.intake (session_id, job_text, week_text, known_for_text, ai_tools, ai_policy)
  values (p_session_id, p_job_text, p_week_text, p_known_for_text, p_ai_tools, p_ai_policy)
  on conflict (session_id) do update set
    job_text = excluded.job_text,
    week_text = excluded.week_text,
    known_for_text = excluded.known_for_text,
    ai_tools = excluded.ai_tools,
    ai_policy = excluded.ai_policy,
    updated_at = now();
end;
$$;

-- Counts one AI reading of her answers. False once the session has used its three.
create or replace function public.use_intake_call(p_session_id uuid)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.sessions set intake_calls = intake_calls + 1, updated_at = now()
  where id = p_session_id and status <> 'paid' and intake_calls < 3;
  return found;
end;
$$;

-- Saves what the AI made of her answers, and replaces her tasks with the ones it found. p_tasks is a list
-- of { name, pile, estimated_hours }, in order. Only the first follow up question is ever kept.
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
  insert into public.tasks (session_id, name, pile, estimated_hours, position)
  select p_session_id, t.value ->> 'name', t.value ->> 'pile', (t.value ->> 'estimated_hours')::numeric, (t.n - 1)::smallint
  from jsonb_array_elements(p_tasks) with ordinality as t(value, n);
end;
$$;

-- Saves her answer to the one follow up question.
create or replace function public.save_follow_up_answer(p_session_id uuid, p_answer text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.intake set follow_up_answer = p_answer, updated_at = now()
  where session_id = p_session_id and follow_up_question is not null;
  if not found then
    raise exception 'no follow up question for this session';
  end if;
end;
$$;

-- "Looks right": saves her tasks as she confirmed them. p_tasks is a list of { id, name, pile,
-- confirmed_hours } in her order. Tasks she removed are deleted. The quiz is then complete.
create or replace function public.confirm_tasks(p_session_id uuid, p_tasks jsonb)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (select 1 from public.sessions where id = p_session_id and status <> 'paid') then
    raise exception 'no open session';
  end if;
  if jsonb_typeof(p_tasks) <> 'array' or jsonb_array_length(p_tasks) not between 1 and 7 then
    raise exception 'between 1 and 7 tasks';
  end if;
  delete from public.tasks
  where session_id = p_session_id
    and id not in (select (value ->> 'id')::uuid from jsonb_array_elements(p_tasks));
  update public.tasks t set
    name = c.value ->> 'name',
    pile = c.value ->> 'pile',
    confirmed_hours = (c.value ->> 'confirmed_hours')::numeric,
    position = (c.n - 1)::smallint
  from jsonb_array_elements(p_tasks) with ordinality as c(value, n)
  where t.id = (c.value ->> 'id')::uuid and t.session_id = p_session_id;
  update public.sessions set status = 'completed', last_step = 'confirm', updated_at = now()
  where id = p_session_id;
end;
$$;

-- Notes that she went to pay.
create or replace function public.note_session_checkout(p_session_id uuid)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.sessions set checkout_started_at = now() where id = p_session_id and status <> 'paid';
$$;

-- Records a paid Checkout. Both the Stripe webhook and the page she lands on after paying call this, so it
-- is safe to call twice: first is true only the first time. A paid plan also marks the session paid, keeps
-- her email, and adds her plan, waiting to be written. Returns { order_id, plan_id, access_token, first }.
create or replace function public.record_order(
  p_provider_ref text,
  p_session_id uuid,
  p_product text,
  p_amount_cents integer,
  p_currency text,
  p_email text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_email text := lower(trim(p_email));
  v_order uuid;
  v_first boolean := false;
  v_plan public.plans%rowtype;
begin
  insert into public.orders (session_id, product, amount_cents, currency, provider_ref, email)
  values (p_session_id, p_product, p_amount_cents, lower(p_currency), p_provider_ref, v_email)
  on conflict (provider_ref) do nothing
  returning id into v_order;

  if v_order is null then
    select id into v_order from public.orders where provider_ref = p_provider_ref;
  else
    v_first := true;
    if p_product = 'plan' then
      update public.sessions set status = 'paid', email = v_email, updated_at = now() where id = p_session_id;
      insert into public.plans (session_id, order_id) values (p_session_id, v_order)
      on conflict (session_id) do nothing;
    end if;
  end if;

  select * into v_plan from public.plans where session_id = p_session_id;
  return jsonb_build_object(
    'order_id', v_order,
    'plan_id', v_plan.id,
    'access_token', v_plan.access_token,
    'first', v_first
  );
end;
$$;

-- Starts one attempt at writing a plan. False when it's ready, when an attempt is already running (for up
-- to 3 minutes), or after 4 attempts (the first and 3 retries).
create or replace function public.claim_plan_generation(p_plan_id uuid)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.plans set attempts = attempts + 1, generating_since = now()
  where id = p_plan_id
    and status <> 'ready'
    and attempts < 4
    and (generating_since is null or generating_since < now() - interval '3 minutes');
  return found;
end;
$$;

-- Saves a written plan and opens it.
create or replace function public.save_plan(p_plan_id uuid, p_content jsonb, p_prompt_version text, p_model text)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.plans set
    content = p_content,
    prompt_version = p_prompt_version,
    model = p_model,
    status = 'ready',
    ready_at = now(),
    generating_since = null,
    last_error = null
  where id = p_plan_id;
$$;

-- Notes a failed attempt. After the fourth, the plan is marked failed, to be looked at by hand.
create or replace function public.fail_plan(p_plan_id uuid, p_error text)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.plans set
    last_error = left(p_error, 1000),
    generating_since = null,
    status = case when attempts >= 4 then 'failed' else 'pending' end
  where id = p_plan_id and status <> 'ready';
$$;

-- Counts one funnel event. An unknown session is left out rather than failing the page.
create or replace function public.log_event(p_session_id uuid, p_name text, p_angle text, p_props jsonb default '{}'::jsonb)
returns void
language sql
security definer
set search_path = ''
as $$
  insert into public.events (session_id, name, angle, props)
  select s.id, p_name, coalesce(nullif(p_angle, ''), 'default'), coalesce(p_props, '{}'::jsonb)
  from (select p_session_id as wanted) w
  left join public.sessions s on s.id = w.wanted
  where w.wanted is null or s.id is not null;
$$;

-- Deletes everything tied to one email, when someone asks: in the SQL Editor, run
--   select public.delete_by_email('her@email.com');
-- Her sessions go, and with them her answers, tasks, orders, plans and events. Sessions that never reached
-- checkout have no email, so they can't be found this way; the privacy cleanup removes their answers.
create or replace function public.delete_by_email(p_email text)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_email text := lower(trim(p_email));
  v_orders integer;
  v_sessions integer;
begin
  delete from public.orders where email = v_email;
  get diagnostics v_orders = row_count;
  delete from public.sessions where email = v_email;
  get diagnostics v_sessions = row_count;
  return format('%s: quiz sessions %s, orders %s, with their answers, tasks, plans and events.', v_email, v_sessions, v_orders);
end;
$$;

-- Only the server, with the secret key, may call these. delete_by_email is for the SQL Editor only.
revoke all on function public.start_session(text, text, text, text, text) from public, anon, authenticated;
revoke all on function public.note_step(uuid, text) from public, anon, authenticated;
revoke all on function public.save_answers(uuid, text, text, text, text[], text) from public, anon, authenticated;
revoke all on function public.use_intake_call(uuid) from public, anon, authenticated;
revoke all on function public.save_intake_result(uuid, text, text, text, text, text, jsonb) from public, anon, authenticated;
revoke all on function public.save_follow_up_answer(uuid, text) from public, anon, authenticated;
revoke all on function public.confirm_tasks(uuid, jsonb) from public, anon, authenticated;
revoke all on function public.note_session_checkout(uuid) from public, anon, authenticated;
revoke all on function public.record_order(text, uuid, text, integer, text, text) from public, anon, authenticated;
revoke all on function public.claim_plan_generation(uuid) from public, anon, authenticated;
revoke all on function public.save_plan(uuid, jsonb, text, text) from public, anon, authenticated;
revoke all on function public.fail_plan(uuid, text) from public, anon, authenticated;
revoke all on function public.log_event(uuid, text, text, jsonb) from public, anon, authenticated;
revoke all on function public.delete_by_email(text) from public, anon, authenticated;

grant execute on function public.start_session(text, text, text, text, text) to service_role;
grant execute on function public.note_step(uuid, text) to service_role;
grant execute on function public.save_answers(uuid, text, text, text, text[], text) to service_role;
grant execute on function public.use_intake_call(uuid) to service_role;
grant execute on function public.save_intake_result(uuid, text, text, text, text, text, jsonb) to service_role;
grant execute on function public.save_follow_up_answer(uuid, text) to service_role;
grant execute on function public.confirm_tasks(uuid, jsonb) to service_role;
grant execute on function public.note_session_checkout(uuid) to service_role;
grant execute on function public.record_order(text, uuid, text, integer, text, text) to service_role;
grant execute on function public.claim_plan_generation(uuid) to service_role;
grant execute on function public.save_plan(uuid, jsonb, text, text) to service_role;
grant execute on function public.fail_plan(uuid, text) to service_role;
grant execute on function public.log_event(uuid, text, text, jsonb) to service_role;
