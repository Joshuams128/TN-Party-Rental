'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { pruneOrphanCustomers } from '@/lib/customers'

// The only way to erase a sent invoice for good, and only from the Deleted list: the invoice number must be typed.
// Meant for test invoices. Real invoices should stay, they are your records.
export default function EraseInvoiceButton({ id, number }: { id: string; number: number }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function erase() {
    const typed = window.prompt(
      `Erase invoice #${number} FOREVER?\n\nThis removes it, its items and any signature completely. It cannot be recovered, and it will be missing from your tax records.\n\nOnly do this for test invoices. To confirm, type the invoice number (${number}):`
    )
    if (typed === null) return
    if (typed.trim() !== String(number)) return setError('That is not the invoice number, so nothing was erased.')
    setBusy(true)
    setError('')
    const supabase = createClient()
    const { error: dbErr } = await supabase.from('invoices').delete().eq('id', id)
    if (dbErr) {
      setBusy(false)
      return setError(dbErr.message)
    }
    await pruneOrphanCustomers(supabase)
    router.refresh()
  }

  return (
    <span className="inline-flex flex-col items-end">
      <button type="button" onClick={erase} disabled={busy} aria-label={`Erase invoice ${number} forever`} className="min-h-[44px] rounded-lg px-3 text-sm text-gray-500 hover:bg-gray-800 hover:text-red-400 disabled:opacity-50">
        {busy ? 'Erasing…' : 'Erase forever'}
      </button>
      {error && <span role="alert" className="max-w-[12rem] text-right text-xs text-red-400">{error}</span>}
    </span>
  )
}
