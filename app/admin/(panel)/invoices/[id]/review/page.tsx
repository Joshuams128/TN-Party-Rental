import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { loadInvoiceDoc } from '@/lib/invoice-data'
import { formatMoney } from '@/lib/money'
import SendPanel from '@/components/admin/SendPanel'

export const dynamic = 'force-dynamic'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default async function ReviewPage({ params }: { params: { id: string } }) {
  const doc = await loadInvoiceDoc(createClient(), params.id)
  if (!doc) notFound()

  const problems: string[] = []
  if (!doc.customer_name.trim()) problems.push('Customer name is missing.')
  if (!EMAIL_RE.test(doc.customer_email.trim())) problems.push('Customer email is missing or invalid.')
  if (doc.lines.length === 0) problems.push('There are no items on this invoice.')
  if (!EMAIL_RE.test(doc.settings.email.trim())) problems.push('Your business email isn’t set. Add it in Settings.')

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Review invoice #{doc.number}</h1>
        <p className="text-sm text-gray-400">
          {doc.customer_name || 'No customer'} · {formatMoney(doc.totals.total)} · {doc.lines.length} item{doc.lines.length === 1 ? '' : 's'}
          {problems.some((p) => p.includes('Settings')) && (
            <> · <Link href="/admin/settings" className="text-gold underline">Open settings</Link></>
          )}
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <div className="order-2 lg:order-1">
          <iframe
            src={`/api/invoices/${doc.id}/pdf#toolbar=0`}
            title={`Invoice ${doc.number} preview`}
            className="hidden h-[820px] w-full rounded-xl border border-gray-800 bg-white md:block"
          />
          <p className="text-sm text-gray-400 md:hidden">
            <a href={`/api/invoices/${doc.id}/pdf`} target="_blank" rel="noreferrer" className="text-gold underline">Open the PDF preview</a> to check it before sending.
          </p>
        </div>
        <div className="order-1 lg:order-2">
          <SendPanel
            invoiceId={doc.id}
            number={doc.number}
            status={doc.status}
            to={doc.customer_email}
            from={doc.settings.email}
            problems={problems}
          />
        </div>
      </div>
    </div>
  )
}
