-- Choose how much the customer pays online before signing: the 50% deposit (default) or 100% up front.
-- Run in the Supabase SQL editor BEFORE deploying the matching code. Safe to run more than once.

alter table invoices
  add column if not exists collect_percent integer not null default 50;

alter table invoices drop constraint if exists invoices_collect_percent_check;
alter table invoices add constraint invoices_collect_percent_check check (collect_percent in (50, 100));

notify pgrst, 'reload schema';
