import Link from 'next/link'
import { Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatMoney } from '@/lib/money'
import { totalFromRows } from '@/lib/invoice'

export const dynamic = 'force-dynamic'

type Row = {
  id: string
  number: number
  status: 'draft' | 'sent'
  customer_name: string
  issue_date: string
  discount_cents: number
  apply_tax: boolean
  tax_rate: number
  invoice_lines: { unit_price_cents: number; quantity: number }[]
}

export default async function InvoicesPage() {
  const { data, error } = await createClient()
    .from('invoices')
    .select('id, number, status, customer_name, issue_date, discount_cents, apply_tax, tax_rate, invoice_lines(unit_price_cents, quantity)')
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
            <li key={inv.id}>
              <Link href={`/admin/invoices/${inv.id}`} className="flex items-center gap-4 px-4 py-3 hover:bg-gray-800">
                <span className="w-16 font-mono text-sm text-gray-400">#{inv.number}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{inv.customer_name || 'No customer yet'}</span>
                  <span className="block text-xs text-gray-400">{inv.issue_date}</span>
                </span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${inv.status === 'sent' ? 'bg-green-950 text-green-300' : 'bg-gray-800 text-gray-300'}`}>
                  {inv.status}
                </span>
                <span className="w-28 text-right font-semibold">
                  {formatMoney(totalFromRows(inv.invoice_lines, inv.discount_cents, inv.apply_tax, Number(inv.tax_rate)))}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
