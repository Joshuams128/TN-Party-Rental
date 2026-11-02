'use client'

import { useState } from 'react'
import { formatRentalPeriod, rentalHours } from '@/lib/rental'

const field = 'mt-1 h-12 w-full rounded-lg border border-gray-700 bg-gray-800 px-3 text-base text-white'

type Props = {
  start: string // 'YYYY-MM-DDTHH:mm' or ''
  end: string
  onChange: (start: string, end: string) => void
}

// One date + start/end time for a same-day rental; tick "Ends on a different day" for overnight or multi-day.
// Keeps the in-progress pieces locally and reports the combined values once both ends are complete.
export default function RentalPeriodInput({ start, end, onChange }: Props) {
  const [p, setP] = useState(() => ({
    startDate: start.slice(0, 10),
    startTime: start.slice(11, 16),
    endDate: end.slice(0, 10),
    endTime: end.slice(11, 16),
    otherDay: !!end && end.slice(0, 10) !== start.slice(0, 10),
  }))

  function update(patch: Partial<typeof p>) {
    const next = { ...p, ...patch }
    // Same-day rental: the end date simply follows the start date.
    if (!next.otherDay) next.endDate = next.startDate
    else if (!next.endDate) next.endDate = next.startDate
    setP(next)
    onChange(
      next.startDate && next.startTime ? `${next.startDate}T${next.startTime}` : '',
      next.endDate && next.endTime ? `${next.endDate}T${next.endTime}` : ''
    )
  }

  const combinedStart = p.startDate && p.startTime ? `${p.startDate}T${p.startTime}` : ''
  const combinedEnd = p.endDate && p.endTime ? `${p.endDate}T${p.endTime}` : ''
  const bad = !!combinedStart && !!combinedEnd && rentalHours(combinedStart, combinedEnd) === null
  const summary = formatRentalPeriod(combinedStart, combinedEnd)

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <label className="col-span-2 block text-xs text-gray-400 sm:col-span-1">
          {p.otherDay ? 'Start date' : 'Date'}
          <input type="date" value={p.startDate} onChange={(e) => update({ startDate: e.target.value })} className={field} />
        </label>
        <label className="block text-xs text-gray-400">
          Start time
          <input type="time" value={p.startTime} onChange={(e) => update({ startTime: e.target.value })} className={field} />
        </label>
        <label className="block text-xs text-gray-400">
          End time
          <input type="time" value={p.endTime} onChange={(e) => update({ endTime: e.target.value })} className={field} />
        </label>
      </div>
      <label className="mt-1 flex min-h-[44px] items-center gap-3 text-sm">
        <input type="checkbox" checked={p.otherDay} onChange={(e) => update({ otherDay: e.target.checked })} className="h-5 w-5 accent-[#D4AF37]" />
        <span>Ends on a different day <span className="text-gray-400">(multi-day or overnight)</span></span>
      </label>
      {p.otherDay && (
        <label className="mt-1 block text-xs text-gray-400 sm:w-1/3">
          End date
          <input type="date" value={p.endDate} min={p.startDate || undefined} onChange={(e) => update({ endDate: e.target.value })} className={field} />
        </label>
      )}
      {bad ? (
        <p role="alert" className="mt-2 text-sm text-red-400">
          The end needs to be after the start.{!p.otherDay && ' If it finishes the next day, tick “Ends on a different day”.'}
        </p>
      ) : (
        summary && <p className="mt-2 text-sm font-medium text-gold">{summary}</p>
      )}
    </div>
  )
}
