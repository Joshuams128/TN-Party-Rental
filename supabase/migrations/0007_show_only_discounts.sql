-- "Show only" discounts: printed on the invoice (e.g. 'Free additional hour -$125.00') without changing the price.
-- Run in the Supabase SQL editor BEFORE using that option. Safe to run more than once.
--
-- They are stored in invoice_lines.discount_type as 'info_amount' / 'info_percent', so totals calculated by anything
-- that does not know about them simply see no price change.

do $$
declare c record;
begin
  for c in
    select conname from pg_constraint
    where conrelid = 'public.invoice_lines'::regclass and contype = 'c' and pg_get_constraintdef(oid) ilike '%discount_type%'
  loop
    execute format('alter table public.invoice_lines drop constraint %I', c.conname);
  end loop;
end $$;

alter table invoice_lines
  add constraint invoice_lines_discount_type_check check (discount_type in ('amount', 'percent', 'info_amount', 'info_percent'));

-- How a show-only amount is printed: '-$125.00' (minus) or '+$125.00' (plus).
alter table invoice_lines
  add column if not exists discount_sign text not null default 'minus' check (discount_sign in ('minus', 'plus'));

-- Same signing function as before, now also returning each line's discount sign.
create or replace function public.get_invoice_for_signing(p_token text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  inv invoices%rowtype;
begin
  if p_token is null or length(p_token) < 32 then
    return null;
  end if;

  select * into inv from invoices where sign_token = p_token and status = 'sent';
  if not found then
    return null;
  end if;

  return jsonb_build_object(
    'id', inv.id,
    'number', inv.number,
    'customer_name', inv.customer_name,
    'customer_email', inv.customer_email,
    'customer_address', inv.customer_address,
    'issue_date', inv.issue_date,
    'due_date', inv.due_date,
    'rental_start', inv.rental_start,
    'rental_end', inv.rental_end,
    'notes', inv.notes,
    'discount_cents', inv.discount_cents,
    'apply_tax', inv.apply_tax,
    'tax_rate', inv.tax_rate,
    'include_owner_signature', inv.include_owner_signature,
    'signed_at', inv.signed_at,
    'signer_name', inv.signer_name,
    'signature_type', inv.signature_type,
    'signature_image', inv.signature_image,
    'signed_hash', inv.signed_hash,
    'signer_ip', inv.signer_ip,
    'lines', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', l.id, 'name', l.name, 'description', l.description, 'image_path', l.image_path,
        'unit_price_cents', l.unit_price_cents, 'quantity', l.quantity,
        'discount_name', l.discount_name, 'discount_type', l.discount_type, 'discount_value', l.discount_value, 'discount_sign', l.discount_sign,
        'rental_start', l.rental_start, 'rental_end', l.rental_end
      ) order by l.position), '[]'::jsonb)
      from invoice_lines l where l.invoice_id = inv.id
    ),
    'settings', (
      select jsonb_build_object(
        'business_name', s.business_name, 'address', s.address, 'phone', s.phone, 'email', s.email,
        'tax_number', s.tax_number, 'tax_label', s.tax_label, 'tax_rate', s.tax_rate,
        'invoice_footer', s.invoice_footer, 'send_from_email', s.send_from_email,
        'owner_signature_image', case when inv.include_owner_signature then s.owner_signature_image else '' end
      )
      from business_settings s where s.id = 1
    )
  );
end;
$$;

create or replace function public.sign_invoice(
  p_token text, p_name text, p_type text, p_image text, p_ip text, p_user_agent text, p_hash text
)
returns text
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_token is null or length(p_token) < 32 then
    return 'not_found';
  end if;

  update invoices
     set signed_at = now(), signer_name = p_name, signature_type = p_type, signature_image = p_image,
         signer_ip = p_ip, signer_user_agent = p_user_agent, signed_hash = p_hash
   where sign_token = p_token and status = 'sent' and signed_at is null;
  if found then
    return 'ok';
  end if;

  if exists (select 1 from invoices where sign_token = p_token and signed_at is not null) then
    return 'already_signed';
  end if;
  return 'not_found';
end;
$$;

revoke all on function public.get_invoice_for_signing(text) from public;
grant execute on function public.get_invoice_for_signing(text) to anon, authenticated;
