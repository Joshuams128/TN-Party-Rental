import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { requireOwner } from '@/lib/auth'
import { loadInvoiceDoc } from '@/lib/invoice-data'
import { buildInvoicePdf } from '@/lib/pdf/build'
import { invoiceEmailHtml, invoiceEmailText, invoiceSubject } from '@/lib/invoice-email'
import { newSignToken, requestOrigin, signUrl } from '@/lib/signing'
import { EMAIL_RE, emailRoute, friendlySendError } from '@/lib/sender'
import { termsPlaceholders } from '@/lib/terms'
import { upfrontCents } from '@/lib/payment'
import { createPaymentLink, squareConfigured } from '@/lib/square'
import { adminConfigured } from '@/lib/supabase/admin'

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

  // Terms: the invoice keeps its own copy of the wording as of now, so later edits in Settings never change it.
  const termsText = doc.settings.terms_text.trim()
  const termsPoints = doc.settings.terms_key_points.trim()
  const blanks = termsPlaceholders(termsText + '\n' + termsPoints)
  if (blanks.length > 0) {
    return fail(`Your payment terms still have blanks to fill in: ${blanks.slice(0, 3).join(', ')}${blanks.length > 3 ? '…' : ''}. Finish them in Settings first.`)
  }
  if (termsText || doc.terms_text) {
    const { error: termsErr } = await owner.supabase.from('invoices').update({ terms_key_points: termsPoints, terms_text: termsText }).eq('id', doc.id)
    if (termsErr) {
      console.error('Could not save terms on the invoice:', termsErr)
      return fail('Payment terms aren’t set up yet. Run the payment-terms database update (0010) in Supabase, then try again.', 500)
    }
    doc.terms_key_points = termsPoints
    doc.terms_text = termsText
  }

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

  // Optional online deposit: one Square checkout for exactly half the total, created now so the amount is fixed.
  if (doc.collect_payment && !doc.paid_at) {
    if (!squareConfigured() || !adminConfigured()) {
      return fail('Online payments aren’t set up yet. Add the Square keys and the Supabase service key in Vercel (see the setup notes), or untick “Collect payment online”.', 503)
    }
    const amount = upfrontCents(doc.totals.total, doc.collect_percent)
    if (amount < 100) return fail('The online payment would be under $1.00. Untick “Collect payment online” or check the invoice total.')
    try {
      const pay = await createPaymentLink({
        amountCents: amount,
        invoiceNumber: doc.number,
        buyerEmail: to,
        redirectUrl: `${link}?paid=1`,
        title: doc.collect_percent === 100 ? `Full payment - Invoice #${doc.number}` : undefined,
      })
      const { error: payErr } = await owner.supabase
        .from('invoices')
        .update({ pay_amount_cents: amount, pay_url: pay.url, pay_order_id: pay.orderId })
        .eq('id', doc.id)
      if (payErr) {
        console.error('Could not save payment link:', payErr)
        return fail('Online payments aren’t set up in the database yet. Run the Square deposit database update (0011) in Supabase, then try again.', 500)
      }
      doc.pay_amount_cents = amount
    } catch (e) {
      console.error('Square payment link failed:', e)
      return fail(`Couldn’t create the Square payment link (${e instanceof Error ? e.message : 'unknown error'}). Nothing was sent.`, 502)
    }
  } else if (doc.collect_payment && doc.paid_at && doc.pay_amount_cents <= 0) {
    doc.pay_amount_cents = upfrontCents(doc.totals.total, doc.collect_percent)
  }
  // Optional online security deposit: its own Square checkout (not mixed into the invoice payment), so a refund later is
  // a clean full refund of that one payment. Created now so the amount is fixed.
  if (doc.security_online && doc.security_deposit_cents > 0 && !doc.security_paid_at) {
    if (!squareConfigured() || !adminConfigured()) {
      return fail('Online payments aren’t set up yet. Add the Square keys and the Supabase service key in Vercel, or untick “Customer pays the security deposit online”.', 503)
    }
    try {
      const sec = await createPaymentLink({
        amountCents: doc.security_deposit_cents,
        invoiceNumber: doc.number,
        buyerEmail: to,
        redirectUrl: `${link}?sec=1`,
        title: `Security deposit (refundable) - Invoice #${doc.number}`,
      })
      const { error: secErr } = await owner.supabase
        .from('invoices')
        .update({ security_pay_url: sec.url, security_order_id: sec.orderId })
        .eq('id', doc.id)
      if (secErr) {
        console.error('Could not save security deposit link:', secErr)
        return fail('Online security deposits aren’t set up in the database yet. Run the cash and security deposit database update (0015) in Supabase, then try again.', 500)
      }
    } catch (e) {
      console.error('Square security deposit link failed:', e)
      return fail(`Couldn’t create the Square payment link for the security deposit (${e instanceof Error ? e.message : 'unknown error'}). Nothing was sent.`, 502)
    }
  }

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
