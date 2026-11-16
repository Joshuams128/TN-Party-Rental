-- Optional online deposit (50%) through Square, paid BEFORE the customer signs.
-- Run in the Supabase SQL editor BEFORE deploying the matching code. Safe to run more than once.

alter table invoices
  add column if not exists collect_payment boolean not null default false,
  add column if not exists pay_amount_cents integer not null default 0,
  add column if not exists pay_url text,
  add column if not exists pay_order_id text,
  add column if not exists square_payment_id text,
  add column if not exists paid_at timestamptz,
  add column if not exists paid_cents integer not null default 0;

create index if not exists invoices_pay_order_id_idx on invoices (pay_order_id) where pay_order_id is not null;

-- Same signing function as before, now also returning the deposit details (never the Square order id).
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
    'terms_key_points', inv.terms_key_points,
    'collect_payment', inv.collect_payment,
    'pay_amount_cents', inv.pay_amount_cents,
    'pay_url', case when inv.paid_at is null then inv.pay_url else null end,
    'paid_at', inv.paid_at,
    'paid_cents', inv.paid_cents,
    'terms_text', inv.terms_text,
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
        'id', l.id, 'item_id', l.item_id, 'name', l.name, 'description', l.description, 'image_path', l.image_path,
        'unit_price_cents', l.unit_price_cents, 'quantity', l.quantity,
        'discount_name', l.discount_name, 'discount_type', l.discount_type, 'discount_value', l.discount_value, 'discount_sign', l.discount_sign,
        'rental_start', l.rental_start, 'rental_end', l.rental_end,
        'rental_start2', l.rental_start2, 'rental_end2', l.rental_end2
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

  -- An invoice that collects a deposit online can only be signed once the deposit has been paid.
  update invoices
     set signed_at = now(), signer_name = p_name, signature_type = p_type, signature_image = p_image,
         signer_ip = p_ip, signer_user_agent = p_user_agent, signed_hash = p_hash
   where sign_token = p_token and status = 'sent' and signed_at is null
     and (collect_payment = false or paid_at is not null);
  if found then
    return 'ok';
  end if;

  if exists (select 1 from invoices where sign_token = p_token and signed_at is not null) then
    return 'already_signed';
  end if;
  if exists (select 1 from invoices where sign_token = p_token and status = 'sent' and collect_payment and paid_at is null) then
    return 'payment_required';
  end if;
  return 'not_found';
end;
$$;

revoke all on function public.get_invoice_for_signing(text) from public;
grant execute on function public.get_invoice_for_signing(text) to anon, authenticated;
revoke all on function public.sign_invoice(text, text, text, text, text, text, text) from public;
grant execute on function public.sign_invoice(text, text, text, text, text, text, text) to anon, authenticated;

notify pgrst, 'reload schema';
