-- Income tracker: payments received outside Square (e-Transfer, cash...) and the expenses of each job.
-- Run in the Supabase SQL editor BEFORE deploying the matching code. Safe to run more than once.

create table if not exists job_payments (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references invoices(id) on delete cascade,
  amount_cents integer not null check (amount_cents > 0),
  received_on date not null default current_date,
  method text not null default 'e-Transfer',
  note text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists job_expenses (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references invoices(id) on delete cascade,
  description text not null,
  amount_cents integer not null check (amount_cents > 0),
  spent_on date,
  created_at timestamptz not null default now()
);

create index if not exists job_payments_invoice_idx on job_payments (invoice_id);
create index if not exists job_expenses_invoice_idx on job_expenses (invoice_id);

alter table job_payments enable row level security;
alter table job_expenses enable row level security;
drop policy if exists "owner full access" on job_payments;
drop policy if exists "owner full access" on job_expenses;
create policy "owner full access" on job_payments for all to authenticated using (true) with check (true);
create policy "owner full access" on job_expenses for all to authenticated using (true) with check (true);

notify pgrst, 'reload schema';
