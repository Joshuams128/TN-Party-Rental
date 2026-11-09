-- A SECOND rental period on each invoice line (e.g. 10:00-3:00 and again 4:00-7:00 for the same item).
-- Run in the Supabase SQL editor BEFORE deploying the matching code. Safe to run more than once.

alter table invoice_lines
  add column if not exists rental_start2 timestamp,
  add column if not exists rental_end2 timestamp;

-- Same signing function as before, now also returning each line's second rental period.
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

revoke all on function public.get_invoice_for_signing(text) from public;
grant execute on function public.get_invoice_for_signing(text) to anon, authenticated;

notify pgrst, 'reload schema';
