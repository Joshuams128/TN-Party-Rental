import type { SupabaseClient } from '@supabase/supabase-js'
import { breakdownFromRows, type DiscountType } from '@/lib/invoice'
import { toInputValue } from '@/lib/rental'

export type BusinessSettings = {
  business_name: string
  address: string
  phone: string
  email: string // where replies and the owner's copy go
  send_from_email: string // address invoices are sent from (must be on a domain verified in Resend); '' = use email
  tax_number: string
  tax_label: string
  tax_rate: number
  invoice_footer: string
  owner_signature_image: string // PNG data URL, '' if none
}

export type Signature = {
  name: string
  type: 'draw' | 'type'
  image: string // PNG data URL
  signedAt: string // ISO timestamp
  hash: string
  ip: string
}

export type DocLine = {
  id: string
  name: string
  description: string
  image_path: string | null
  unit_price_cents: number
  quantity: number
  discount_name: string
  discount_type: DiscountType
  discount_value: number
}

export type InvoiceDoc = {
  id: string
  number: number
  status: 'draft' | 'sent'
  customer_name: string
  customer_email: string
  customer_address: string
  issue_date: string
  due_date: string | null
  rental_start: string | null // 'YYYY-MM-DDTHH:mm'
  rental_end: string | null
  notes: string
  apply_tax: boolean
  owner_signature: boolean
  sign_token: string | null
  signature: Signature | null
  tax_rate: number
  lines: DocLine[]
  totals: { subtotal: number; discount: number; tax: number; total: number }
  settings: BusinessSettings
}

// Same sender the website's contact form already uses, so it's known to be on the verified domain.
export const DEFAULT_SEND_FROM = 'noreply@truenorthpartyrentals.com'

export const DEFAULT_SETTINGS: BusinessSettings = {
  business_name: 'True North Party Rentals',
  address: '',
  phone: '',
  email: '',
  send_from_email: DEFAULT_SEND_FROM,
  tax_number: '',
  tax_label: 'HST',
  tax_rate: 13,
  invoice_footer: '',
  owner_signature_image: '',
}

// Rows saved before line discounts existed (or before the migration) simply have no discount.
export function withDiscountDefaults(r: Partial<DocLine>): DocLine {
  return {
    ...(r as DocLine),
    discount_name: r.discount_name ?? '',
    discount_type: r.discount_type ?? 'amount',
    discount_value: Number(r.discount_value) || 0,
  }
}

export async function loadSettings(supabase: SupabaseClient): Promise<BusinessSettings> {
  const { data } = await supabase.from('business_settings').select('*').eq('id', 1).maybeSingle()
  return data ? { ...DEFAULT_SETTINGS, ...data, tax_rate: Number(data.tax_rate) } : DEFAULT_SETTINGS
}

export async function loadInvoiceDoc(supabase: SupabaseClient, id: string): Promise<InvoiceDoc | null> {
  const [{ data: inv }, { data: rows }, settings] = await Promise.all([
    supabase.from('invoices').select('*').eq('id', id).maybeSingle(),
    supabase.from('invoice_lines').select('*').eq('invoice_id', id).order('position'),
    loadSettings(supabase),
  ])
  if (!inv) return null
  const lines = ((rows ?? []) as Partial<DocLine>[]).map(withDiscountDefaults)
  const taxRate = Number(inv.tax_rate)
  return {
    id: inv.id,
    number: inv.number,
    status: inv.status,
    customer_name: inv.customer_name,
    customer_email: inv.customer_email,
    customer_address: inv.customer_address,
    issue_date: inv.issue_date,
    due_date: inv.due_date,
    rental_start: toInputValue(inv.rental_start) || null,
    rental_end: toInputValue(inv.rental_end) || null,
    notes: inv.notes,
    apply_tax: inv.apply_tax,
    owner_signature: !!inv.include_owner_signature,
    sign_token: inv.sign_token ?? null,
    signature: inv.signed_at
      ? {
          name: inv.signer_name ?? '',
          type: inv.signature_type ?? 'draw',
          image: inv.signature_image ?? '',
          signedAt: inv.signed_at,
          hash: inv.signed_hash ?? '',
          ip: inv.signer_ip ?? '',
        }
      : null,
    tax_rate: taxRate,
    lines,
    totals: breakdownFromRows(lines, inv.discount_cents, inv.apply_tax, taxRate),
    settings: inv.include_owner_signature ? settings : { ...settings, owner_signature_image: '' },
  }
}
