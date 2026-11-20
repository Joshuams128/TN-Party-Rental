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
  deposit?: { amount: string; paid: boolean; paidOn?: string; full?: boolean } // set when this invoice collects payment online (full = 100%)
  statusLabel?: string // e.g. "Deposit paid & signed"
  // The refundable security deposit, when the invoice has one.
  security?: { amount: string; online: boolean; paid: boolean; paidOn?: string }
  // Ask the customer for a payment (50%, 100% or the balance), shown once the invoice has been sent.
  request?: {
    canHalf: boolean
    halfAmount: string
    restAmount: string
    restLabel: string // "Full amount (100%)" or "Remaining balance"
    history: { text: string; paid: boolean }[]
  }
}

export default function SendPanel({ invoiceId, number, status, signedBy, signedOn, to, from, replyTo, problems, deposit, statusLabel, request, security }: Props) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [payConfirm, setPayConfirm] = useState(false)
  const [paySending, setPaySending] = useState(false)
  const [payDone, setPayDone] = useState(false)
  const [payError, setPayError] = useState('')
  const [choice, setChoice] = useState<'half' | 'rest'>(request?.canHalf ? 'half' : 'rest')

  async function sendPayment() {
    setPaySending(true)
    setPayError('')
    try {
      const res = await fetch(`/api/invoices/${invoiceId}/request-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ choice }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body.message || 'Sending failed.')
      setPayDone(true)
      setPayConfirm(false)
      router.refresh()
    } catch (e) {
      setPayError(e instanceof Error ? e.message : 'Sending failed.')
    } finally {
      setPaySending(false)
    }
  }

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
          <p className="flex items-center gap-2 font-semibold">
            <CheckCircle2 size={18} />{' '}
            {statusLabel && statusLabel !== 'Signed' ? statusLabel : `Signed by ${signedBy}`}
          </p>
          <p className="mt-1 text-sm text-green-300">
            {statusLabel && statusLabel !== 'Signed' ? `Signed by ${signedBy}, ` : ''}{signedOn?.replace(/\.$/, '')}. A signed copy was emailed to you and the customer. It can no longer be edited or resent.
          </p>
        </div>
      ) : alreadySent ? (
        <p className="flex items-center gap-2 text-green-400">
          <CheckCircle2 size={18} />{' '}
          {deposit && !deposit.paid
            ? `${sent ? 'Sent!' : 'Sent.'} Waiting for the customer to pay the ${deposit.amount}${deposit.full ? '' : ' deposit'} and sign.`
            : `${sent ? 'Sent!' : 'Sent.'} Waiting for the customer to sign.`}
        </p>
      ) : null}

      {deposit && (alreadySent || signed) && deposit.paid && (
        <p className="rounded-lg bg-green-950 p-3 text-sm text-green-200">
          {deposit.full ? 'Payment in full of' : 'Deposit of'} {deposit.amount} paid through Square{deposit.paidOn ? ` on ${deposit.paidOn.replace(/\.$/, '')}` : ''}.
        </p>
      )}

      {security && (alreadySent || signed) && (
        <p className={`rounded-lg p-3 text-sm ${security.online && security.paid ? 'bg-green-950 text-green-200' : 'bg-gray-950 text-gray-300'}`}>
          {security.online
            ? security.paid
              ? `Security deposit of ${security.amount} paid through Square${security.paidOn ? ` on ${security.paidOn.replace(/\.$/, '')}` : ''}. After pickup, refund it in Square (a full refund of that one payment), less any charges.`
              : `Security deposit of ${security.amount}: waiting for the customer to pay it online before they can sign.`
            : `Security deposit of ${security.amount} is noted on the invoice. Collect it yourself.`}
        </p>
      )}

      {request && (alreadySent || signed) && (
        <div className="space-y-3 rounded-lg border border-gray-800 p-4">
          <p className="text-sm font-semibold">Request a payment</p>
          {request.history.length > 0 && (
            <ul className="space-y-1 text-xs">
              {request.history.map((h, i) => (
                <li key={i} className={h.paid ? 'text-green-300' : 'text-gray-400'}>{h.paid ? '✓ ' : '• '}{h.text}</li>
              ))}
            </ul>
          )}
          {!payConfirm ? (
            <>
              <fieldset className="space-y-1">
                <legend className="sr-only">How much to ask for</legend>
                {request.canHalf && (
                  <label className="flex min-h-[44px] items-center gap-3 text-sm">
                    <input type="radio" name="payChoice" checked={choice === 'half'} onChange={() => setChoice('half')} className="h-5 w-5 accent-[#D4AF37]" />
                    <span>50% deposit: <strong>{request.halfAmount}</strong></span>
                  </label>
                )}
                <label className="flex min-h-[44px] items-center gap-3 text-sm">
                  <input type="radio" name="payChoice" checked={choice === 'rest'} onChange={() => setChoice('rest')} className="h-5 w-5 accent-[#D4AF37]" />
                  <span>{request.restLabel}: <strong>{request.restAmount}</strong></span>
                </label>
              </fieldset>
              <button
                onClick={() => setPayConfirm(true)}
                className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-gold/50 px-4 py-2.5 font-semibold text-gold hover:bg-gold/10"
              >
                <Send size={16} /> Send payment link
              </button>
            </>
          ) : (
            <div className="space-y-3 rounded-lg border border-gold/40 p-3">
              <p className="text-sm">
                Email <strong>{to}</strong> a secure Square link to pay{' '}
                <strong>{choice === 'half' ? request.halfAmount : request.restAmount}</strong>?
              </p>
              <div className="flex gap-2">
                <button onClick={sendPayment} disabled={paySending} className="flex-1 rounded-lg bg-gold px-4 py-2.5 font-semibold text-black hover:bg-gold-dark disabled:opacity-60">
                  {paySending ? 'Sending…' : 'Yes, send it'}
                </button>
                <button onClick={() => setPayConfirm(false)} disabled={paySending} className="rounded-lg px-4 py-2.5 text-gray-300 hover:bg-gray-800">Cancel</button>
              </div>
            </div>
          )}
          {payDone && !payConfirm && <p className="text-sm text-green-400">Sent! Waiting for the customer to pay.</p>}
          {payError && <p role="alert" className="text-sm text-red-400">{payError}</p>}
        </div>
      )}

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
