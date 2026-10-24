-- Step 9: the 10 minute repair. What a couple agree on at the end of it is saved with their other
-- agreements, for their Couple Standard, even straight after paying, before they've opened their email
-- link. Run it after the other files. It only widens one rule and adds one function, so nothing saved
-- changes, and it is safe to run again.

-- Agreements can now also come from the 10 minute repair.
alter table public.agreements drop constraint if exists agreements_step_id_check;
alter table public.agreements add constraint agreements_step_id_check
  check (step_id in ('check_in', 'running_on_empty', 'agree_pause', 'coming_back', 'first_move', 'ten_minute'));

-- The same as save_agreement, for the page people land on right after paying, where nobody is signed in
-- yet. The site checks the payment with Stripe first and passes the address that paid, so only the server
-- can call this.
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
    author_email = excluded.author_email,
    updated_at = now();
end;
$$;
revoke all on function public.save_agreement_after_paying from public, anon, authenticated;
grant execute on function public.save_agreement_after_paying to service_role;
