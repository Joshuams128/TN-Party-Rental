import type { SupabaseClient } from '@supabase/supabase-js'
import { breakdownFromRows } from '@/lib/invoice'

export type BusinessSettings = {
  business_name: string
  address: string
  phone: string
  email: string
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

export const DEFAULT_SETTINGS: BusinessSettings = {
  business_name: 'True North Party Rentals',
  address: '',
  phone: '',
  email: '',
  tax_number: '',
  tax_label: 'HST',
  tax_rate: 13,
  invoice_footer: '',
  owner_signature_image: '',
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
  const lines = (rows ?? []) as DocLine[]
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
