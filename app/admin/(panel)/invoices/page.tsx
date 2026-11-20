import Link from 'next/link'
import { Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { invoiceStatusLabel, totalFromRows, type LineRow } from '@/lib/invoice'
import { loadRequestedPaidTotals } from '@/lib/invoice-data'
import { fetchInvoiceRows } from '@/lib/invoice-lists'
import InvoiceListItem from '@/components/admin/InvoiceListItem'

export const dynamic = 'force-dynamic'

type Row = {
  id: string
  number: number
  status: 'draft' | 'sent'
  signed_at: string | null
  collect_payment: boolean
  paid_at: string | null
  paid_cents: number
  customer_name: string
  issue_date: string
  discount_cents: number
  apply_tax: boolean
  tax_rate: number
  invoice_lines: LineRow[]
}

export default async function InvoicesPage() {
  const supabase = createClient()
  const requestedPaidPromise = loadRequestedPaidTotals(supabase)
  const { rows, error } = await fetchInvoiceRows<Row>(supabase, 'id, number, status, signed_at, collect_payment, paid_at, paid_cents, customer_name, issue_date, discount_cents, apply_tax, tax_rate, invoice_lines(unit_price_cents, quantity, discount_type, discount_value)', 'active')
  const invoices = rows
  const requestedPaid = await requestedPaidPromise
  // Records: deleted invoices are kept (not erased), and everything can be exported for taxes.
  const { rows: deletedRows } = await fetchInvoiceRows<{ id: string }>(supabase, 'id', 'deleted')
  const years = Array.from(new Set(invoices.map((i) => i.issue_date.slice(0, 4)))).sort().reverse()

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Invoices</h1>
        <Link href="/admin/invoices/new" className="inline-flex items-center gap-2 rounded-lg bg-gold px-4 py-2 font-semibold text-black hover:bg-gold-dark">
          <Plus size={18} /> New invoice
        </Link>
      </div>

      {error && <p className="rounded-lg bg-red-950 p-3 text-sm text-red-300">Couldn&apos;t load invoices: {error}</p>}

      {invoices.length === 0 && !error ? (
        <p className="py-10 text-center text-gray-400">No invoices yet. Create your first one.</p>
      ) : (
        <ul className="divide-y divide-gray-800 overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
          {invoices.map((inv) => (
            <li key={inv.id} className="flex items-center hover:bg-gray-800">
              <InvoiceListItem
                id={inv.id}
                number={inv.number}
                status={inv.signed_at ? 'signed' : inv.status}
                label={invoiceStatusLabel({ ...inv, paidCents: (inv.collect_payment && inv.paid_at ? Number(inv.paid_cents) || 0 : 0) + (requestedPaid.get(inv.id) ?? 0), totalCents: totalFromRows(inv.invoice_lines, inv.discount_cents, inv.apply_tax, Number(inv.tax_rate)) })}
                customerName={inv.customer_name}
                issueDate={inv.issue_date}
                totalCents={totalFromRows(inv.invoice_lines, inv.discount_cents, inv.apply_tax, Number(inv.tax_rate))}
                deletable
              />
            </li>
          ))}
        </ul>
      )}

      <section aria-labelledby="records-heading" className="space-y-3 rounded-xl border border-gray-800 bg-gray-900 p-4">
        <h2 id="records-heading" className="font-semibold">Records</h2>
        <p className="text-sm text-gray-400">
          Every invoice you send is kept. Deleting one only moves it to Deleted invoices, so it is still here for taxes. Download a spreadsheet of your
          invoices (subtotal, HST, total, what was paid) to give your accountant.
        </p>
        <form action="/api/invoices/export" method="get" className="flex flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor="export-year">Year</label>
          <select id="export-year" name="year" defaultValue="all" className="min-h-[44px] rounded-lg border border-gray-700 bg-gray-800 px-3 text-white">
            <option value="all">All years</option>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <button type="submit" className="min-h-[44px] rounded-lg bg-gold px-4 font-semibold text-black hover:bg-gold-dark">Download spreadsheet (CSV)</button>
        </form>
        <Link href="/admin/invoices/deleted" className="inline-flex min-h-[44px] items-center text-sm text-gray-300 hover:text-gold">
          Deleted invoices{deletedRows.length > 0 ? ` (${deletedRows.length})` : ''} →
        </Link>
      </section>
    </div>
  )
}
