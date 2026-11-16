import Image from 'next/image'
import type { Metadata } from 'next'
import { Download } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { documentHash, loadInvoiceDocByToken } from '@/lib/signing'
import InvoiceView from '@/components/InvoiceView'
import SignForm from '@/components/SignForm'
import { syncPaymentForToken } from '@/lib/payment-sync'
import { depositSummary, remainingCents } from '@/lib/payment'
import { formatMoney } from '@/lib/money'

export const dynamic = 'force-dynamic'

// The link is the credential: keep it out of search engines and out of Referer headers.
export const metadata: Metadata = {
  title: 'Review and sign your invoice',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
}

// What is left after paying this one (the current page's amount).
const remainingAfter = (d: NonNullable<Awaited<ReturnType<typeof loadInvoiceDocByToken>>>, amount: number) => remainingCents(d) - amount

export default async function SignPage({ params, searchParams }: { params: { token: string }; searchParams: { paid?: string; pay?: string } }) {
  const supabase = createClient()
  let doc = await loadInvoiceDocByToken(supabase, params.token)
  // Deposit invoices: ask Square whether it has been paid (covers coming back from Square, and a slow webhook).
  // Also covers payment links the owner emailed later (50%, 100% or the balance).
  const hasOpenRequests = (d: typeof doc) => !!d && d.payments.some((x) => x.url && !x.paid_at)
  if (doc && ((doc.collect_payment && !doc.paid_at && !doc.signature) || hasOpenRequests(doc))) {
    await syncPaymentForToken(params.token).catch(() => 'unknown' as const)
    doc = (await loadInvoiceDocByToken(supabase, params.token)) ?? doc
  }
  const needsPayment = !!doc && doc.collect_payment && !doc.paid_at && !doc.signature
  const deposit = doc && doc.collect_payment ? depositSummary(doc) : null

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <div className="mx-auto max-w-2xl space-y-5 px-4 pb-16 pt-6">
        <Image src="/images/logo.png" alt="True North Party Rentals" width={240} height={80} className="mx-auto h-14 w-auto rounded-lg bg-black px-4 py-1" priority />

        {!doc ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
            <h1 className="text-xl font-bold">This link isn’t available</h1>
            <p className="mt-2 text-sm text-gray-600">
              The invoice link may be incorrect or no longer active. Please contact True North Party Rentals and we’ll send you a new one.
            </p>
          </div>
        ) : (
          <>
            <InvoiceView doc={doc} />
            {doc.signature && (
              <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
                <h2 className="text-lg font-bold text-green-900">This invoice has been signed</h2>
                <p className="mt-1 text-sm text-green-800">
                  Signed by {doc.signature.name} on {new Date(doc.signature.signedAt).toLocaleDateString('en-CA', { dateStyle: 'long', timeZone: 'America/Toronto' })}.
                </p>
                <a
                  href={`/api/sign/${params.token}/pdf?download=1`}
                  className="mt-4 inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-green-700 px-5 font-semibold text-white hover:bg-green-800"
                >
                  <Download size={18} /> Download signed invoice
                </a>
              </div>
            )}
            {doc.payments.filter((x) => x.url && !x.paid_at).map((x) => (
              <div key={x.id} className="rounded-2xl border-2 border-[#D4AF37] bg-white p-5 shadow-sm sm:p-6">
                <h2 className="text-lg font-bold">Pay {formatMoney(x.amount_cents)}</h2>
                <p className="mt-1 text-sm text-gray-600">
                  {x.label}. {remainingAfter(doc, x.amount_cents) > 0
                    ? `After this payment, ${formatMoney(remainingAfter(doc, x.amount_cents))} remains.`
                    : 'This pays the invoice in full.'}
                </p>
                {searchParams.pay && (
                  <p role="status" className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
                    We haven’t received the confirmation from Square yet. Please wait a few seconds, then{' '}
                    <a href={`/sign/${params.token}?pay=1`} className="font-semibold underline">check again</a>.
                  </p>
                )}
                <a href={x.url!} className="mt-4 flex h-14 w-full items-center justify-center rounded-xl bg-black text-base font-semibold text-white hover:bg-gray-800">
                  Pay {formatMoney(x.amount_cents)}
                </a>
                <p className="mt-2 text-center text-xs text-gray-500">Secure card payment by Square.</p>
              </div>
            ))}
            {!doc.signature && (
              <>
                {doc.collect_payment && deposit && (
                  needsPayment ? (
                    <div className="rounded-2xl border-2 border-[#D4AF37] bg-white p-5 shadow-sm sm:p-6">
                      <p className="text-[11px] font-bold tracking-widest text-[#B8941F]">STEP 1 OF 2</p>
                      <h2 className="mt-1 text-lg font-bold">Pay your deposit</h2>
                      <p className="mt-1 text-sm text-gray-600">
                        A {deposit.now} secures your date. The {deposit.later}. You’ll return here to sign right after paying.
                      </p>
                      {searchParams.paid && (
                        <p role="status" className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
                          We haven’t received the confirmation from Square yet. This can take a moment. Please wait a few seconds, then{' '}
                          <a href={`/sign/${params.token}?paid=1`} className="font-semibold underline">check again</a>.
                        </p>
                      )}
                      {doc.pay_url ? (
                        <a
                          href={doc.pay_url}
                          className="mt-4 flex h-14 w-full items-center justify-center rounded-xl bg-black text-base font-semibold text-white hover:bg-gray-800"
                        >
                          Pay {formatMoney(doc.pay_amount_cents)} deposit
                        </a>
                      ) : (
                        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                          The payment link isn’t available. Please contact True North Party Rentals.
                        </p>
                      )}
                      <p className="mt-2 text-center text-xs text-gray-500">Secure card payment by Square. The next step unlocks once it goes through.</p>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-green-200 bg-green-50 p-5 text-green-900">
                      <p className="font-bold">Deposit received: {formatMoney(doc.paid_cents || doc.pay_amount_cents)}. Thank you!</p>
                      <p className="mt-1 text-sm">The {deposit.later}. Please sign below to finish.</p>
                    </div>
                  )
                )}
                {needsPayment ? (
                  <div className="rounded-2xl border border-gray-200 bg-white/60 p-5 text-center text-sm text-gray-500">
                    <p className="font-semibold text-gray-700">STEP 2 OF 2: Sign</p>
                    <p className="mt-1">Signing unlocks as soon as your deposit has been paid.</p>
                  </div>
                ) : (
                  <SignForm token={params.token} hash={documentHash(doc)} number={doc.number} hasTerms={!!doc.terms_text} />
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
