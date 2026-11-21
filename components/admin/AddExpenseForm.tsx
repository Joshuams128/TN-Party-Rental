'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { parseMoneyToCents } from '@/lib/money'

const field = 'mt-1 min-h-[44px] w-full rounded-lg border border-gray-700 bg-gray-800 px-3 text-white placeholder-gray-500'

// What the job cost (staff, delivery, supplies...), so the profit on the job can be seen.
export default function AddExpenseForm({ invoiceId, today }: { invoiceId: string; today: string }) {
  const router = useRouter()
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(today)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function save(e: React.FormEvent) {
    e.preventDefault()
    const cents = parseMoneyToCents(amount)
    if (!description.trim()) return setError('Say what the expense was for.')
    if (!cents || cents <= 0) return setError('Enter the amount.')
    setBusy(true)
    setError('')
    const { error: dbErr } = await createClient().from('job_expenses').insert({ invoice_id: invoiceId, description: description.trim(), amount_cents: cents, spent_on: date || null })
    setBusy(false)
    if (dbErr) return setError(/job_expenses/.test(dbErr.message) ? 'Run the “income tracker” database update (0017) in Supabase first, then try again.' : dbErr.message)
    setDescription('')
    setAmount('')
    router.refresh()
  }

  return (
    <form onSubmit={save} className="space-y-3 rounded-lg border border-gray-800 p-4">
      <p className="text-sm font-medium">Add an expense</p>
      <label className="block text-xs text-gray-400">
        What was it for?
        <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. Delivery, helper, balloons" className={field} />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-xs text-gray-400">
          Amount
          <span className="relative block">
            <span className="pointer-events-none absolute left-3 top-1/2 mt-0.5 -translate-y-1/2 text-gray-400">$</span>
            <input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className={`${field} pl-6 text-right`} />
          </span>
        </label>
        <label className="block text-xs text-gray-400">
          Date
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={field} />
        </label>
      </div>
      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
      <button type="submit" disabled={busy} className="min-h-[44px] rounded-lg border border-gold/50 px-5 font-semibold text-gold hover:bg-gold/10 disabled:opacity-60">
        {busy ? 'Saving…' : 'Add expense'}
      </button>
    </form>
  )
}
