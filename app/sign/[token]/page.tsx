import Image from 'next/image'
import type { Metadata } from 'next'
import { Download } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { documentHash, loadInvoiceDocByToken } from '@/lib/signing'
import InvoiceView from '@/components/InvoiceView'
import SignForm from '@/components/SignForm'

export const dynamic = 'force-dynamic'

// The link is the credential: keep it out of search engines and out of Referer headers.
export const metadata: Metadata = {
  title: 'Review and sign your invoice',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
}

export default async function SignPage({ params }: { params: { token: string } }) {
  const doc = await loadInvoiceDocByToken(createClient(), params.token)

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
            {doc.signature ? (
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
            ) : (
              <SignForm token={params.token} hash={documentHash(doc)} number={doc.number} />
            )}
          </>
        )}
      </div>
    </div>
  )
}
