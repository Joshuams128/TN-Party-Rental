import Link from 'next/link'
import { Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import InvoiceListItem from '@/components/admin/InvoiceListItem'
import { totalFromRows, type LineRow } from '@/lib/invoice'

export const dynamic = 'force-dynamic'

type Row = {
  id: string
  number: number
  status: 'draft' | 'sent'
  signed_at: string | null
  customer_name: string
  issue_date: string
  discount_cents: number
  apply_tax: boolean
  tax_rate: number
  invoice_lines: LineRow[]
}

export default async function DashboardPage() {
  const { data } = await createClient()
    .from('invoices')
    .select('id, number, status, signed_at, customer_name, issue_date, discount_cents, apply_tax, tax_rate, invoice_lines(unit_price_cents, quantity, discount_type, discount_value)')
    .order('number', { ascending: false })
  const invoices = (data ?? []) as Row[]
  const drafts = invoices.filter((i) => i.status === 'draft').length
  const signed = invoices.filter((i) => i.signed_at).length
  const awaiting = invoices.length - drafts - signed

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <Link href="/admin/invoices/new" className="inline-flex items-center gap-2 rounded-lg bg-gold px-5 py-3 font-semibold text-black hover:bg-gold-dark">
        <Plus size={18} /> New invoice
      </Link>

      <div className="grid grid-cols-3 gap-3 sm:max-w-lg">
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
          <p className="text-2xl font-bold">{drafts}</p>
          <p className="text-sm text-gray-400">Drafts</p>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
          <p className="text-2xl font-bold">{awaiting}</p>
          <p className="text-sm text-gray-400">Awaiting signature</p>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
          <p className="text-2xl font-bold">{signed}</p>
          <p className="text-sm text-gray-400">Signed</p>
        </div>
      </div>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-semibold">Recent invoices</h2>
          <Link href="/admin/invoices" className="flex min-h-[44px] items-center text-sm text-gray-400 hover:text-gold">View all</Link>
        </div>
        {invoices.length === 0 ? (
          <p className="text-sm text-gray-400">Nothing yet.</p>
        ) : (
          <ul className="divide-y divide-gray-800 overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
            {invoices.slice(0, 5).map((inv) => (
              <li key={inv.id} className="flex items-center hover:bg-gray-800">
                <InvoiceListItem
                  id={inv.id}
                  number={inv.number}
                  status={inv.signed_at ? 'signed' : inv.status}
                  customerName={inv.customer_name}
                  issueDate={inv.issue_date}
                  totalCents={totalFromRows(inv.invoice_lines, inv.discount_cents, inv.apply_tax, Number(inv.tax_rate))}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
