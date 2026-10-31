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

export function deleteInvoiceMessage(number: number, status: 'draft' | 'sent' | 'signed') {
  if (status === 'signed') {
    return `Delete invoice #${number}?\n\nThe customer has SIGNED this invoice. Deleting permanently removes the signed record (and their signature) from this app. Download the signed PDF first if you need to keep it.\n\nThis can't be undone.`
  }
  return status === 'sent'
    ? `Delete invoice #${number}?\n\nIt was already emailed to the customer. Deleting removes it from your records here, but it can't unsend that email.\n\nThis can't be undone.`
    : `Delete draft invoice #${number}? This can't be undone.`
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
    const { error: dbErr } = await supabase.from('invoices').delete().eq('id', id)
    if (dbErr) {
      setBusy(false)
      return setError(dbErr.message)
    }
    await pruneOrphanCustomers(supabase)
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
