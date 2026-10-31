import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { requireOwner } from '@/lib/auth'
import { loadInvoiceDoc } from '@/lib/invoice-data'
import { buildInvoicePdf } from '@/lib/pdf/build'
import { invoiceEmailHtml, invoiceEmailText, invoiceSubject } from '@/lib/invoice-email'
import { newSignToken, requestOrigin, signUrl } from '@/lib/signing'
import { EMAIL_RE, emailRoute, friendlySendError } from '@/lib/sender'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 30

const fail = (message: string, status = 400) => NextResponse.json({ message }, { status })

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const owner = await requireOwner()
  if (!owner) return fail('Please sign in again.', 401)

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return fail('Email service is not configured.', 503)

  const doc = await loadInvoiceDoc(owner.supabase, params.id)
  if (!doc) return fail('Invoice not found.', 404)

  const to = doc.customer_email.trim()
  const route = emailRoute(doc.settings)
  if (!doc.customer_name.trim()) return fail('Add the customer’s name first.')
  if (!EMAIL_RE.test(to)) return fail('Add a valid customer email first.')
  if (doc.lines.length === 0) return fail('Add at least one item first.')
  if (!EMAIL_RE.test(route.replyTo)) return fail('Add your business email in Settings first. Replies and your copy go to it.')
  if (!EMAIL_RE.test(route.fromAddress)) return fail('The “Send invoices from” address in Settings isn’t a valid email.')

  if (doc.signature) return fail('This invoice has already been signed, so it can’t be sent again.')

  // The customer signs through a private link; create it the first time, reuse it on a resend.
  let token = doc.sign_token
  if (!token) {
    token = newSignToken()
    const { error: tokenErr } = await owner.supabase.from('invoices').update({ sign_token: token }).eq('id', doc.id)
    if (tokenErr) {
      console.error('Could not create signing link:', tokenErr)
      return fail('Online signing isn’t set up yet. Run the digital-signing database update (0003) in Supabase, then try again.', 500)
    }
  }
  const origin = requestOrigin(request.headers, request.nextUrl.origin)
  const link = signUrl(origin, token)
  const pdf = await buildInvoicePdf(doc, origin, { signUrl: link })

  const resend = new Resend(apiKey)
  const { error } = await resend.emails.send({
    from: route.from,
    to: [to],
    bcc: [route.replyTo], // the owner keeps a copy in their own inbox
    replyTo: route.replyTo,
    subject: invoiceSubject(doc),
    html: invoiceEmailHtml(doc, link),
    text: invoiceEmailText(doc, link),
    attachments: [{ filename: `Invoice-${doc.number}.pdf`, content: pdf }],
  })
  if (error) {
    console.error('Invoice email failed:', error)
    return fail(friendlySendError(error.message, route.fromAddress), 502)
  }

  const { error: dbErr } = await owner.supabase
    .from('invoices')
    .update({ status: 'sent', sent_at: new Date().toISOString() })
    .eq('id', doc.id)
  if (dbErr) {
    // The email already went out; say so rather than implying it failed.
    return fail(`The email was sent, but the invoice couldn’t be marked as sent: ${dbErr.message}`, 500)
  }

  return NextResponse.json({ ok: true })
}
