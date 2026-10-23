-- Invoicing app schema. Single-owner app: every table is locked to authenticated users.
-- Run in the Supabase SQL editor (or `supabase db push`).

create table if not exists business_settings (
  id int primary key default 1 check (id = 1),
  business_name text not null default 'True North Party Rentals',
  address text not null default '',
  phone text not null default '',
  email text not null default '',
  tax_number text not null default '',
  tax_label text not null default 'HST',
  tax_rate numeric(5,2) not null default 13.00,
  invoice_footer text not null default '',
  next_invoice_number int not null default 1001
);
insert into business_settings (id) values (1) on conflict do nothing;

create table if not exists items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  category text not null default '',
  price_cents int not null default 0 check (price_cents >= 0),
  image_path text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists items_name_idx on items (lower(name));

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null default '',
  address text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists invoices (
  id uuid primary key default gen_random_uuid(),
  number int not null unique,
  status text not null default 'draft' check (status in ('draft', 'sent')),
  customer_id uuid references customers(id) on delete set null,
  customer_name text not null default '',
  customer_email text not null default '',
  customer_address text not null default '',
  issue_date date not null default current_date,
  due_date date,
  notes text not null default '',
  discount_cents int not null default 0 check (discount_cents >= 0),
  apply_tax boolean not null default true,
  tax_rate numeric(5,2) not null default 13.00,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Lines snapshot the item's name/price/image so later edits never change old invoices.
create table if not exists invoice_lines (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references invoices(id) on delete cascade,
  item_id uuid references items(id) on delete set null,
  position int not null default 0,
  name text not null,
  description text not null default '',
  image_path text,
  unit_price_cents int not null default 0 check (unit_price_cents >= 0),
  quantity int not null default 1 check (quantity > 0)
);
create index if not exists invoice_lines_invoice_idx on invoice_lines (invoice_id);

alter table business_settings enable row level security;
alter table items enable row level security;
alter table customers enable row level security;
alter table invoices enable row level security;
alter table invoice_lines enable row level security;

create policy "owner full access" on business_settings for all to authenticated using (true) with check (true);
create policy "owner full access" on items for all to authenticated using (true) with check (true);
create policy "owner full access" on customers for all to authenticated using (true) with check (true);
create policy "owner full access" on invoices for all to authenticated using (true) with check (true);
create policy "owner full access" on invoice_lines for all to authenticated using (true) with check (true);

-- Public bucket for item photos (read by anyone with the URL so emails/PDFs can embed them; writes owner-only).
insert into storage.buckets (id, name, public) values ('item-images', 'item-images', true) on conflict do nothing;
create policy "owner uploads item images" on storage.objects for insert to authenticated with check (bucket_id = 'item-images');
create policy "owner updates item images" on storage.objects for update to authenticated using (bucket_id = 'item-images');
create policy "owner deletes item images" on storage.objects for delete to authenticated using (bucket_id = 'item-images');
