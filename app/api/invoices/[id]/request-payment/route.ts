import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { requireOwner } from '@/lib/auth'
import { loadInvoiceDoc } from '@/lib/invoice-data'
import { requestOrigin, signUrl } from '@/lib/signing'
import { EMAIL_RE, emailRoute, friendlySendError } from '@/lib/sender'
import { cancelPaymentLink, createPaymentLink, squareConfigured } from '@/lib/square'
import { adminConfigured } from '@/lib/supabase/admin'
import { depositCents, paidSoFarCents, remainingCents } from '@/lib/payment'
import { paymentEmailHtml, paymentEmailText, paymentSubject } from '@/lib/payment-email'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 30

const fail = (message: string, status = 400) => NextResponse.json({ message }, { status })

// The owner asks the customer for a payment: 50% of the invoice, or everything that is left. Works on any sent
// invoice, including ones signed before online payments were set up, and can be repeated.
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const owner = await requireOwner()
  if (!owner) return fail('Please sign in again.', 401)

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return fail('Email service is not configured.', 503)

  let choice: unknown
  try {
    choice = (await request.json()).choice
  } catch {
    return fail('Choose what to ask for first.')
  }
  if (choice !== 'half' && choice !== 'rest') return fail('Choose what to ask for first.')

  const doc = await loadInvoiceDoc(owner.supabase, params.id)
  if (!doc) return fail('Invoice not found.', 404)
  if (doc.status !== 'sent' || !doc.sign_token) return fail('Send the invoice to the customer first.')
  if (doc.collect_payment && !doc.paid_at) return fail('This invoice is waiting for its deposit. The customer pays that first, from their signing link.')

  const to = doc.customer_email.trim()
  const route = emailRoute(doc.settings)
  if (!EMAIL_RE.test(to)) return fail('The customer’s email is missing or invalid.')
  if (!EMAIL_RE.test(route.replyTo)) return fail('Add your business email in Settings first. Replies and your copy go to it.')
  if (!squareConfigured() || !adminConfigured()) return fail('Online payments aren’t set up yet (Square keys in Vercel).', 503)

  const remaining = remainingCents(doc)
  const paid = paidSoFarCents(doc)
  let amount: number
  let label: string
  if (choice === 'half') {
    if (paid > 0) return fail('Part of this invoice is already paid. Ask for the remaining balance instead.')
    amount = depositCents(doc.totals.total)
    label = '50% payment'
  } else {
    amount = remaining
    label = paid > 0 ? 'Remaining balance' : 'Full payment'
  }
  if (amount < 100 || amount > remaining) return fail('There is nothing left to collect, or the amount would be under $1.00.')

  // Earlier unpaid requests: reuse one for the same amount, switch the others off so only one link is live.
  const { data: open, error: openErr } = await owner.supabase
    .from('invoice_payments')
    .select('id, amount_cents, link_id, url, order_id')
    .eq('invoice_id', doc.id)
    .is('paid_at', null)
    .is('cancelled_at', null)
  if (openErr) {
    console.error('invoice_payments missing:', openErr)
    return fail('Payment requests aren’t set up in the database yet. Run the payment-requests database update (0012) in Supabase, then try again.', 500)
  }
  const rows = (open ?? []) as { id: string; amount_cents: number; link_id: string | null; url: string | null; order_id: string | null }[]
  const same = rows.find((r) => r.amount_cents === amount && r.url && r.order_id)
  for (const r of rows.filter((x) => x !== same)) {
    await owner.supabase.from('invoice_payments').update({ cancelled_at: new Date().toISOString() }).eq('id', r.id)
    if (r.link_id) await cancelPaymentLink(r.link_id)
  }

  let payUrl = same?.url ?? null
  let rowId = same?.id ?? null
  if (!payUrl) {
    const origin = requestOrigin(request.headers, request.nextUrl.origin)
    try {
      const pay = await createPaymentLink({
        amountCents: amount,
        invoiceNumber: doc.number,
        buyerEmail: to,
        redirectUrl: `${signUrl(origin, doc.sign_token)}?pay=1`,
        title: `${label} - Invoice #${doc.number}`,
      })
      // Saved before emailing, so a payment can always be matched to its invoice.
      const { data: saved, error: saveErr } = await owner.supabase
        .from('invoice_payments')
        .insert({ invoice_id: doc.id, label, amount_cents: amount, link_id: pay.linkId, url: pay.url, order_id: pay.orderId })
        .select('id')
        .single()
      if (saveErr || !saved) {
        console.error('Could not save payment request:', saveErr)
        return fail(`Couldn’t save the payment link: ${saveErr?.message ?? 'unknown error'}`, 500)
      }
      payUrl = pay.url
      rowId = saved.id as string
    } catch (e) {
      console.error('Square payment link failed:', e)
      return fail(`Couldn’t create the Square payment link (${e instanceof Error ? e.message : 'unknown error'}). Nothing was sent.`, 502)
    }
  }

  const { error } = await new Resend(apiKey).emails.send({
    from: route.from,
    to: [to],
    bcc: [route.replyTo],
    replyTo: route.replyTo,
    subject: paymentSubject(doc),
    html: paymentEmailHtml(doc, payUrl, amount, label, remaining - amount),
    text: paymentEmailText(doc, payUrl, amount, label, remaining - amount),
  })
  if (error) {
    console.error('Payment email failed:', error)
    return fail(friendlySendError(error.message, route.fromAddress), 502)
  }

  if (rowId) await owner.supabase.from('invoice_payments').update({ sent_at: new Date().toISOString() }).eq('id', rowId)
  return NextResponse.json({ ok: true })
}
