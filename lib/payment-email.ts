import { escapeHtml as esc } from '@/lib/escape'
import { formatMoney } from '@/lib/money'
import { balanceDueDate, formatLongDate } from '@/lib/payment'
import type { InvoiceDoc } from '@/lib/invoice-data'

// The email with a Square payment link that the owner sends for 50%, 100% or the remaining balance of an invoice.
const dueText = (doc: InvoiceDoc) => {
  const d = balanceDueDate(doc)
  return d ? `${formatLongDate(d)} (7 days before your event)` : '7 days before your event'
}

export const paymentSubject = (doc: InvoiceDoc) => `Payment link for invoice #${doc.number} from ${doc.settings.business_name}`

const intro = (doc: InvoiceDoc, amountCents: number, label: string, leftAfterCents: number) =>
  `Here is the secure link to pay ${formatMoney(amountCents)} (${label.toLowerCase()}) for invoice #${doc.number}.` +
  (leftAfterCents > 0 ? ` After this payment, ${formatMoney(leftAfterCents)} remains, due ${dueText(doc)}.` : ' This pays the invoice in full.')

export function paymentEmailHtml(doc: InvoiceDoc, payUrl: string, amountCents: number, label: string, leftAfterCents: number): string {
  const b = doc.settings
  const amount = formatMoney(amountCents)
  const contact = b.email.trim()
    ? `Questions? Reply to this email or write to <a href="mailto:${esc(b.email.trim())}">${esc(b.email.trim())}</a>.`
    : 'Reply to this email if you have any questions.'
  return `<div style="font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;max-width:560px;margin:0 auto;line-height:1.5">
    <p>Hi ${esc(doc.customer_name || 'there')},</p>
    <p>${esc(intro(doc, amountCents, label, leftAfterCents))}</p>
    <p style="margin:24px 0 8px"><a href="${esc(payUrl)}" style="display:inline-block;background:#D4AF37;color:#000;text-decoration:none;font-weight:bold;padding:14px 28px;border-radius:8px">Pay ${amount}</a></p>
    <p style="font-size:13px;color:#666;margin:0 0 16px">Secure card payment by Square. Or copy this link: <br><span style="word-break:break-all">${esc(payUrl)}</span></p>
    <p>${contact}</p>
    <p style="margin-top:24px">Thank you,<br><strong>${esc(b.business_name)}</strong></p>
  </div>`
}

export function paymentEmailText(doc: InvoiceDoc, payUrl: string, amountCents: number, label: string, leftAfterCents: number): string {
  const b = doc.settings
  return [
    `Hi ${doc.customer_name || 'there'},`,
    '',
    intro(doc, amountCents, label, leftAfterCents),
    '',
    `Pay ${formatMoney(amountCents)} (secure card payment by Square): ${payUrl}`,
    '',
    b.email.trim() ? `Questions? Reply to this email or write to ${b.email.trim()}.` : 'Reply to this email if you have any questions.',
    '',
    b.business_name,
  ].join('\n')
}
