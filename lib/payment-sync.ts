import { Resend } from 'resend'
import { createAdminClient, adminConfigured } from '@/lib/supabase/admin'
import { squareConfigured, paidOnOrder } from '@/lib/square'
import { loadSettings } from '@/lib/invoice-data'
import { emailRoute } from '@/lib/sender'
import { formatMoney } from '@/lib/money'
import { escapeHtml as esc } from '@/lib/escape'

export type PaymentState = 'paid' | 'unpaid' | 'unknown'

// Ask Square whether this order has been paid; if so, mark the invoice paid (once) and tell the owner.
// Safe to call as often as needed: the browser's word is never trusted, Square's is.
export async function recordPaymentForOrder(orderId: string): Promise<PaymentState> {
  if (!adminConfigured() || !squareConfigured()) return 'unknown'
  const db = createAdminClient()
  const { data: inv } = await db
    .from('invoices')
    .select('id, number, customer_name, pay_amount_cents, paid_at')
    .eq('pay_order_id', orderId)
    .maybeSingle()
  if (!inv) return 'unknown'
  if (inv.paid_at) return 'paid'

  const { cents, paymentId } = await paidOnOrder(orderId)
  if (inv.pay_amount_cents <= 0 || cents < inv.pay_amount_cents) return 'unpaid'

  const { data: updated } = await db
    .from('invoices')
    .update({ paid_at: new Date().toISOString(), paid_cents: cents, square_payment_id: paymentId })
    .eq('id', inv.id)
    .is('paid_at', null)
    .select('id')
  if (updated && updated.length > 0) await notifyOwner(db, inv.number, inv.customer_name, cents)
  return 'paid'
}

// Used by the signing page when the customer comes back from Square (and as a safety net if the webhook is late).
export async function syncPaymentForToken(token: string): Promise<PaymentState> {
  if (!adminConfigured() || !squareConfigured()) return 'unknown'
  const { data: inv } = await createAdminClient()
    .from('invoices')
    .select('pay_order_id, paid_at')
    .eq('sign_token', token)
    .eq('collect_payment', true)
    .maybeSingle()
  if (!inv) return 'unknown'
  if (inv.paid_at) return 'paid'
  if (!inv.pay_order_id) return 'unknown'
  return recordPaymentForOrder(inv.pay_order_id)
}

async function notifyOwner(db: ReturnType<typeof createAdminClient>, number: number, customer: string, cents: number) {
  try {
    const apiKey = process.env.RESEND_API_KEY
    const settings = await loadSettings(db)
    const route = emailRoute(settings)
    if (!apiKey || !route.replyTo) return
    const amount = formatMoney(cents)
    await new Resend(apiKey).emails.send({
      from: route.from,
      to: [route.replyTo],
      subject: `Deposit received: invoice #${number} (${amount})`,
      html: `<div style="font-family:Arial,sans-serif;line-height:1.5"><p><strong>${esc(customer || 'Your customer')}</strong> paid the ${amount} deposit on invoice <strong>#${number}</strong> through Square. They can now sign the invoice.</p></div>`,
      text: `${customer || 'Your customer'} paid the ${amount} deposit on invoice #${number} through Square. They can now sign the invoice.`,
    })
  } catch (e) {
    console.error('Deposit notification failed:', e)
  }
}
