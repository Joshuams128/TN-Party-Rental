// Rental period helpers. Times are plain local wall-clock times ('YYYY-MM-DDTHH:mm'), never converted between
// time zones, so "9:00 AM" always prints as 9:00 AM.

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

type Parts = { y: number; mo: number; d: number; h: number; mi: number }

function parse(value: string | null | undefined): Parts | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/.exec(value ?? '')
  return m ? { y: +m[1], mo: +m[2], d: +m[3], h: +m[4], mi: +m[5] } : null
}

const utc = (p: Parts) => Date.UTC(p.y, p.mo - 1, p.d, p.h, p.mi)

function time(p: Parts): string {
  const h12 = p.h % 12 === 0 ? 12 : p.h % 12
  return `${h12}:${String(p.mi).padStart(2, '0')} ${p.h < 12 ? 'AM' : 'PM'}`
}

const day = (p: Parts, withYear: boolean) => `${MONTHS[p.mo - 1]} ${p.d}${withYear ? `, ${p.y}` : ''}`

// Whole or half-hour-ish counts print cleanly: 4, 80, 2.5
export function rentalHours(start: string | null | undefined, end: string | null | undefined): number | null {
  const a = parse(start)
  const b = parse(end)
  if (!a || !b) return null
  const hours = (utc(b) - utc(a)) / 3_600_000
  return hours > 0 ? Math.round(hours * 10) / 10 : null
}

export function hoursLabel(hours: number): string {
  const n = Number.isInteger(hours) ? String(hours) : hours.toFixed(1)
  return `${n} ${hours === 1 ? 'hour' : 'hours'}`
}

// "April 4, 2026, 2:00 PM – 6:00 PM (4 hours)"  or  "April 2, 9:00 AM – April 5, 2026, 5:00 PM (80 hours)"
export function formatRentalPeriod(start: string | null | undefined, end: string | null | undefined): string {
  const a = parse(start)
  const b = parse(end)
  if (!a) return ''
  if (!b) return `From ${day(a, true)}, ${time(a)}`
  const hours = rentalHours(start, end)
  const sameDay = a.y === b.y && a.mo === b.mo && a.d === b.d
  const sameYear = a.y === b.y
  const range = sameDay
    ? `${day(a, true)}, ${time(a)} – ${time(b)}`
    : `${day(a, !sameYear)}, ${time(a)} – ${day(b, true)}, ${time(b)}`
  return hours ? `${range} (${hoursLabel(hours)})` : range
}

// 'YYYY-MM-DDTHH:mm' from whatever the database returns ('2026-04-02T09:00:00').
export const toInputValue = (value: string | null | undefined): string => (parse(value) ? String(value).replace(' ', 'T').slice(0, 16) : '')
