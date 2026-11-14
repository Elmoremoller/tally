-- Tally, step 2: finds the login for an email, so the email with her plan's link can be sent to a
-- customer who already has a login (a second purchase, "send it again", or the Open your plan page). It only
-- reads. Only the server, with the secret key, may call it. Safe to run again.
create or replace function public.login_id_for_email(p_email text)
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select id from auth.users where email = lower(trim(p_email)) limit 1;
$$;
revoke all on function public.login_id_for_email(text) from public, anon, authenticated;
grant execute on function public.login_id_for_email(text) to service_role;
