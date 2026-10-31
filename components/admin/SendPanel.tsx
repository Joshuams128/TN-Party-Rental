'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Download, Pencil, Send } from 'lucide-react'
import DeleteInvoiceButton from './DeleteInvoiceButton'

type Props = {
  invoiceId: string
  number: number
  status: 'draft' | 'sent'
  signedBy?: string // set once the customer has signed
  signedOn?: string
  to: string
  from: string
  replyTo: string
  problems: string[] // reasons sending is blocked
}

export default function SendPanel({ invoiceId, number, status, signedBy, signedOn, to, from, replyTo, problems }: Props) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function send() {
    setSending(true)
    setError('')
    try {
      const res = await fetch(`/api/invoices/${invoiceId}/send`, { method: 'POST' })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body.message || 'Sending failed.')
      setSent(true)
      setConfirming(false)
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sending failed.')
    } finally {
      setSending(false)
    }
  }

  const alreadySent = status === 'sent' || sent
  const signed = !!signedBy

  return (
    <div className="space-y-4 rounded-xl border border-gray-800 bg-gray-900 p-5">
      {signed ? (
        <div className="rounded-lg bg-green-950 p-4 text-green-200">
          <p className="flex items-center gap-2 font-semibold"><CheckCircle2 size={18} /> Signed by {signedBy}</p>
          <p className="mt-1 text-sm text-green-300">{signedOn}. A signed copy was emailed to you and the customer. It can no longer be edited or resent.</p>
        </div>
      ) : alreadySent ? (
        <p className="flex items-center gap-2 text-green-400">
          <CheckCircle2 size={18} /> {sent ? 'Sent! Waiting for the customer to sign.' : 'Sent. Waiting for the customer to sign.'}
        </p>
      ) : null}

      {!signed && problems.length > 0 && (
        <ul className="space-y-1 rounded-lg bg-red-950 p-3 text-sm text-red-300">
          {problems.map((p) => <li key={p}>• {p}</li>)}
        </ul>
      )}

      {signed ? null : !confirming ? (
        <button
          onClick={() => setConfirming(true)}
          disabled={problems.length > 0}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gold px-5 py-3 font-semibold text-black hover:bg-gold-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send size={18} /> {alreadySent ? 'Send again' : 'Send to customer'}
        </button>
      ) : (
        <div className="space-y-3 rounded-lg border border-gold/40 p-4">
          <p className="text-sm">
            Email invoice #{number} to <strong>{to}</strong> with a secure link to review and sign it?
            <span className="mt-1 block text-xs text-gray-400">From {from}. Replies and a copy go to {replyTo}.</span>
          </p>
          <div className="flex gap-2">
            <button onClick={send} disabled={sending} className="flex-1 rounded-lg bg-gold px-4 py-2.5 font-semibold text-black hover:bg-gold-dark disabled:opacity-60">
              {sending ? 'Sending…' : 'Yes, send it'}
            </button>
            <button onClick={() => setConfirming(false)} disabled={sending} className="rounded-lg px-4 py-2.5 text-gray-300 hover:bg-gray-800">
              Cancel
            </button>
          </div>
        </div>
      )}

      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}

      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
        <a href={`/api/invoices/${invoiceId}/pdf?download=1`} className="flex min-h-[44px] items-center gap-1 text-gray-300 hover:text-gold">
          <Download size={14} /> {signed ? 'Download signed PDF' : 'Download PDF'}
        </a>
        {!signed && (
          <Link href={`/admin/invoices/${invoiceId}`} className="flex min-h-[44px] items-center gap-1 text-gray-300 hover:text-gold">
            <Pencil size={14} /> Edit invoice
          </Link>
        )}
        <Link href="/admin/invoices" className="flex min-h-[44px] items-center text-gray-400 hover:text-gold">All invoices</Link>
        <DeleteInvoiceButton id={invoiceId} number={number} status={signed ? 'signed' : alreadySent ? 'sent' : status} variant="text" redirectTo="/admin/invoices" />
      </div>
    </div>
  )
}
