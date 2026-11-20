import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { loadInvoiceDoc } from '@/lib/invoice-data'
import { formatMoney } from '@/lib/money'
import SendPanel from '@/components/admin/SendPanel'
import { emailRoute } from '@/lib/sender'
import { depositCents, paidSoFarCents, remainingCents, upfrontCents } from '@/lib/payment'
import { invoiceStatusLabel } from '@/lib/invoice'

export const dynamic = 'force-dynamic'

const when = (iso: string) => `on ${new Date(iso).toLocaleString('en-CA', { dateStyle: 'long', timeStyle: 'short', timeZone: 'America/Toronto' })}`

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default async function ReviewPage({ params }: { params: { id: string } }) {
  const doc = await loadInvoiceDoc(createClient(), params.id)
  if (!doc) notFound()

  const problems: string[] = []
  if (!doc.customer_name.trim()) problems.push('Customer name is missing.')
  if (!EMAIL_RE.test(doc.customer_email.trim())) problems.push('Customer email is missing or invalid.')
  if (doc.lines.length === 0) problems.push('There are no items on this invoice.')
  if (!EMAIL_RE.test(doc.settings.email.trim())) problems.push('Your business email isn’t set. Add it in Settings (replies and your copy go there).')

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Review invoice #{doc.number}</h1>
        <p className="text-sm text-gray-400">
          {doc.customer_name || 'No customer'} · {formatMoney(doc.totals.total)} · {doc.lines.length} item{doc.lines.length === 1 ? '' : 's'}
          {problems.some((p) => p.includes('Settings')) && (
            <> · <Link href="/admin/settings" className="text-gold underline">Open settings</Link></>
          )}
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <div className="order-2 lg:order-1">
          <iframe
            src={`/api/invoices/${doc.id}/pdf#toolbar=0`}
            title={`Invoice ${doc.number} preview`}
            className="hidden h-[820px] w-full rounded-xl border border-gray-800 bg-white md:block"
          />
          <a
            href={`/api/invoices/${doc.id}/pdf`}
            target="_blank"
            rel="noreferrer"
            className="flex min-h-[48px] items-center justify-center rounded-xl border border-gray-700 bg-gray-900 px-4 text-sm font-medium text-gold md:hidden"
          >
            Open PDF preview to check it before sending
          </a>
        </div>
        <div className="order-1 lg:order-2">
          <SendPanel
            invoiceId={doc.id}
            number={doc.number}
            status={doc.status}
            signedBy={doc.signature?.name}
            signedOn={doc.signature ? new Date(doc.signature.signedAt).toLocaleString('en-CA', { dateStyle: 'long', timeStyle: 'short', timeZone: 'America/Toronto' }) : undefined}
            to={doc.customer_email}
            from={emailRoute(doc.settings).fromAddress}
            replyTo={doc.settings.email}
            problems={problems}
            statusLabel={invoiceStatusLabel({
              status: doc.status,
              signed_at: doc.signature?.signedAt,
              collect_payment: doc.collect_payment,
              paid_at: doc.paid_at,
              paidCents: paidSoFarCents(doc),
              totalCents: doc.totals.total,
            })}
            request={
              doc.status === 'sent' && !(doc.collect_payment && !doc.paid_at) && remainingCents(doc) >= 100
                ? {
                    canHalf: paidSoFarCents(doc) === 0,
                    halfAmount: formatMoney(depositCents(doc.totals.total)),
                    restAmount: formatMoney(remainingCents(doc)),
                    restLabel: paidSoFarCents(doc) > 0 ? 'Remaining balance' : 'Full amount (100%)',
                    history: [
                      ...(doc.collect_payment && doc.paid_at ? [{ text: `${doc.collect_percent === 100 ? 'Payment in full' : 'Deposit'} ${formatMoney(doc.paid_cents || doc.pay_amount_cents)} paid ${when(doc.paid_at)}`, paid: true }] : []),
                      ...doc.payments.map((p) =>
                        p.paid_at
                          ? { text: `${p.label} ${formatMoney(p.paid_cents || p.amount_cents)} paid ${when(p.paid_at)}`, paid: true }
                          : { text: `${p.label} ${formatMoney(p.amount_cents)} requested${p.sent_at ? ` ${when(p.sent_at)}` : ''}, waiting for payment`, paid: false }
                      ),
                    ],
                  }
                : undefined
            }
            deposit={
              doc.collect_payment
                ? {
                    amount: formatMoney(doc.pay_amount_cents || upfrontCents(doc.totals.total, doc.collect_percent)),
                    full: doc.collect_percent === 100,
                    paid: !!doc.paid_at,
                    paidOn: doc.paid_at ? new Date(doc.paid_at).toLocaleString('en-CA', { dateStyle: 'long', timeStyle: 'short', timeZone: 'America/Toronto' }) : undefined,
                  }
                : undefined
            }
          />
        </div>
      </div>
    </div>
  )
}
