import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { loadIncome } from '@/lib/income'
import { formatMoney } from '@/lib/money'
import { formatDateShort, todayISO } from '@/lib/invoice'
import RecordPaymentForm from '@/components/admin/RecordPaymentForm'
import AddExpenseForm from '@/components/admin/AddExpenseForm'
import DeleteRecordButton from '@/components/admin/DeleteRecordButton'

export const dynamic = 'force-dynamic'

export default async function JobPage({ params }: { params: { id: string } }) {
  const { jobs, setupNeeded } = await loadIncome(createClient())
  const j = jobs.find((x) => x.id === params.id)
  if (!j) notFound()
  const today = todayISO()
  const owing = (j.owingCents / 100).toFixed(2)

  return (
    <div className="space-y-5">
      <Link href="/admin/income" className="inline-flex min-h-[44px] items-center gap-1 text-sm text-gray-400 hover:text-gold">
        <ArrowLeft size={14} /> Income
      </Link>
      <div>
        <h1 className="text-2xl font-bold">{j.customer || 'No name'} <span className="text-lg font-normal text-gray-400">#{j.number}</span></h1>
        <p className="text-sm text-gray-400">
          Event {formatDateShort(j.eventDate)} ·{' '}
          <Link href={`/admin/invoices/${j.id}/review`} className="text-gold hover:underline">Open the invoice</Link>
        </p>
      </div>

      {setupNeeded && (
        <p role="status" className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-200">
          Run the “income tracker” database update (0017) in Supabase to record payments and expenses.
        </p>
      )}

      <section aria-label="Summary" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {[
          ['Total (with HST)', formatMoney(j.totalCents)],
          ['Received', formatMoney(j.receivedCents)],
          ['Still owing', j.owingCents > 0 ? formatMoney(j.owingCents) : 'Paid in full'],
          ['Revenue (no HST)', formatMoney(j.revenueCents)],
          ['Expenses', formatMoney(j.expensesCents)],
          ['Profit', formatMoney(j.profitCents)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-gray-800 bg-gray-900 p-4">
            <p className="text-xs text-gray-400">{label}</p>
            <p className="text-lg font-bold">{value}</p>
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Payments received</h2>
        {j.payments.length === 0 ? (
          <p className="text-sm text-gray-400">Nothing received yet.</p>
        ) : (
          <ul className="divide-y divide-gray-800 overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
            {j.payments.map((p, i) => (
              <li key={p.id ?? `sq-${i}`} className="flex items-center justify-between gap-3 px-4 py-2">
                <div className="min-w-0">
                  <p className="font-medium">{formatMoney(p.amountCents)} <span className="font-normal text-gray-400">· {p.method}</span></p>
                  <p className="truncate text-xs text-gray-400">{p.date ? formatDateShort(p.date) : ''}{p.note ? ` · ${p.note}` : ''}</p>
                </div>
                {p.id ? <DeleteRecordButton table="job_payments" id={p.id} label={`the ${formatMoney(p.amountCents)} payment`} /> : <span className="shrink-0 text-xs text-gray-500">Automatic</span>}
              </li>
            ))}
          </ul>
        )}
        <RecordPaymentForm invoiceId={j.id} defaultAmount={j.owingCents > 0 ? owing : ''} today={today} />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Expenses for this job</h2>
        {j.expenses.length === 0 ? (
          <p className="text-sm text-gray-400">No expenses added. Add what the job cost to see the profit.</p>
        ) : (
          <ul className="divide-y divide-gray-800 overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
            {j.expenses.map((e) => (
              <li key={e.id} className="flex items-center justify-between gap-3 px-4 py-2">
                <div className="min-w-0">
                  <p className="font-medium">{e.description}</p>
                  <p className="text-xs text-gray-400">{formatMoney(e.amountCents)}{e.date ? ` · ${formatDateShort(e.date)}` : ''}</p>
                </div>
                <DeleteRecordButton table="job_expenses" id={e.id} label={`the ${e.description} expense`} />
              </li>
            ))}
          </ul>
        )}
        <AddExpenseForm invoiceId={j.id} today={today} />
      </section>
    </div>
  )
}
