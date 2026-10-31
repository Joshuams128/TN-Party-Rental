import { Resend } from 'resend'
import { escapeHtml as esc } from '@/lib/escape'
import { formatMoney } from '@/lib/money'
import { emailRoute } from '@/lib/sender'
import type { InvoiceDoc } from '@/lib/invoice-data'

// After a customer signs: email the signed PDF to the customer and to the owner. Never throws; signing already succeeded.
export async function sendSignedCopies(doc: InvoiceDoc, pdf: Buffer): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY
  const route = emailRoute(doc.settings)
  if (!apiKey || !route.replyTo || !doc.signature) return false

  const resend = new Resend(apiKey)
  const biz = doc.settings.business_name
  const attachments = [{ filename: `Invoice-${doc.number}-signed.pdf`, content: pdf }]
  const total = formatMoney(doc.totals.total)
  let ok = true

  const owner = await resend.emails.send({
    from: route.from,
    to: [route.replyTo],
    subject: `Invoice #${doc.number} was signed by ${doc.signature.name}`,
    html: `<div style="font-family:Arial,sans-serif;line-height:1.5"><p><strong>${esc(doc.signature.name)}</strong> just signed invoice <strong>#${doc.number}</strong> (${total}).</p><p>The signed PDF is attached.</p></div>`,
    text: `${doc.signature.name} just signed invoice #${doc.number} (${total}). The signed PDF is attached.`,
    attachments,
  })
  if (owner.error) {
    ok = false
    console.error('Signed copy to owner failed:', owner.error)
  }

  const to = doc.customer_email.trim()
  if (to) {
    const cust = await resend.emails.send({
      from: route.from,
      to: [to],
      replyTo: route.replyTo,
      subject: `Your signed invoice #${doc.number} from ${biz}`,
      html: `<div style="font-family:Arial,sans-serif;line-height:1.5"><p>Hi ${esc(doc.customer_name || 'there')},</p><p>Thank you for signing invoice <strong>#${doc.number}</strong> (${total}). Your signed copy is attached for your records.</p><p>${esc(biz)}</p></div>`,
      text: `Hi ${doc.customer_name || 'there'},\n\nThank you for signing invoice #${doc.number} (${total}). Your signed copy is attached for your records.\n\n${biz}`,
      attachments,
    })
    if (cust.error) {
      ok = false
      console.error('Signed copy to customer failed:', cust.error)
    }
  }
  return ok
}
