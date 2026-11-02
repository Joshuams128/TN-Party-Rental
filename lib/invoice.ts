import { parseMoneyToCents } from '@/lib/money'

export type DiscountType = 'amount' | 'percent'

export type Line = {
  key: string
  item_id: string | null
  name: string
  description: string
  image_path: string | null
  price: string // dollars as typed, e.g. "25.00"
  quantity: number
  // Optional discount on just this item/service, with a name the customer sees (e.g. "Repeat customer").
  discountName: string
  discountType: DiscountType
  discountValue: string // dollars or percent, as typed
}

export type InvoiceFields = {
  customer_name: string
  customer_email: string
  customer_address: string
  rental_start: string // 'YYYY-MM-DDTHH:mm' local time, '' if not set
  rental_end: string
  issue_date: string
  due_date: string
  notes: string
  discount: string // dollars as typed
  apply_tax: boolean
  owner_signature: boolean
}

export type InvoiceStatus = 'draft' | 'sent'

export const blankDiscount = { discountName: '', discountType: 'amount' as DiscountType, discountValue: '' }

// How much comes off a line: a fixed dollar amount or a percentage of that line, never more than the line itself.
export function discountCentsFor(grossCents: number, type: DiscountType, value: number): number {
  const v = Number.isFinite(value) && value > 0 ? value : 0
  const raw = type === 'percent' ? Math.round((grossCents * Math.min(v, 100)) / 100) : Math.round(v * 100)
  return Math.min(raw, grossCents)
}

export function lineGrossCents(line: Pick<Line, 'price' | 'quantity'>): number {
  return (parseMoneyToCents(line.price) ?? 0) * line.quantity
}

export function lineDiscountCents(line: Pick<Line, 'price' | 'quantity' | 'discountType' | 'discountValue'>): number {
  return discountCentsFor(lineGrossCents(line), line.discountType, Number(line.discountValue) || 0)
}

// What the customer pays for the line, after its own discount.
export function lineTotalCents(line: Pick<Line, 'price' | 'quantity' | 'discountType' | 'discountValue'>): number {
  return lineGrossCents(line) - lineDiscountCents(line)
}

export function computeTotals(
  lines: Pick<Line, 'price' | 'quantity' | 'discountType' | 'discountValue'>[],
  discount: string,
  applyTax: boolean,
  taxRate: number
) {
  const subtotal = lines.reduce((sum, l) => sum + lineTotalCents(l), 0)
  const discountCents = Math.min(parseMoneyToCents(discount) ?? 0, subtotal)
  const taxable = subtotal - discountCents
  const tax = applyTax ? Math.round((taxable * taxRate) / 100) : 0
  return { subtotal, discount: discountCents, tax, total: taxable + tax }
}

// Database rows (amounts in cents). Discount columns may be absent on rows saved before they existed.
export type LineRow = {
  unit_price_cents: number
  quantity: number
  discount_type?: DiscountType | null
  discount_value?: number | string | null
}

export function rowDiscountCents(l: LineRow): number {
  return discountCentsFor(l.unit_price_cents * l.quantity, l.discount_type ?? 'amount', Number(l.discount_value) || 0)
}

// What the customer sees next to the amount taken off, e.g. "Additional hours (10% off)".
export function discountLabel(l: { discount_name?: string | null; discount_type?: DiscountType | null; discount_value?: number | string | null }): string {
  const name = (l.discount_name ?? '').trim() || 'Discount'
  return l.discount_type === 'percent' ? `${name} (${Number(l.discount_value)}% off)` : name
}

export function rowNetCents(l: LineRow): number {
  return l.unit_price_cents * l.quantity - rowDiscountCents(l)
}

// Same math for rows read straight from the database.
export function breakdownFromRows(lines: LineRow[], discountCents: number, applyTax: boolean, taxRate: number) {
  const subtotal = lines.reduce((s, l) => s + rowNetCents(l), 0)
  const discount = Math.min(discountCents, subtotal)
  const taxable = subtotal - discount
  const tax = applyTax ? Math.round((taxable * taxRate) / 100) : 0
  return { subtotal, discount, tax, total: taxable + tax }
}

export function totalFromRows(lines: LineRow[], discountCents: number, applyTax: boolean, taxRate: number) {
  return breakdownFromRows(lines, discountCents, applyTax, taxRate).total
}

export function formatDateShort(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function todayISO(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}
