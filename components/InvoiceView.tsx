import { formatMoney } from '@/lib/money'
import { discountLabel, discountSignChar, formatDateShort, rowDiscountCents, rowPriceAfterDiscountCents } from '@/lib/invoice'
import { linePeriodTexts } from '@/lib/rental'
import { keyPoints, parseTerms, TERMS_TITLE } from '@/lib/terms'
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
        <div className="min-w-0 flex-1">
          <p className="text-lg font-bold">{b.business_name}</p>
          {[b.phone, b.email].filter(Boolean).map((v) => <p key={v} className="text-xs text-gray-300 [overflow-wrap:anywhere]">{v}</p>)}
          {b.tax_number && <p className="text-xs text-gray-300">{b.tax_label} #: {b.tax_number}</p>}
        </div>
        <div className="shrink-0 text-right">
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
      </div>

      <ul className="divide-y divide-gray-100 border-y border-gray-100">
        {doc.lines.map((l) => {
          const img = itemImageUrl(l.image_path)
          const off = rowDiscountCents(l)
          return (
            <li key={l.id} className="px-5 py-3">
              <div className="flex items-center gap-3">
                {img && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img} alt="" loading="lazy" className="h-12 w-12 shrink-0 rounded-lg bg-gray-100 object-cover" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-medium leading-snug">{l.name}</p>
                  {linePeriodTexts(l, doc).map((p, i) => (
                    <p key={i} className="text-xs font-semibold text-green-700">{p}</p>
                  ))}
                  <p className="text-xs text-gray-500">{l.quantity} × {formatMoney(l.unit_price_cents)}</p>
                </div>
                <p className="shrink-0 font-semibold">{formatMoney(l.unit_price_cents * l.quantity)}</p>
              </div>
              {off > 0 && (
                <div className={`mt-2 flex items-start justify-between gap-3 text-sm font-semibold text-green-700 ${img ? 'pl-[60px]' : ''}`}>
                  <span>{discountLabel(l)}</span>
                  <span className="shrink-0">{discountSignChar(l)}{formatMoney(off)}</span>
                </div>
              )}
              {off > 0 && (
                <div className={`mt-0.5 flex items-start justify-between gap-3 text-sm font-semibold text-green-700 ${img ? 'pl-[60px]' : ''}`}>
                  <span>Price after discount</span>
                  <span className="shrink-0">{formatMoney(rowPriceAfterDiscountCents(l))}</span>
                </div>
              )}
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

      {doc.terms_text && (
        <div className="border-t border-gray-100 bg-[#faf8f0] p-5 text-sm">
          <p className="mb-2 text-[11px] font-bold tracking-widest text-[#B8941F]">KEY TERMS</p>
          {keyPoints(doc.terms_key_points).length > 0 && (
            <ul className="list-disc space-y-1 pl-5">
              {keyPoints(doc.terms_key_points).map((k, i) => <li key={i}>{k}</li>)}
            </ul>
          )}
          <details className="group mt-3">
            <summary className="flex min-h-[44px] cursor-pointer list-none items-center font-semibold text-[#8a6d12] underline underline-offset-2 [&::-webkit-details-marker]:hidden">
              Please read full terms here
            </summary>
            <div className="mt-2 max-h-[28rem] overflow-y-auto rounded-lg border border-gray-200 bg-white p-4">
              <p className="mb-3 font-bold">{TERMS_TITLE}</p>
              {parseTerms(doc.terms_text).map((b, i) => (
                <div key={i} className="mb-3 last:mb-0">
                  {b.heading && <p className="font-semibold">{b.heading}</p>}
                  {b.lines.map((l, j) => <p key={j} className="mt-1 leading-snug text-gray-700">{l}</p>)}
                </div>
              ))}
            </div>
          </details>
          <p className="mt-3 font-semibold">By signing below, you agree to this invoice and to these payment terms.</p>
        </div>
      )}
    </article>
  )
}
