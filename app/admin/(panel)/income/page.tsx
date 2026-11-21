import Link from 'next/link'
import { Download } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { filterJobs, loadIncome, parseFilter, totalsOf } from '@/lib/income'
import { formatMoney } from '@/lib/money'
import { formatDateShort, todayISO } from '@/lib/invoice'

export const dynamic = 'force-dynamic'

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const card = 'rounded-xl border border-gray-800 bg-gray-900 p-4'
const select = 'min-h-[44px] rounded-lg border border-gray-700 bg-gray-800 px-3 text-white'

export default async function IncomePage({ searchParams }: { searchParams: { year?: string; month?: string; unpaid?: string } }) {
  const { jobs: all, setupNeeded } = await loadIncome(createClient())
  const thisYear = todayISO().slice(0, 4)
  const f = parseFilter(searchParams, thisYear)
  const jobs = filterJobs(all, f)
  const t = totalsOf(jobs)
  const years = Array.from(new Set([thisYear, ...all.map((j) => j.eventDate.slice(0, 4))])).sort().reverse()
  const query = new URLSearchParams({ year: f.year, month: f.month, ...(f.showUnpaid ? { unpaid: '1' } : {}) }).toString()

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Income</h1>
          <p className="text-sm text-gray-400">Every job that has been paid, filled in from your invoices and payments.</p>
        </div>
        <a
          href={`/api/income/export?${query}`}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-gold px-4 font-semibold text-black hover:bg-gold-dark"
        >
          <Download size={18} /> Download Excel
        </a>
      </div>

      {setupNeeded && (
        <p role="status" className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-200">
          To record payments and expenses, run the “income tracker” database update (0017) in Supabase. Until then this page shows Square payments only.
        </p>
      )}

      <form method="get" className="flex flex-wrap items-end gap-3">
        <label className="text-xs text-gray-400">
          Year
          <select name="year" defaultValue={f.year} className={`${select} mt-1 block`}>
            <option value="all">All years</option>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </label>
        <label className="text-xs text-gray-400">
          Month
          <select name="month" defaultValue={f.month} className={`${select} mt-1 block`}>
            <option value="all">Whole year</option>
            {MONTHS.map((m, i) => <option key={m} value={String(i + 1)}>{m}</option>)}
          </select>
        </label>
        <label className="flex min-h-[44px] items-center gap-2 text-sm">
          <input type="checkbox" name="unpaid" value="1" defaultChecked={f.showUnpaid} className="h-5 w-5 accent-[#D4AF37]" />
          Show jobs with no payment yet
        </label>
        <button type="submit" className="min-h-[44px] rounded-lg border border-gray-700 px-4 text-sm hover:bg-gray-800">Show</button>
      </form>

      <section aria-label="Totals" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <div className={card}><p className="text-xs text-gray-400">Received</p><p className="text-lg font-bold text-green-400">{formatMoney(t.received)}</p></div>
        <div className={card}><p className="text-xs text-gray-400">Still owing</p><p className="text-lg font-bold">{formatMoney(t.owing)}</p></div>
        <div className={card}><p className="text-xs text-gray-400">Booked (with HST)</p><p className="text-lg font-bold">{formatMoney(t.total)}</p></div>
        <div className={card}><p className="text-xs text-gray-400">HST collected</p><p className="text-lg font-bold">{formatMoney(t.tax)}</p></div>
        <div className={card}><p className="text-xs text-gray-400">Expenses</p><p className="text-lg font-bold">{formatMoney(t.expenses)}</p></div>
        <div className={card}><p className="text-xs text-gray-400">Profit (before HST)</p><p className="text-lg font-bold text-gold">{formatMoney(t.profit)}</p></div>
      </section>

      {jobs.length === 0 ? (
        <p className="py-10 text-center text-gray-400">
          No paid jobs for this period yet. A job shows up here as soon as a payment comes in, or tick “Show jobs with no payment yet”.
        </p>
      ) : (
        <>
          {/* Wide screens: a sheet. */}
          <div className="hidden overflow-x-auto rounded-xl border border-gray-800 md:block">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="bg-gray-900 text-left text-xs text-gray-400">
                <tr>
                  <th className="px-3 py-2 font-medium">Event date</th>
                  <th className="px-3 py-2 font-medium">Customer</th>
                  <th className="px-3 py-2 font-medium">Invoice</th>
                  <th className="px-3 py-2 text-right font-medium">Revenue (no HST)</th>
                  <th className="px-3 py-2 text-right font-medium">HST</th>
                  <th className="px-3 py-2 text-right font-medium">Total</th>
                  <th className="px-3 py-2 text-right font-medium">Received</th>
                  <th className="px-3 py-2 text-right font-medium">Still owing</th>
                  <th className="px-3 py-2 text-right font-medium">Expenses</th>
                  <th className="px-3 py-2 text-right font-medium">Profit</th>
                  <th className="px-3 py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {jobs.map((j) => (
                  <tr key={j.id} className="hover:bg-gray-900">
                    <td className="whitespace-nowrap px-3 py-2">{formatDateShort(j.eventDate)}</td>
                    <td className="px-3 py-2 font-medium">{j.customer || 'No name'}</td>
                    <td className="px-3 py-2 text-gray-400">#{j.number}</td>
                    <td className="px-3 py-2 text-right">{formatMoney(j.revenueCents)}</td>
                    <td className="px-3 py-2 text-right text-gray-400">{formatMoney(j.taxCents)}</td>
                    <td className="px-3 py-2 text-right">{formatMoney(j.totalCents)}</td>
                    <td className="px-3 py-2 text-right text-green-400">{formatMoney(j.receivedCents)}</td>
                    <td className={`px-3 py-2 text-right ${j.owingCents > 0 ? 'font-medium text-amber-300' : 'text-gray-500'}`}>{j.owingCents > 0 ? formatMoney(j.owingCents) : 'Paid'}</td>
                    <td className="px-3 py-2 text-right text-gray-400">{formatMoney(j.expensesCents)}</td>
                    <td className="px-3 py-2 text-right font-medium">{formatMoney(j.profitCents)}</td>
                    <td className="px-3 py-2 text-right">
                      <Link href={`/admin/income/${j.id}`} className="inline-flex min-h-[44px] items-center text-gold hover:underline">Manage</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-900 font-semibold">
                <tr>
                  <td className="px-3 py-2" colSpan={3}>{t.jobs} job{t.jobs === 1 ? '' : 's'}</td>
                  <td className="px-3 py-2 text-right">{formatMoney(t.revenue)}</td>
                  <td className="px-3 py-2 text-right">{formatMoney(t.tax)}</td>
                  <td className="px-3 py-2 text-right">{formatMoney(t.total)}</td>
                  <td className="px-3 py-2 text-right text-green-400">{formatMoney(t.received)}</td>
                  <td className="px-3 py-2 text-right">{formatMoney(t.owing)}</td>
                  <td className="px-3 py-2 text-right">{formatMoney(t.expenses)}</td>
                  <td className="px-3 py-2 text-right text-gold">{formatMoney(t.profit)}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Phones: one card per job. */}
          <ul className="space-y-3 md:hidden">
            {jobs.map((j) => (
              <li key={j.id} className="rounded-xl border border-gray-800 bg-gray-900 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{j.customer || 'No name'}</p>
                    <p className="text-xs text-gray-400">#{j.number} · {formatDateShort(j.eventDate)}</p>
                  </div>
                  <p className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${j.owingCents > 0 ? 'bg-amber-950 text-amber-300' : 'bg-green-950 text-green-300'}`}>
                    {j.owingCents > 0 ? `Owes ${formatMoney(j.owingCents)}` : 'Paid in full'}
                  </p>
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  <dt className="text-gray-400">Total</dt><dd className="text-right">{formatMoney(j.totalCents)}</dd>
                  <dt className="text-gray-400">Received</dt><dd className="text-right text-green-400">{formatMoney(j.receivedCents)}</dd>
                  <dt className="text-gray-400">Expenses</dt><dd className="text-right">{formatMoney(j.expensesCents)}</dd>
                  <dt className="text-gray-400">Profit (no HST)</dt><dd className="text-right font-medium">{formatMoney(j.profitCents)}</dd>
                </dl>
                <Link href={`/admin/income/${j.id}`} className="mt-2 inline-flex min-h-[44px] items-center text-sm font-medium text-gold">Manage payments & expenses →</Link>
              </li>
            ))}
          </ul>
        </>
      )}
      <p className="text-xs text-gray-500">
        Profit = revenue before HST minus the expenses you add to each job. HST is collected for the government, so it is not counted as income. Security
        deposits are refundable and are not included.
      </p>
    </div>
  )
}
