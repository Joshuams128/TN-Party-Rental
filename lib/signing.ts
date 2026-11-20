import { createHash, randomBytes } from 'crypto'
import type { SupabaseClient } from '@supabase/supabase-js'
import { breakdownFromRows } from '@/lib/invoice'
import { DEFAULT_SETTINGS, withDiscountDefaults, type DocLine, type DocPayment, type InvoiceDoc } from '@/lib/invoice-data'
import { toInputValue } from '@/lib/rental'

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
    // The phone number is only part of the fingerprint when there is one, so older invoices keep their hash.
    customer: [doc.customer_name, doc.customer_email, doc.customer_address, ...(doc.customer_phone ? [doc.customer_phone] : [])],
    dates: [doc.issue_date, doc.due_date],
    rental: [doc.rental_start, doc.rental_end],
    notes: doc.notes,
    tax: [doc.apply_tax, doc.tax_rate],
    lines: doc.lines.map((l) => [l.name, l.description, l.unit_price_cents, l.quantity, l.discount_name, l.discount_type, l.discount_value, l.discount_sign, l.rental_start, l.rental_end, ...(l.rental_start2 ? [l.rental_start2, l.rental_end2] : [])]),
    totals: doc.totals,
    // Only present when the invoice has terms, so hashes of older invoices stay the same.
    ...(doc.terms_text ? { terms: [doc.terms_key_points, doc.terms_text] } : {}),
    // The deposit the customer is told to pay is part of what they sign.
    ...(doc.collect_payment ? { deposit: doc.pay_amount_cents } : {}),
    // The cash note and security deposit are part of what the customer signs, but only when present.
    ...(doc.cash_payment ? { cash: true } : {}),
    ...(doc.security_deposit_cents > 0 ? { security: doc.security_deposit_cents } : {}),
    ...(doc.security_online ? { securityOnline: true } : {}),
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
  const lines = ((r.lines ?? []) as Partial<DocLine>[]).map(withDiscountDefaults)
  const taxRate = Number(r.tax_rate)
  const totals = breakdownFromRows(lines, r.discount_cents, r.apply_tax, taxRate)
  return {
    id: r.id,
    number: r.number,
    status: 'sent',
    customer_name: r.customer_name,
    customer_email: r.customer_email,
    customer_phone: r.customer_phone ?? '',
    customer_address: r.customer_address,
    issue_date: r.issue_date,
    due_date: r.due_date,
    rental_start: toInputValue(r.rental_start) || null,
    rental_end: toInputValue(r.rental_end) || null,
    notes: r.notes,
    terms_key_points: r.terms_key_points ?? '',
    terms_text: r.terms_text ?? '',
    collect_payment: !!r.collect_payment,
    cash_payment: !!r.cash_payment,
    security_deposit_cents: Number(r.security_deposit_cents) || 0,
    security_online: !!r.security_online && Number(r.security_deposit_cents) > 0,
    deleted_at: null,
    security_pay_url: r.security_pay_url ?? null,
    security_paid_at: r.security_paid_at ?? null,
    security_paid_cents: Number(r.security_paid_cents) || 0,
    // Asked to pay the whole invoice up front = 100%; otherwise the 50% deposit.
    collect_percent: Number(r.pay_amount_cents) > 0 && Number(r.pay_amount_cents) >= totals.total ? 100 : 50,
    pay_amount_cents: Number(r.pay_amount_cents) || 0,
    pay_url: r.pay_url ?? null,
    paid_at: r.paid_at ?? null,
    paid_cents: Number(r.paid_cents) || 0,
    payments: ((r.payments ?? []) as Partial<DocPayment>[]).map((x) => ({
      id: String(x.id),
      label: x.label ?? 'Payment',
      amount_cents: Number(x.amount_cents) || 0,
      url: x.url ?? null,
      sent_at: null,
      paid_at: x.paid_at ?? null,
      paid_cents: Number(x.paid_cents) || 0,
    })),
    apply_tax: r.apply_tax,
    owner_signature: !!r.include_owner_signature,
    sign_token: token,
    signature: r.signed_at
      ? { name: r.signer_name ?? '', type: r.signature_type ?? 'draw', image: r.signature_image ?? '', signedAt: r.signed_at, hash: r.signed_hash ?? '', ip: r.signer_ip ?? '' }
      : null,
    tax_rate: taxRate,
    lines,
    totals,
    settings: { ...DEFAULT_SETTINGS, ...(r.settings ?? {}), tax_rate: Number(r.settings?.tax_rate ?? taxRate) },
  }
}
