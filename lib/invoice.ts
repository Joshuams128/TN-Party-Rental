import { parseMoneyToCents } from '@/lib/money'

export type Line = {
  key: string
  item_id: string | null
  name: string
  description: string
  image_path: string | null
  price: string // dollars as typed, e.g. "25.00"
  quantity: number
}

export type InvoiceFields = {
  customer_name: string
  customer_email: string
  customer_address: string
  issue_date: string
  due_date: string
  notes: string
  discount: string // dollars as typed
  apply_tax: boolean
  owner_signature: boolean
}

export type InvoiceStatus = 'draft' | 'sent'

export function lineTotalCents(line: Pick<Line, 'price' | 'quantity'>): number {
  return (parseMoneyToCents(line.price) ?? 0) * line.quantity
}

export function computeTotals(
  lines: Pick<Line, 'price' | 'quantity'>[],
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

// Same math for rows read straight from the database (amounts already in cents).
export function breakdownFromRows(
  lines: { unit_price_cents: number; quantity: number }[],
  discountCents: number,
  applyTax: boolean,
  taxRate: number
) {
  const subtotal = lines.reduce((s, l) => s + l.unit_price_cents * l.quantity, 0)
  const discount = Math.min(discountCents, subtotal)
  const taxable = subtotal - discount
  const tax = applyTax ? Math.round((taxable * taxRate) / 100) : 0
  return { subtotal, discount, tax, total: taxable + tax }
}

export function totalFromRows(
  lines: { unit_price_cents: number; quantity: number }[],
  discountCents: number,
  applyTax: boolean,
  taxRate: number
) {
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
