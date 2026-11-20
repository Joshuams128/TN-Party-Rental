import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { fetchInvoiceRows } from '@/lib/invoice-lists'
import { formatMoney } from '@/lib/money'
import { formatDateShort, totalFromRows, type LineRow } from '@/lib/invoice'
import RestoreInvoiceButton from '@/components/admin/RestoreInvoiceButton'
import EraseInvoiceButton from '@/components/admin/EraseInvoiceButton'

export const dynamic = 'force-dynamic'

type Row = {
  id: string
  number: number
  status: 'draft' | 'sent'
  signed_at: string | null
  deleted_at: string
  customer_name: string
  issue_date: string
  discount_cents: number
  apply_tax: boolean
  tax_rate: number
  invoice_lines: LineRow[]
}

export default async function DeletedInvoicesPage() {
  const { rows } = await fetchInvoiceRows<Row>(
    createClient(),
    'id, number, status, signed_at, deleted_at, customer_name, issue_date, discount_cents, apply_tax, tax_rate, invoice_lines(unit_price_cents, quantity, discount_type, discount_value)',
    'deleted'
  )
  return (
    <div className="space-y-5">
      <Link href="/admin/invoices" className="inline-flex min-h-[44px] items-center gap-1 text-sm text-gray-400 hover:text-gold">
        <ArrowLeft size={14} /> All invoices
      </Link>
      <div>
        <h1 className="text-2xl font-bold">Deleted invoices</h1>
        <p className="mt-1 text-sm text-gray-400">
          Deleted invoices are kept here for your records and taxes. You can open one to download its PDF, or restore it. They are also included in the
          records export.
        </p>
      </div>
      {rows.length === 0 ? (
        <p className="py-10 text-center text-gray-400">Nothing deleted. Invoices you delete will be kept here.</p>
      ) : (
        <ul className="divide-y divide-gray-800 overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
          {rows.map((inv) => (
            <li key={inv.id} className="flex flex-col gap-1 p-2 sm:flex-row sm:items-center sm:gap-2">
              <Link href={`/admin/invoices/${inv.id}/review`} className="grid min-w-0 grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 rounded-lg px-2 py-2 hover:bg-gray-800 sm:flex-1">
                <span className="truncate font-medium">{inv.customer_name || 'No customer'}</span>
                <span className="text-right font-semibold">{formatMoney(totalFromRows(inv.invoice_lines, inv.discount_cents, inv.apply_tax, Number(inv.tax_rate)))}</span>
                <span className="text-xs text-gray-400">
                  #{inv.number} · {formatDateShort(inv.issue_date)} · {inv.signed_at ? 'was signed' : 'was sent'}
                </span>
                <span className="justify-self-end text-xs text-gray-500">Deleted {formatDateShort(inv.deleted_at.slice(0, 10))}</span>
              </Link>
              <div className="flex shrink-0 items-center justify-end border-t border-gray-800 pt-1 sm:border-t-0 sm:pt-0">
                <RestoreInvoiceButton id={inv.id} number={inv.number} />
                <EraseInvoiceButton id={inv.id} number={inv.number} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
