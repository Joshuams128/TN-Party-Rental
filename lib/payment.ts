import type { InvoiceDoc } from '@/lib/invoice-data'
import { formatMoney } from '@/lib/money'

// The deposit is half of the invoice total (tax included), as the payment terms say.
export const DEPOSIT_PERCENT = 50
export const depositCents = (totalCents: number): number => Math.round((totalCents * DEPOSIT_PERCENT) / 100)
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
export function depositSummary(doc: Pick<InvoiceDoc, 'rental_start' | 'lines' | 'totals' | 'pay_amount_cents'>): { now: string; later: string } {
  const now = doc.pay_amount_cents > 0 ? doc.pay_amount_cents : depositCents(doc.totals.total)
  const rest = doc.totals.total - now
  const due = balanceDueDate(doc)
  return {
    now: `${formatMoney(now)} deposit (${DEPOSIT_PERCENT}%)`,
    later: `${formatMoney(rest)} balance, due ${due ? formatLongDate(due) + ' (7 days before your event)' : '7 days before your event'}`,
  }
}
