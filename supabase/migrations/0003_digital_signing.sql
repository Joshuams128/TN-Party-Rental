-- Digital (online) signing. Run in the Supabase SQL editor BEFORE deploying the matching code.
--
-- Customers sign through a private link (/sign/<token>) without logging in. The tables stay locked to the
-- owner; the two functions below are the ONLY things the public can call, and each needs the unguessable token.

alter table invoices
  add column if not exists sign_token text unique,
  add column if not exists signed_at timestamptz,
  add column if not exists signer_name text,
  add column if not exists signature_type text check (signature_type in ('draw', 'type')),
  add column if not exists signature_image text,      -- PNG data URL
  add column if not exists signer_ip text,
  add column if not exists signer_user_agent text,
  add column if not exists signed_hash text;          -- SHA-256 of the invoice content at the moment of signing

-- The owner's own saved signature, applied to invoices that have "include my signature" ticked.
alter table business_settings
  add column if not exists owner_signature_image text not null default '';

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
        'invoice_footer', s.invoice_footer,
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
revoke all on function public.sign_invoice(text, text, text, text, text, text, text) from public;
grant execute on function public.get_invoice_for_signing(text) to anon, authenticated;
grant execute on function public.sign_invoice(text, text, text, text, text, text, text) to anon, authenticated;
