import { parseMoneyToCents } from '@/lib/money'

export type DiscountType = 'amount' | 'percent'
export type DiscountSign = 'minus' | 'plus'

// A discount can be "show only": it prints on the invoice (e.g. "Free additional hour -$125.00") but does NOT
// change the price. In the database that is stored in discount_type as 'info_amount' / 'info_percent', so totals
// calculated anywhere (including older code and the invoice lists) ignore it safely.
export type DiscountTypeRaw = DiscountType | 'info_amount' | 'info_percent'

export function parseDiscountType(raw?: string | null): { kind: DiscountType; applies: boolean } {
  const info = !!raw && raw.startsWith('info_')
  const base = info ? raw!.slice(5) : raw
  return { kind: base === 'percent' ? 'percent' : 'amount', applies: !info }
}

export const encodeDiscountType = (kind: DiscountType, applies: boolean): DiscountTypeRaw => (applies ? kind : (`info_${kind}` as DiscountTypeRaw))

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
  discountShowOnly: boolean // true = print the discount but do not change the price
  discountSign: DiscountSign // how a show-only amount is printed: -$125.00 or +$125.00
  // Optional rental period for just this item ('YYYY-MM-DDTHH:mm' or ''), for items rented at different times.
  rentalStart: string
  rentalEnd: string
  // Optional second period for the same item (e.g. 10-3 and then 4-7).
  rentalStart2: string
  rentalEnd2: string
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

export const blankRental = { rentalStart: '', rentalEnd: '', rentalStart2: '', rentalEnd2: '' }

export const blankDiscount = {
  discountName: '',
  discountType: 'amount' as DiscountType,
  discountValue: '',
  discountShowOnly: false,
  discountSign: 'minus' as DiscountSign,
}

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

// The part of the discount that actually reduces the price (0 for a show-only discount).
export function lineAppliedDiscountCents(line: Pick<Line, 'price' | 'quantity' | 'discountType' | 'discountValue' | 'discountShowOnly'>): number {
  return line.discountShowOnly ? 0 : lineDiscountCents(line)
}

// What the customer pays for the line, after its own discount.
export function lineTotalCents(line: Pick<Line, 'price' | 'quantity' | 'discountType' | 'discountValue' | 'discountShowOnly'>): number {
  return lineGrossCents(line) - lineAppliedDiscountCents(line)
}

export function computeTotals(
  lines: Pick<Line, 'price' | 'quantity' | 'discountType' | 'discountValue' | 'discountShowOnly'>[],
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
  discount_type?: string | null // 'amount' | 'percent' | 'info_amount' | 'info_percent'
  discount_value?: number | string | null
}

// The amount printed next to a line's discount (for a show-only discount this is the value, not a deduction).
export function rowDiscountCents(l: LineRow): number {
  return discountCentsFor(l.unit_price_cents * l.quantity, parseDiscountType(l.discount_type).kind, Number(l.discount_value) || 0)
}

export function rowDiscountApplies(l: Pick<LineRow, 'discount_type'>): boolean {
  return parseDiscountType(l.discount_type).applies
}

// The part that really comes off the price.
export function rowAppliedDiscountCents(l: LineRow): number {
  return rowDiscountApplies(l) ? rowDiscountCents(l) : 0
}

// "-" for a real discount; for a show-only one, whichever sign the owner chose.
export function discountSignChar(l: { discount_type?: string | null; discount_sign?: string | null }): '-' | '+' {
  return !rowDiscountApplies(l) && l.discount_sign === 'plus' ? '+' : '-'
}

// What the customer sees next to the amount taken off, e.g. "Additional hours (10% off)".
export function discountLabel(l: { discount_name?: string | null; discount_type?: string | null; discount_value?: number | string | null }): string {
  const name = (l.discount_name ?? '').trim() || 'Discount'
  const { kind, applies } = parseDiscountType(l.discount_type)
  const withPercent = kind === 'percent' ? `${name} (${Number(l.discount_value)}% off)` : name
  return applies ? withPercent : `${withPercent} (included, price unchanged)`
}

// The line's price once its discount is applied, shown under the discount: $350 with -$50 => $300.
// A show-only discount prints the same figure, following the sign chosen (a "+" adds instead).
export function rowPriceAfterDiscountCents(l: LineRow & { discount_sign?: string | null }): number {
  const gross = l.unit_price_cents * l.quantity
  const off = rowDiscountCents(l)
  return discountSignChar(l) === '+' ? gross + off : gross - off
}

export function rowNetCents(l: LineRow): number {
  return l.unit_price_cents * l.quantity - rowAppliedDiscountCents(l)
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
