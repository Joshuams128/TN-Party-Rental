import type { SupabaseClient } from '@supabase/supabase-js'
import { breakdownFromRows, type DiscountSign, type DiscountTypeRaw } from '@/lib/invoice'
import { linePeriodTexts, toInputValue } from '@/lib/rental'

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
  terms_key_points: string // short points shown on the invoice itself, one per line
  terms_text: string // the full payment terms; '' = no terms with invoices
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
  item_id?: string | null // null = a custom line she typed herself
  name: string
  description: string
  image_path: string | null
  unit_price_cents: number
  quantity: number
  discount_name: string
  discount_type: DiscountTypeRaw // 'info_*' = show-only (does not change the price)
  discount_sign: DiscountSign
  discount_value: number
  rental_start: string | null // this item's own rental period, 'YYYY-MM-DDTHH:mm'
  rental_end: string | null
  rental_start2: string | null // optional second period for the same item
  rental_end2: string | null
}

export type DocPayment = {
  id: string
  label: string
  amount_cents: number
  url: string | null // where to pay: only on the customer's signing page, only while unpaid
  sent_at: string | null
  paid_at: string | null
  paid_cents: number
}

export type InvoiceDoc = {
  id: string
  number: number
  status: 'draft' | 'sent'
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_address: string // the event location
  issue_date: string
  due_date: string | null
  rental_start: string | null // 'YYYY-MM-DDTHH:mm'
  rental_end: string | null
  notes: string
  // This invoice's own copy of the payment terms (taken from Settings when it is sent), '' = none.
  terms_key_points: string
  terms_text: string
  // Optional online deposit (Square), paid before the customer signs.
  collect_payment: boolean
  collect_percent: 50 | 100 // 100 = the whole invoice is paid up front
  pay_amount_cents: number // the deposit amount, fixed when the invoice is sent
  pay_url: string | null // where the customer pays (only while unpaid, and only on the signing page)
  paid_at: string | null
  paid_cents: number
  // Payment requests the owner emailed (50%, 100% or the balance), as many as needed.
  payments: DocPayment[]
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
  terms_key_points: '',
  terms_text: '',
}

// Rows saved before line discounts existed (or before the migration) simply have no discount.
export function withDiscountDefaults(r: Partial<DocLine>): DocLine {
  return {
    ...(r as DocLine),
    discount_name: r.discount_name ?? '',
    discount_type: r.discount_type ?? 'amount',
    discount_sign: r.discount_sign === 'plus' ? 'plus' : 'minus',
    discount_value: Number(r.discount_value) || 0,
    rental_start: toInputValue(r.rental_start) || null,
    rental_end: toInputValue(r.rental_end) || null,
    rental_start2: toInputValue(r.rental_start2) || null,
    rental_end2: toInputValue(r.rental_end2) || null,
  }
}

export async function loadSettings(supabase: SupabaseClient): Promise<BusinessSettings> {
  const { data } = await supabase.from('business_settings').select('*').eq('id', 1).maybeSingle()
  return data ? { ...DEFAULT_SETTINGS, ...data, tax_rate: Number(data.tax_rate) } : DEFAULT_SETTINGS
}

export async function loadInvoiceDoc(supabase: SupabaseClient, id: string): Promise<InvoiceDoc | null> {
  // Everything this needs is known up front, so all of it is fetched at once (one round trip, not two).
  const [{ data: inv }, { data: rows }, settings, { data: payRows }] = await Promise.all([
    supabase.from('invoices').select('*').eq('id', id).maybeSingle(),
    supabase.from('invoice_lines').select('*').eq('invoice_id', id).order('position'),
    loadSettings(supabase),
    // Best effort: the payments table comes from a newer database update.
    supabase.from('invoice_payments').select('id, label, amount_cents, sent_at, cancelled_at, paid_at, paid_cents').eq('invoice_id', id).order('created_at'),
  ])
  if (!inv) return null
  const lines = ((rows ?? []) as Partial<DocLine>[]).map(withDiscountDefaults)
  const taxRate = Number(inv.tax_rate)
  const payments: DocPayment[] = ((payRows ?? []) as (DocPayment & { cancelled_at: string | null })[])
    .filter((r) => r.paid_at || !r.cancelled_at)
    .map((r) => ({ id: r.id, label: r.label, amount_cents: r.amount_cents, url: null, sent_at: r.sent_at ?? null, paid_at: r.paid_at ?? null, paid_cents: Number(r.paid_cents) || 0 }))
  return {
    id: inv.id,
    number: inv.number,
    status: inv.status,
    customer_name: inv.customer_name,
    customer_email: inv.customer_email,
    customer_phone: inv.customer_phone ?? '',
    customer_address: inv.customer_address,
    issue_date: inv.issue_date,
    due_date: inv.due_date,
    rental_start: toInputValue(inv.rental_start) || null,
    rental_end: toInputValue(inv.rental_end) || null,
    notes: inv.notes,
    // A draft shows the current wording; once sent, the invoice keeps the copy it was sent with.
    terms_key_points: (inv.status === 'draft' ? settings.terms_key_points : inv.terms_key_points) ?? '',
    terms_text: (inv.status === 'draft' ? settings.terms_text : inv.terms_text) ?? '',
    collect_payment: !!inv.collect_payment,
    collect_percent: Number(inv.collect_percent) === 100 ? 100 : 50,
    pay_amount_cents: Number(inv.pay_amount_cents) || 0,
    pay_url: null,
    paid_at: inv.paid_at ?? null,
    paid_cents: Number(inv.paid_cents) || 0,
    payments,
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

// One "Item: period" line per rented item, for the plain-text emails.
export function rentalSummary(doc: Pick<InvoiceDoc, 'lines' | 'rental_start' | 'rental_end'>): string[] {
  return doc.lines.flatMap((l) => linePeriodTexts(l, doc).map((p) => `${l.name}: ${p}`))
}

// How much has been paid online on each invoice through payment requests (not the deposit). Best effort, like above.
export async function loadRequestedPaidTotals(supabase: SupabaseClient): Promise<Map<string, number>> {
  const { data } = await supabase.from('invoice_payments').select('invoice_id, paid_cents').not('paid_at', 'is', null)
  const out = new Map<string, number>()
  for (const r of (data ?? []) as { invoice_id: string; paid_cents: number }[]) out.set(r.invoice_id, (out.get(r.invoice_id) ?? 0) + (Number(r.paid_cents) || 0))
  return out
}
