import type { InvoiceDoc } from '@/lib/invoice-data'
import { formatMoney } from '@/lib/money'
import { securityDepositNote } from '@/lib/security-deposit'

// The deposit is half of the invoice total (tax included), as the payment terms say.
export const DEPOSIT_PERCENT = 50
export const depositCents = (totalCents: number): number => Math.round((totalCents * DEPOSIT_PERCENT) / 100)
// What the customer pays online before signing: half (the deposit) or everything.
export const upfrontCents = (totalCents: number, percent: 50 | 100): number => (percent === 100 ? totalCents : depositCents(totalCents))

export const balanceCents = (totalCents: number): number => totalCents - depositCents(totalCents)

// "Balance due 7 days before the event": the earliest rental start on the invoice, minus 7 days. null if no date is set.
export function balanceDueDate(doc: Pick<InvoiceDoc, 'rental_start' | 'lines'>): string | null {
  const starts = [doc.rental_start, ...doc.lines.flatMap((l) => [l.rental_start, l.rental_start2])].filter((v): v is string => !!v)
  if (starts.length === 0) return null
  const first = starts.map((s) => s.slice(0, 10)).sort()[0]
  const [y, m, d] = first.split('-').map(Number)
  const due = new Date(Date.UTC(y, m - 1, d - 7))
  return due.toISOString().slice(0, 10)
}

export function formatLongDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })
}

// One sentence describing what is due now and later, used on the page, PDF and emails.
export function depositSummary(doc: Pick<InvoiceDoc, 'rental_start' | 'lines' | 'totals' | 'pay_amount_cents' | 'collect_percent'>): { now: string; later: string } {
  const now = doc.pay_amount_cents > 0 ? doc.pay_amount_cents : upfrontCents(doc.totals.total, doc.collect_percent)
  const rest = doc.totals.total - now
  const due = balanceDueDate(doc)
  if (doc.collect_percent === 100) return { now: `${formatMoney(now)} payment in full`, later: '' }
  return {
    now: `${formatMoney(now)} deposit (${DEPOSIT_PERCENT}%)`,
    later: `${formatMoney(rest)} balance, due ${due ? formatLongDate(due) + ' (7 days before your event)' : '7 days before your event'}`,
  }
}

// Everything paid online so far: the deposit (if the invoice collected one) plus any requested payments.
export function paidSoFarCents(doc: Pick<InvoiceDoc, 'collect_payment' | 'paid_at' | 'paid_cents' | 'pay_amount_cents' | 'payments'>): number {
  const dep = doc.collect_payment && doc.paid_at ? doc.paid_cents || doc.pay_amount_cents : 0
  return dep + doc.payments.reduce((s, p) => s + (p.paid_at ? p.paid_cents || p.amount_cents : 0), 0)
}

export const remainingCents = (doc: Pick<InvoiceDoc, 'totals' | 'collect_payment' | 'paid_at' | 'paid_cents' | 'pay_amount_cents' | 'payments'>): number =>
  Math.max(0, doc.totals.total - paidSoFarCents(doc))

// The payment lines shown under an invoice's total (page, PDF): what was paid, what is due, what is left.
export function paymentLines(
  doc: Pick<InvoiceDoc, 'collect_payment' | 'collect_percent' | 'paid_at' | 'paid_cents' | 'pay_amount_cents' | 'payments' | 'totals' | 'rental_start' | 'lines'>
): { label: string; cents: number; strong?: boolean }[] {
  const out: { label: string; cents: number; strong?: boolean }[] = []
  const dep = doc.pay_amount_cents || upfrontCents(doc.totals.total, doc.collect_percent)
  // Paying everything up front: one line says it all.
  if (doc.collect_payment && doc.collect_percent === 100) {
    return [{ label: doc.paid_at ? 'Paid in full (100%)' : 'Payment due now (100%)', cents: dep, strong: true }]
  }
  if (doc.collect_payment) out.push({ label: `${doc.paid_at ? 'Deposit paid' : 'Deposit due now'} (50%)`, cents: dep, strong: true })
  for (const p of doc.payments) if (p.paid_at) out.push({ label: `${p.label} paid`, cents: p.paid_cents || p.amount_cents, strong: true })
  if (out.length === 0) return out
  const due = balanceDueDate(doc)
  const left = doc.collect_payment && !doc.paid_at ? doc.totals.total - dep : remainingCents(doc)
  if (left > 0) out.push({ label: `Balance, due ${due ? formatLongDate(due) : '7 days before your event'}`, cents: left })
  else out.push({ label: 'Paid in full', cents: 0 })
  return out
}

// Notes shown with the invoice's payment details: a cash payment, and the refundable security deposit.
export function extraPaymentNotes(doc: Pick<InvoiceDoc, 'cash_payment' | 'security_deposit_cents' | 'security_online' | 'security_paid_at'>): { label: string; amount?: number; note: string }[] {
  const out: { label: string; amount?: number; note: string }[] = []
  if (doc.cash_payment) out.push({ label: 'Payment method: Cash', note: 'The customer will pay with cash.' })
  if (doc.security_deposit_cents > 0) {
    out.push({
      label: doc.security_online && doc.security_paid_at ? 'Refundable security deposit (paid)' : 'Refundable security deposit',
      amount: doc.security_deposit_cents,
      note: securityDepositNote({ online: doc.security_online, paid: !!doc.security_paid_at }),
    })
  }
  return out
}
