-- Optional owner signature line on an invoice's PDF. Run in the Supabase SQL editor.
alter table invoices add column if not exists include_owner_signature boolean not null default false;
