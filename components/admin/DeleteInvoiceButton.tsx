'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { pruneOrphanCustomers } from '@/lib/customers'

type Props = {
  id: string
  number: number
  status: 'draft' | 'sent' | 'signed'
  variant?: 'icon' | 'text'
  redirectTo?: string // go here after deleting; otherwise just refresh the current page
}

// A draft nobody ever received can simply be erased. Anything that was sent (or signed) is a record you may need for
// taxes, so "delete" only moves it to the Deleted invoices list, where it is kept and can be restored.
export function deleteInvoiceMessage(number: number, status: 'draft' | 'sent' | 'signed') {
  if (status === 'draft') return `Delete draft invoice #${number}? This can't be undone.`
  return `Delete invoice #${number}?\n\nIt is NOT erased: it moves to “Deleted invoices” so you still have it for your records and taxes, and you can restore it any time. The customer's link will stop working.`
}

export default function DeleteInvoiceButton({ id, number, status, variant = 'icon', redirectTo }: Props) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function remove() {
    if (!confirm(deleteInvoiceMessage(number, status))) return
    setBusy(true)
    setError('')
    const supabase = createClient()
    const { error: dbErr } =
      status === 'draft'
        ? await supabase.from('invoices').delete().eq('id', id)
        : await supabase.from('invoices').update({ deleted_at: new Date().toISOString() }).eq('id', id)
    if (dbErr) {
      setBusy(false)
      return setError(/deleted_at/.test(dbErr.message) ? 'Run the “keep deleted invoices” database update (0016) in Supabase first, then try again.' : dbErr.message)
    }
    if (status === 'draft') await pruneOrphanCustomers(supabase)
    if (redirectTo) router.push(redirectTo)
    router.refresh()
  }

  return (
    <span className="inline-flex flex-col items-end">
      <button
        type="button"
        onClick={remove}
        disabled={busy}
        aria-label={`Delete invoice ${number}`}
        title="Delete invoice"
        className={
          variant === 'icon'
            ? 'flex h-11 w-11 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-700 hover:text-red-400 disabled:opacity-50'
            : 'flex min-h-[44px] items-center gap-1 text-sm text-gray-400 hover:text-red-400 disabled:opacity-50'
        }
      >
        <Trash2 size={variant === 'icon' ? 16 : 14} />
        {variant === 'text' && (busy ? 'Deleting…' : 'Delete invoice')}
      </button>
      {error && <span role="alert" className="text-xs text-red-400">{error}</span>}
    </span>
  )
}
