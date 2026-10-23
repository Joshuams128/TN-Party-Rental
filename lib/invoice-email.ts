import { escapeHtml as esc } from '@/lib/escape'
import { formatMoney } from '@/lib/money'
import type { InvoiceDoc } from '@/lib/invoice-data'

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })
}

export function invoiceSubject(doc: InvoiceDoc): string {
  return `Invoice #${doc.number} from ${doc.settings.business_name}`
}

// All user-entered text is escaped: this goes to customers, unlike the owner-only contact notification.
export function invoiceEmailHtml(doc: InvoiceDoc): string {
  const b = doc.settings
  const rows = doc.lines
    .map(
      (l) => `<tr>
        <td style="padding:6px 0;border-bottom:1px solid #eee">${esc(l.name)}${l.quantity > 1 ? ` &times; ${l.quantity}` : ''}</td>
        <td style="padding:6px 0;border-bottom:1px solid #eee;text-align:right">${formatMoney(l.unit_price_cents * l.quantity)}</td>
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
    ${doc.due_date ? `<p><strong>Due:</strong> ${formatDate(doc.due_date)}</p>` : ''}
    ${doc.notes ? `<p style="white-space:pre-line">${esc(doc.notes)}</p>` : ''}
    <p>Reply to this email if you have any questions.</p>
    <p style="margin-top:24px">Thank you,<br><strong>${esc(b.business_name)}</strong>${contact ? `<br><span style="color:#666">${contact}</span>` : ''}</p>
  </div>`
}

export function invoiceEmailText(doc: InvoiceDoc): string {
  const b = doc.settings
  return [
    `Hi ${doc.customer_name || 'there'},`,
    '',
    `Please find your invoice #${doc.number} from ${b.business_name} attached as a PDF.`,
    `Total: ${formatMoney(doc.totals.total)}`,
    doc.due_date ? `Due: ${formatDate(doc.due_date)}` : '',
    doc.notes ? `\n${doc.notes}` : '',
    '',
    'Reply to this email if you have any questions.',
    '',
    `Thank you,\n${b.business_name}`,
  ]
    .filter((l, i, a) => l !== '' || a[i - 1] !== '')
    .join('\n')
}
