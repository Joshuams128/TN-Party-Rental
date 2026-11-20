import { Resend } from 'resend'
import { createAdminClient, adminConfigured } from '@/lib/supabase/admin'
import { squareConfigured, paidOnOrder } from '@/lib/square'
import { loadSettings } from '@/lib/invoice-data'
import { emailRoute } from '@/lib/sender'
import { formatMoney } from '@/lib/money'
import { escapeHtml as esc } from '@/lib/escape'

export type PaymentState = 'paid' | 'unpaid' | 'unknown'

// Ask Square whether this order has been paid; if so, record it (once) and tell the owner. The order is either an
// invoice's deposit or its later balance payment. Safe to call as often as needed: the browser's word is never
// trusted, Square's is.
export async function recordPaymentForOrder(orderId: string): Promise<PaymentState> {
  if (!adminConfigured() || !squareConfigured()) return 'unknown'
  const db = createAdminClient()

  const { data: dep } = await db
    .from('invoices')
    .select('id, number, customer_name, pay_amount_cents, paid_at')
    .eq('pay_order_id', orderId)
    .maybeSingle()
  if (dep) {
    if (dep.paid_at) return 'paid'
    const { cents, paymentId } = await paidOnOrder(orderId)
    if (dep.pay_amount_cents <= 0 || cents < dep.pay_amount_cents) return 'unpaid'
    const { data: updated } = await db
      .from('invoices')
      .update({ paid_at: new Date().toISOString(), paid_cents: cents, square_payment_id: paymentId })
      .eq('id', dep.id)
      .is('paid_at', null)
      .select('id')
    if (updated && updated.length > 0) {
      const { data: pct } = await db.from('invoices').select('collect_percent').eq('id', dep.id).maybeSingle()
      await notifyOwner(db, dep.number, dep.customer_name, cents, Number(pct?.collect_percent) === 100 ? 'Full payment' : 'Deposit')
    }
    return 'paid'
  }

  const { data: req } = await db
    .from('invoice_payments')
    .select('id, invoice_id, label, amount_cents, paid_at')
    .eq('order_id', orderId)
    .maybeSingle()
  if (!req) return 'unknown'
  if (req.paid_at) return 'paid'
  const { cents, paymentId } = await paidOnOrder(orderId)
  if (req.amount_cents <= 0 || cents < req.amount_cents) return 'unpaid'
  const { data: updated } = await db
    .from('invoice_payments')
    .update({ paid_at: new Date().toISOString(), paid_cents: cents, square_payment_id: paymentId })
    .eq('id', req.id)
    .is('paid_at', null)
    .select('id')
  if (updated && updated.length > 0) {
    const { data: inv } = await db.from('invoices').select('number, customer_name').eq('id', req.invoice_id).maybeSingle()
    if (inv) await notifyOwner(db, inv.number, inv.customer_name, cents, 'Payment')
  }
  return 'paid'
}

// Used by the signing page when the customer comes back from Square (and as a safety net if the webhook is late).
// Checks the deposit first, then any payment requests the owner sent.
export async function syncPaymentForToken(token: string): Promise<PaymentState> {
  if (!adminConfigured() || !squareConfigured()) return 'unknown'
  const db = createAdminClient()
  let state: PaymentState = 'unknown'

  const { data: inv } = await db.from('invoices').select('pay_order_id, paid_at').eq('sign_token', token).eq('collect_payment', true).maybeSingle()
  if (inv) {
    state = inv.paid_at ? 'paid' : inv.pay_order_id ? await recordPaymentForOrder(inv.pay_order_id) : 'unknown'
  }

  // Payment requests the owner emailed (50%, 100%, balance). Best effort: the table comes from a newer database update,
  // so a failure here must never affect the deposit.
  const { data: invId } = await db.from('invoices').select('id').eq('sign_token', token).maybeSingle()
  if (invId) {
    const { data: pending } = await db.from('invoice_payments').select('order_id').eq('invoice_id', invId.id).is('paid_at', null).not('order_id', 'is', null)
    for (const r of ((pending ?? []) as { order_id: string }[]).slice(0, 5)) await recordPaymentForOrder(r.order_id).catch(() => undefined)
  }
  return state
}

async function notifyOwner(db: ReturnType<typeof createAdminClient>, number: number, customer: string, cents: number, what: 'Deposit' | 'Payment' | 'Full payment') {
  try {
    const apiKey = process.env.RESEND_API_KEY
    const settings = await loadSettings(db)
    const route = emailRoute(settings)
    if (!apiKey || !route.replyTo) return
    const amount = formatMoney(cents)
    await new Resend(apiKey).emails.send({
      from: route.from,
      to: [route.replyTo],
      subject: `${what === 'Full payment' ? 'Payment' : what} received: invoice #${number} (${amount})`,
      html: `<div style="font-family:Arial,sans-serif;line-height:1.5"><p><strong>${esc(customer || 'Your customer')}</strong> paid ${what === 'Full payment' ? `the full ${amount}` : `the ${amount} ${what.toLowerCase()}`} on invoice <strong>#${number}</strong> through Square.${what === 'Payment' ? ' Check the invoice to see what is left, if anything.' : ' They can now sign the invoice.'}</p></div>`,
      text: `${customer || 'Your customer'} paid ${what === 'Full payment' ? `the full ${amount}` : `the ${amount} ${what.toLowerCase()}`} on invoice #${number} through Square.${what === 'Payment' ? ' Check the invoice to see what is left, if anything.' : ' They can now sign the invoice.'}`,
    })
  } catch (e) {
    console.error('Deposit notification failed:', e)
  }
}
