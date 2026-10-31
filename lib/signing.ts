import { createHash, randomBytes } from 'crypto'
import type { SupabaseClient } from '@supabase/supabase-js'
import { breakdownFromRows } from '@/lib/invoice'
import { DEFAULT_SETTINGS, type DocLine, type InvoiceDoc } from '@/lib/invoice-data'

// 43 URL-safe characters = 256 bits. The link is the credential, so it must be unguessable.
export const newSignToken = () => randomBytes(32).toString('base64url')
export const TOKEN_RE = /^[A-Za-z0-9_-]{32,64}$/

// The signing link must point at the site the owner is using right now (live site, or a preview while testing),
// so build it from the incoming request's host rather than from a fixed setting.
export function requestOrigin(headers: Headers, fallback: string): string {
  const host = (headers.get('x-forwarded-host') ?? headers.get('host') ?? '').split(',')[0].trim()
  if (!host) return fallback
  const local = /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host)
  const proto = (headers.get('x-forwarded-proto') ?? (local ? 'http' : 'https')).split(',')[0].trim()
  return `${proto}://${host}`
}

export const signUrl = (origin: string, token: string) => `${origin.replace(/\/$/, '')}/sign/${token}`

// Fingerprint of everything the customer is agreeing to. Stored when they sign, and re-checked so they
// can never sign a version of the invoice different from the one they were shown.
export function documentHash(doc: InvoiceDoc): string {
  const canonical = JSON.stringify({
    number: doc.number,
    customer: [doc.customer_name, doc.customer_email, doc.customer_address],
    dates: [doc.issue_date, doc.due_date],
    notes: doc.notes,
    tax: [doc.apply_tax, doc.tax_rate],
    lines: doc.lines.map((l) => [l.name, l.description, l.unit_price_cents, l.quantity]),
    totals: doc.totals,
  })
  return createHash('sha256').update(canonical).digest('hex')
}

type Raw = Record<string, any>

// Public read of one invoice by its signing token, through the locked-down database function.
export async function loadInvoiceDocByToken(supabase: SupabaseClient, token: string): Promise<InvoiceDoc | null> {
  if (!TOKEN_RE.test(token)) return null
  const { data } = await supabase.rpc('get_invoice_for_signing', { p_token: token })
  if (!data) return null
  const r = data as Raw
  const lines = (r.lines ?? []) as DocLine[]
  const taxRate = Number(r.tax_rate)
  return {
    id: r.id,
    number: r.number,
    status: 'sent',
    customer_name: r.customer_name,
    customer_email: r.customer_email,
    customer_address: r.customer_address,
    issue_date: r.issue_date,
    due_date: r.due_date,
    notes: r.notes,
    apply_tax: r.apply_tax,
    owner_signature: !!r.include_owner_signature,
    sign_token: token,
    signature: r.signed_at
      ? { name: r.signer_name ?? '', type: r.signature_type ?? 'draw', image: r.signature_image ?? '', signedAt: r.signed_at, hash: r.signed_hash ?? '', ip: r.signer_ip ?? '' }
      : null,
    tax_rate: taxRate,
    lines,
    totals: breakdownFromRows(lines, r.discount_cents, r.apply_tax, taxRate),
    settings: { ...DEFAULT_SETTINGS, ...(r.settings ?? {}), tax_rate: Number(r.settings?.tax_rate ?? taxRate) },
  }
}
