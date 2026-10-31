import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { loadInvoiceDocByToken, requestOrigin, signUrl, TOKEN_RE } from '@/lib/signing'
import { buildInvoicePdf } from '@/lib/pdf/build'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Public (no login): the signing link is the credential, so only the holder of the token can fetch the PDF.
export async function GET(request: NextRequest, { params }: { params: { token: string } }) {
  if (!TOKEN_RE.test(params.token)) return new Response('Not found', { status: 404 })
  const doc = await loadInvoiceDocByToken(createClient(), params.token)
  if (!doc) return new Response('Not found', { status: 404 })

  const origin = requestOrigin(request.headers, request.nextUrl.origin)
  const pdf = await buildInvoicePdf(doc, origin, { signUrl: signUrl(origin, params.token) })
  const disposition = request.nextUrl.searchParams.has('download') ? 'attachment' : 'inline'
  return new Response(new Uint8Array(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `${disposition}; filename="Invoice-${doc.number}${doc.signature ? '-signed' : ''}.pdf"`,
      'Cache-Control': 'private, no-store',
      'Referrer-Policy': 'no-referrer',
    },
  })
}
