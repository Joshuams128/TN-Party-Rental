import { escapeHtml as esc } from '@/lib/escape'
import { formatMoney } from '@/lib/money'
import { formatRentalPeriod } from '@/lib/rental'
import { rowDiscountCents, rowNetCents } from '@/lib/invoice'
import type { InvoiceDoc } from '@/lib/invoice-data'

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })
}

export function invoiceSubject(doc: InvoiceDoc): string {
  return `Invoice #${doc.number} from ${doc.settings.business_name}`
}

// All user-entered text is escaped: this goes to customers, unlike the owner-only contact notification.
export function invoiceEmailHtml(doc: InvoiceDoc, signLink: string): string {
  const b = doc.settings
  const rows = doc.lines
    .map(
      (l) => `<tr>
        <td style="padding:6px 0;border-bottom:1px solid #eee">${esc(l.name)}${l.quantity > 1 ? ` &times; ${l.quantity}` : ''}${rowDiscountCents(l) > 0 ? `<br><span style="font-size:12px;color:#2e7d32">${esc(l.discount_name || 'Discount')}: -${formatMoney(rowDiscountCents(l))}</span>` : ''}</td>
        <td style="padding:6px 0;border-bottom:1px solid #eee;text-align:right">${formatMoney(rowNetCents(l))}</td>
      </tr>`
    )
    .join('')
  const contact = [b.phone, b.email].filter(Boolean).map(esc).join(' &middot; ')

  return `<div style="font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;max-width:560px;margin:0 auto;line-height:1.5">
    <p>Hi ${esc(doc.customer_name || 'there')},</p>
    <p>Please find your invoice <strong>#${doc.number}</strong> from ${esc(b.business_name)} attached as a PDF.</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;margin:16px 0">${rows}
      <tr><td style="padding:10px 0 0;font-weight:bold">Total${doc.apply_tax ? ` (incl. ${esc(b.tax_label)})` : ''}</td>
          <td style="padding:10px 0 0;text-align:right;font-weight:bold">${formatMoney(doc.totals.total)}</td></tr>
    </table>
    ${doc.rental_start ? `<p><strong>Rental period:</strong> ${esc(formatRentalPeriod(doc.rental_start, doc.rental_end))}</p>` : ''}
    ${doc.due_date ? `<p><strong>Due:</strong> ${formatDate(doc.due_date)}</p>` : ''}
    ${doc.notes ? `<p style="white-space:pre-line">${esc(doc.notes)}</p>` : ''}
    <p style="margin:24px 0 8px"><a href="${esc(signLink)}" style="display:inline-block;background:#D4AF37;color:#000;text-decoration:none;font-weight:bold;padding:14px 28px;border-radius:8px">Review &amp; sign invoice</a></p>
    <p style="font-size:13px;color:#666;margin:0 0 16px">Takes about 20 seconds. Nothing to download or print. Or copy this link: <br><span style="word-break:break-all">${esc(signLink)}</span></p>
    <p>Reply to this email if you have any questions.</p>
    <p style="margin-top:24px">Thank you,<br><strong>${esc(b.business_name)}</strong>${contact ? `<br><span style="color:#666">${contact}</span>` : ''}</p>
  </div>`
}

export function invoiceEmailText(doc: InvoiceDoc, signLink: string): string {
  const b = doc.settings
  return [
    `Hi ${doc.customer_name || 'there'},`,
    '',
    `Please find your invoice #${doc.number} from ${b.business_name} attached as a PDF.`,
    `Total: ${formatMoney(doc.totals.total)}`,
    doc.rental_start ? `Rental period: ${formatRentalPeriod(doc.rental_start, doc.rental_end)}` : '',
    doc.due_date ? `Due: ${formatDate(doc.due_date)}` : '',
    doc.notes ? `\n${doc.notes}` : '',
    '',
    `Review and sign your invoice online (takes about 20 seconds, nothing to download or print):\n${signLink}`,
    '',
    'Reply to this email if you have any questions.',
    '',
    `Thank you,\n${b.business_name}`,
  ]
    .filter((l, i, a) => l !== '' || a[i - 1] !== '')
    .join('\n')
}
