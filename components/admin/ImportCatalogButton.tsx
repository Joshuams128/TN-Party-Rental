'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { catalogToItems } from '@/lib/items'

export default function ImportCatalogButton({ existingNames }: { existingNames: string[] }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  const have = new Set(existingNames.map((n) => n.toLowerCase()))
  const pending = catalogToItems().filter((i) => !have.has(i.name.toLowerCase())).length

  async function run() {
    setBusy(true)
    setMessage('')
    const rows = catalogToItems().filter((i) => !have.has(i.name.toLowerCase()))
    if (rows.length === 0) {
      setMessage('Everything from the website is already imported.')
      setBusy(false)
      return
    }
    const { error } = await createClient().from('items').insert(rows)
    setBusy(false)
    if (error) {
      setMessage(`Import failed: ${error.message}`)
      return
    }
    setMessage(`Imported ${rows.length} items.`)
    router.refresh()
  }

  // Nothing left to import (and no message to show): don't take up space on a phone.
  if (pending === 0 && !message) return null

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button onClick={run} disabled={busy} className="rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-sm font-medium hover:bg-gray-800 disabled:opacity-60">
        {busy ? 'Importing…' : 'Import from website catalog'}
      </button>
      {message && <span className="text-sm text-gray-400">{message}</span>}
    </div>
  )
}
