-- Tally, the beginner version (lib/beginner): for women who want to start using AI and don't know where to
-- begin. It runs beside the first version as a test, behind the ad angles new_to_ai, own_job and first_try.
-- Its quiz saves her answers with the same functions as the first one (no extra work answer, and no company
-- view when she works for herself), and keeps what is its own in one column: who she works for, how much
-- she has used AI, her first win and her idea titles. Only the server writes it, with the secret key.

alter table public.intake add column if not exists beginner jsonb
  check (beginner is null or (jsonb_typeof(beginner) = 'object' and pg_column_size(beginner) <= 8000));

comment on column public.intake.beginner is
  'Beginner version only: { v, worksFor, experience, firstWin { task, intro, draft }, ideas [], privateTasks [] }.';
