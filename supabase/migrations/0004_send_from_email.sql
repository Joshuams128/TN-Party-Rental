-- Separate the address invoices are SENT FROM from the address replies/copies go TO.
-- Run in the Supabase SQL editor BEFORE deploying the matching code.
--
-- Resend can only send from a domain you've verified (e.g. noreply@truenorthpartyrentals.com; the mailbox does not
-- need to exist). Replies and the owner's copy go to business_settings.email (e.g. a Gmail address).

alter table business_settings
  add column if not exists send_from_email text not null default 'noreply@truenorthpartyrentals.com';

-- If a row already exists without one, use the default too.
update business_settings set send_from_email = 'noreply@truenorthpartyrentals.com' where send_from_email = '';

-- Same function as before, now also returning the sender so the 'signed copy' emails use it too.
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
        'unit_price_cents', l.unit_price_cents, 'quantity', l.quantity
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
