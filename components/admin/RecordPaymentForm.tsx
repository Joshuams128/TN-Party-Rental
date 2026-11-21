'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { parseMoneyToCents } from '@/lib/money'

const field = 'mt-1 min-h-[44px] w-full rounded-lg border border-gray-700 bg-gray-800 px-3 text-white placeholder-gray-500'
const METHODS = ['e-Transfer', 'Cash', 'Card (in person)', 'Cheque', 'Other']

// Records money received outside Square (e-Transfer, cash...), so the job's "received" and "still owing" stay right.
export default function RecordPaymentForm({ invoiceId, defaultAmount, today }: { invoiceId: string; defaultAmount: string; today: string }) {
  const router = useRouter()
  const [amount, setAmount] = useState(defaultAmount)
  const [date, setDate] = useState(today)
  const [method, setMethod] = useState(METHODS[0])
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function save(e: React.FormEvent) {
    e.preventDefault()
    const cents = parseMoneyToCents(amount)
    if (!cents || cents <= 0) return setError('Enter the amount received.')
    if (!date) return setError('Choose the date it was received.')
    setBusy(true)
    setError('')
    const { error: dbErr } = await createClient().from('job_payments').insert({ invoice_id: invoiceId, amount_cents: cents, received_on: date, method, note: note.trim() })
    setBusy(false)
    if (dbErr) return setError(/job_payments/.test(dbErr.message) ? 'Run the “job tracker” database update (0017) in Supabase first, then try again.' : dbErr.message)
    setNote('')
    setAmount('')
    router.refresh()
  }

  return (
    <form onSubmit={save} className="space-y-3 rounded-lg border border-gray-800 p-4">
      <p className="text-sm font-medium">Record a payment received</p>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block text-xs text-gray-400">
          Amount
          <span className="relative block">
            <span className="pointer-events-none absolute left-3 top-1/2 mt-0.5 -translate-y-1/2 text-gray-400">$</span>
            <input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className={`${field} pl-6 text-right`} />
          </span>
        </label>
        <label className="block text-xs text-gray-400">
          Date received
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={field} />
        </label>
        <label className="block text-xs text-gray-400">
          How
          <select value={method} onChange={(e) => setMethod(e.target.value)} className={field}>
            {METHODS.map((m) => <option key={m}>{m}</option>)}
          </select>
        </label>
      </div>
      <label className="block text-xs text-gray-400">
        Note <span className="text-gray-500">(optional)</span>
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. balance, e-Transfer from Maria" className={field} />
      </label>
      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
      <button type="submit" disabled={busy} className="min-h-[44px] rounded-lg bg-gold px-5 font-semibold text-black hover:bg-gold-dark disabled:opacity-60">
        {busy ? 'Saving…' : 'Add payment'}
      </button>
    </form>
  )
}
