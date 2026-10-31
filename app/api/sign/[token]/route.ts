import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import { createClient } from '@/lib/supabase/server'
import { documentHash, loadInvoiceDocByToken, requestOrigin, signUrl, TOKEN_RE } from '@/lib/signing'
import { buildInvoicePdf } from '@/lib/pdf/build'
import { sendSignedCopies } from '@/lib/signed-email'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 30

const fail = (message: string, status = 400, code?: string) => NextResponse.json({ message, code }, { status })
const PNG_RE = /^data:image\/png;base64,([A-Za-z0-9+/=]+)$/

// Public (no login). The unguessable token in the URL is the credential.
export async function POST(request: NextRequest, { params }: { params: { token: string } }) {
  if (!TOKEN_RE.test(params.token)) return fail('This signing link is not valid.', 404)

  let body: { name?: unknown; type?: unknown; image?: unknown; hash?: unknown; consent?: unknown }
  try {
    body = await request.json()
  } catch {
    return fail('Invalid request.')
  }

  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const type = body.type === 'draw' || body.type === 'type' ? body.type : null
  const image = typeof body.image === 'string' ? body.image : ''
  if (name.length < 2 || name.length > 100) return fail('Please enter your full name.')
  if (!type) return fail('Invalid signature type.')
  if (body.consent !== true) return fail('Please tick the box to confirm you agree.')
  const match = PNG_RE.exec(image)
  if (!match || image.length > 400_000) return fail('Please provide your signature.')

  // Re-encode so only a clean, small PNG is ever stored or placed into the PDF.
  let png: Buffer
  try {
    png = await sharp(Buffer.from(match[1], 'base64')).resize({ width: 700, withoutEnlargement: true }).png({ compressionLevel: 9 }).toBuffer()
  } catch {
    return fail('That signature could not be read. Please try again.')
  }

  const supabase = createClient()
  const doc = await loadInvoiceDocByToken(supabase, params.token)
  if (!doc) return fail('This signing link is not available.', 404)
  if (doc.signature) return fail('This invoice has already been signed.', 409, 'already_signed')

  // The customer must sign exactly what they were shown. If the owner edited it in the meantime, make them reload.
  const hash = documentHash(doc)
  if (body.hash !== hash) return fail('This invoice was just updated. Please reload the page and review it again.', 409, 'changed')

  const forwarded = request.headers.get('x-forwarded-for')
  const { data: result, error } = await supabase.rpc('sign_invoice', {
    p_token: params.token,
    p_name: name,
    p_type: type,
    p_image: `data:image/png;base64,${png.toString('base64')}`,
    p_ip: (forwarded?.split(',')[0] ?? '').trim().slice(0, 64),
    p_user_agent: (request.headers.get('user-agent') ?? '').slice(0, 300),
    p_hash: hash,
  })
  if (error) {
    console.error('sign_invoice failed:', error)
    return fail('We could not save your signature. Please try again.', 500)
  }
  if (result === 'already_signed') return fail('This invoice has already been signed.', 409, 'already_signed')
  if (result !== 'ok') return fail('This signing link is not available.', 404)

  // Signing is done. Emailing the signed copies is best-effort and must never turn a success into an error.
  let emailed = false
  try {
    const signed = await loadInvoiceDocByToken(supabase, params.token)
    if (signed) {
      const origin = requestOrigin(request.headers, request.nextUrl.origin)
      const pdf = await buildInvoicePdf(signed, origin, { signUrl: signUrl(origin, params.token) })
      emailed = await sendSignedCopies(signed, pdf)
    }
  } catch (e) {
    console.error('Signed-copy email step failed:', e)
  }
  return NextResponse.json({ ok: true, emailed })
}
