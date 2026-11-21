import type { SupabaseClient } from '@supabase/supabase-js'
import { breakdownFromRows, type LineRow } from '@/lib/invoice'
import { fetchInvoiceRows } from '@/lib/invoice-lists'

// The income tracker: one row per job (an invoice that was sent and not deleted), filled in automatically from the
// invoices, the Square payments, the payments the owner recorded herself, and the expenses she added per job.

export type JobPayment = {
  id: string | null // null = recorded by Square (cannot be edited here)
  date: string // YYYY-MM-DD
  amountCents: number
  method: string
  source: 'Square' | 'Recorded'
  note: string
}
export type JobExpense = { id: string; description: string; amountCents: number; date: string | null }

export type IncomeJob = {
  id: string
  number: number
  customer: string
  eventDate: string // the earliest rental date, or the invoice date when none was set
  signed: boolean
  revenueCents: number // before HST (the part that is the business's income)
  taxCents: number // HST collected
  totalCents: number // what the customer is billed (booked)
  receivedCents: number
  owingCents: number
  expensesCents: number
  profitCents: number // revenue (before HST) minus expenses
  payments: JobPayment[]
  expenses: JobExpense[]
}

type InvoiceRow = {
  id: string
  number: number
  status: 'draft' | 'sent'
  issue_date: string
  customer_name: string
  discount_cents: number
  apply_tax: boolean
  tax_rate: number
  signed_at: string | null
  collect_payment: boolean | null
  paid_at: string | null
  paid_cents: number | null
  rental_start: string | null
  invoice_lines: (LineRow & { rental_start?: string | null; rental_start2?: string | null })[]
}

const SELECT =
  'id, number, status, issue_date, customer_name, discount_cents, apply_tax, tax_rate, signed_at, collect_payment, paid_at, paid_cents, rental_start, invoice_lines(unit_price_cents, quantity, discount_type, discount_value, rental_start, rental_start2)'

const day = (v?: string | null) => (v ? v.slice(0, 10) : '')

function eventDate(r: InvoiceRow): string {
  const starts = [r.rental_start, ...(r.invoice_lines ?? []).flatMap((l) => [l.rental_start, l.rental_start2])].filter((v): v is string => !!v).map(day).sort()
  return starts[0] || r.issue_date
}

export async function loadIncome(supabase: SupabaseClient): Promise<{ jobs: IncomeJob[]; setupNeeded: boolean }> {
  const [{ rows }, reqPay, manual, expenses] = await Promise.all([
    fetchInvoiceRows<InvoiceRow>(supabase, SELECT, 'active'),
    supabase.from('invoice_payments').select('invoice_id, label, paid_at, paid_cents').not('paid_at', 'is', null),
    supabase.from('job_payments').select('id, invoice_id, amount_cents, received_on, method, note').order('received_on'),
    supabase.from('job_expenses').select('id, invoice_id, description, amount_cents, spent_on').order('created_at'),
  ])
  // The two tables below come from a newer database update: until it is run, the page asks for it.
  const setupNeeded = !!manual.error || !!expenses.error

  const payBy = new Map<string, JobPayment[]>()
  const add = (invoiceId: string, p: JobPayment) => payBy.set(invoiceId, [...(payBy.get(invoiceId) ?? []), p])
  for (const r of rows) if (r.collect_payment && r.paid_at) add(r.id, { id: null, date: day(r.paid_at), amountCents: Number(r.paid_cents) || 0, method: 'Card (Square)', source: 'Square', note: 'Online payment before signing' })
  for (const p of (reqPay.data ?? []) as { invoice_id: string; label: string; paid_at: string; paid_cents: number }[])
    add(p.invoice_id, { id: null, date: day(p.paid_at), amountCents: Number(p.paid_cents) || 0, method: 'Card (Square)', source: 'Square', note: p.label })
  for (const p of (manual.data ?? []) as { id: string; invoice_id: string; amount_cents: number; received_on: string; method: string; note: string }[])
    add(p.invoice_id, { id: p.id, date: p.received_on, amountCents: p.amount_cents, method: p.method, source: 'Recorded', note: p.note })

  const expBy = new Map<string, JobExpense[]>()
  for (const e of (expenses.data ?? []) as { id: string; invoice_id: string; description: string; amount_cents: number; spent_on: string | null }[])
    expBy.set(e.invoice_id, [...(expBy.get(e.invoice_id) ?? []), { id: e.id, description: e.description, amountCents: e.amount_cents, date: e.spent_on }])

  const jobs: IncomeJob[] = rows
    .filter((r) => r.status !== 'draft')
    .map((r) => {
      const t = breakdownFromRows(r.invoice_lines ?? [], r.discount_cents, r.apply_tax, Number(r.tax_rate))
      const payments = (payBy.get(r.id) ?? []).sort((a, b) => a.date.localeCompare(b.date))
      const exps = expBy.get(r.id) ?? []
      const received = payments.reduce((s, p) => s + p.amountCents, 0)
      const expensesCents = exps.reduce((s, e) => s + e.amountCents, 0)
      const revenue = t.subtotal - t.discount
      return {
        id: r.id,
        number: r.number,
        customer: r.customer_name,
        eventDate: eventDate(r),
        signed: !!r.signed_at,
        revenueCents: revenue,
        taxCents: t.tax,
        totalCents: t.total,
        receivedCents: received,
        owingCents: Math.max(0, t.total - received),
        expensesCents,
        profitCents: revenue - expensesCents,
        payments,
        expenses: exps,
      }
    })
    .sort((a, b) => a.eventDate.localeCompare(b.eventDate) || a.number - b.number)
  return { jobs, setupNeeded }
}

export type IncomeFilter = { year: string; month: string; showUnpaid: boolean }

// The jobs that count: ones that have received a payment (or all of them when "show unpaid" is on), in the chosen period.
export function filterJobs(jobs: IncomeJob[], f: IncomeFilter): IncomeJob[] {
  return jobs.filter((j) => {
    if (!f.showUnpaid && j.receivedCents <= 0) return false
    if (f.year !== 'all' && !j.eventDate.startsWith(f.year)) return false
    if (f.month !== 'all' && j.eventDate.slice(5, 7) !== f.month.padStart(2, '0')) return false
    return true
  })
}

export function totalsOf(jobs: IncomeJob[]) {
  const sum = (pick: (j: IncomeJob) => number) => jobs.reduce((s, j) => s + pick(j), 0)
  return {
    jobs: jobs.length,
    revenue: sum((j) => j.revenueCents),
    tax: sum((j) => j.taxCents),
    total: sum((j) => j.totalCents),
    received: sum((j) => j.receivedCents),
    owing: sum((j) => j.owingCents),
    expenses: sum((j) => j.expensesCents),
    profit: sum((j) => j.profitCents),
  }
}

export function parseFilter(sp: { year?: string; month?: string; unpaid?: string }, thisYear: string): IncomeFilter {
  return {
    year: sp.year === 'all' ? 'all' : /^\d{4}$/.test(sp.year ?? '') ? (sp.year as string) : thisYear,
    month: /^(0?[1-9]|1[0-2])$/.test(sp.month ?? '') ? (sp.month as string) : 'all',
    showUnpaid: sp.unpaid === '1',
  }
}
