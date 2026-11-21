'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

// Removes one payment or expense the owner entered by mistake. (Square payments cannot be removed here.)
export default function DeleteRecordButton({ table, id, label }: { table: 'job_payments' | 'job_expenses'; id: string; label: string }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  async function remove() {
    if (!confirm(`Remove ${label}?`)) return
    setBusy(true)
    setError('')
    const { error: dbErr } = await createClient().from(table).delete().eq('id', id)
    if (dbErr) {
      setBusy(false)
      return setError(dbErr.message)
    }
    router.refresh()
  }
  return (
    <span className="inline-flex flex-col items-end">
      <button type="button" onClick={remove} disabled={busy} aria-label={`Remove ${label}`} className="min-h-[44px] rounded-lg px-3 text-sm text-gray-500 hover:bg-gray-800 hover:text-red-400 disabled:opacity-50">
        {busy ? '…' : 'Remove'}
      </button>
      {error && <span role="alert" className="text-xs text-red-400">{error}</span>}
    </span>
  )
}
