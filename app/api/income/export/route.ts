import { NextRequest, NextResponse } from 'next/server'
import ExcelJS from 'exceljs'
import { requireOwner } from '@/lib/auth'
import { filterJobs, loadIncome, parseFilter, totalsOf } from '@/lib/income'
import { todayISO } from '@/lib/invoice'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MONEY = '"$"#,##0.00;[Red]-"$"#,##0.00'
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const dollars = (cents: number) => Math.round(cents) / 100
const asDate = (iso: string) => new Date(`${iso.slice(0, 10)}T12:00:00`) // noon: never slips a day across time zones

function styleSheet(ws: ExcelJS.Worksheet, moneyCols: number[], widths: number[]) {
  ws.columns.forEach((c, i) => (c.width = widths[i] ?? 14))
  const head = ws.getRow(1)
  head.font = { bold: true, color: { argb: 'FFFFFFFF' } }
  head.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F2937' } }
  head.alignment = { vertical: 'middle', wrapText: true }
  head.height = 22
  ws.views = [{ state: 'frozen', ySplit: 1 }]
  for (const c of moneyCols) ws.getColumn(c).numFmt = MONEY
}

// The income tracker as an Excel workbook: every paid job, a monthly summary, and the payments and expenses behind them.
export async function GET(request: NextRequest) {
  const owner = await requireOwner()
  if (!owner) return NextResponse.json({ message: 'Please sign in again.' }, { status: 401 })

  const sp = request.nextUrl.searchParams
  const thisYear = todayISO().slice(0, 4)
  const f = parseFilter({ year: sp.get('year') ?? undefined, month: sp.get('month') ?? undefined, unpaid: sp.get('unpaid') ?? undefined }, thisYear)
  const { jobs: all } = await loadIncome(owner.supabase)
  const jobs = filterJobs(all, f)
  const t = totalsOf(jobs)

  const wb = new ExcelJS.Workbook()
  wb.creator = 'True North Party Rentals'
  wb.created = new Date()

  // ---- Jobs
  const js = wb.addWorksheet('Jobs')
  js.columns = [
    { header: 'Event date' }, { header: 'Customer' }, { header: 'Invoice #' }, { header: 'Signed' },
    { header: 'Revenue (before HST)' }, { header: 'HST' }, { header: 'Total (booked)' }, { header: 'Received' },
    { header: 'Still owing' }, { header: 'Expenses' }, { header: 'Profit (before HST)' }, { header: 'Paid in full' },
  ]
  for (const j of jobs) {
    js.addRow([
      asDate(j.eventDate), j.customer, j.number, j.signed ? 'Yes' : 'No',
      dollars(j.revenueCents), dollars(j.taxCents), dollars(j.totalCents), dollars(j.receivedCents),
      dollars(j.owingCents), dollars(j.expensesCents), dollars(j.profitCents), j.owingCents > 0 ? 'No' : 'Yes',
    ])
  }
  const n = jobs.length
  const total = js.addRow(['Total', `${n} job${n === 1 ? '' : 's'}`, '', ''])
  for (const col of [5, 6, 7, 8, 9, 10, 11]) {
    const letter = js.getColumn(col).letter
    total.getCell(col).value = { formula: `SUM(${letter}2:${letter}${n + 1})`, result: dollars([0, 0, 0, 0, t.revenue, t.tax, t.total, t.received, t.owing, t.expenses, t.profit][col - 1]) }
  }
  total.font = { bold: true }
  total.border = { top: { style: 'thin' } }
  styleSheet(js, [5, 6, 7, 8, 9, 10, 11], [13, 28, 11, 9, 20, 12, 16, 14, 14, 13, 20, 12])
  js.getColumn(1).numFmt = 'mmm d, yyyy'
  js.autoFilter = { from: 'A1', to: `L${Math.max(1, n + 1)}` }

  // ---- By month
  const ms = wb.addWorksheet('By month')
  ms.columns = [{ header: 'Month' }, { header: 'Jobs' }, { header: 'Revenue (before HST)' }, { header: 'HST' }, { header: 'Total (booked)' }, { header: 'Received' }, { header: 'Expenses' }, { header: 'Profit (before HST)' }]
  const byMonth = new Map<string, typeof jobs>()
  for (const j of jobs) byMonth.set(j.eventDate.slice(0, 7), [...(byMonth.get(j.eventDate.slice(0, 7)) ?? []), j])
  for (const key of Array.from(byMonth.keys()).sort()) {
    const mt = totalsOf(byMonth.get(key)!)
    ms.addRow([`${MONTHS[Number(key.slice(5, 7)) - 1]} ${key.slice(0, 4)}`, mt.jobs, dollars(mt.revenue), dollars(mt.tax), dollars(mt.total), dollars(mt.received), dollars(mt.expenses), dollars(mt.profit)])
  }
  const mn = byMonth.size
  const mtot = ms.addRow(['Total'])
  for (let col = 2; col <= 8; col++) {
    const letter = ms.getColumn(col).letter
    mtot.getCell(col).value = { formula: `SUM(${letter}2:${letter}${mn + 1})` }
  }
  mtot.font = { bold: true }
  mtot.border = { top: { style: 'thin' } }
  styleSheet(ms, [3, 4, 5, 6, 7, 8], [18, 8, 20, 12, 16, 14, 13, 20])

  // ---- Payments
  const ps = wb.addWorksheet('Payments')
  ps.columns = [{ header: 'Date received' }, { header: 'Invoice #' }, { header: 'Customer' }, { header: 'Amount' }, { header: 'How' }, { header: 'Source' }, { header: 'Note' }]
  const payRows = jobs.flatMap((j) => j.payments.map((p) => ({ j, p }))).sort((a, b) => a.p.date.localeCompare(b.p.date))
  for (const { j, p } of payRows) ps.addRow([p.date ? asDate(p.date) : '', j.number, j.customer, dollars(p.amountCents), p.method, p.source, p.note])
  styleSheet(ps, [4], [14, 11, 28, 14, 18, 12, 40])
  ps.getColumn(1).numFmt = 'mmm d, yyyy'

  // ---- Expenses
  const es = wb.addWorksheet('Expenses')
  es.columns = [{ header: 'Date' }, { header: 'Invoice #' }, { header: 'Customer' }, { header: 'What it was for' }, { header: 'Amount' }]
  for (const j of jobs) for (const e of j.expenses) es.addRow([e.date ? asDate(e.date) : '', j.number, j.customer, e.description, dollars(e.amountCents)])
  styleSheet(es, [5], [14, 11, 28, 36, 14])
  es.getColumn(1).numFmt = 'mmm d, yyyy'

  const buffer = Buffer.from(await wb.xlsx.writeBuffer())
  const period = f.year === 'all' ? 'all-years' : f.month === 'all' ? f.year : `${f.year}-${f.month.padStart(2, '0')}`
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="income-${period}.xlsx"`,
      'Cache-Control': 'no-store',
    },
  })
}
