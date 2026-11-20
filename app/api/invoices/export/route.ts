import { NextRequest, NextResponse } from 'next/server'
import { requireOwner } from '@/lib/auth'
import { breakdownFromRows, type LineRow } from '@/lib/invoice'
import { loadRequestedPaidTotals } from '@/lib/invoice-data'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type Row = {
  id: string
  number: number
  status: 'draft' | 'sent'
  issue_date: string
  customer_name: string
  customer_email: string
  customer_phone?: string | null
  customer_address: string
  discount_cents: number
  apply_tax: boolean
  tax_rate: number
  signed_at: string | null
  collect_payment?: boolean | null
  collect_percent?: number | null
  paid_at?: string | null
  paid_cents?: number | null
  cash_payment?: boolean | null
  security_deposit_cents?: number | null
  security_online?: boolean | null
  security_paid_at?: string | null
  security_paid_cents?: number | null
  deleted_at?: string | null
  invoice_lines: LineRow[]
}

const LINES = 'invoice_lines(unit_price_cents, quantity, discount_type, discount_value)'
const BASE = 'id, number, status, issue_date, customer_name, customer_email, customer_address, discount_cents, apply_tax, tax_rate, signed_at'
const FULL = `${BASE}, customer_phone, collect_payment, collect_percent, paid_at, paid_cents, cash_payment, security_deposit_cents, security_online, security_paid_at, security_paid_cents, deleted_at`

const dollars = (cents: number) => (cents / 100).toFixed(2)
const day = (iso?: string | null) => (iso ? iso.slice(0, 10) : '')
// Spreadsheet programs run text that starts with = + - @ as a formula; keep customer-typed text as plain text.
const cell = (v: string | number) => {
  let t = String(v ?? '')
  if (/^[=+\-@\t\r]/.test(t)) t = `'${t}`
  return `"${t.replace(/"/g, '""')}"`
}

// A spreadsheet (CSV) of every invoice that was sent, for the accountant or tax time. Includes deleted ones, marked as such.
export async function GET(request: NextRequest) {
  const owner = await requireOwner()
  if (!owner) return NextResponse.json({ message: 'Please sign in again.' }, { status: 401 })

  const yearParam = request.nextUrl.searchParams.get('year') ?? 'all'
  const year = /^\d{4}$/.test(yearParam) ? yearParam : null

  const query = (cols: string) => owner.supabase.from('invoices').select(`${cols}, ${LINES}`).neq('status', 'draft').order('issue_date').order('number')
  let data: unknown[] | null = null
  const full = await query(FULL)
  if (!full.error) data = full.data as unknown[]
  else {
    // Older database (some newer columns missing): fall back to the basic columns.
    const basic = await query(BASE)
    if (basic.error) return NextResponse.json({ message: basic.error.message }, { status: 500 })
    data = basic.data as unknown[]
  }

  const requestedPaid = await loadRequestedPaidTotals(owner.supabase)
  const rows = ((data ?? []) as Row[]).filter((r) => !year || r.issue_date.startsWith(year))

  const header = [
    'Invoice #', 'Invoice date', 'Status', 'Customer', 'Email', 'Phone', 'Event location',
    'Subtotal', 'Discount', 'Tax (HST)', 'Total', 'Paid online', 'Payment', 'Security deposit (refundable, not income)', 'Security deposit paid online',
    'Signed on', 'Deleted on',
  ]
  const out = [header.map(cell).join(',')]
  for (const r of rows) {
    const t = breakdownFromRows(r.invoice_lines ?? [], r.discount_cents, r.apply_tax, Number(r.tax_rate))
    const deposit = r.collect_payment && r.paid_at ? Number(r.paid_cents) || 0 : 0
    const paidOnline = deposit + (requestedPaid.get(r.id) ?? 0)
    const payment = r.cash_payment ? 'Cash' : r.collect_payment ? (Number(r.collect_percent) === 100 ? 'Online, 100%' : 'Online, 50% deposit') : ''
    const status = r.deleted_at ? 'Deleted' : r.signed_at ? 'Signed' : 'Sent'
    out.push(
      [
        r.number, r.issue_date, status, r.customer_name, r.customer_email, r.customer_phone ?? '', r.customer_address.replace(/\s*\n\s*/g, ', '),
        dollars(t.subtotal), dollars(t.discount), dollars(t.tax), dollars(t.total), dollars(paidOnline), payment,
        dollars(Number(r.security_deposit_cents) || 0), r.security_online ? (r.security_paid_at ? 'Yes' : 'Not yet') : 'No',
        day(r.signed_at), day(r.deleted_at),
      ].map(cell).join(',')
    )
  }

  return new NextResponse('﻿' + out.join('\r\n') + '\r\n', {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="invoices-${year ?? 'all-years'}.csv"`,
      'Cache-Control': 'no-store',
    },
  })
}
