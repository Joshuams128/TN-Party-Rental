import Link from 'next/link'
import { Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { totalFromRows, type LineRow } from '@/lib/invoice'
import InvoiceListItem from '@/components/admin/InvoiceListItem'

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

export default async function InvoicesPage() {
  const { data, error } = await createClient()
    .from('invoices')
    .select('id, number, status, signed_at, customer_name, issue_date, discount_cents, apply_tax, tax_rate, invoice_lines(unit_price_cents, quantity, discount_type, discount_value)')
    .order('number', { ascending: false })
  const invoices = (data ?? []) as Row[]

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Invoices</h1>
        <Link href="/admin/invoices/new" className="inline-flex items-center gap-2 rounded-lg bg-gold px-4 py-2 font-semibold text-black hover:bg-gold-dark">
          <Plus size={18} /> New invoice
        </Link>
      </div>

      {error && <p className="rounded-lg bg-red-950 p-3 text-sm text-red-300">Couldn&apos;t load invoices: {error.message}</p>}

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
                customerName={inv.customer_name}
                issueDate={inv.issue_date}
                totalCents={totalFromRows(inv.invoice_lines, inv.discount_cents, inv.apply_tax, Number(inv.tax_rate))}
                deletable
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
