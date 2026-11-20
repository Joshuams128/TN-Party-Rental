'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RotateCcw } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

// Puts a deleted invoice back in the normal lists, exactly as it was.
export default function RestoreInvoiceButton({ id, number, redirectTo }: { id: string; number: number; redirectTo?: string }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function restore() {
    setBusy(true)
    setError('')
    const { error: dbErr } = await createClient().from('invoices').update({ deleted_at: null }).eq('id', id)
    if (dbErr) {
      setBusy(false)
      return setError(dbErr.message)
    }
    if (redirectTo) router.push(redirectTo)
    router.refresh()
  }

  return (
    <span className="inline-flex flex-col items-end">
      <button
        type="button"
        onClick={restore}
        disabled={busy}
        aria-label={`Restore invoice ${number}`}
        className="flex min-h-[44px] items-center gap-1 rounded-lg px-3 text-sm font-medium text-gold hover:bg-gray-800 disabled:opacity-50"
      >
        <RotateCcw size={14} /> {busy ? 'Restoring…' : 'Restore'}
      </button>
      {error && <span role="alert" className="text-xs text-red-400">{error}</span>}
    </span>
  )
}
