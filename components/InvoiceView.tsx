import { formatMoney } from '@/lib/money'
import { formatDateShort, rowDiscountCents, rowNetCents } from '@/lib/invoice'
import { formatRentalPeriod } from '@/lib/rental'
import { itemImageUrl } from '@/lib/items'
import type { InvoiceDoc } from '@/lib/invoice-data'

const lines = (v: string) => v.split('\n').map((l) => l.trim()).filter(Boolean)

// Read-only, phone-friendly view of an invoice for the customer's signing page.
export default function InvoiceView({ doc }: { doc: InvoiceDoc }) {
  const b = doc.settings
  const t = doc.totals
  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-start justify-between gap-4 bg-black px-5 py-4 text-white">
        <div>
          <p className="text-lg font-bold">{b.business_name}</p>
          <p className="text-xs text-gray-300">{[b.phone, b.email].filter(Boolean).join(' · ')}</p>
          {b.tax_number && <p className="text-xs text-gray-300">{b.tax_label} #: {b.tax_number}</p>}
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-[#D4AF37]">INVOICE</p>
          <p className="text-sm">#{doc.number}</p>
        </div>
      </div>

      <div className="grid gap-4 p-5 text-sm sm:grid-cols-2">
        <div>
          <p className="mb-1 text-[11px] font-bold tracking-widest text-[#B8941F]">BILL TO</p>
          <p className="font-semibold">{doc.customer_name}</p>
          {lines(doc.customer_address).map((l, i) => <p key={i}>{l}</p>)}
        </div>
        <div className="sm:text-right">
          <p><span className="text-gray-500">Invoice date: </span>{formatDateShort(doc.issue_date)}</p>
          {doc.due_date && <p><span className="text-gray-500">Due date: </span>{formatDateShort(doc.due_date)}</p>}
        </div>
        {doc.rental_start && (
          <div className="sm:col-span-2">
            <p className="mb-1 text-[11px] font-bold tracking-widest text-[#B8941F]">RENTAL PERIOD</p>
            <p className="font-medium">{formatRentalPeriod(doc.rental_start, doc.rental_end)}</p>
          </div>
        )}
      </div>

      <ul className="divide-y divide-gray-100 border-y border-gray-100">
        {doc.lines.map((l) => {
          const img = itemImageUrl(l.image_path)
          return (
            <li key={l.id} className="flex items-center gap-3 px-5 py-3">
              {img && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={img} alt="" loading="lazy" className="h-12 w-12 shrink-0 rounded-lg bg-gray-100 object-cover" />
              )}
              <div className="min-w-0 flex-1">
                <p className="font-medium leading-snug">{l.name}</p>
                <p className="text-xs text-gray-500">{l.quantity} × {formatMoney(l.unit_price_cents)}</p>
                {rowDiscountCents(l) > 0 && (
                  <p className="text-xs font-medium text-green-700">
                    {l.discount_name || 'Discount'}: -{formatMoney(rowDiscountCents(l))}
                    {l.discount_type === 'percent' ? ` (${l.discount_value}% off)` : ''}
                  </p>
                )}
              </div>
              <p className="shrink-0 font-semibold">{formatMoney(rowNetCents(l))}</p>
            </li>
          )
        })}
      </ul>

      <div className="space-y-1 p-5 text-sm">
        <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatMoney(t.subtotal)}</span></div>
        {t.discount > 0 && <div className="flex justify-between"><span className="text-gray-500">Discount</span><span>-{formatMoney(t.discount)}</span></div>}
        {doc.apply_tax && <div className="flex justify-between"><span className="text-gray-500">{b.tax_label} ({doc.tax_rate}%)</span><span>{formatMoney(t.tax)}</span></div>}
        <div className="flex justify-between border-t border-gray-200 pt-2 text-lg font-bold"><span>Total</span><span>{formatMoney(t.total)}</span></div>
        {doc.notes && (
          <div className="pt-4">
            <p className="mb-1 text-[11px] font-bold tracking-widest text-[#B8941F]">NOTES</p>
            {lines(doc.notes).map((l, i) => <p key={i}>{l}</p>)}
          </div>
        )}
      </div>
    </article>
  )
}
