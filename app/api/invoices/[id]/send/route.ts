import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { requireOwner } from '@/lib/auth'
import { loadInvoiceDoc } from '@/lib/invoice-data'
import { buildInvoicePdf } from '@/lib/pdf/build'
import { invoiceEmailHtml, invoiceEmailText, invoiceSubject } from '@/lib/invoice-email'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 30

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const fail = (message: string, status = 400) => NextResponse.json({ message }, { status })

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const owner = await requireOwner()
  if (!owner) return fail('Please sign in again.', 401)

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return fail('Email service is not configured.', 503)

  const doc = await loadInvoiceDoc(owner.supabase, params.id)
  if (!doc) return fail('Invoice not found.', 404)

  const to = doc.customer_email.trim()
  const from = doc.settings.email.trim()
  if (!doc.customer_name.trim()) return fail('Add the customer’s name first.')
  if (!EMAIL_RE.test(to)) return fail('Add a valid customer email first.')
  if (doc.lines.length === 0) return fail('Add at least one item first.')
  if (!EMAIL_RE.test(from)) return fail('Add your business email in Settings first. Invoices are sent from it.')

  const pdf = await buildInvoicePdf(doc, request.nextUrl.origin)

  const resend = new Resend(apiKey)
  const { error } = await resend.emails.send({
    from: `${doc.settings.business_name} <${from}>`,
    to: [to],
    bcc: [from], // the owner keeps a copy in their own inbox
    replyTo: from,
    subject: invoiceSubject(doc),
    html: invoiceEmailHtml(doc),
    text: invoiceEmailText(doc),
    attachments: [{ filename: `Invoice-${doc.number}.pdf`, content: pdf }],
  })
  if (error) {
    console.error('Invoice email failed:', error)
    return fail(`Couldn’t send: ${error.message}`, 502)
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
