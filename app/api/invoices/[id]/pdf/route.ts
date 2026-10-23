import { NextRequest } from 'next/server'
import { requireOwner } from '@/lib/auth'
import { loadInvoiceDoc } from '@/lib/invoice-data'
import { buildInvoicePdf } from '@/lib/pdf/build'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const owner = await requireOwner()
  if (!owner) return new Response('Unauthorized', { status: 401 })

  const doc = await loadInvoiceDoc(owner.supabase, params.id)
  if (!doc) return new Response('Not found', { status: 404 })

  const pdf = await buildInvoicePdf(doc, request.nextUrl.origin)
  const disposition = request.nextUrl.searchParams.has('download') ? 'attachment' : 'inline'
  return new Response(new Uint8Array(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `${disposition}; filename="Invoice-${doc.number}.pdf"`,
      'Cache-Control': 'private, no-store',
    },
  })
}
